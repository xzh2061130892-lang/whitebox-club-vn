import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { compile } from '../tools/compile.mjs';

const root = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
const host = { window: {} };
for (const name of ['prologue', 'chapter1', 'chapter2', 'chapter3', 'engine'])
  runInNewContext(read('src/' + name + '.js'), host);
const { fresh, storyFor, names, arrive, choose, heroes, routeHero } = host.window.Whitebox;

test('第二、三章离线脚本与定稿一致，保留全部台词和舞台指令', () => {
  for (const [id, file] of [['chapter2', '02_chapter2'], ['chapter3', '03_chapter3']]) {
    const source = read('docs/scripts/' + file + '_full_script.md');
    const story = storyFor({ storyId: id });
    assert.deepEqual(JSON.parse(JSON.stringify(story)), JSON.parse(JSON.stringify(compile(source))));
    assert.equal(story.nodes.filter((n) => n.type === 'dialogue').length, source.match(/\[speaker: /g).length);
    assert.equal(story.nodes.filter((n) => n.type === 'scene_end').length, 1);
    for (const n of story.nodes) {
      if (n.type === 'bg') assert.ok(existsSync(new URL('assets/bg/' + n.value + '.webp', root)), n.value);
      if (n.type === 'char') assert.ok(existsSync(new URL('assets/sprites/' + n.value + '-front.webp', root)), n.value);
    }
  }
});

test('合宿和运动祭的母版、常用表情及客串出场资源齐全', () => {
  const sprites = ['grok-date/panicked', 'mistral-1/happy'];
  for (const hero of heroes) {
    for (const outfit of ['camp', 'sport']) {
      const key = hero + '-' + outfit;
      sprites.push(key + '-front');
      for (const exp of ['happy', 'blush', 'gentle', 'panicked']) sprites.push(key + '/' + exp);
    }
  }
  for (const sprite of sprites)
    assert.ok(existsSync(new URL('assets/sprites/' + sprite + '.webp', root)), sprite);
});

test('两章分支全覆盖，姓名和积分跨章继承，低温高温重试，借物对象自由锁定', () => {
  const visited = { chapter2: new Set(), chapter3: new Set() };
  const shownSprites = new Set();
  for (let run = 0; run < 60; run++) {
    let previous = fresh('chapter1');
    previous.names = names('南', '星');
    previous.affection.gpt = 30;
    for (const id of Object.keys(visited)) {
      const s = fresh(id, previous), story = storyFor(s);
      const scores = { ...previous.affection };
      assert.equal(s.names.player_name, '南星');
      assert.deepEqual({ ...s.affection }, scores);
      assert.notEqual(s.affection, previous.affection);
      let next = 0, tuning = 0, visits = 0, done = false, specialOutfit = false;
      for (let step = 0; step < 260; step++) {
        const n = arrive(s, next);
        visited[id].add(s.pc);
        next = s.pc + 1;
        const suffix = id === 'chapter2' ? '-camp' : '-sport';
        for (const { sprite, exp } of Object.values(s.cast)) {
          if (sprite.endsWith(suffix)) specialOutfit = true;
          shownSprites.add(exp === 'normal' ? sprite + '-front' : sprite + '/' + exp);
        }
        if (id === 'chapter3')
          for (const hero of heroes)
            if (s.cast[hero]) assert.equal(s.cast[hero].sprite, hero + '-sport');
        if (n.type === 'dialogue' && heroes.includes(n.speaker)) {
          const pts = n.text.match(/好感度\s*\+(\d+)/);
          if (pts) scores[n.speaker] += Number(pts[1]);
        }
        if (n.type === 'narration')
          for (const match of n.text.matchAll(/(GPT|Claude|Gemini|Grok|DeepSeek) 好感度 \+(\d+)/g))
            scores[match[1].toLowerCase()] += Number(match[2]);
        assert.deepEqual({ ...s.affection }, scores);
        if (n.type === 'free_roam_hub') {
          const first = run % 5, second = (first + 1 + Math.floor(run / 5) % 4) % 5;
          next = choose(s, visits++ === 0 ? first : second);
        } else if (n.type === 'temp_tuner') {
          next = choose(s, [0, 2, 1][tuning++]);
        } else if (n.options) {
          const idx = run % n.options.length;
          const hero = routeHero(s, n.options[idx]);
          next = choose(s, idx);
          if (hero) {
            assert.equal(s.lockedHero, heroes[run % 5]);
            assert.equal(next, story.labels['ch3_lock_' + s.lockedHero]);
          }
        }
        if (n.type === 'scene_end') { done = true; break; }
      }
      assert.ok(done && specialOutfit);
      assert.equal(visits, 2);
      assert.equal(tuning, 3);
      if (id === 'chapter3') {
        assert.equal(s.lockedHero, heroes[run % 5]);
        assert.equal(JSON.parse(JSON.stringify(s)).lockedHero, s.lockedHero);
      }
      previous = s;
    }
  }
  for (const sprite of shownSprites)
    assert.ok(existsSync(new URL('assets/sprites/' + sprite + '.webp', root)), sprite);
  for (const [id, seen] of Object.entries(visited))
    storyFor({ storyId: id }).nodes.forEach((n, index) => {
      if (['dialogue', 'narration', 'choice', 'scene_end'].includes(n.type))
        assert.ok(seen.has(index), id + ' 遗漏节点 ' + index);
    });
});
