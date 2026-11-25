import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const stories = ['prologue', 'chapter1', 'chapter2', 'chapter3', 'chapter4', 'chapter5'];
function load(fetch) {
  const host = { window: {}, URL, structuredClone, fetch };
  for (const file of [...stories, 'engine', 'studio-poses', 'replay-data', 'replay', 'tea'])
    runInNewContext(readFileSync(new URL('../src/' + file + '.js', import.meta.url), 'utf8'), host);
  return host.window;
}

test('各章结算开放茶室，中华小当家仍然需要第一、二章', () => {
  const { Whitebox: eng, WhiteboxReplay } = load();
  const data = new Map();
  const p = WhiteboxReplay.progress(k => data.get(k), (k,v) => data.set(k,v), () => {});
  for (const id of ['prologue','chapter3','chapter4','chapter5','chapter2','chapter1']) {
    const state = eng.fresh(id), story = eng.storyFor(state);
    state.pc = story.nodes.findIndex(n => n.type === 'scene_end');
    p.position(state);
    assert.ok(p.list('clearedChapters').has(id));
    assert.equal(p.list('achievements').has('ach_09'), id === 'chapter1');
  }
});

test('旧档只补登已到过的结算，能识别回退帧、旧终章勋章与自定义姓名', () => {
  const { Whitebox: eng, WhiteboxReplay } = load();
  const data = new Map(), awards = [];
  const p = WhiteboxReplay.progress(k => data.get(k), (k,v) => data.set(k,v), x => awards.push(x));
  const current = eng.fresh('chapter3'), old = eng.fresh();
  old.names = eng.names('叶', '晴'); delete old.storyId;
  const ending = eng.storyFor(old).nodes.findIndex(n => n.type === 'scene_end');
  old.pc = ending - 2;
  data.set('slot1', {version:current.version, state:current, frames:[old], date:'2026-11-25'});
  p.importClearances(); assert.equal(p.list('clearedChapters').size, 0);
  old.pc = ending; const version = old.version;
  old.version = '过期剧本'; p.importClearances(); assert.equal(p.list('clearedChapters').size, 0);
  old.version = version; data.set('achievements', ['ach_16']);
  p.importClearances(); p.importClearances();
  assert.deepEqual([...p.list('clearedChapters')].sort(), ['chapter5','prologue']);
  assert.equal(data.get('playerNames').player_name, '叶晴');
  assert.deepEqual(awards, []);

  data.clear();
  data.set('autosave', { version: current.version, state: current, frames: [old], date: '2026-11-25' });
  p.importClearances();
  assert.deepEqual([...p.list('clearedChapters')], ['prologue']);
  assert.equal(data.get('playerNames').player_name, '叶晴');
});

test('五人各十句离线对白覆盖五个本地时段，每句都有真实表情与内心便签', () => {
  const { WhiteboxTea: tea, Whitebox: eng, StudioPoses: poses } = load();
  const cases = [[0,4],[4,4],[5,0],[10,0],[11,1],[13,1],[14,2],[17,2],[18,3],[21,3],[22,4],[23,4]];
  for (const [hour, slot] of cases) assert.equal(tea.period(new Date(2026,10,25,hour,30)), slot);
  assert.equal(tea.dayKey(new Date(2026,0,2,0,1)), '2026-01-02');
  for (const id of eng.heroes) {
    const beats = new Set();
    for (let s=0; s<5; s++) {
      const a = tea.greeting(id,s,-1,'茶友',()=>0), b = tea.greeting(id,s,a.index,'茶友',()=>0);
      for (const line of [a,b]) {
        assert.ok(poses[id + '-1'].includes(line.exp));
        assert.ok(line.os.length && !line.reply.includes('{你}'));
        beats.add(line.reply);
      }
    }
    assert.equal(beats.size,10);
  }
});

