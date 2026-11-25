import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { compile } from '../tools/compile.mjs';

const root = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
const host = { window: {} };
for (const name of ['chapter3', 'chapter4', 'engine'])
  runInNewContext(read('src/' + name + '.js'), host);
const { heroes, member, fresh, enterChapter, reselectRoute, storyFor, names, arrive, choose } = host.window.Whitebox;
const story = storyFor({ storyId: 'chapter4' });

test('五条个人线与定稿一致，所有续玩标签都有对应的选线按钮', () => {
  const source = read('docs/scripts/04_chapter4_full_script.md');
  assert.deepEqual(JSON.parse(JSON.stringify(story)), JSON.parse(JSON.stringify(compile(source))));
  assert.equal(story.nodes.filter(n => n.type === 'dialogue').length, source.match(/\[speaker: /g).length);
  const s = fresh('chapter4');
  const menu = enterChapter(s);
  assert.equal(menu.type, 'choice');
  assert.deepEqual(Array.from(menu.options, o => o.label), Array.from(heroes, id => 'ch4_route_' + id));
  assert.equal(s.lockedHero, '');
  assert.equal(s.bg, 'bg_hydrangea_rain_walk');
  assert.equal(s.names.player_name, '');
});

test('继承或手选均能走完五线、读档、两档重试并换线，积分和历史从章首重新分支', () => {
  const covered = new Set(), images = new Set();
  for (const [index, id] of heroes.entries()) {
    for (const inherited of [false, true]) {
      const previous = fresh('chapter3');
      previous.names = names('林', '听雨');
      previous.affection.grok = 17;
      previous.lockedHero = id;
      previous.history.push({ who: '旁白', speaker: '', text: '运动祭结束', chapter: '第三章' });
      let s = fresh('chapter4', inherited ? previous : undefined);
      if (!inherited) s.names = names('', '小夏');
      const base = { ...s.affection };
      if (inherited) assert.equal(s.pc, story.labels['ch4_route_' + id]);
      let n = enterChapter(s);
      if (!inherited) {
        assert.equal(n.type, 'choice');
        covered.add(s.pc);
        n = arrive(s, choose(s, index));
      }
      assert.equal(s.lockedHero, id);
      assert.equal(s.bg, 'bg_hydrangea_rain_walk');
      assert.ok(s.chapter.includes(member[id][0]));
      let tuning = 0, chat = false, decisions = 0;
      for (let step = 0; step < 150; step++) {
        covered.add(s.pc);
        let next = s.pc + 1;
        if (s.phoneChat) { chat = true; assert.ok(s.phoneChat.title.includes('置顶特别关心')); }
        for (const [actor, { sprite, exp }] of Object.entries(s.cast)) {
          if (heroes.includes(actor)) assert.equal(sprite, actor + '-summer');
          images.add(exp === 'normal' ? sprite + '-front' : sprite + '/' + exp);
        }
        if (n.type === 'scene_end') break;
        if (n.type === 'temp_tuner') {
          assert.equal(n.actor, id);
          s = JSON.parse(JSON.stringify(s));
          next = choose(s, [0, 2, 1][tuning++]);
        } else if (n.type === 'choice') {
          decisions++;
          next = choose(s, Number(inherited));
        }
        n = arrive(s, next);
      }
      assert.equal(n.type, 'scene_end');
      assert.ok(chat);
      assert.equal(tuning, 3);
      assert.equal(decisions, 3);
      assert.deepEqual({ ...s.affection }, { ...base, [id]: base[id] + 4 });
      const again = reselectRoute(JSON.parse(JSON.stringify(s)));
      const menu = enterChapter(again);
      assert.equal(menu.type, 'choice');
      assert.equal(again.names.player_name, inherited ? '林听雨' : '小夏');
      assert.deepEqual({ ...again.affection }, base);
      assert.equal(again.lockedHero, '');
      assert.equal(again.history.filter(l => l.speaker === 'player').length, 0);
      if (inherited) assert.equal(again.history[0].text, '运动祭结束');
      arrive(again, choose(again, (index + 1) % heroes.length));
      assert.equal(again.lockedHero, heroes[(index + 1) % heroes.length]);
      assert.equal(s.lockedHero, id);
    }
  }
  const entryNarration = story.nodes.findIndex(n => n.type === 'narration');
  story.nodes.forEach((n, i) => {
    if (i !== entryNarration && ['choice','dialogue','narration','temp_tuner','scene_end'].includes(n.type))
      assert.ok(covered.has(i), '未走到第四章节点 ' + i);
    if (n.type === 'bg') assert.ok(existsSync(new URL('assets/bg/' + n.value + '.webp', root)), n.value);
  });
  for (const id of heroes)
    for (const suffix of ['-front', '/happy', '/blush', '/gentle', '/panicked'])
      images.add(id + '-summer' + suffix);
  for (const sprite of images) assert.ok(existsSync(new URL('assets/sprites/' + sprite + '.webp', root)), sprite);
});
