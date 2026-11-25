import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const root = new URL('../', import.meta.url);
const host = { window: {} };
for (const name of ['engine', 'studio-poses', 'studio', 'commissions-data', 'club-activities'])
  runInNewContext(readFileSync(new URL('src/' + name + '.js', root), 'utf8'), host);
const { WhiteboxClub: club, WhiteboxStudio: studio, StudioPoses: poses } = host.window;

test('摄影棚覆盖全部场景与九人衣橱，CG 保留在相册', () => {
  const backgrounds = readdirSync(new URL('assets/bg/', root)).filter(n => n.startsWith('bg_')).map(n => n.slice(0, -5));
  assert.deepEqual(Object.keys(studio.scenes).sort(), backgrounds.sort());
  const sprites = readdirSync(new URL('assets/sprites/', root)).filter(n => n.endsWith('-front.webp'));
  const offered = [];
  for (const actor of studio.actors) {
    const clothes = studio.clothesFor(actor);
    assert.equal(clothes.length, host.window.Whitebox.heroes.includes(actor) ? 6 : 2);
    for (const key of clothes) {
      assert.ok(Array.isArray(poses[actor + '-' + key]));
      offered.push(actor + '-' + key + '-front.webp');
    }
  }
  assert.deepEqual(offered.sort(), sprites.sort());
});

