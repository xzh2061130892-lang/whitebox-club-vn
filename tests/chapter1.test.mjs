import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { compile } from '../tools/compile.mjs';

const root = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
const source = read('docs/scripts/01_chapter1_full_script.md');
const story = compile(source);
const prologue = compile(read('docs/scripts/00_prologue_full_script.md'));
const host = { window: { WHITEBOX_STORY: prologue, WHITEBOX_CHAPTER1: story } };
runInNewContext(read('src/engine.js'), host);
const { fresh, names, storyFor, arrive, choose, heroes } = host.window.Whitebox;
const total = (s) => Object.values(s.affection).reduce((sum, value) => sum + value, 0);

test('指令成对闭合、选项目标有效，并保留原剧本的所有台词', () => {
  assert.equal(story.nodes.filter((n) => n.type === 'dialogue').length, source.match(/\[speaker: /g).length);
  const chat = story.nodes.find((n) => n.type === 'phone_chat');
  assert.equal(story.nodes[chat.end].type, 'phone_chat_end');
  assert.throws(() => compile(source.replace('[phone_chat_end]', '[char_clear]')), /未闭合/);
  assert.throws(() => compile(source.replace('picks: 2', 'picks: 6')), /次数无效/);
  assert.throws(() => compile(source.replace('exit: ch1_after_roam', 'exit: nowhere')), /未知跳转/);
  assert.throws(() => compile(source.replace('→ 跳转 `[label: ch1_date_gpt]', '→ 跳转 `[label: nowhere]')), /未知跳转/);
  const board = story.nodes.find((n) => n.type === 'dispatch_board');
  assert.deepEqual([board.title, board.client, board.related, board.deadline],
    ['猛男的恋爱SOS', '橄榄球部主将·阿烈', 'Claude（温室审稿）', '今日放学前']);
  assert.ok(board.desc.includes('橄榄球'));
});

test('20 种串门顺序、三组派单、五人约会与两种答复均可到达结算', () => {
  const previous = fresh();
  previous.names = names('林', '初雪');
  previous.affection.gpt = 4;
  previous.history.push({ who: '旁白', text: '序章', chapter: '序章', speaker: '' });
  const covered = new Set();
  let run = 0;
  for (let first = 0; first < 5; first++) {
    for (let second = 0; second < 5; second++) {
      if (second === first) continue;
      const s = fresh('chapter1', previous);
      assert.equal(s.history.length, 1);
      const date = run % 5;
      let next = 0, visits = 0, tunings = 0, scoreBeforeTuning, invited = false, seenOutfit = false, ended = false;
      for (let step = 0; step < 260; step++) {
        const n = arrive(s, next);
        covered.add(s.pc);
        next = s.pc + 1;
        if (s.phoneChat) {
          assert.equal(Object.keys(s.cast).length, 0);
          assert.ok(s.phoneChat.from >= 1);
        }
        if (n.type === 'phone_chat_end') {
          const messages = s.history.slice(s.phoneChat.from);
          assert.equal(messages.filter((line) => line.speaker === 'player').length, 1);
          assert.ok(messages.some((line) => line.text.includes('林初雪')));
        }
        if (n.type === 'free_roam_hub') {
          assert.equal(s.phoneChat, undefined);
          assert.equal(s.roam.visited.length, visits);
          if (visits === 1) {
            const loaded = JSON.parse(JSON.stringify(s));
            assert.throws(() => choose(loaded, first), /已访问/);
            assert.deepEqual(loaded.roam.visited, [n.options[first].actor]);
            assert.equal(choose(loaded, second), story.labels[n.options[second].label]);
          }
          next = choose(s, visits++ === 0 ? first : second);
        }
        if (n.type === 'temp_tuner') {
          assert.equal(s.roam, undefined);
          if (tunings === 0) scoreBeforeTuning = total(s);
          else assert.equal(total(s), scoreBeforeTuning);
          next = choose(s, [0, 2, 1][tunings++]);
        }
        if (n.type === 'dispatch_board') next = choose(s, run % 3);
        if (n.type === 'choice') {
          const isInvite = n.options.every((o) => o.label);
          next = choose(s, isInvite ? date : run % n.options.length);
          if (isInvite) {
            invited = true;
            assert.equal(next, story.labels['ch1_date_' + heroes[date]]);
          }
        }
        if (invited && s.cast[heroes[date]]?.sprite === heroes[date] + '-date') seenOutfit = true;
        if (n.type === 'scene_end') {
          ended = true;
          break;
        }
      }
      assert.ok(ended && seenOutfit);
      assert.equal(visits, 2);
      assert.equal(tunings, 3);
      assert.equal(total(s) - total(previous), 9);
      assert.equal(previous.history.length, 1);
      assert.equal(s.names.player_name, '林初雪');
      run++;
    }
  }
  assert.equal(run, 20);
  for (const [i, n] of story.nodes.entries())
    if (['dialogue', 'narration', 'choice', 'free_roam_hub', 'temp_tuner', 'dispatch_board', 'scene_end'].includes(n.type))
      assert.ok(covered.has(i), '未走到 ' + i);
  assert.equal(storyFor({}), prologue);
  assert.equal(total(fresh('chapter1')), 0);
});

test('所有场景、五套私服母版和首期表情均可离线读取', () => {
  for (const n of story.nodes)
    if (n.type === 'bg') assert.ok(existsSync(new URL('assets/bg/' + n.value + '.webp', root)), n.value);
  for (const id of heroes) {
    const base = 'assets/sprites/' + id + '-date';
    for (const suffix of ['-front.webp', '/normal.webp', '/happy.webp', '/blush.webp', '/gentle.webp'])
      assert.ok(existsSync(new URL(base + suffix, root)), id + suffix);
  }
});