test('模型请求只发送选定角色的资料和六轮上下文，Ollama 不携带云端密钥', async () => {
  const calls = [];
  const reply = { exp:'blush', os:'想再留一会儿。', reply:'这杯茶是你的。' };
  const { WhiteboxTea: tea, Whitebox: eng, StudioPoses: poses } = load(async (url, opts) => {
    calls.push({url, ...opts});
    const content = JSON.stringify(reply);
    return {ok:true,json:async () => url.endsWith('/api/chat') ? {message:{content}} : {choices:[{message:{content}}]} };
  });
  const context = {id:'claude',names:eng.names('叶','晴'), bond:{confessed:true, gifts:2},
    date:new Date(2026,10,25,14,30), message:'喝什么？',
    turns:Array.from({length:8}, (_,i) => ({user:'第' + i + '轮', result:reply}))};
  const inputs = [{mode:'compatible',endpoint:'https://unit.invalid/v1',model:'chat',key:'test-key'},
    {mode:'ollama',endpoint:'http://localhost:11434',model:'local',key:'discard'}];
  for (const c of inputs) {
    const result = await tea.ask(c,context,new AbortController().signal);
    assert.deepEqual({...result}, reply);
  }
  assert.equal(calls[0].url,'https://unit.invalid/v1/chat/completions');
  assert.equal(calls[0].headers.Authorization,'Bearer test-key');
  assert.equal(calls[1].url,'http://localhost:11434/api/chat');
  assert.equal(calls[1].headers.Authorization,undefined);
  for (const [i, c] of calls.entries()) {
    const body = JSON.parse(c.body), msgs = body.messages;
    assert.equal(c.redirect, 'error'); assert.equal(c.credentials,'omit'); assert.equal(body.stream,false);
    if (i) {
      assert.equal(body.format.type, 'object');
      assert.deepEqual(body.format.required, ['reply', 'os', 'exp']);
      assert.equal(body.format.properties.reply.minLength, 1);
      assert.ok(body.format.properties.reply.maxLength > 0);
      const note = new RegExp(body.format.properties.os.pattern);
      assert.ok(note.test(reply.os));
      for (const invalid of ['', '可别被她看出来。}{', '字'.repeat(57)]) assert.ok(!note.test(invalid));
      assert.deepEqual(body.format.properties.exp.enum, ['normal', ...poses['claude-1']]);
      assert.ok(body.options.num_predict > 0);
      assert.equal(msgs[2].content, reply.reply);
    } else {
      assert.equal(body.format, undefined);
      assert.equal(body.options, undefined);
    }
    assert.equal(msgs.length,14); assert.equal(msgs[1].content,'第2轮'); assert.equal(msgs.at(-1).content,'喝什么？');
    for (const term of ['Claude','叶晴','告白','私房','午后']) assert.ok(msgs[0].content.includes(term));
    assert.ok(!c.body.includes('test-key') && !c.body.includes('discard'));
  }
});

test('坏地址、非法回复与 HTTP 失败可以识别，意外表情回退自然立绘', async () => {
  let response;
  const { WhiteboxTea: tea, Whitebox: eng } = load(async () => response);
  const c = {mode:'compatible',endpoint:'https://unit.invalid/v1/chat/completions',model:'test'};
  assert.equal(tea.config(c).endpoint,c.endpoint);
  assert.equal(tea.config({...c, mode:'ollama', endpoint:'http://localhost:11434/api/'}).endpoint,'http://localhost:11434/api/chat');
  assert.throws(() => tea.config({...c,endpoint:'file:///local'}));
  const run = () => tea.ask(c,{ id:'gpt', names:eng.names('周','青'), bond:{}, date:new Date(),turns:[],message:'早' },new AbortController().signal);
  response = {ok:false,status:401}; await assert.rejects(run,/401/);
  for (const content of ['普通文本','{}','null']) {
    response = {ok:true,json:async () => ({choices:[{message:{content}}]})};
    await assert.rejects(run,/JSON|缺少/);
  }
  const content = '```json\n{"exp":"../other","os":"草稿","reply":"台词"}\n```';
  response = {ok:true,json:async () => ({choices:[{message:{content}}]})};
  assert.equal((await run()).exp,'normal');
});

test('直接打开 HTML 遇到 Ollama 来源拒绝时提示本机 HTTP 入口', async () => {
  const env = load(async () => { throw new TypeError('Failed to fetch'); });
  const c = { mode: 'ollama', endpoint: 'http://localhost:11434', model: 'local' };
  const round = { id: 'claude', names: env.Whitebox.names('林', '栀'), bond: {}, date: new Date(), turns: [], message: '下午好' };
  const send = () => env.WhiteboxTea.ask(c, round, new AbortController().signal);
  env.location = { protocol: 'file:' };
  await assert.rejects(send, /127\.0\.0\.1:8000/);
  env.location.protocol = 'http:';
  await assert.rejects(send, /检查服务地址/);
});
