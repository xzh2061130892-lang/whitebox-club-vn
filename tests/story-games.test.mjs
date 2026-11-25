import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const context = { window: {} };
const chapters = ['prologue', 'chapter1', 'chapter2', 'chapter3', 'chapter4', 'chapter5'];
for (const file of [...chapters, 'engine', 'story-games'])
  runInNewContext(readFileSync(new URL('../src/' + file + '.js', import.meta.url), 'utf8'), context);
const { transition } = context.window.WhiteboxStoryGames;
const { fresh, storyFor, arrive, choose } = context.window.Whitebox;

test('锁定按示波器显示的两位小数判断，边界以外可重试', () => {
  const { bandAt } = context.window.WhiteboxStoryGames;
  for (const [value, band] of [[0,0], [0.39,0], [0.396,null], [0.61,null], [0.619,1],
    [0.75,1], [0.88,1], [0.89,null], [1.35,null], [1.36,2], [2,2]])
    assert.equal(bandAt(value), band);
});

test('咖喱钩子覆盖三条厨房路线的六种答复，下一节点仍为停电夜', () => {
  const s = fresh('chapter2'), story = storyFor(s);
  const hits = story.nodes.flatMap((n, pc) => n.type === 'dialogue' && transition(story, {...s, pc}) ? [pc] : []);
  assert.equal(hits.length, 6);
  for (const pc of hits) {
    arrive(s, pc);
    assert.equal(transition(story, s), 'curry');
    const old = structuredClone(s);
    transition(story, s);
    assert.deepEqual(JSON.parse(JSON.stringify(s)), old);
    arrive(s, pc + 1);
    assert.equal(s.bg, 'bg_camp_lodge_night');
  }
});

test('接力钩子只在三场比赛选完场边口令时触发，原有两种答案都能提交', () => {
  const s = fresh('chapter3'), story = storyFor(s);
  const hits = story.nodes.flatMap((n, pc) => n.options && transition(story, {...s, pc}, 0) ? [pc] : []);
  assert.equal(hits.length, 3);
  for (const pc of hits) {
    for (const i of [0, 1]) {
      const menu = arrive(s, pc);
      assert.equal(transition(story, s, i), 'relay');
      assert.equal(transition(story, s), undefined);
      const before = s.history.length;
      assert.equal(choose(s, i), menu.options[i].target);
      assert.equal(s.history.length, before + 1);
    }
  }
});

test('只在五张专属告白 CG 前点火，已展示的 CG 与合照均不重复触发', () => {
  const s = fresh('chapter5'), story = storyFor(s), cgs = [];
  for (const [pc, n] of story.nodes.entries()) {
    if (!['dialogue','narration'].includes(n.type)) continue;
    const frame = { ...s, pc, bg: 'bg_festival_plaza_night' };
    if (transition(story, frame) !== 'fireworks') continue;
    const loaded = JSON.parse(JSON.stringify(frame));
    arrive(loaded, pc + 1);
    cgs.push(loaded.bg);
    assert.deepEqual(Object.keys(loaded.cast), []);
    assert.equal(transition(story, loaded), undefined);
  }
  assert.deepEqual(cgs, ['gpt','claude','gemini','grok','deepseek'].map(id => 'cg_confession_' + id));
});
