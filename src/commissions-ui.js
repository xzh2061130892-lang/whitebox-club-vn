(() => {
  'use strict';
  const club = window.WhiteboxClub;
  const { weather, bonds, stock, temperatures, modes, grades, rest, burnout } = window.WhiteboxCommissionData;
  const { heroes, member } = window.Whitebox;
  const name = id => member[id][0];
  const signed = n => n > 0 ? '+' + n : String(n);
  const icon = window.WhiteboxIcon;
  const supportName = { card: '合规黄牌', chips: '青柠薯片', sticker: '急救贴纸', qwen: 'Qwen', glm: 'GLM', kimi: 'Kimi', mistral: 'Mistral' };
  const phaseNames = { morning: '晨间派单桌', live: '现场实况连线', result: '委托回执', evening: '晚间采购台', finished: '事务所结算' };

  function render(panel, tab, data, { el, pic, button, change, audio, body }) {
    const r = data.run, book = club.codexStats(data);
    const root = el('div', 'cm-desk');
    root.dataset.revision = r?.revision ?? '';
    root.dataset.phase = tab === 'codex' ? 'codex' : r?.phase || 'start';
    panel.append(root);
    const text = (value, cls = '') => el('p', cls, value);
    const heading = value => el('h3', '', value);
    const face = id => pic('assets/avatars/' + id + (id === 'mistral' ? '-3.webp' : '-1.webp'), '', 'cm-face');
    function line(parent, label, value) {
      const row = el('div', 'cm-line');
      row.append(el('span', '', label), el('strong', '', value));
      parent.append(row);
    }
    function section(title, cls = '') {
      const box = el('section', 'cm-box ' + cls);
      box.append(heading(title));
      return box;
    }
    function control(label, key, handler, cls = 'cm-button') {
      const b = button(label, handler, cls);
      b.dataset.cm = key;
      return b;
    }
    function act(mutate, sound) {
      return () => change(d => {
        if (d.run?.id !== r?.id || d.run?.revision !== r?.revision || mutate(d) === false) return false;
        if (d.run) d.run.revision++;
        return true;
      }, d => {
        const effect = typeof sound === 'function' ? sound(d.run) : sound;
        if (effect) { audio.unlock(); audio.effect(effect); }
        if (d.run?.phase !== r?.phase || d.run?.day !== r?.day || d.run?.live?.step !== r?.live?.step) body.scrollTop = 0;
      });
    }
    function mainButton(label, key, fn, sound) {
      return control(label, key, act(fn, sound), 'cm-primary');
    }
    function mast(title, detail, bg) {
      const header = el('header', 'cm-mast');
      header.style.backgroundImage = 'linear-gradient(95deg, #133c35f5, #153b33ce 56%, #153b3340), url("assets/bg/' + bg + '.webp")';
      header.append(heading(title), text(detail));
      return header;
    }
    function modeRail(selected, onPick) {
      const rail = el('div', 'cm-modes');
      rail.setAttribute('aria-label', '经营模式');
      for (const [id, label] of Object.entries(modes)) {
        const b = control(label, 'mode-' + id, () => onPick(id, rail));
        b.setAttribute('aria-pressed', String(id === selected));
        b.disabled = !club.unlocked(data, id);
        if (b.disabled) b.append(el('small', '', id === 'overload' ? '完成一轮解锁' : '获得 A 级解锁'));
        rail.append(b);
      }
      return rail;
    }
    function modeSelect() {
      let selected = 'standard';
      const start = control('开始经营', 'start', () => act(d => {
        if ((d.run && d.run.phase !== 'finished') || !club.unlocked(d, selected)) return false;
        return club.switchMode(d, selected);
      }, 'se_stamp')(), 'cm-primary');
      const descriptions = {
        standard: '初始经费 500 元。前四晚可整备，第五天接双阶段终极委托。',
        overload: '全程温度 1.6，每天多一项即兴挑战，正收益 ×1.4。',
        endless: '每五天迎战 Boss，下一周固定开支增加 30 元，经费跌破 −150 元即结算。',
      };
      const desc = text(descriptions[selected], 'cm-note');
      const rail = modeRail(selected, (id, rail) => {
        selected = id;
        for (const child of rail.children) child.setAttribute('aria-pressed', String(child.dataset.cm === 'mode-' + id));
        desc.textContent = descriptions[id];
      });
      root.append(rail, desc, start);
    }
    function status() {
      const command = el('header', 'cm-command'), bar = el('div', 'cm-status');
      const day = r.mode === 'endless' ? '无尽第 ' + r.day + ' 天' : '第 ' + r.day + '/5 天';
      const title = el('div', 'cm-status-title');
      title.append(heading(day + ' · ' + phaseNames[r.phase]));
      if (r.phase === 'finished') title.append(el('small', '', modes[r.mode]));
      else {
        const chooser = el('details', 'cm-menu cm-mode-menu'), label = el('summary', '', modes[r.mode] + ' ▾');
        label.setAttribute('aria-label', '切换模式 · ' + modes[r.mode]); label.title = '切换经营模式';
        chooser.append(label, modeRail(r.mode, id => act(d => club.switchMode(d, id))())); title.append(chooser);
      }
      bar.append(title);
      for (const [label, value] of [['经费', r.cash], ['声望', r.rep], ['钱包', data.wallet]]) {
        const cell = el('div', 'cm-stat'); cell.append(el('span', '', label), el('strong', '', value)); bar.append(cell);
      }
      const pack = el('details', 'cm-menu'), summary = el('summary', '', '背包 ' + r.bag.length + '/4 ▾');
      const contents = el('div', 'cm-pack'); summary.prepend(icon('archive'));
      for (const id of new Set([...r.bag, ...r.allies])) {
        const n = r.bag.filter(item => item === id).length;
        const entry = el('div', 'cm-pack-entry');
        entry.append(el('strong', '', stock[id].name + (n > 1 ? ' ×' + n : '')), el('small', '', stock[id].effect));
        contents.append(entry);
      }
      if (r.fish) contents.append(el('span', 'cm-tag', '小鱼干'));
      if (!contents.childElementCount) contents.append(text('背包暂无道具。'));
      pack.append(summary, contents); bar.append(pack); command.append(bar); root.append(command);
      if (r.phase === 'finished') return;
      const w = weather[r.weather], strip = el('div', 'cm-weather');
      const badge = el('strong', 'cm-badge', w.name); badge.prepend(icon('map')); badge.title = w.quote;
      strip.append(badge, el('span', '', w.effect));
      if (r.extra) strip.append(el('strong', 'cm-badge', r.extra.name));
      command.append(strip);
    }
    function drink(id) {
      const b = control('请喝冰饮 · 35元', 'drink-' + id, act(d => club.boostStamina(d, id)));
      b.disabled = r.stamina[id] === 3;
      b.setAttribute('aria-label', '给 ' + name(id) + ' 请喝冰饮 · 35 元');
      return b;
    }
    function morning() {
      const task = club.tasks[r.job], desk = section(task.boss ? '今日压轴 · 双阶段终极委托' : '今日委托'), offers = el('div', 'cm-offers');
      if (!task.boss) {
        const refresh = control('刷新委托 · ' + (r.freeRefresh ? '今日免费' : '余 ' + r.tickets + ' 次'), 'refresh', act(d => club.refreshOffers(d.run)));
        refresh.disabled = !(r.freeRefresh || r.tickets);
        desk.firstChild.append(refresh);
      }
      offers.style.setProperty('--offers', r.offers.length);
      for (const id of r.offers) {
        const j = club.tasks[id];
        const b = control('', 'job-' + id, act(d => { d.run.job = id; }), 'cm-order' + (j.boss ? ' cm-boss' : ''));
        b.setAttribute('aria-pressed', String(id === r.job));
        const tags = el('span', 'cm-tags');
        for (const tag of j.boss ? ['终极危机', '全专长综合'] : j.types) tags.append(el('span', 'cm-tag', tag));
        b.append(tags, el('strong', '', j.title), el('small', '', '大成功奖金 ' + j.bonus + ' 元')); offers.append(b);
      }
      desk.append(offers);
      if (r.job === 'piano' && !r.fish) desk.firstChild.append(control('领食堂小鱼干', 'fish', act(d => { d.run.fish = true; })));
      root.append(desk);
      const grid = el('div', 'cm-dispatch'), crew = section('指派两名搭档'), team = el('div', 'cm-team');
      for (const id of heroes) {
        const wrapper = el('div', 'cm-member'), stamina = r.stamina[id];
        const b = control('', 'member-' + id, act(d => club.selectMember(d, id)), 'cm-person');
        const selected = r.pair.includes(id);
        b.setAttribute('aria-pressed', String(selected)); b.disabled = !selected && r.pair.length === 2;
        b.dataset.actor = id; b.dataset.energy = stamina;
        const specs = el('span', 'cm-skills');
        for (const type of Object.keys(club.skills).filter(type => club.skills[type].includes(id))) {
          specs.append(el('span', task.types.includes(type) ? 'match' : '', type));
        }
        const marks = el('span', 'cm-marks');
        if (!stamina) marks.append(el('b', 'cm-hot', '红温'));
        if (specs.querySelector('.match')) marks.append(el('b', 'cm-match', '✦ 匹配'));
        b.append(marks, face(id), el('strong', '', name(id)), specs);
        if (selected) b.append(el('span', 'cm-slot', (r.pair.indexOf(id) + 1) + '号位'));
        const energy = el('span', 'cm-energy');
        energy.setAttribute('aria-label', '精力 ' + stamina + '/3');
        for (let i = 0; i < 3; i++) energy.append(el('i', i < stamina ? 'on' : ''));
        b.append(energy);
        wrapper.append(b); if (r.facilities.includes('fridge')) wrapper.append(drink(id)); team.append(wrapper);
      }
      crew.append(team);
      const info = club.forecast(r), bond = bonds[info.bond], ribbon = el('div', 'cm-bond');
      if (bond) {
        const faces = el('div', 'cm-bond-faces'), copy = el('div', 'cm-bond-copy');
        faces.append(...r.pair.map(face));
        copy.append(el('small', 'cm-bond-badge', '✦ 羁绊激活'), el('strong', '', bond.name), text(bond.effect), el('small', '', '「' + bond.quote + '」'));
        ribbon.append(faces, copy);
      }
      else ribbon.append(el('span', '', '已选 ' + r.pair.length + ' / 2 人，选满即可查看双人羁绊。'));
      crew.append(ribbon);
      const tired = r.pair.filter(id => !r.stamina[id]);
      if (tired.length) crew.append(text(tired.map(id => name(id) + '「' + burnout[id] + '」').join('　'), 'cm-red cm-quips'));
      const tactics = section('输出温度'), temps = el('div', 'cm-temps');
      for (const [value, title] of Object.entries(temperatures)) {
        const b = control('', 'temp-' + value, act(d => { d.run.temp = value; }), 'cm-button cm-temp-btn');
        b.dataset.temp = value; b.append(el('strong', '', value), el('small', '', title));
        b.setAttribute('aria-pressed', String(value === r.temp)); b.disabled = r.mode === 'overload' && value !== '1.6'; temps.append(b);
      }
      tactics.append(temps, text(({ '0.1': '风险 −12%，收益 ×0.9，高危指令封存。', '0.7': '标准风险，开放常规救场指令。', '1.6': '风险 +18%，大成功收益 ×1.45，开放过载指令。' })[r.temp], 'cm-note'));
      line(tactics, '初始完成度' + (info.best ? ' · 最佳搭档' : ''), info.progress + '%');
      function gauge(label, value, max, marks = []) {
        const track = el('div', 'cm-gauge'), fill = el('i');
        track.setAttribute('role', 'meter'); track.setAttribute('aria-label', label);
        track.setAttribute('aria-valuemin', 0); track.setAttribute('aria-valuemax', max); track.setAttribute('aria-valuenow', value);
        fill.style.width = (100 * value / max) + '%'; track.append(fill);
        for (const [threshold, label] of marks) {
          const tick = el('b', 'cm-tick'); tick.style.left = (100 * threshold / max) + '%';
          tick.title = label + ' ' + threshold + '%'; tick.append(el('span', '', threshold + '%')); track.append(tick);
        }
        return track;
      }
      tactics.append(gauge('预计初始完成度', info.progress, 120, [[55, '顺利线'], [85, '大成功线']]));
      line(tactics, '预估风险', info.risk + '%');
      const riskBar = gauge('预计起始风险', info.risk, 100); riskBar.classList.add('cm-risk-bar'); tactics.append(riskBar);
      const send = mainButton('盖章派单', 'dispatch', d => club.pickDispatch(d, r.job, r.pair, r.temp), 'se_stamp');
      send.disabled = r.pair.length !== 2; tactics.append(send);
      grid.append(crew, tactics); root.append(grid);
    }
    function stage(result) {
      const task = club.tasks[r.job], live = r.live, frame = el('div', 'cm-stage');
      frame.style.backgroundImage = 'linear-gradient(0deg,#0b2f2ee8, #173e3860 70%), url("assets/bg/' + task.bg + '.webp")';
      const sprites = [];
      const setPose = (img, id, pose) => {
        const front = 'assets/sprites/' + id + '-1-front.webp';
        img.onerror = () => { img.onerror = null; img.src = front; };
        img.src = pose === 'normal' ? front : 'assets/sprites/' + id + '-1/' + pose + '.webp';
        img.dataset.pose = pose;
      };
      for (const id of r.pair) {
        const img = el('img', 'cm-sprite'); img.alt = name(id);
        setPose(img, id, result ? (r.result.level >= 2 ? 'smug' : r.result.level ? 'happy' : 'panicked') : 'normal');
        const portrait = el('div', 'cm-portrait');
        sprites.push(img); portrait.append(img); frame.append(portrait);
      }
      const center = el('div', 'cm-stage-readout');
      center.append(el('small', '', r.pair.map(name).join(' × ')), heading(task.title));
      const meter = el('div', 'cm-meter'), fill = el('i');
      fill.style.setProperty('--from', (live.prior / 120 * 100) + '%');
      fill.style.width = (live.progress / 120 * 100) + '%';
      meter.setAttribute('role', 'meter'); meter.setAttribute('aria-label', '现场完成度'); meter.setAttribute('aria-valuemin', '0');
      meter.setAttribute('aria-valuemax', '120'); meter.setAttribute('aria-valuenow', live.progress); meter.append(fill);
      const risk = el('span', 'cm-lamp ' + (live.risk >= 45 ? 'high' : live.risk >= 20 ? 'medium' : 'low'), '风险 ' + live.risk + '%');
      center.append(meter, el('strong', '', '完成度 ' + live.progress + '%'), risk);
      if (result) {
        const stamp = el('b', 'cm-stamp level-' + r.result.level, grades[r.result.level]);
        frame.append(stamp);
        if (r.result.level === 3) frame.classList.add('cm-ssr');
      }
      const front = el('div', 'cm-front');
      frame.append(center); front.append(frame); root.append(front);
      for (const id of live.calls.filter(id => stock[id]?.kind === 'ally')) {
        const reply = el('div', 'cm-call'); reply.append(face(id), text(stock[id].name + '「' + stock[id].quote + '」')); front.append(reply);
      }
      if (result) return;
      const crisis = section('前线突发危机' + (task.boss ? ' · Phase ' + (live.step + 1) + ' / 2' : ''), 'cm-crisis');
      crisis.append(text(task.phases[live.step].crisis, 'cm-dialogue'));
      const choices = el('div', 'cm-choices'), supports = el('div', 'cm-support');
      for (const c of club.instructions(r)) {
        const choose = act(d => club.resolveCrisis(d, c.id), run => {
          if (run.phase !== 'result') return c.id === 'chips' ? 'se_chips_crunch' : 'se_stamp';
          if (c.id === 'chips' || c.id === 'card') audio.effect(c.id === 'chips' ? 'se_chips_crunch' : 'se_stamp');
          return ['se_shredder_jam', 'se_stamp', 'se_stamp', 'se_rice_ding'][run.result.level];
        });
        const b = control('', 'choice-' + c.id, choose, 'cm-choice cm-' + c.id);
        b.disabled = !!c.disabled;
        const title = el('strong', '', c.support ? supportName[c.id] : c.label);
        if (c.support) {
          title.prepend(stock[c.id].kind === 'ally' ? face(c.id) : icon('archive'));
          b.title = c.text; b.setAttribute('aria-label', c.label + ' · ' + c.text); b.append(title);
          supports.append(b); continue;
        }
        if (c.id === 'special') title.prepend(icon('medal'));
        const stats = el('span', 'cm-values');
        stats.append(el('span', 'cm-gain', '+' + c.progress + '% 进度'),
          el('span', c.certain || c.risk <= 0 ? 'cm-gain' : 'cm-danger', c.certain ? '风险归零' : signed(c.risk) + '% 风险'));
        if (live.bond === 'grok_deepseek') {
          stats.append(el('span', '', '成功率 ' + c.success + '%'));
          if (c.afterRisk >= 35) stats.append(el('span', 'cm-danger', '高危陷阱'));
        }
        b.append(title, el('span', '', c.text), stats);
        if (c.id === 'special') b.append(el('small', '', c.need));
        if (c.disabled && c.adventurous) b.append(el('small', '', '稳健温度下封存'));
        if (c.stageBonus) b.append(el('small', '', '大成功额外 ×1.5'));
        choices.append(b);
      }
      crisis.append(choices);
      if (supports.childElementCount) { supports.prepend(el('strong', '', '快捷支援')); crisis.append(supports); }
      root.append(crisis);
      const reveal = () => {
        if (!frame.isConnected) return;
        sprites.forEach((img, index) => setPose(img, r.pair[index], 'panicked'));
        crisis.hidden = false;
      };
      if (document.documentElement.classList.contains('still') || matchMedia('(prefers-reduced-motion: reduce)').matches) reveal();
      else { crisis.hidden = true; setTimeout(reveal, 440); }
    }
    function ledger() {
      const x = r.result, box = section('当日收支账单');
      line(box, '早间经费结存', x.startCash + ' 元');
      for (const [label, amount] of x.ledger) line(box, label, signed(amount) + ' 元');
      line(box, '固定开支', '−' + x.rent + ' 元');
      const spent = x.purchases.reduce((sum, id) => sum + (id === 'drink' ? 35 : stock[id].price), 0);
      if (spent) line(box, '晚间采购', '−' + spent + ' 元');
      line(box, '当前经费', r.cash + ' 元'); line(box, '今日声望', signed(x.rep));
      return box;
    }
    function receipt() {
      stage(true);
      const x = r.result, box = section(grades[x.level] + ' · 前线回执');
      box.append(text(x.story, 'cm-dialogue'));
      if (x.critical) box.append(text('匿名墙暴击 · 完成度 +30%', 'cm-note'));
      if (x.gift) box.append(text('零食组带回了' + stock[x.gift].name, 'cm-note'));
      box.append(text('委托报酬 ' + signed(x.pay) + ' 元　·　声望 ' + signed(x.rep), 'cm-note'));
      const end = r.mode === 'endless' ? r.cash < -150 : r.day === 5;
      const detail = el('details', 'cm-clip');
      detail.append(el('summary', '', '查看报酬与开支明细'), ledger());
      root.append(box, detail, mainButton(end ? '查看经营结算' : '前往晚间采购台', 'evening', club.toEvening));
    }
    function evening() {
      const grid = el('div', 'cm-evening'), left = el('div', 'cm-column'), market = el('div', 'cm-column');
      const recovery = section('留室摸鱼简报');
      for (const id of heroes.filter(id => !r.pair.includes(id))) {
        const amount = r.result.recovery[id];
        recovery.append(text(name(id) + rest[id] + '，' + (amount ? '精力 +' + amount : '精力已满') + '。'));
      }
      const drinks = section('星冰乐补给');
      for (const id of heroes.filter(id => r.stamina[id] < 3)) {
        const row = el('div', 'cm-line'); row.append(el('span', '', name(id) + ' · ' + r.stamina[id] + '/3'), drink(id)); drinks.append(row);
      }
      left.append(ledger(), recovery);
      if (drinks.childElementCount > 1) left.append(drinks);
      for (const [kind, title] of [['facility', '常驻设施'], ['item', '应急道具'], ['ally', '外援电话卡']]) {
        const box = section(title), list = el('div', 'cm-shelf cm-shelf-' + kind);
        const ids = kind === 'facility' ? r.shelves : Object.keys(stock).filter(id => stock[id].kind === kind);
        for (const id of ids) {
          const p = stock[id], used = r.facilities.includes(id) || r.hired.includes(id);
          const b = control('', 'buy-' + id, act(d => club.buyStock(d, id)), 'cm-product');
          b.disabled = used || (kind === 'item' && r.bag.length >= 4);
          const label = el('strong', '', p.name);
          if (kind === 'ally') label.prepend(face(id)); else label.prepend(icon(kind === 'item' ? 'archive' : 'club'));
          b.append(label, el('span', '', p.effect), el('b', '', used ? '已购入' : b.disabled ? '背包已满' : p.price + ' 元 · 购入')); list.append(b);
        }
        if (!ids.length) list.append(text('本轮设施已全部购齐。'));
        box.append(list); market.append(box);
      }
      const footer = el('footer', 'cm-next');
      footer.append(el('strong', '', '结余 ' + r.cash + ' 元'), mainButton('进入第 ' + (r.day + 1) + ' 天 →', 'next', club.nextDay));
      grid.append(left, market); root.append(grid, footer);
    }
    function summary() {
      const { total, grade, boss } = club.score(r);
      root.append(mast((r.mode === 'endless' ? '破产结算' : '五日结算') + ' · ' + grade + ' 级事务所',
        '总评 ' + total + ' 分　/　' + book.rank, 'bg_room_404_sunset'));
      const grid = el('div', 'cm-summary'), score = section('评级明细'), history = section('本轮派单记录');
      line(score, '结余经费', r.cash); line(score, '声望 ' + r.rep + ' × 50', r.rep * 50);
      line(score, '设施 ' + r.facilities.length + ' × 60', r.facilities.length * 60); line(score, 'Boss 通关', boss);
      score.append(text('S ≥1550 · A ≥1050 · B ≥650；经费 ≤0 评 C。', 'cm-note'));
      for (const entry of r.log) line(history, '第 ' + entry.day + ' 天 · ' + club.tasks[entry.job].title, grades[entry.level]);
      grid.append(score, history);
      root.append(grid);
      if (r.result) root.append(ledger());
      root.append(mainButton('再开一轮' + modes[r.mode], 'restart', d => { d.run = club.newRun(r.mode); }));
    }
    function codex() {
      root.append(mast('404 奇闻剪报图鉴 · ' + book.rank, '累计 ' + book.rounds + ' 轮　/　最高评级 ' + (book.best || '待评') +
        '　/　无尽最长 ' + book.longest + ' 天', 'bg_room_404_sunset'));
      const archive = section('羁绊档案 ' + book.bonds.length + ' / 10'), grid = el('div', 'cm-archives');
      if (book.commander) archive.append(text('已获称号 · 全员对齐指挥官', 'cm-bond'));
      for (const [id, bond] of Object.entries(bonds)) {
        const owned = book.bonds.includes(id), card = el('article', 'cm-file' + (owned ? ' collected' : ''));
        const faces = el('div', 'cm-file-faces'); id.split('_').forEach(id => faces.append(face(id)));
        if (!owned) faces.append(icon('lock'));
        card.append(faces, el('strong', '', bond.name), el('small', '', id.split('_').map(name).join(' × ') + (owned ? ' · 已收录' : ' · 待组合')), text(bond.effect)); grid.append(card);
      }
      archive.append(grid); root.append(archive);
      const clips = section('名场面剪报 ' + Object.keys(book.clips).length + ' / 15');
      clips.append(text('荣誉 ' + book.honours + ' / 15　·　翻车 ' + book.mishaps + ' / 15', 'cm-note'));
      for (const j of club.jobs) {
        const entry = book.clips[j.id] || {}, detail = el('details', 'cm-clip');
        const header = el('summary', 'cm-clip-title'), badges = el('span', 'cm-clip-badges');
        for (const [key, mark] of [['honour', '★ 荣誉'], ['mishap', '！翻车']]) {
          const badge = el('span', entry[key] ? key : '', mark);
          badge.title = mark + (entry[key] ? '已收录' : '待收录');
          badge.setAttribute('aria-label', badge.title); badges.append(badge);
        }
        header.append(el('strong', '', j.title), badges); detail.append(header);
        if (entry.honour) detail.append(text(j.triumph));
        if (entry.mishap) detail.append(text(j.mishap));
        if (!entry.honour && !entry.mishap) detail.append(text('在此委托取得大成功或爆笑翻车，解锁对应剪报。'));
        clips.append(detail);
      }
      root.append(clips);
    }
    if (tab === 'codex') { codex(); return; }
    if (!r) {
      root.append(mast('404 无限委托', '选两名部员接单，遇到突发时替她们拿主意。晚间经费用来采购，也计入第五天的总评。', 'bg_room_404_day'));
      modeSelect(); return;
    }
    if (r.phase === 'finished') root.append(modeRail(r.mode, id => act(d => club.switchMode(d, id))()));
    status();
    if (r.phase === 'morning') morning();
    if (r.phase === 'live') stage(false);
    if (r.phase === 'result') receipt();
    if (r.phase === 'evening') evening();
    if (r.phase === 'finished') summary();
  }
  window.WhiteboxCommissionsUI = { render };
})();