const catalog = host.window.WhiteboxCommissionData;
const heroes = Array.from(host.window.Whitebox.heroes);
function fixture(job = 'wig', pair = ['gemini', 'grok'], temp = '0.7', setup = () => {}) {
  const d = club.fresh(), r = d.run = club.newRun();
  r.job = job; r.offers = [job]; r.weather = 'clear';
  setup(r);
  assert.ok(club.pickDispatch(d, job, pair, temp));
  return d;
}
test('旧档只重置旧经营轮次，保留钱包、礼物、测验与其他字段', () => {
  const quiz = club.newQuiz(1000), affection = { gpt: 1 };
  const d = club.normalize({ wallet: 200, affection, bestQuiz: 5, quiz, run: { id: 'old' }, extra: 1 });
  assert.equal(d.run, null); assert.equal(d.quiz, quiz); assert.equal(d.affection, affection);
  assert.equal(d.wallet, 200); assert.equal(d.bestQuiz, 5); assert.equal(d.extra, 1);
  d.run = club.newRun(); const saved = JSON.parse(JSON.stringify(d));
  assert.deepEqual(club.normalize(saved), saved); assert.equal(saved.run.v, 2);
  d.wallet = 10 * club.giftPrice; d.affection = {};
  for (const id of heroes) { assert.ok(club.give(d, id)); assert.ok(club.give(d, id)); assert.equal(club.give(d, id), false); }
  assert.equal(d.wallet, 0); d.wallet = 200;
  assert.ok(club.exchangeToArcadeCoins(d)); assert.equal(club.exchangeToArcadeCoins(d), false); assert.equal(d.wallet, 100);
});
test('完整题库、资源、十组全覆盖羁绊与双份剪报', () => {
  assert.equal(Object.keys(catalog.weather).length, 6); assert.equal(Object.keys(catalog.stock).length, 12);
  assert.equal(club.jobs.filter(j => j.boss).length, 3); assert.equal(club.jobs.filter(j => !j.boss).length, 12);
  const book = club.fresh().codex;
  for (const j of club.jobs) {
    assert.ok(studio.scenes[j.bg]); assert.ok(j.normal && j.triumph && j.mishap);
    assert.equal(j.phases.length, j.boss ? 2 : 1);
    for (const loss of [false,true]) {
      const d = fixture(j.id, j.boss ? ['gpt','claude'] : j.best, '1.6');
      d.codex = book;
      for (const phase of j.phases) {
        assert.ok(phase.safe.text && phase.risk.text);
        assert.ok(club.resolveCrisis(d, 'risk', () => loss ? 0 : .99));
      }
      // The Claude/DeepSeek bond protects eligible jobs even on a failed risk roll.
      if (loss && d.run.result.level === 1) {
        const spare = fixture(j.id, ['gpt','gemini'], '1.6'); spare.codex = book;
        for (const phase of j.phases) club.resolveCrisis(spare, 'risk', () => 0);
      }
      assert.ok(book.clips[j.id][loss ? 'mishap' : 'honour']);
      assert.equal(d.run.log.length, 1); assert.equal(club.resolveCrisis(d, 'risk'), false);
    }
  }
  const d = club.fresh(); d.run = club.newRun(); d.codex = book;
  for (const [i,a] of heroes.entries()) for (const b of heroes.slice(i + 1)) {
    assert.ok(club.selectMember(d,a)); assert.ok(club.selectMember(d,b));
    assert.ok(catalog.bonds[club.bondId([b,a])]); club.selectMember(d,b); club.selectMember(d,a);
  }
  const stats = club.codexStats(d);
  assert.equal(stats.commander, true); assert.equal(stats.honours, 15); assert.equal(stats.mishaps, 15);
});
test('晨间刷新、温度、精力、天气与金框特解可预判', () => {
  const d = club.fresh(), r = d.run = club.newRun(); assert.equal(new Set(r.offers).size, 3);
  const first = [...r.offers]; assert.ok(club.refreshOffers(r)); assert.ok(r.offers.every(id => !first.includes(id)));
  assert.ok(club.refreshOffers(r)); assert.equal(club.refreshOffers(r), false);
  assert.equal(club.pickDispatch(d,r.offers[0],['gpt','gpt'],'0.7'), false);
  r.weather = 'rain'; r.stamina.grok = 0; r.stamina.gemini = 3;
  const pair = ['grok','gemini'], a = club.forecast(r,'wig',pair,'0.1'), b = club.forecast(r,'wig',pair,'1.6');
  assert.equal(a.progress,74); assert.equal(a.risk,38); assert.equal(b.risk,68); assert.ok(b.best);
  assert.ok(club.pickDispatch(d,r.job,pair,'0.1')); assert.equal(club.resolveCrisis(d,'risk'),false);
  assert.equal(club.resolveCrisis(d,'overdrive'),false);
  const shield = fixture('cover',['gemini','claude'],'1.6');
  assert.equal(club.instructions(shield.run).find(c=>c.id==='special').afterRisk,0);
  assert.ok(club.resolveCrisis(shield,'special',()=>0)); assert.equal(shield.run.result.level,3);
  const piano = fixture('piano',['grok','gpt']); assert.equal(club.resolveCrisis(piano,'special'),false);
  piano.run.fish=true; assert.ok(club.resolveCrisis(piano,'special',()=>.99)); assert.equal(piano.run.fish,false);
});
test('四种外援和三件道具分别消耗、改判，并跨 Boss 两阶段生效', () => {
  const start = () => fixture('festival',['gpt','claude'],'1.6',r=>{
    r.day=5; r.bag=['card','chips','sticker']; r.allies=['glm','qwen','kimi','mistral']; r.stamina.gpt=0;
  });
  for (const id of ['card','chips','sticker','glm','qwen','kimi','mistral']) {
    const d=start(), r=d.run, p=r.live.progress, risk=r.live.risk;
    assert.ok(club.resolveCrisis(d,id)); assert.equal(r.live.step,1); assert.equal(r.log.length,0);
    assert.equal(club.resolveCrisis(d,id),false);
    if(id==='card'||id==='kimi') assert.equal(r.live.risk,0);
    if(id==='qwen') {assert.equal(r.live.progress,Math.min(120,p+45)); assert.equal(r.live.risk,Math.max(0,risk-20));}
    if(id==='chips') assert.equal(r.live.risk, Math.max(0,risk-40));
    assert.ok(club.resolveCrisis(d,'safe',()=>id==='mistral'?0:.99));
    if(id==='glm') {assert.equal(r.result.rent,0); assert.ok(r.result.ledger.some(([k,n])=>k==='学生会津贴'&&n===110));}
    if(id==='kimi') assert.equal(r.stamina.claude,3);
    if(id==='mistral') {assert.ok(r.result.level>=2);assert.ok(r.result.rep>=6);}
    if(id==='sticker') assert.equal(r.result.level,3);
  }
});
test('设施、次日恢复、库存上限、外援限购与过劳补贴', () => {
  const d=fixture('rice',['deepseek','gemini'],'0.7',r=>{r.facilities=['cooker'];r.stamina.deepseek=0;r.stamina.grok=0;});
  const r=d.run;
  assert.ok(club.resolveCrisis(d,'special',()=>.99)); assert.equal(r.stamina.deepseek,0); assert.equal(r.stamina.grok,3);
  assert.equal(r.bag.length,1); assert.ok(r.result.ledger.some(([k,n])=>k==='燃尽加班补贴'&&n===80));
  assert.ok(club.toEvening(d)); r.shelves=['printer','fridge']; const wallet=d.wallet;
  assert.ok(club.buyStock(d,'printer'));assert.equal(club.buyStock(d,'printer'),false);
  assert.ok(club.buyStock(d,'fridge'));assert.ok(club.buyStock(d,'kimi'));assert.equal(club.buyStock(d,'kimi'),false);
  while(r.bag.length<4) assert.ok(club.buyStock(d,'card'));
  assert.equal(club.buyStock(d,'card'),false); assert.equal(d.wallet,wallet);
  assert.ok(club.nextDay(d)); assert.equal(r.offers.length,4); assert.equal(r.freeRefresh,1);
  assert.ok(club.refreshOffers(r));assert.equal(r.tickets,2);assert.equal(r.freeRefresh,0);
  r.stamina.gpt=0;const cash=r.cash;assert.ok(club.boostStamina(d,'gpt'));assert.equal(r.cash,cash-35);assert.equal(r.stamina.gpt,2);
});
test('评级、模式解锁与无尽第五天后的递增开支和破产只结算一次', () => {
  const d=club.fresh();assert.equal(club.unlocked(d,'overload'),false);assert.equal(club.unlocked(d,'endless'),false);
  const r=d.run=club.newRun('endless');
  for(let day=1;day<=6;day++){
    r.weather = 'clear'; // Isolate the weekly rent increase from the cafeteria discount.
    assert.equal(r.day,day);assert.equal(!!club.tasks[r.job].boss,day===5);
    assert.ok(club.pickDispatch(d,r.job,['gpt','claude'],'0.7'));
    while(r.phase==='live') assert.ok(club.resolveCrisis(d,'safe',()=>.99));
    assert.equal(r.result.rent,day<=5?100:130);
    assert.ok(club.toEvening(d));if(day<6) assert.ok(club.nextDay(d));
  }
  r.cash=-120;assert.ok(club.buyStock(d,'mistral'));assert.equal(r.phase,'finished');assert.equal(d.codex.rounds,1);
  assert.equal(club.toEvening(d),false);assert.equal(d.codex.longest,6);assert.equal(club.score(r).grade,'C');
  d.codex.best='A';assert.ok(club.unlocked(d,'overload'));assert.ok(club.unlocked(d,'endless'));
  d.run=club.newRun('overload');assert.equal(d.run.temp,'1.6');assert.ok(d.run.extra);
  assert.equal(club.pickDispatch(d,d.run.job,['claude','gpt'],'0.7'),false);
});

