import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runInNewContext } from 'node:vm';
import { compile, liveCgManifest } from '../tools/compile.mjs';
import { insertCg, omniCgs } from '../tools/omni-cgs.mjs';

const root = new URL('../', import.meta.url);
const read = path => readFileSync(new URL(path, root), 'utf8');
const loadManifest = script => {
  const window = {};
  runInNewContext(script, { window });
  return window;
};

test('视频清单仅收录根目录实际文件，优先 WebM，空目录与重复扫描均稳定', t => {
  const dir = mkdtempSync(join(tmpdir(), 'whitebox-cgs-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  assert.deepEqual(Object.keys(loadManifest(liveCgManifest(dir)).LiveCgMedia), []);
  for (const name of ['cg_z.mp4', 'cg_a.mp4', 'cg_a.webm', 'cg_b.webm', 'cg_a.webp',
    'bg_room.webm', 'cg_.mp4', 'cg_a.webm.bak', 'cg_bad.MP4']) writeFileSync(join(dir, name), '');
  mkdirSync(join(dir, 'cg_dir.webm'));
  writeFileSync(join(dir, 'cg_dir.webm', 'cg_nested.mp4'), '');
  const script = liveCgManifest(dir), window = loadManifest(script);
  assert.equal(liveCgManifest(dir), script);
  assert.deepEqual(JSON.parse(JSON.stringify(window.LiveCgMedia)),
    { cg_a: ['webm', 'mp4'], cg_b: ['webm'], cg_z: ['mp4'] });
  assert.deepEqual(Object.keys(window.LiveCgMedia), ['cg_a', 'cg_b', 'cg_z']);
  assert.throws(() => { window.LiveCgMedia = {}; }, TypeError);
  assert.ok(Object.isFrozen(window.LiveCgMedia));
  assert.ok(Object.isFrozen(window.LiveCgMedia.cg_a));
});

const compiledMedia = loadManifest(read('src/studio-poses.js'));
const scriptFiles = ['00_prologue', '01_chapter1', '02_chapter2', '03_chapter3', '04_chapter4'];
const sourceFor = chapter => read('docs/scripts/' + scriptFiles.find(file => file.endsWith('_' + chapter)) + '_full_script.md');

test('发布清单对应实际视频，新增相册标题仅收录已接入且有静帧的条目，并按剧情排序', () => {
  assert.deepEqual(JSON.stringify(compiledMedia.LiveCgMedia),
    JSON.stringify(loadManifest(liveCgManifest(new URL('assets/bg/', root))).LiveCgMedia));
  const entries = [];
  for (const cg of omniCgs) {
    const used = compile(sourceFor(cg.chapter)).nodes.some(n => n.type === 'bg' && n.value === cg.id);
    assert.equal(used, existsSync(new URL('assets/bg/' + cg.id + '.webp', root)), cg.id);
    if (used) entries.push([cg.id, cg.title]);
  }
  assert.deepEqual(Object.entries(compiledMedia.OmniCgTitles), entries);
});

for (const cg of omniCgs) {
  test(cg.id + ' 在指定旁白清场，各选项恢复对应场景或保持 CG 至结算', () => {
    // Exercise the real script in memory even while its production art is pending.
    const source = sourceFor(cg.chapter), staged = insertCg(source, cg);
    assert.equal(insertCg(staged, cg), staged);
    const story = compile(staged), original = compile(source);
    const storyContent = nodes => nodes.filter(n => !['char', 'char_clear', 'bg', 'goto'].includes(n.type))
      .map(n => [n.type, n.value, n.speaker, n.text, n.options?.map(o => [o.text, o.label])]);
    assert.deepEqual(storyContent(story.nodes), storyContent(original.nodes));
    const entry = story.nodes.findIndex(n => n.type === 'bg' && n.value === cg.id);
    assert.ok(entry >= 1);
    assert.equal(story.nodes[entry - 1].type, 'char_clear');
    const variable = cg.chapter === 'prologue' ? 'WHITEBOX_STORY' : 'WHITEBOX_' + cg.chapter.toUpperCase();
    const window = { [variable]: story };
    runInNewContext(read('src/engine.js'), { window });
    const { fresh, arrive, choose, heroes } = window.Whitebox;
    const options = cg.chapter === 'chapter3' ? heroes.length : cg.chapter === 'prologue' ? 3 : 2;
    for (let option = 0; option < options; option++) {
      const s = fresh(cg.chapter);
      s.cast.gpt = { pos: 'center' };
      let n = arrive(s, entry), steps = 0;
      assert.ok(n.text.startsWith(cg.anchor), n.text);
      while (s.bg === cg.id) {
        assert.deepEqual(Object.keys(s.cast), []);
        if (n.type === 'scene_end') break;
        assert.ok(++steps < 30);
        n = arrive(s, n.options ? choose(s, option) : s.pc + 1);
      }
      if (cg.chapter === 'chapter4') {
        assert.equal(n.type, 'scene_end');
        assert.equal(s.bg, cg.id);
      } else if (cg.chapter === 'chapter2') {
        assert.equal(s.bg, 'bg_camp_lodge_night');
        assert.match(n.text, /^十一点整/);
        while (!s.cast.gpt) {
          assert.ok(++steps < 40);
          n = arrive(s, n.options ? choose(s, 0) : s.pc + 1);
        }
        assert.equal(s.cast.gpt.sprite, 'gpt-camp');
      } else {
        const [bg, sprite] = {
          prologue: ['bg_room_404_day', 'grok-1'],
          chapter1: ['bg_cafeteria_day', 'deepseek-1'],
          chapter3: ['bg_twinstar_roof_sunset', heroes[option] + '-sport'],
        }[cg.chapter];
        assert.equal(s.bg, bg);
        assert.ok(Object.values(s.cast).some(actor => actor.sprite === sprite), sprite);
      }
    }
  });
}
