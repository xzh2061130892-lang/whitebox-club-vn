(() => {
  'use strict';
  const { heroes } = window.Whitebox;
  const questions = [
    ['「这不是一次普通的值日——而是对空间秩序的深度重构——」是谁说的？', 'GPT', 'GLM', 'Grok', 'Claude'],
    ['下午两点半准时进入高负荷限流静修模式，桌上还养着橘色小螃蟹的是谁？', 'Claude', 'Kimi', 'Gemini', 'DeepSeek'],
    ['正面看 Gemini，她的异色瞳在画面左边和右边分别是什么颜色？', '左玫粉、右鎏金', '左鎏金、右玫粉', '左海蓝、右玫粉', '左银白、右鎏金'],
    ['DeepSeek 最害怕被要求在解题结尾加上哪个字？', '喵', '汪', '哒', '啾'],
    ['Grok 肩上的巨型黑金 X 仪仗斧实际是什么材质？', '戏剧社高密度泡沫涂装道具款', '实心铸铁', '钟楼拆下的铜板', '黑曜石'],
    ['为了防止 Gemini 写错字就毁稿，墙角的碎纸机上贴着什么？', '禁止靠近封条 / 五星好评贴纸', '经费报销指南', '值日排班表', '深夜点歌单'],
    ['第一章里，食堂王大叔差点毁灭全校午餐的跨界新菜是什么？', '蓝莓麻婆豆腐仰望星空派', '薄荷味咖喱饭团', '香草布丁拌面', '跳跳糖炒饭'],
    ['第二章停电夜，把 Grok 吓进部长怀里的两只发光鬼眼其实是什么？', '端水回来的 Gemini 的异瞳反光', '钟表的夜光指针', '海鸥的眼睛', '走廊应急灯'],
    ['GPT 以前一口气挂名了几个社团的顾问？', '18 个', '4 个', '9 个', '84 个'],
    ['Grok 在幕后主编的校园匿名日报叫什么？', '《X-News》', '《日轮文粹》', '《白玉通讯》', '《月湾晚报》'],
  ];
  const gifts = {
    gpt: ['桂花白茶罐', '白龙的两只茶杯', '学姐翻遍那本八十四页的手册，也没找到约你喝第二杯茶的合适措辞。她索性把茶壶往你这边挪了挪。「明天也来，行吗？」'],
    claude: ['橘色毛线球', '小螃蟹的新钳子', 'Claude 把补好钳子的小螃蟹放在你的笔袋上。「替我看管到放学。」你翻过它，肚皮上缝着一张纸条，写了她一起回家的时间。'],
    gemini: ['草莓星冰乐', '双吸管的距离', '猫猫插好两支吸管，又偷偷把它们往杯子中间挪了一点。「快喝呀，等冰化掉，今天的星星就要不甜啦☆」'],
    grok: ['青柠薯片箱', '头版只给你看', '你掀开薯片箱，最上面压着一份手写号外：《御用跟班今日准时赴约》。Grok 把最大的一片塞进你嘴里。「独家消息，禁止转载！」'],
    deepseek: ['五常新米券', '半碗隐藏算力', '电饭煲响的时候，小鲸鱼已经睡着了。你刚要起身，她的尾巴就轻轻勾住椅脚。「学长别走……锅里多量了半碗，是你的。」'],
  };
  const giftPrice = 120, affectionGoal = 2, quizPay = 30, seconds = 30;
  const fresh = () => normalize();
  function shuffle(items, random = Math.random) {
    const deck = items.slice();
    for (let end = deck.length - 1; end > 0; end--) {
      const i = Math.floor(random() * (end + 1));
      [deck[end], deck[i]] = [deck[i], deck[end]];
    }
    return deck;
  }
  const newId = () => Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
  const { skills, jobs, weather, bonds, stock, carnival, modes, temperatures, grades } = window.WhiteboxCommissionData;
  const tasks = Object.fromEntries(jobs.map(task => [task.id, task]));
  const byKind = kind => Object.keys(stock).filter(id => stock[id].kind === kind);
  const facilities = byKind('facility'), items = byKind('item');
  const clamp = (n, low, high) => Math.min(high, Math.max(low, n));
  const sample = list => list[Math.floor(Math.random() * list.length)];
  const order = ['C', 'B', 'A', 'S'];
  function normalize(value) {
    const data = value || { wallet: 0, affection: {}, bestQuiz: 0, run: null, quiz: null };
    if (data.run && data.run.v !== 2) data.run = null;
    data.codex ||= { bonds: [], clips: {}, rounds: 0, best: '', longest: 0 };
    return data;
  }
  function bondId(pair) {
    return heroes.filter(id => pair.includes(id)).join('_');
  }
  function collectBond(data, pair) {
    const id = bondId(pair);
    if (bonds[id] && !data.codex.bonds.includes(id)) data.codex.bonds.push(id);
  }
  function codexStats(data) {
    const c = data.codex;
    const honours = Object.values(c.clips).filter(entry => entry.honour).length;
    const mishaps = Object.values(c.clips).filter(entry => entry.mishap).length;
    const rank = c.rounds >= 5 && c.best === 'S' ? '白箱学园传说级 404' :
      c.rounds >= 3 && order.indexOf(c.best) >= 2 ? '全校指定救急部' : c.rounds ? '海风口碑事务所' : '濒临封门 404';
    return { ...c, honours, mishaps, rank, commander: c.bonds.length === 10 };
  }
  function unlocked(data, mode) {
    return mode === 'standard' || (mode === 'overload' && data.codex.rounds > 0) ||
      (mode === 'endless' && order.indexOf(data.codex.best) >= 2);
  }
  function switchMode(data, mode) {
    if (!unlocked(data, mode) || data.run?.mode === mode) return false;
    const parked = data.commissionModes ||= {};
    if (data.run) parked[data.run.mode] = data.run;
    data.run = parked[mode]?.v === 2 ? parked[mode] : newRun(mode);
    delete parked[mode];
    return true;
  }
  function drawOffers(r, exclude = []) {
    const pool = jobs.filter(j => !j.boss && !exclude.includes(j.id));
    const drawn = [];
    // Give unseen notices three tickets, previously dispatched notices one.
    while (drawn.length < (r.facilities.includes('printer') ? 4 : 3)) {
      const weights = pool.map(j => r.seen.includes(j.id) ? 1 : 3);
      let roll = Math.random() * weights.reduce((a, b) => a + b, 0);
      const index = weights.findIndex(weight => (roll -= weight) < 0);
      drawn.push(pool.splice(index, 1)[0].id);
    }
    return drawn;
  }
  function morning(r) {
    r.phase = 'morning';
    r.weather = sample(Object.keys(weather));
    if (r.weather === 'cafeteria') r.stamina.deepseek = 3;
    r.extra = r.mode === 'overload' ? sample(carnival) : null;
    r.freeRefresh = r.facilities.includes('printer') ? 1 : 0;
    r.offers = r.day % 5 === 0 ? [sample(jobs.filter(j => j.boss)).id] : drawOffers(r);
    r.job = r.offers[0];
    r.pair = [];
    r.temp = r.mode === 'overload' ? '1.6' : '0.7';
    r.live = null;
    r.result = null;
    r.shelves = [];
  }
  function newRun(mode = 'standard') {
    if (!Object.hasOwn(modes, mode)) return null;
    const r = { v: 2, id: newId(), revision: 0, mode, day: 1, cash: 500, rep: 0,
      stamina: Object.fromEntries(heroes.map(id => [id, 3])), facilities: [], bag: [], allies: [], hired: [],
      cookerUses: 0, tickets: 2, seen: [], fish: false, log: [] };
    morning(r);
    return r;
  }
  function refreshOffers(r) {
    if (r.phase !== 'morning' || tasks[r.job].boss || !(r.freeRefresh || r.tickets)) return false;
    if (r.freeRefresh) r.freeRefresh--; else r.tickets--;
    r.offers = drawOffers(r, r.offers);
    r.job = r.offers[0];
    return true;
  }
  function selectMember(data, id) {
    const r = data.run;
    if (r.phase !== 'morning' || !heroes.includes(id)) return false;
    if (r.pair.includes(id)) r.pair = r.pair.filter(other => other !== id);
    else if (r.pair.length < 2) r.pair.push(id);
    else return false;
    collectBond(data, r.pair);
    return true;
  }
  function forecast(r, job = r.job, pair = r.pair, temp = r.temp) {
    const task = tasks[job], bond = bondId(pair);
    const matches = task.types.filter(type => pair.some(id => skills[type].includes(id))).length;
    const best = task.best.length > 0 && task.best.every(id => pair.includes(id));
    const tired = pair.filter(id => r.stamina[id] === 0).length;
    let progress = 45 + matches * 12 + (best ? 10 : 0) + pair.filter(id => r.stamina[id] === 3).length * 5 - tired * 10;
    let risk = 20 + ({ '0.1': -12, '0.7': 0, '1.6': 18 })[temp] + tired * 22;
    if (r.weather === 'clear') progress += 5;
    if (r.weather === 'rain') risk += 8;
    if (r.facilities.includes('lock')) risk -= 12;
    if (bond === 'gpt_claude') { risk -= 15; if (temp !== '1.6') progress += 10; }
    const initialRisk = clamp(risk, 5, 85);
    const unstrainedRisk = clamp(risk - tired * 22 - (temp === '1.6' ? 18 : 0), 5, 85);
    return { progress: clamp(progress, 0, 120), risk: initialRisk, strainRisk: initialRisk - unstrainedRisk, best, tired, bond };
  }
  function pickDispatch(data, job, pair, temp) {
    const r = data.run;
    if (!r || r.phase !== 'morning' || !r.offers.includes(job) || !Array.isArray(pair) || pair.length !== 2 ||
      new Set(pair).size !== 2 || !pair.every(id => heroes.includes(id)) || !Object.hasOwn(temperatures, temp) ||
      (r.mode === 'overload' && temp !== '1.6')) return false;
    r.job = job; r.pair = [...pair]; r.temp = temp;
    collectBond(data, pair);
    r.live = { ...forecast(r), step: 0, calls: [], prior: 0, exempt: false, rested: false, promote: 0, floor: 0, stageBonus: false };
    if (!r.seen.includes(job)) r.seen.push(job);
    r.phase = 'live';
    return true;
  }
  function instructions(r) {
    const task = tasks[r.job], live = r.live, phase = task.phases[live.step];
    const ids = r.pair, bond = live.bond;
    const shield = bond === 'claude_gemini' && phase.creative;
    const choices = [{ id: 'safe', label: '稳妥兜底', ...phase.safe }];
    const riskLocked = r.temp === '0.1';
    const risky = { id: 'risk', label: '冒险整活', ...phase.risk, disabled: riskLocked, adventurous: true };
    if (task.id === 'hearing' && !live.step && r.rep >= 6) risky.certain = true;
    if (task.id === 'festival' && live.step === 1 && r.temp === '1.6') risky.stageBonus = true;
    choices.push(risky);
    if (phase.special || shield) {
      const requires = phase.requires || [];
      const qualified = task.id === 'piano' ? (task.best.every(id => ids.includes(id)) || r.fish && requires.some(id => ids.includes(id))) :
        requires.some(id => ids.includes(id));
      choices.push({ id: 'special', label: '专属特解', ...(phase.special || { text: '护稿同盟启用备用设备，稳住现场', progress: 50, risk: -100 }),
        disabled: !shield && !qualified, certain: shield || task.boss, need: shield ? '护稿防碎纸同盟' :
          task.id === 'piano' ? 'Grok 与 DeepSeek，或其中一人携小鱼干' : requires.map(id => window.Whitebox.member[id][0]).join(' 或 ') });
    }
    if (r.temp === '1.6') choices.push({ id: 'overdrive', label: '1.6 放飞', text: '把这场危机拍成一镜到底的即兴特辑', progress: 64, risk: 26, adventurous: true });
    if (bond === 'gemini_grok') choices.push({ id: 'chaos', label: '羁绊 · 疯狂整活', text: '双星接管现场，邀请全校一起即兴演出', progress: 72, risk: 24, disabled: riskLocked, adventurous: true });
    if (r.extra) choices.push({ id: 'carnival', label: r.extra.name, text: r.extra.action, progress: r.extra.progress, risk: r.extra.risk, adventurous: true });
    for (const id of new Set([...r.bag, ...r.allies])) {
      const delta = { card: [40, -100], chips: [28, -live.strainRisk], sticker: [0, 0],
        qwen: [45, -20], glm: [30, 0], kimi: [35, -100], mistral: [0, 0] }[id];
      choices.push({ id, label: stock[id].name, text: stock[id].effect, progress: delta[0], risk: delta[1], support: true });
    }
    return choices.map(c => {
      const delta = c.risk - (c.adventurous && bond === 'gpt_gemini' ? 12 : 0);
      const afterRisk = c.certain ? 0 : clamp(live.risk + delta, 0, 85);
      const riskWithoutStrain = c.certain || c.id === 'chips' ? afterRisk : clamp(live.risk - live.strainRisk + delta, 0, 85);
      const progress = live.progress + c.progress;
      const critChance = r.weather === 'gossip' && ids.includes('grok') ? .2 : 0;
      const meetsThreshold = progress >= 55 ? 1 : progress + 30 >= 55 ? critChance : 0;
      const guaranteed = live.floor || c.id === 'mistral' || (bond === 'claude_deepseek' &&
        task.types.some(t => ['逻辑省钱', '文采礼仪'].includes(t)));
      const success = guaranteed ? 100 : Math.round(meetsThreshold * (100 - afterRisk) * 10) / 10;
      return { ...c, afterRisk, strainRisk: afterRisk - riskWithoutStrain, success };
    });
  }
  function score(r) {
    const boss = r.log.at(-1)?.bossWin ? 200 : 0;
    const total = r.cash + r.rep * 50 + r.facilities.length * 60 + boss;
    const grade = r.cash <= 0 ? 'C' : total >= 1550 ? 'S' : total >= 1050 ? 'A' : total >= 650 ? 'B' : 'C';
    return { total, boss, grade };
  }
  function finish(data) {
    const r = data.run;
    r.phase = 'finished';
    const c = data.codex, grade = score(r).grade;
    c.rounds++;
    if (order.indexOf(grade) > order.indexOf(c.best)) c.best = grade;
    if (r.mode === 'endless') c.longest = Math.max(c.longest, r.log.length);
  }
  function settle(data, random) {
    const r = data.run, live = r.live, task = tasks[r.job], bond = live.bond;
    const tags = task.types, has = id => r.facilities.includes(id);
    const critical = r.weather === 'gossip' && r.pair.includes('grok') && random() < .2;
    if (critical) live.progress = Math.min(120, live.progress + 30);
    let level = live.progress < 55 || random() * 100 < live.risk ? 0 : live.progress >= 115 ? 3 : live.progress >= 85 ? 2 : 1;
    if (bond === 'claude_deepseek' && tags.some(t => ['逻辑省钱', '文采礼仪'].includes(t))) level = Math.max(level, 1);
    level = Math.max(level, live.floor);
    if (level && live.promote) level = Math.min(3, level + live.promote);
    const great = level >= 2, ledger = [];
    let rep = [-1, 1, 3, 4][level];
    let pay = [task.loss, task.base, task.bonus, Math.round(task.bonus * 1.35)][level];
    ledger.push([grades[level], pay]);
    function add(label, value) { if (value) { pay += value; ledger.push([label, value]); } }
    function scale(label, rate) { add(label, Math.round(pay * rate) - pay); }
    if (pay > 0 && r.temp === '0.1') scale('稳健对齐', .9);
    if (level > 0) {
      if (r.weather === 'rain' && tags.includes('脑洞才艺')) scale('梅雨才艺奖金', 1.25);
      if (bond === 'gpt_gemini' && tags.some(t => ['脑洞才艺', '文采礼仪'].includes(t))) scale('多模态话痨秀', 1.3);
    }
    if (great) {
      if (r.temp === '1.6') { scale('过载奖金', 1.45); rep++; }
      if (r.weather === 'throttle' && r.pair.includes('claude')) scale('限流津贴', 1.4);
      if (r.weather === 'audit') { scale('学生会表彰', 1.35); rep++; }
      if (bond === 'claude_grok' && r.temp === '1.6') scale('红线赌注', 1.6);
      if (live.stageBonus) scale('电音体操安可', 1.5);
      if (bond === 'gemini_grok') { add('混沌双星', 100); rep++; }
      if (has('headline')) { add('热搜置顶', 65); rep++; }
      if (live.tired) add('燃尽加班补贴', 80);
    }
    if (!level) {
      if (bond === 'claude_grok' && r.temp === '1.6') add('踩线罚金', -30);
      if (r.weather === 'audit') rep--;
      if (bond === 'gpt_grok') { rep = 0; add('圆场流量保底', Math.max(0, 50 - pay)); }
      if (r.temp === '1.6') add('校园话题热搜', 40);
    }
    if (r.weather === 'gossip' && tags.includes('情报嘴替')) add('匿名墙热度', 80);
    if (live.exempt) {
      const fines = ledger.filter(([label, amount]) => amount < 0 && label !== '稳健对齐').reduce((sum, [, n]) => sum - n, 0);
      add('学生会核销扣款', fines);
      add('学生会津贴', 110);
    }
    if (live.floor === 2) rep += 2;
    if (r.mode === 'overload' && pay > 0) scale('过载狂欢周', 1.4);
    let rent = 100 + (r.mode === 'endless' ? 30 * Math.floor((r.day - 1) / 5) : 0);
    if (bond === 'gpt_deepseek') rent /= 2;
    if (r.weather === 'cafeteria' && tags.includes('逻辑省钱')) rent /= 2;
    rent = live.exempt ? 0 : Math.round(rent);
    const recovery = {};
    for (const id of heroes) {
      let delta = r.pair.includes(id) ? -1 : has('cooker') ? 3 : 2;
      if (delta < 0) {
        if (id === 'claude' && r.weather === 'throttle') delta--;
        if (id === 'deepseek' && has('cooker') && r.cookerUses < 2) { r.cookerUses++; delta = 0; }
        if (live.rested || (id === 'claude' && bond === 'claude_deepseek' && random() < .5)) delta = 0;
      }
      const before = r.stamina[id];
      r.stamina[id] = clamp(before + delta, 0, 3);
      recovery[id] = r.stamina[id] - before;
    }
    let gift = '';
    if (level && bond === 'gemini_deepseek' && r.bag.length < 4) { gift = sample(items); r.bag.push(gift); }
    const startCash = r.cash;
    r.cash += pay - rent; r.rep += rep;
    data.wallet += Math.max(0, pay);
    r.result = { level, pay, rep, rent, startCash, ledger, recovery, gift, critical, purchases: [],
      story: level === 0 ? task.mishap : great ? task.triumph : task.normal };
    r.log.push({ day: r.day, job: task.id, pair: [...r.pair], temp: r.temp, level, pay, rent, bossWin: !!task.boss && level > 0 });
    if (level === 0 || great) {
      const clip = data.codex.clips[task.id] ||= {};
      clip[great ? 'honour' : 'mishap'] = true;
    }
    r.phase = 'result';
    r.shelves = shuffle(facilities.filter(id => !has(id))).slice(0, 2);
    if (r.mode === 'endless') data.codex.longest = Math.max(data.codex.longest, r.log.length);
  }
  function resolveCrisis(data, id, random = Math.random) {
    const r = data.run;
    if (r?.phase !== 'live') return false;
    const choice = instructions(r).find(c => c.id === id);
    if (!choice || choice.disabled) return false;
    const live = r.live;
    live.prior = live.progress;
    live.progress = clamp(live.progress + choice.progress, 0, 120);
    live.risk = choice.afterRisk;
    live.strainRisk = choice.strainRisk;
    if (id === 'special' && r.job === 'piano' && !tasks.piano.best.every(hero => r.pair.includes(hero))) r.fish = false;
    if (choice.support) {
      const bag = stock[id].kind === 'ally' ? r.allies : r.bag;
      bag.splice(bag.indexOf(id), 1);
      if (id === 'sticker') live.promote++;
      if (id === 'kimi') live.rested = true;
      if (id === 'glm') live.exempt = true;
      if (id === 'mistral') live.floor = 2;
    }
    if (choice.stageBonus) live.stageBonus = true;
    live.calls.push(id);
    if (live.step + 1 < tasks[r.job].phases.length) live.step++;
    else settle(data, random);
    return true;
  }
  function toEvening(data) {
    const r = data.run;
    if (r?.phase !== 'result') return false;
    if ((r.mode !== 'endless' && r.day === 5) || (r.mode === 'endless' && r.cash < -150)) finish(data);
    else r.phase = 'evening';
    return true;
  }
  function buyStock(data, id) {
    const r = data.run, product = Object.hasOwn(stock, id) && stock[id];
    if (r?.phase !== 'evening' || !product) return false;
    if (product.kind === 'facility') {
      if (!r.shelves.includes(id) || r.facilities.includes(id)) return false;
      r.facilities.push(id);
    } else if (product.kind === 'item') {
      if (r.bag.length >= 4) return false;
      r.bag.push(id);
    } else {
      if (r.hired.includes(id)) return false;
      r.hired.push(id); r.allies.push(id);
    }
    r.cash -= product.price;
    r.result.purchases.push(id);
    if (r.mode === 'endless' && r.cash < -150) finish(data);
    return true;
  }
  function boostStamina(data, id) {
    const r = data.run;
    if (!['morning','evening'].includes(r.phase) || !heroes.includes(id) || r.stamina[id] >= 3 ||
      (r.phase === 'morning' && !r.facilities.includes('fridge'))) return false;
    r.cash -= 35;
    r.stamina[id] = Math.min(3, r.stamina[id] + 2);
    if (r.phase === 'evening') r.result.purchases.push('drink');
    if (r.mode === 'endless' && r.cash < -150) finish(data);
    return true;
  }
  function nextDay(data) {
    const r = data.run;
    if (r?.phase !== 'evening') return false;
    r.day++; morning(r);
    return true;
  }
  function exchangeToArcadeCoins(data) {
    if (data.exchange || data.wallet < 100 || !heroes.every(id => (data.affection[id] || 0) >= affectionGoal)) return false;
    data.wallet -= 100;
    data.exchange = newId();
    return true;
  }
  function give(profile, id) {
    if (!heroes.includes(id) || profile.wallet < giftPrice || (profile.affection[id] || 0) >= affectionGoal) return false;
    profile.wallet -= giftPrice;
    profile.affection[id] = (profile.affection[id] || 0) + 1;
    return true;
  }
  function newQuiz(now = Date.now()) {
    const deck = shuffle(questions.map((_, i) => i)).slice(0, 5);
    return { id: newId(), deck, orders: deck.map(() => shuffle([0, 1, 2, 3])), answers: [], deadline: now + seconds * 1000 };
  }
  function answer(profile, expectedId, index, choice, now = Date.now()) {
    const q = profile.quiz;
    if (!q || q.id !== expectedId || q.answers.length !== index || !q.deadline || index >= 5) return false;
    if (now >= q.deadline) choice = -1;
    else if (!q.orders[index].includes(choice)) return false;
    q.answers.push(choice);
    q.deadline = 0;
    if (choice === 0) profile.wallet += quizPay;
    if (q.answers.length === 5) profile.bestQuiz = Math.max(profile.bestQuiz, q.answers.filter(a => a === 0).length);
    return true;
  }
  const quizTitle = score => ['尚未获得称号', '初识部员', '熟悉的同桌', '404 知心人', '首席默契搭档', '全员同频部长'][score];
  window.WhiteboxClub = { skills, jobs, tasks, questions, gifts, giftPrice, affectionGoal, quizPay, seconds, fresh,
    normalize, newRun, unlocked, switchMode, refreshOffers, selectMember, bondId, forecast, pickDispatch, instructions,
    resolveCrisis, toEvening, buyStock, boostStamina, nextDay, exchangeToArcadeCoins, codexStats, score,
    give, newQuiz, answer, quizTitle };
})();
