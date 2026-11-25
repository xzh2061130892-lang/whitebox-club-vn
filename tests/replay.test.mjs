import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const ids = ['prologue', 'chapter1', 'chapter2', 'chapter3', 'chapter4', 'chapter5'];
const host = { window: {}, structuredClone };
for (const file of [...ids, 'engine', 'replay-data', 'replay', 'poke']) {
  runInNewContext(readFileSync(new URL('../src/' + file + '.js', import.meta.url), 'utf8'), host);
}
const { Whitebox: engine, WhiteboxReplay, WhiteboxReplayData, WhiteboxPoke } = host.window;
const storage = () => {
  const data = new Map(), awards = [];
  const open = () => WhiteboxReplay.progress(k => data.get(k), (k, v) => data.set(k, v), id => awards.push(id));
  return { data, awards, open };
};

test('章节目录逐章解锁，读回旧档、世界线或相册只补登实际到过的章节', () => {
  const { data, open } = storage();
  const accessible = () => ids.filter(open().chapterUnlocked);
  assert.deepEqual(accessible(), ['prologue']);
  for (const [i, id] of ids.entries()) {
    const s = engine.fresh(id);
    engine.enterChapter(s);
    open().position(s);
    assert.deepEqual(accessible(), ids.slice(0, i + 1));
    s.pc = engine.storyFor(s).nodes.findIndex(n => n.type === 'scene_end');
    open().position(s);
    assert.deepEqual(accessible(), ids.slice(0, i + 2));
  }
  data.clear();
  const s = engine.fresh('chapter3');
  engine.enterChapter(s);
  s.names = engine.names('', '小秋');
  data.set('slot4', { state: s, version: s.version, frames: [], date: '2026-01-01' });
  data.set('seenLabels', ['chapter1:roam_gpt']);
  data.set('album.cg_confession_claude', true);
  open().importClearances();
  assert.deepEqual(accessible(), ['prologue', 'chapter1', 'chapter3', 'chapter5']);
  assert.equal(data.get('playerNames').player_name, '小秋');
  assert.equal(open().list('clearedChapters').size, 0);
});

test('五女主各有三区与专属过载台词，五秒滑动窗口按连续的同一角色计数', () => {
  assert.deepEqual(Object.keys(WhiteboxReplayData.pokes), [...engine.heroes]);
  for (const lines of Object.values(WhiteboxReplayData.pokes)) {
    assert.equal(lines.length, 4);
    for (const [exp, line] of lines) assert.ok(exp && line);
  }
  const tap = WhiteboxPoke.streak();
  for (const t of [0, 1, 2, 3, 5001]) assert.equal(tap('gpt', t), false);
  assert.equal(tap('gpt', 5001), true);
  for (const id of ['gpt', 'gpt', 'gpt', 'claude', 'gpt', 'gpt', 'gpt', 'gpt']) assert.equal(tap(id, 5100), false);
  assert.equal(tap('gpt', 5101), true);
});