test('风向与双人被动实际作用于收益、精力、暴击、负债和保底', () => {
  function complete(job, pair, temp, wind, choice, roll, extra = () => {}) {
    const d=fixture(job,pair,temp,r=>{r.weather=wind;extra(r);});
    assert.ok(club.resolveCrisis(d,choice,()=>roll));
    return d.run;
  }
  let r=complete('letter',['gpt','claude'],'0.7','throttle','special',.99);
  assert.equal(r.stamina.claude,1); assert.equal(r.result.pay,Math.round(300*1.35*1.4));
  r=complete('wig',['gpt','grok'],'0.7','audit','risk',0);
  assert.equal(r.result.rep,0); assert.ok(r.result.pay>=50);
  r=complete('rice',['gpt','deepseek'],'0.7','cafeteria','special',.99);
  assert.equal(r.result.rent,25);
  r=complete('cover',['gpt','gemini'],'0.7','rain','risk',.99);
  assert.equal(r.result.pay,Math.round(Math.round(360*1.35*1.25)*1.3));
  assert.equal(r.live.risk,36);
  r=complete('wig',['claude','grok'],'1.6','audit','risk',0);
  assert.equal(r.result.rep,-2); assert.ok(r.result.ledger.some(([k,n])=>k==='踩线罚金'&&n===-30));
  r=complete('piano',['grok','deepseek'],'0.7','gossip','risk',0);
  assert.ok(r.result.critical); assert.ok(r.result.ledger.some(([k,n])=>k==='匿名墙热度'&&n===80));
  r=complete('audit',['claude','deepseek'],'1.6','throttle','risk',0);
  assert.equal(r.result.level,1); assert.equal(r.stamina.claude,3);
  r=complete('wig',['gemini','grok'],'1.6','clear','chaos',.99);
  assert.equal(r.result.rep,6); assert.ok(r.result.ledger.some(([k,n])=>k==='混沌双星'&&n===100));
});
test('模式可在现场切换并续玩，过载收益与晨间饮品破产生效', () => {
  const d=club.fresh(); d.codex.rounds=1; d.codex.best='A';
  assert.ok(club.switchMode(d,'standard')); const standard=d.run.id;
  assert.ok(club.pickDispatch(d,d.run.job,['gpt','claude'],'0.7'));
  assert.ok(club.switchMode(d,'overload')); const overloaded=d.run;
  assert.ok(club.pickDispatch(d,d.run.job,['gpt','claude'],'1.6'));
  assert.ok(club.resolveCrisis(d,'carnival',()=>.99));
  assert.ok(overloaded.result.ledger.some(([k,n])=>k==='过载狂欢周'&&n>0));
  assert.ok(club.switchMode(d,'standard'));assert.equal(d.run.id,standard);assert.equal(d.run.phase,'live');
  assert.ok(club.switchMode(d,'overload'));assert.equal(d.run,overloaded);assert.equal(d.run.log.length,1);
  assert.ok(club.switchMode(d,'endless')); const r=d.run;
  r.facilities=['fridge']; r.stamina.gpt=1; r.cash=-120;
  assert.ok(club.boostStamina(d,'gpt'));assert.equal(r.phase,'finished');assert.equal(r.cash,-155);
  assert.equal(club.codexStats(d).rounds,2);
});
test('默契测验从十题抽五题，超时和重复提交不能获得经费', () => {
  const data = club.fresh(), q = data.quiz = club.newQuiz(0);
  assert.equal(club.questions.length, 10);
  assert.equal(q.deck.length, 5);
  assert.equal(new Set(q.deck).size, 5);
  for (const order of q.orders) assert.deepEqual(Array.from(order).sort(), [0, 1, 2, 3]);
  for (let i = 0; i < 5; i++) {
    q.deadline = 30000;
    assert.equal(club.answer(data, q.id, i, 0, i === 2 ? 30000 : 29999), true);
    assert.equal(club.answer(data, q.id, i, 0, 29999), false);
  }
  assert.deepEqual(Array.from(q.answers), [0, 0, -1, 0, 0]);
  assert.equal(data.bestQuiz, 4);
  assert.equal(data.wallet, club.quizPay * 4);
});
