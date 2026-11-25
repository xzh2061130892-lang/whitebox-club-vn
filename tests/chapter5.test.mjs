import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { compile } from '../tools/compile.mjs';

const root = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
const host = { window: {} };
for (const name of ['chapter4', 'chapter5', 'engine'])
  runInNewContext(read('src/' + name + '.js'), host);
const { heroes, fresh, enterChapter, storyFor, arrive, choose, routeHero, revisitBonfire, names } = host.window.Whitebox;
const story = storyFor({ storyId: 'chapter5' });
const saved = (value) => JSON.parse(JSON.stringify(value));
const asset = (name) => assert.ok(existsSync(new URL('assets/' + name + '.webp', root)), name);

test('事件 CG 自行清场并忽略上台指令，切回场景后恢复立绘', () => {
  const scene = { version: 'test', labels: {}, nodes: [
    { type: 'bg', value: 'bg_plaza' },
    { type: 'dialogue', speaker: 'claude', text: '开幕' },
    { type: 'bg', value: 'cg_photo' },
    { type: 'char', value: 'gpt-3', pos: 'left' },
    { type: 'dialogue', speaker: 'claude', text: '拍照' },
    { type: 'bg', value: 'bg_plaza' },
    { type: 'dialogue', speaker: 'glm', text: '谢幕' },
  ] };
  const context = { window: { WHITEBOX_CHAPTER5: scene } };
  runInNewContext(read('src/engine.js'), context);
  const w = context.window.Whitebox, s = w.fresh('chapter5');
  w.enterChapter(s);
  assert.equal(s.cast.claude.sprite, 'claude-3');
  w.arrive(s, s.pc + 1);
  assert.deepEqual(Object.keys(s.cast), []);
  const restored = saved(s);
  w.arrive(restored, restored.pc + 1);
  assert.deepEqual(Object.keys(restored.cast), ['glm']);
  assert.equal(restored.cast.glm.sprite, 'glm-3');
});

test('终章与定稿一致，九人礼服、头像和六张事件 CG 均随游戏提供', () => {
  const source = read('docs/scripts/05_chapter5_full_script.md');
  assert.deepEqual(saved(story), saved(compile(source)));
  assert.equal(story.nodes.filter(n => n.type === 'dialogue').length, source.match(/\[speaker: /g).length);
  const cgs = new Set();
  for (const n of story.nodes) {
    if (n.type === 'bg') {
      asset('bg/' + n.value);
      if (n.value.startsWith('cg_')) cgs.add(n.value);
    }
  }
  assert.equal(cgs.size, 6);
  for (const id of [...heroes, 'glm', 'qwen', 'kimi', 'mistral']) {
    asset('avatars/' + id + '-3');
    asset('sprites/' + id + '-3-front');
    if (heroes.includes(id))
      for (const exp of ['happy', 'blush', 'gentle', 'panicked']) asset('sprites/' + id + '-3/' + exp);
  }
});

test('文化祭任选两处，五线重调、告白、结算读档与回溯保留正确的积分和恋人', () => {
  const covered = new Set(), sprites = new Set();
  const prior = fresh('chapter4');
  prior.names = names('江', '知雨');
  prior.lockedHero = 'gemini';
  prior.affection.claude = 14;
  prior.history.push({ text: '梅雨季结束', chapter: '第四章', speaker: '', who: '旁白' });
  function check(s) {
    covered.add(s.pc);
    if (s.bg.startsWith('cg_')) assert.equal(Object.keys(s.cast).length, 0, s.bg);
    for (const [id, actor] of Object.entries(s.cast)) {
      assert.equal(actor.sprite, id + '-3');
      sprites.add(actor.sprite + (actor.exp === 'normal' ? '-front' : '/' + actor.exp));
    }
  }
  for (let first = 0; first < heroes.length; first++) {
    for (let second = 0; second < heroes.length; second++) {
      if (first === second) continue;
      const previous = first % 2 === 0 ? prior : undefined;
      let s = fresh('chapter5', previous);
      if (!previous) s.names = names('韩', '月');
      let n = enterChapter(s), visits = 0;
      const answer = second % 2;
      for (let step = 0; step < 90; step++) {
        check(s);
        if (n.options?.every(o => routeHero(s, o))) break;
        let next = s.pc + 1;
        if (n.type === 'free_roam_hub') {
          assert.equal(n.picks, 2);
          if (visits) assert.throws(() => choose(s, first));
          next = choose(s, visits++ ? second : first);
        } else if (n.options) next = choose(s, answer);
        n = arrive(s, next);
      }
      assert.equal(visits, 2);
      assert.deepEqual(Array.from(n.options, o => routeHero(s, o)), Array.from(heroes));
      const hub = saved(s);
      for (const [i, id] of heroes.entries()) {
        let tunes = 0, sawConfession = false;
        n = arrive(s, choose(s, i));
        for (let step = 0; step < 80; step++) {
          check(s);
          if (s.bg === 'cg_confession_' + id && n.speaker === id) sawConfession = true;
          if (n.type === 'scene_end') break;
          let next = s.pc + 1;
          if (n.type === 'temp_tuner') {
            assert.equal(n.actor, id);
            next = choose(s, [0, 2, 1][tunes++]);
          } else if (n.options) next = choose(s, answer);
          n = arrive(s, next);
        }
        assert.equal(n.type, 'scene_end');
        assert.equal(tunes, 3);
        assert.ok(sawConfession);
        assert.equal(s.bg, 'cg_grand_404_photo');
        assert.equal(s.finaleHero, id);
        assert.equal(s.lockedHero, previous?.lockedHero || '');
        assert.deepEqual({ ...s.affection }, { ...hub.affection, [id]: hub.affection[id] + 3 });
        s = revisitBonfire(saved(s));
        assert.equal(s.pc, hub.pc);
        assert.equal(s.names.player_name, previous ? '江知雨' : '韩月');
        assert.equal(s.lockedHero, hub.lockedHero);
        assert.deepEqual(saved(s.affection), hub.affection);
        assert.deepEqual(saved(s.history), hub.history);
      }
    }
  }
  for (const [pc, n] of story.nodes.entries())
    if (['dialogue', 'narration', 'choice', 'free_roam_hub', 'temp_tuner', 'scene_end'].includes(n.type))
      assert.ok(covered.has(pc), '未走到的节点 ' + pc);
  for (const sprite of sprites) asset('sprites/' + sprite);
});