test('实际剧本全图可达，空降恢复角色、场景与重试状态，主线快照独立', () => {
  const { open, awards } = storage(), p = open();
  const player = engine.names('林', '星野');
  for (const id of ids) {
    const story = engine.storyFor({ storyId: id }), chart = p.chart(id);
    const initial = engine.fresh(id);
    engine.enterChapter(initial, undefined, p.pass);
    const queue = [initial], checked = new Set();
    for (let i = 0; i < queue.length; i++) {
      const state = queue[i], n = story.nodes[state.pc];
      // Roam uses two different actors. Endings share a pc across five routes.
      const signature = [state.pc, state.roam?.visited, state.finaleHero].join('|');
      if (checked.has(signature)) continue;
      checked.add(signature);
      p.position(state);
      if (n.type === 'scene_end') continue;
      if (n.innerOs) p.note(state);
      if (n.value === 'delete_panic') p.earn('ach_05');
      if (n.type === 'input_player_name') p.earn('ach_01');
      const options = n.options ? n.options.map((_, j) => j) : [null];
      for (const j of options) {
        if (n.type === 'free_roam_hub' && state.roam.visited.includes(n.options[j].actor)) continue;
        const branch = structuredClone(state);
        const next = j === null ? state.pc + 1 : engine.choose(branch, j, p.choice);
        engine.arrive(branch, next, undefined, p.pass);
        queue.push(branch);
      }
    }
    const visited = p.list('seenLabels');
    for (const item of chart.entries.values()) assert.ok(visited.has(item.key), item.key);
    for (const label of Object.keys(story.labels)) assert.ok(visited.has(id + ':' + label), label);
    for (const hub of chart.hubs.values()) {
      const landing = p.checkpoint(hub, id, player);
      assert.equal(landing.names.player_name, '林星野');
      assert.equal(landing.pc, hub.pc);
      assert.equal(landing.history.length, 0);
      assert.ok(landing.bg && landing.chapter);
      const target = story.nodes[landing.pc];
      if (target.type === 'free_roam_hub') assert.deepEqual([...landing.roam.visited], []);
      const affection = structuredClone(landing.affection);
      engine.arrive(landing, engine.choose(landing, 0, p.choice), undefined, p.pass);
      landing.affection.gpt = 999;
      assert.deepEqual(p.checkpoint(hub, id, player).affection, affection);
    }
  }
  p.earn('ach_11');
  p.earn('ach_12');
  assert.equal(Object.keys(WhiteboxReplayData.medals).length, 18);
  assert.equal(open().list('achievements').size, 18);
  assert.equal(awards.length, 18);
  assert.ok(awards.indexOf('ach_18') > awards.indexOf('ach_17'));
});

test('旧序章档缺少 storyId 仍可开图，重载和重绘不重复累计黄牌或草稿', () => {
  const { open } = storage(), p = open(), s = engine.fresh();
  delete s.storyId;
  const story = engine.storyFor(s);
  const pc = story.nodes.findIndex(n => n.type === 'dispatch_board');
  engine.arrive(s, pc, undefined, p.pass);
  const oldSave = JSON.stringify(s);
  p.position(s);
  p.position(JSON.parse(oldSave));
  assert.equal(JSON.stringify(s), oldSave);
  assert.ok(p.checkpoint(p.chart('prologue').hubs.get(pc), 'prologue', s.names));
  for (let i = 0; i < 9; i++) open().note(s);
  assert.equal(p.list('openedNotes').size, 1);
  for (let i = 0; i < 7; i++) { s.pc = i; open().note(s); }
  assert.ok(p.list('achievements').has('ach_06'));
  p.pass(s, { type: 'tag', value: 'suspended_card' });
  open().position(JSON.parse(oldSave));
  assert.equal(p.list('achievements').has('ach_04'), false);
  open().pass(s, { type: 'tag', value: 'suspended_card' });
  assert.ok(p.list('achievements').has('ach_04'));
});

test('读取旧档从回退记录补登实际派单与枢纽，重复读取保留同一份记录', () => {
  const { open, data } = storage(), p = open(), s = engine.fresh();
  delete s.storyId;
  const story = engine.storyFor(s), pc = story.nodes.findIndex(n => n.type === 'dispatch_board');
  engine.arrive(s, pc);
  const { history, ...rest } = s;
  const frames = [{ ...structuredClone(rest), historyLength: history.length }];
  engine.arrive(s, engine.choose(s, 1));
  const serialized = JSON.stringify({ s, frames });
  p.restoreHistory(s, frames);
  const stored = JSON.stringify([...data]);
  open().restoreHistory(s, frames);
  assert.equal(JSON.stringify([...data]), stored);
  assert.equal(JSON.stringify({ s, frames }), serialized);
  assert.ok(p.list('seenLabels').has('prologue:route_gpt_deepseek'));
  assert.equal(p.list('seenLabels').has('prologue:route_claude_grok'), false);
  const landing = p.checkpoint(p.chart('prologue').hubs.get(pc), 'prologue', s.names);
  assert.equal(landing.pc, pc);
  assert.equal(landing.historyLength, undefined);
});
