import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { insertCg, omniCgs } from './omni-cgs.mjs';

const chapters = [
  ['00_prologue_full_script.md', 'prologue.js', 'WHITEBOX_STORY'],
  ['01_chapter1_full_script.md', 'chapter1.js', 'WHITEBOX_CHAPTER1'],
  ['02_chapter2_full_script.md', 'chapter2.js', 'WHITEBOX_CHAPTER2'],
  ['03_chapter3_full_script.md', 'chapter3.js', 'WHITEBOX_CHAPTER3'],
  ['04_chapter4_full_script.md', 'chapter4.js', 'WHITEBOX_CHAPTER4'],
  ['05_chapter5_full_script.md', 'chapter5.js', 'WHITEBOX_CHAPTER5'],
];
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
  'phone_chat',
  'phone_chat_end',
  'free_roam_return',
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
  markdown = markdown.replaceAll('\r\n', '\n');
  const lines = markdown.replace(/^\uFEFF/, '').split(/\r?\n/);
  const nodes = [],
    labels = Object.create(null);
  let i = lines.findIndex((line) => line.startsWith('## '));
  let chatStart = null;
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
        const item = take().match(/^- \*\*(.+?)\*\*(?: → 跳转 `\[label: (\w+)\]`)?$/);
        if (!item) fail('选项标题格式错误');
        if (item[2]) {
          choice.options.push({ text: clean(item[1]), label: item[2] });
          continue;
        }
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
    if (['dispatch_board', 'free_roam_hub', 'temp_tuner'].includes(node.type)) {
      node.options = [];
      while (i < lines.length) {
        if (!peek()) {
          i++;
          continue;
        }
        if (!peek().startsWith('- ')) break;
        const row = take().match(/^- \*\*(.+?)\*\* → 跳转 `\[label: (\w+)\]`$/);
        if (!row) fail('面板选项缺少标签');
        const [, caption, label] = row;
        if (node.type === 'dispatch_board') {
          const m = caption.match(/^派单方案.+?：【(.+?)】指派 (\w+) \+ (\w+)$/);
          if (!m) fail('派单行格式错误');
          node.options.push({ text: m[1], pair: [m[2].toLowerCase(), m[3].toLowerCase()], label });
        } else if (node.type === 'free_roam_hub') {
          const m = caption.match(/^串门目标.+?：【(.+?)】(.+?)（指派 (\w+)）$/);
          if (!m) fail('串门行格式错误');
          node.options.push({ place: m[1], text: m[2], actor: m[3].toLowerCase(), label });
        } else {
          const m = caption.match(/^刻度.+?：【(.+?)】$/);
          if (!m) fail('温度刻度格式错误');
          node.options.push({ text: m[1], label });
        }
      }
      if (!node.options.length) fail('面板缺少选项');
      if (node.type === 'free_roam_hub') {
        node.picks = Number(node.picks);
        const actors = new Set(node.options.map((o) => o.actor));
        if (!node.exit || actors.size !== node.options.length ||
            !Number.isInteger(node.picks) || node.picks < 1 || node.picks > actors.size)
          fail('串门目标或次数无效');
      }
      if (node.type === 'temp_tuner' && (node.options.length !== 3 || !node.actor || !node.task))
        fail('调谐器需要角色、任务和三个刻度');
    } else if (!commands.has(node.type)) fail('未知指令 ' + node.type);
    if (node.type === 'phone_chat' || node.type === 'phone_chat_end') {
      const opening = node.type === 'phone_chat';
      if (opening) {
        if (chatStart || !node.value) fail('手机群聊容器不匹配');
        chatStart = node;
      } else {
        if (!chatStart) fail('手机群聊容器不匹配');
        chatStart.end = nodes.length;
        chatStart = null;
      }
    }
    if (node.type === 'tag' && !tags.has(node.value)) fail('未知演出 ' + node.value);
    if (node.type === 'label') {
      if (Object.hasOwn(labels, node.value)) fail('重复标签 ' + node.value);
      labels[node.value] = nodes.length;
    }
    nodes.push(node);
  }
  if (chatStart) fail('手机群聊未闭合');
  for (const n of nodes) {
    const targets = (n.options ?? []).map((o) => o.label).filter(Boolean);
    if (n.type === 'jump_to') targets.push(n.value);
    if (n.type === 'free_roam_hub') targets.push(n.exit);
    for (const target of targets)
      if (!Object.hasOwn(labels, target)) throw Error('未知跳转 ' + target);
  }
  return {
    version: createHash('sha256').update(markdown).digest('hex').slice(0, 16),
    nodes,
    labels,
  };
}
export function liveCgManifest(directory) {
  const formats = new Map();
  for (const file of readdirSync(directory, { withFileTypes: true })) {
    const match = /^(cg_.+)\.(webm|mp4)$/.exec(file.name);
    if (!file.isFile() || !match) continue;
    const [, id, ext] = match;
    if (!formats.has(id)) formats.set(id, []);
    formats.get(id).push(ext);
  }
  const entries = [...formats.keys()].sort().map(id => {
    const ordered = ['webm', 'mp4'].filter(ext => formats.get(id).includes(ext));
    return '  ' + JSON.stringify(id) + ': Object.freeze(' + JSON.stringify(ordered) + '),';
  });
  const mapping = entries.length ? '{\n' + entries.join('\n') + '\n}' : '{}';
  return "Object.defineProperty(window, 'LiveCgMedia', { enumerable: true, value: Object.freeze(" +
    mapping + ') });\n';
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const integrating = process.argv.includes('--integrate-cgs');
  if (integrating && process.argv.includes('--check')) throw Error('请分别运行接入与 --check');
  const backgrounds = new URL('../assets/bg/', import.meta.url);
  const posters = new Set(readdirSync(backgrounds, { withFileTypes: true })
    .filter(file => file.isFile() && file.name.endsWith('.webp')).map(file => file.name));
  const usedCgs = new Set(), scriptChanges = [];
  const outputs = chapters.map(([file, dest, variable]) => {
    const source = new URL('../docs/scripts/' + file, import.meta.url);
    const original = readFileSync(source, 'utf8');
    let markdown = original;
    if (integrating) {
      for (const cg of omniCgs.filter(cg => cg.chapter + '.js' === dest))
        if (posters.has(cg.id + '.webp')) markdown = insertCg(markdown, cg);
    }
    const story = compile(markdown);
    for (const n of story.nodes) {
      if (n.type !== 'bg' || !n.value.startsWith('cg_')) continue;
      if (!posters.has(n.value + '.webp')) throw Error('缺少 CG 静帧：' + n.value);
      usedCgs.add(n.value);
    }
    if (markdown !== original) scriptChanges.push([source, markdown]);
    const data = '// Generated by tools/compile.mjs from the canonical Markdown.\n' +
      'window.' + variable + ' = ' + JSON.stringify(story, null, 2) + ';\n';
    return { dest, data, story };
  });
  const sprites = new URL('../assets/sprites/', import.meta.url);
  const poses = {};
  for (const file of readdirSync(sprites).filter(file => file.endsWith('-front.webp')).sort()) {
    const key = file.slice(0, -'-front.webp'.length);
    const directory = new URL(key + '/', sprites);
    const files = existsSync(directory) ? readdirSync(directory) : [];
    poses[key] = files.filter(name => name.endsWith('.webp') && name !== 'normal.webp')
      .map(name => name.slice(0, -5)).sort();
  }
  outputs.push({ dest: 'studio-poses.js', data: '// Generated by tools/compile.mjs from assets/sprites and assets/bg.\n' +
    'window.StudioPoses = {\n' + Object.entries(poses).map(([key, values]) =>
      '  ' + JSON.stringify(key) + ': ' + JSON.stringify(values) + ',').join('\n') + '\n};\n' +
    'window.OmniCgTitles = ' + JSON.stringify(Object.fromEntries(
      omniCgs.filter(cg => usedCgs.has(cg.id)).map(cg => [cg.id, cg.title])), null, 2) + ';\n' +
    liveCgManifest(backgrounds) });
  for (const [source, markdown] of scriptChanges) writeFileSync(source, markdown);
  for (const { dest, data, story } of outputs) {
    const output = new URL('../src/' + dest, import.meta.url);
    if (process.argv.includes('--check')) {
      if (readFileSync(output, 'utf8').replaceAll('\r\n', '\n') !== data)
        throw Error(dest + ' 需要重新编译');
    } else writeFileSync(output, data);
    if (story) console.log(dest + '：' + story.nodes.length + ' 个剧情节点，' + Object.keys(story.labels).length + ' 个跳转标签。');
  }
}
