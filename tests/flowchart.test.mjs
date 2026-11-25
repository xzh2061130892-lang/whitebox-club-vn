import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const ids = ['prologue', 'chapter1', 'chapter2', 'chapter3', 'chapter4', 'chapter5'];
const root = new URL('../', import.meta.url);
function load() {
  const context = { window: {}, structuredClone };
  for (const host of [context, context.window])
    for (const api of ['document', 'ResizeObserver', 'requestAnimationFrame'])
      Object.defineProperty(host, api, { get() { throw Error('纯逻辑模块访问了 ' + api); } });
  for (const file of [...ids, 'engine', 'replay-data', 'replay'])
    runInNewContext(readFileSync(new URL('src/' + file + '.js', root), 'utf8'), context);
  return context.window;
}
const { WhiteboxReplay: replay, Whitebox: engine } = load();
const progress = replay.progress(() => null, () => true, () => {});
const kinds = new Set(['dispatch', 'roam', 'tuner', 'choice_hub', 'route', 'branch', 'merge', 'ending']);

test('六章可在无 DOM 的存档环境构建图谱，保留键、跳转点和父子结构', () => {
  for (const id of ids) {
    const { entries, roots, hubs } = progress.chart(id), story = engine.storyFor({storyId: id});
    assert.ok(existsSync(new URL('assets/bg/' + replay.chapterBg[id] + '.webp', root)));
    for (const [label, item] of entries) {
      assert.equal(item.id, label);
      assert.equal(item.key, id + ':' + label);
      assert.ok(kinds.has(item.kind) && item.hint && item.bg, item.key);
      assert.ok(existsSync(new URL('assets/bg/' + item.bg + '.webp', root)));
      assert.equal(typeof item.technical, 'boolean');
      assert.equal(item.technical, /_(tuner_retry|after_roam|roam_start|ending_card)$/.test(label));
      if (item.pc != null) assert.equal(hubs.get(item.pc), item);
      else assert.equal(item.scriptPc, story.labels[label]);
      assert.ok(item.parentKey ? entries.get(item.parentKey.split(':')[1]).children.includes(item) : roots.includes(item));
    }
  }
});

test('角色筛选覆盖五人，派单搭档、串门目标、调温三档与剧本选项逐一对应', () => {
  for (const id of ids) {
    const chart = progress.chart(id);
    for (const item of chart.entries.values()) {
      assert.ok(item.actors.every(actor => engine.heroes.includes(actor)), item.key);
      assert.equal(new Set(item.actors).size, item.actors.length);
    }
    for (const [pc, hub] of chart.hubs) {
      const n = engine.storyFor({storyId:id}).nodes[pc];
      assert.equal(hub.kind, { choice:'choice_hub', dispatch_board:'dispatch', free_roam_hub:'roam', temp_tuner:'tuner' }[n.type]);
      hub.children.forEach((branch, i) => {
        if (hub.kind === 'dispatch') {
          assert.equal(branch.actors.length, 2);
          assert.deepEqual([...branch.actors], [...n.options[i].pair]);
        } else if (hub.kind === 'roam') assert.deepEqual([...branch.actors], [n.options[i].actor]);
        else if (hub.kind === 'tuner') {
          assert.equal(branch.tempBand, i);
          assert.deepEqual([...branch.actors], [n.actor]);
          assert.ok(branch.hint.includes(['0.1','0.7','1.6'][i]));
        }
      });
    }
  }
  for (const id of engine.heroes) {
    const entries = [...progress.chart('chapter5').entries.values()].filter(item => item.actors.includes(id));
    assert.ok(entries.some(item => item.kind === 'route') && entries.some(item => item.kind === 'tuner'));
  }
});

test('终章收集品、技术折返点及告白时的当前坐标准确归位', () => {
  const chart = progress.chart('chapter5');
  for (const [i, hero] of engine.heroes.entries()) {
    const route = chart.entries.get('ch5_end_' + hero);
    assert.equal(route.cg, 'cg_confession_' + hero);
    assert.equal(route.medal, 'ach_' + (13+i));
    const tuner = route.children.find(n => n.kind === 'tuner');
    for (const node of [route, tuner, ...tuner.children])
      assert.equal(progress.locate({storyId:'chapter5',pc:node.scriptPc+Number(node.kind !== 'tuner')}), node);
    assert.equal(progress.locate({storyId:'chapter5',pc:tuner.pc-1}), tuner);
    assert.equal(progress.locate({storyId:'chapter5',pc:tuner.pc+4,bg:route.cg}), route);
  }
  assert.equal(chart.entries.get('ch5_grand_epilogue').cg, 'cg_grand_404_photo');
  // A choice and its destination may have different scenery, even across adjacent routes.
  assert.equal(chart.entries.get('ch5_end_claude').bg, 'bg_greenhouse_lib_day');
  assert.equal(chart.entries.get('ch5_grand_epilogue').bg, 'bg_room_404_sunset');
  assert.equal(progress.chart('chapter2').entries.get('ch2_grok_chaos').medal, 'ach_08');
  assert.equal(progress.locate({pc:0}), null);
  assert.equal(progress.locate(null), null);
});
