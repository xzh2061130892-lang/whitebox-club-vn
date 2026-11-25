import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const root = new URL('../', import.meta.url);
const read = path => readFileSync(new URL(path, root), 'utf8');
const context = { window: {}, navigator: {} };
for (const name of ['engine', 'arcade-decks', 'arcade', 'studio', 'arcade-rounds'])
  runInNewContext(read('src/' + name + '.js'), context);
const { WhiteboxArcade: arcade, ArcadeDecks: decks, WhiteboxStudio: studio } = context.window;

test('全套来稿、双重违规、八稿删留标记与十二条热搜逐项对应设计稿', () => {
  const spec = read('docs/10_postgame_arcade_minigames_spec.md');
  assert.equal(decks.papers.length, 14);
  assert.equal(decks.edits.length, 8);
  assert.equal(decks.rumors.length, 12);
  for (const p of decks.papers) {
    const row = spec.split('\n').find(line => line.includes('《' + p.title + '》') && line.includes(p.body));
    assert.ok(row.includes(p.author));
    assert.deepEqual([...p.rules], [...row.matchAll(/R(\d)/g)].map(m => Number(m[1])));
  }
  for (const line of decks.edits) {
    const blocks = line.map(([word, remove]) => '`[' + (remove ? '删' : '留') + '] ' + word + '`');
    assert.ok(spec.includes(blocks.join(' / ')));
  }
  for (const [word, fake] of decks.rumors) {
    const row = spec.split('\n').find(line => line.includes('`' + word + '`'));
    assert.ok(row.includes(fake ? '应点爆' : '勿错杀'));
  }
});

test('门槛与结算保留分模式最高纪录，双星两项合计最多三星，五金为十五星', () => {
  const p = arcade.cabinet(() => null, () => true).current();
  for (const [id, game] of Object.entries(arcade.games)) {
    game.marks.forEach((mark, i) => {
      assert.equal(arcade.grade(id, mark - 1), i);
      assert.equal(arcade.grade(id, mark), i + 1);
    });
    assert.equal(arcade.settle(p, id, id, id === 'gpt' ? 8000 : game.marks[2], 3), 300);
  }
  assert.equal(arcade.stars(p), 15);
  assert.equal(arcade.settle(p, 'gemini', 'memory', 1500, 1), 113);
  assert.equal(arcade.settle(p, 'gemini', 'gemini', 0, 0), 50);
  assert.equal(arcade.stars(p), 15);
  assert.equal(p.records.gemini.modes.gemini.score, 6000);
  assert.equal(p.records.gemini.modes.memory.rank, 1);
  assert.equal(p.coins, 1663);
  assert.deepEqual([15,30,45].map(arcade.stroopScore), [1500,3500,6000]);
  assert.equal(arcade.memoryRank(14,50), 3);
  assert.equal(arcade.memoryRank(15,50), 2);
  assert.equal(arcade.memoryRank(21,91), 1);
});

test('钱包原子保存余额、奖品与装备，余额不足、重复兑换及写入失败都不扣款', async () => {
  const disk = new Map();
  let available = true;
  const read = key => JSON.parse(disk.get(key) || 'null');
  const write = (key, value) => {
    if (available) disk.set(key, JSON.stringify(value));
    return available;
  };
  const store = arcade.cabinet(read, write);
  const buy = key => store.change(p => arcade.purchase(p, key));
  assert.equal(await buy('host.grok'), false);
  await store.change(p => arcade.settle(p, 'gpt', 'gpt', 8000, 3));
  available = false;
  await assert.rejects(buy('host.grok'), /保存/);
  assert.equal(store.current().coins, 300);
  available = true;
  assert.deepEqual(await Promise.all([buy('host.grok'), buy('host.grok')]), [true, false]);
  const afterReload = arcade.cabinet(read, write).current();
  assert.equal(afterReload.coins, 0);
  assert.equal(afterReload.host, 'grok');
  assert.deepEqual([...afterReload.owned], ['host.grok']);
  assert.equal(arcade.price('scene.grok'), 400);
  assert.equal(arcade.price('decor.instant'), 200);
  assert.equal(arcade.price('decor.fake'), undefined);
  assert.deepEqual([...disk.keys()], ['arcade']);
});

test('所有大厅、主持人、全员衣橱牌面与换装奖品均有离线素材', () => {
  const asset = path => assert.ok(existsSync(new URL('assets/' + path + '.webp', root)), path);
  for (const [id, game] of Object.entries(arcade.games)) {
    asset('bg/' + game.bg); asset('avatars/' + id + '-1');
    assert.equal(studio.clothesFor(id).length, 6);
  }
  for (const id of studio.actors) for (const outfit of studio.clothesFor(id)) asset('sprites/' + id + '-' + outfit + '-front');
});
