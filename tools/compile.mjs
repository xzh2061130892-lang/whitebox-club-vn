import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const source = new URL('../docs/scripts/00_prologue_full_script.md', import.meta.url);
const output = new URL('../src/prologue.js', import.meta.url);
const commandLine = /^`\[(.*)\]`$/;
const spoken = /^\*\*【(.+?)】\*\*\s+`\[(speaker: [^\]]+)\]`\s*[：:]?\s*(.*)$/;
const commands = new Set([
  'bg',
  'bgm',
  'se',
  'char',
  'char_clear',
  'input_player_name',
  'tag',
  'label',
  'jump_to',
  'scene_end',
]);
const tags = new Set(['char_intro_card', 'suspended_card', 'cot_spinning', 'delete_panic']);

function fields(raw) {
  const [first, ...rest] = raw.split(/\s*\|\s*/);
  function split(s) {
    const idx = s.indexOf(':');
    return idx < 0
      ? [s, '']
      : [
          s.slice(0, idx),
          s
            .slice(idx + 1)
            .trim()
            .replace(/^"(.*)"$/, '$1'),
        ];
  }
  const [type, value] = split(first);
  return { type, value, ...Object.fromEntries(rest.map(split)) };
}

export function compile(markdown) {
  const lines = markdown.replace(/^\uFEFF/, '').split(/\r?\n/);
  const nodes = [],
    labels = Object.create(null);
  let i = lines.findIndex((line) => line.startsWith('## '));
  const fail = (msg) => {
    throw Error('剧本第 ' + (i + 1) + ' 行：' + msg);
  };
  if (i < 0) fail('缺少章节');
  const peek = () => (lines[i] || '').trim();
  const take = () => lines[i++].trim();
  const clean = (s) => s.replaceAll('`', '');
  function paragraph() {
    const p = [];
    while (i < lines.length && peek() && !/^(?:`\[|\*\*【|>|#|---|- )/.test(peek())) p.push(take());
    if (!p.length) fail('缺少正文');
    return clean(p.join('\n'));
  }
  function dialogue(header) {
    const match = header.match(spoken);
    if (!match) fail('角色发言格式错误');
    const { value: speaker, ...attrs } = fields(match[2]);
    return {
      ...attrs,
      type: 'dialogue',
      speaker,
      name: match[1],
      text: match[3] ? clean(match[3]) : paragraph(),
    };
  }
  while (i < lines.length) {
    const line = peek();
    if (!line || line === '---' || line.startsWith('### ')) {
      i++;
      continue;
    }
    if (line.startsWith('## ')) {
      nodes.push({ type: 'chapter', text: take().slice(3) });
      continue;
    }
    if (line.startsWith('>')) {
      const title = take().match(/^> 💡 \*\*【(.+)】\*\*$/);
      const previous = nodes.at(-1);
      if (
        !title ||
        !previous ||
        !(previous.type === 'dialogue' || previous.value === 'cot_spinning')
      )
        fail('未挂载的草稿');
      const body = [];
      while (peek().startsWith('>')) body.push(clean(take().replace(/^>\s*/, '')));
      if (!body.length) fail('草稿无正文');
      previous.innerOs = { title: title[1], text: body.join('\n') };
      continue;
    }
    if (spoken.test(line)) {
      nodes.push(dialogue(take()));
      continue;
    }
    const match = line.match(commandLine);
    if (!match) {
      nodes.push({ type: 'narration', text: paragraph() });
      continue;
    }
    const node = fields(match[1]);
    i++;
    if (node.type === 'choice_start') {
      const choice = { type: 'choice', text: node.value, options: [] };
      nodes.push(choice);
      const exits = [];
      while (i < lines.length && peek() !== '`[choice_end]`') {
        if (!peek()) {
          i++;
          continue;
        }
        const item = take().match(/^- \*\*(.*)\*\*$/);
        if (!item) fail('选项标题格式错误');
        choice.options.push({ text: clean(item[1]), target: nodes.length });
        let count = 0;
        while (/^\s+- /.test(lines[i] || '')) {
          nodes.push(dialogue(take().slice(2)));
          count++;
        }
        if (!count) fail('选项缺少回应');
        exits.push(nodes.length);
        nodes.push({ type: 'goto', target: null });
      }
      if (!choice.options.length || i === lines.length) fail('选项未闭合');
      exits.forEach((j) => (nodes[j].target = nodes.length));
      i++;
      continue;
    }
    if (node.type === 'dispatch_board') {
      node.options = [];
      while (i < lines.length) {
        if (!peek()) {
          i++;
          continue;
        }
        if (!peek().startsWith('- ')) break;
        const m = take().match(
          /^- \*\*派单方案.+?：【(.+?)】指派 ([\w ]+) \+ (\w+)\*\* → 跳转 `\[label: (\w+)\]`$/,
        );
        if (!m) fail('派单行格式错误');
        node.options.push({
          text: m[1],
          pair: [m[2].trim().toLowerCase(), m[3].toLowerCase()],
          label: m[4],
        });
      }
      if (!node.options.length) fail('派单缺少目标');
    } else if (!commands.has(node.type)) fail('未知指令 ' + node.type);
    if (node.type === 'tag' && !tags.has(node.value)) fail('未知演出 ' + node.value);
    if (node.type === 'label') {
      if (Object.hasOwn(labels, node.value)) fail('重复标签 ' + node.value);
      labels[node.value] = nodes.length;
    }
    nodes.push(node);
  }
  for (const n of nodes) {
    const targets =
      n.type === 'dispatch_board'
        ? n.options.map((o) => o.label)
        : n.type === 'jump_to'
          ? [n.value]
          : [];
    for (const target of targets)
      if (!Object.hasOwn(labels, target)) throw Error('未知跳转 ' + target);
  }
  return {
    version: createHash('sha256').update(markdown).digest('hex').slice(0, 16),
    nodes,
    labels,
  };
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const story = compile(readFileSync(source, 'utf8'));
  const data =
    '// Generated by tools/compile.mjs from the canonical Markdown.\nwindow.WHITEBOX_STORY = ' +
    JSON.stringify(story, null, 2) +
    ';\n';
  if (process.argv.includes('--check')) {
    if (readFileSync(output, 'utf8') !== data) throw Error('剧本数据需要重新编译');
  } else writeFileSync(output, data);
  console.log(
    story.nodes.length + ' 个剧情节点，' + Object.keys(story.labels).length + ' 个跳转标签。',
  );
}
