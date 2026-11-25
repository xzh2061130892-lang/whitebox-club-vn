import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { compile } from '../tools/compile.mjs';

const root = new URL('../', import.meta.url);
const source = readFileSync(new URL('docs/scripts/00_prologue_full_script.md', root), 'utf8');
const story = compile(source);
const host = { window: { WHITEBOX_STORY: story } };
runInNewContext(readFileSync(new URL('src/engine.js', root), 'utf8'), host);
const { fresh, arrive, choose, names, interpolate } = host.window.Whitebox;

test('每句署名台词、每个草稿和登场标签都进入剧本', () => {
  assert.equal(
    story.nodes.filter((n) => n.type === 'dialogue').length,
    source.match(/\[speaker: /g).length,
  );
  assert.equal(story.nodes.filter((n) => n.innerOs).length, source.match(/^> 💡/gm).length);
  assert.equal(story.nodes.filter((n) => n.value === 'char_intro_card').length, 5);
  assert.deepEqual(
    story.nodes.filter((n) => n.type === 'choice').map((n) => n.options.length),
    [3, 5],
  );
  assert.throws(
    () => compile(source.replace('[jump_to: act3_reunion]', '[jump_to: missing]')),
    /未知跳转/,
  );
  assert.throws(() => compile(source.replace('[char_clear]', '[typo]')), /未知指令/);
});
test('两种起名模式、空白和纯文本标点', () => {
  assert.equal(names(' ', '　').player_name, '');
  assert.equal(fresh().names.player_name, '');
  for (const name of [names(' 春 ', ' '), names('', '春')])
    assert.equal(
      interpolate('{last_name}/{first_name}/{player_name}', { names: name }),
      '春/春/春',
    );
  assert.equal(names('abcde', '雪').player_name, 'abcd雪');
  assert.equal(names('<星>', '&').player_name, '<星>&');
});
test('45 种选择组合各自走完且只奖励选中路线的部员', () => {
  const visits = new Set();
  for (let first = 0; first < 3; first++)
    for (let route = 0; route < 3; route++)
      for (let cookie = 0; cookie < 5; cookie++) {
        const s = fresh(),
          reward = { gpt: 0, claude: 0, gemini: 0, grok: 0, deepseek: 0 };
        for (const key of [['gpt'], ['claude', 'gemini'], ['deepseek', 'grok']][first])
          reward[key]++;
        let next = 0,
          decisions = 0,
          ended = false,
          boardFrame,
          rewardPair;
        for (let i = 0; i < 300; i++) {
          const n = arrive(s, next);
          visits.add(s.pc);
          next = s.pc + 1;
          if (n.type === 'input_player_name') s.names = names('林', '初雪');
          if (n.type === 'choice') next = choose(s, decisions++ === 0 ? first : cookie);
          if (n.type === 'dispatch_board') {
            boardFrame = JSON.stringify(s);
            rewardPair = n.options[route].pair;
            for (const key of rewardPair) reward[key]++;
            next = choose(s, route);
          }
          if (n.type === 'scene_end') {
            ended = true;
            break;
          }
        }
        assert.ok(ended);
        assert.equal(decisions, 2);
        assert.deepEqual({ ...s.affection }, reward);
        assert.match(s.history.at(-1).text, /林初雪/);
        assert.equal(s.history.filter((l) => l.who === '部长决定').length, 3);
        const restored = JSON.parse(boardFrame);
        const reroute = choose(restored, (route + 1) % 3);
        assert.equal(
          reroute,
          story.labels[story.nodes[restored.pc].options[(route + 1) % 3].label],
        );
        assert.notEqual(restored.route, s.route);
      }
  story.nodes.forEach((n, i) => {
    if (
      [
        'dialogue',
        'narration',
        'choice',
        'dispatch_board',
        'input_player_name',
        'scene_end',
      ].includes(n.type)
    )
      assert.ok(visits.has(i), '遗漏节点 ' + i);
  });
});
test('六张场景、剧本调用的表情与各角色母版都已随游戏提供', () => {
  const bgs = new Set(),
    assets = new Set();
  for (const n of story.nodes) {
    if (n.type === 'bg') {
      bgs.add(n.value);
      assets.add('bg/' + n.value + '.webp');
    }
    const id = n.type === 'char' ? n.value.replace(/-1$/, '') : n.speaker;
    if (id && id !== 'player') {
      assets.add('sprites/' + id + '-1-front.webp');
      if (n.exp && n.exp !== 'normal') assets.add('sprites/' + id + '-1/' + n.exp + '.webp');
    }
  }
  assert.equal([...bgs].filter(id => id.startsWith('bg_')).length, 6);
  assert.deepEqual([...bgs].filter(id => id.startsWith('cg_')),
    existsSync(new URL('assets/bg/cg_prologue_404_chaos.webp', root)) ? ['cg_prologue_404_chaos'] : []);
  for (const path of assets) assert.ok(existsSync(new URL('assets/' + path, root)), path);
});
