(() => {
  'use strict';
  const { games, ranks, decorations, theatre, greetings, cabinet, purchase, price, stars, settle } = window.WhiteboxArcade;
  const ids = Object.keys(games), { member } = window.Whitebox;
  const memoryHelp = '翻开两张相同衣装即配对，每翻两张计一步。方向键移动，空格或回车翻牌。14 步且 50 秒内得金牌，21 步且 90 秒内得银牌，其余完成得铜牌。';
  const sceneUrl = id => 'url("' + new URL('assets/bg/' + id + '.webp', document.baseURI).href + '")';
  function mount(body, { el, button, pic, read, write, playerNames, onOverload }) {
    const store = cabinet(read, write), room = el('div', 'arcade'), audio = window.AcademyAudio;
    body.append(room);
    let controller, leaving, view, screen = 0;
    function clear(next) {
      controller?.abort(); leaving?.(); leaving = null;
      controller = new AbortController(); screen++; view = next;
      room.dataset.view = next;
      room.replaceChildren(); body.scrollTop = 0;
    }
    function listen(target, name, listener) {
      target.addEventListener(name, listener, { signal: controller.signal });
    }
    const action = (text, fn) => button(text, fn, 'arc-action');
    function face(id) { return pic('assets/avatars/' + id + '-1.webp', '', 'arc-face'); }
    function wallet(p) {
      const bar = el('div', 'arc-wallet');
      const balance = el('strong', '', ' ' + p.coins + ' 白箱社团币');
      balance.prepend(window.WhiteboxIcon('coin'));
      bar.append(balance, el('span', '', '★ ' + stars(p) + ' / 15 星'));
      if (stars(p) === 15) bar.append(el('strong', 'arc-legend', '白箱街机传奇'));
      return bar;
    }
    function home() {
      clear('home');
      const p = store.current(), bar = wallet(p);
      const storeButton = action(' 404 秘密小卖部', shop);
      storeButton.prepend(window.WhiteboxIcon('gift'));
      bar.append(storeButton);
      const grid = el('div', 'arc-cards');
      for (const id of ids) {
        const game = games[id], best = p.records[id], card = button('', () => briefing(id), 'arc-card');
        card.style.setProperty('--scene', sceneUrl(game.bg));
        card.style.setProperty('--tone', member[id][2]);
        const copy = el('div'); copy.append(el('small', '', member[id][0]), el('h3', '', game.title));
        const record = el('footer'); record.append(el('span', '', '最高 ' + (best?.score || 0)), el('b', '', ranks[best?.rank || 0]));
        card.append(face(id), copy, record); grid.append(card);
      }
      room.append(bar);
      if (read('clearedChapters')?.includes('chapter5')) room.append(el('p', 'arc-ribbon', '✦ 星海终章通关纪念'));
      room.append(grid);
      hostess(p);
    }
    function hostess(p) {
      const date = new Date(), hour = date.getHours();
      const id = p.host || ids[date.getDate() % ids.length], outfit = p.host ? p.outfit : '1';
      const host = el('section', 'arc-host'), figure = button('', e => {
        const rect = figure.getBoundingClientRect();
        const zone = e.detail ? Math.max(0, Math.min(2, Math.floor(3 * (e.clientY - rect.top) / rect.height))) : 1;
        poke.react(e, id, zone, figure, id + '-' + outfit);
      }, 'arc-host-figure');
      const bubble = el('div', 'arc-poke'); bubble.hidden = true; bubble.setAttribute('role', 'status');
      const poke = window.WhiteboxPoke.create({ bubble, playerNames, onOverload });
      leaving = () => poke.clear();
      figure.setAttribute('aria-label', '轻触值日看板娘 ' + member[id][0]);
      figure.dataset.actor = id;
      figure.append(pic('assets/sprites/' + id + '-' + outfit + '-front.webp', ''));
      const copy = el('div', 'arc-host-copy');
      copy.append(el('h3', '', '今日值日 · ' + member[id][0]), el('p', '', greetings[id][hour < 5 || hour >= 23 ? 3 : hour < 11 ? 0 : hour < 17 ? 1 : 2]));
      const available = ids.filter(k => p.owned.includes('host.' + k));
      if (available.length) {
        function picker(label, entries, selected, fn) {
          const wrap = el('label'), select = el('select');
          wrap.append(el('span', '', label), select);
          entries.forEach(([key, title]) => select.add(new Option(title, key)));
          select.value = selected;
          select.onchange = () => saveChoice(fn, select.value);
          return wrap;
        }
        const error = el('p', 'activity-error');
        async function saveChoice(fn, value) {
          const here = screen;
          try { await store.change(draft => fn(draft, value)); if (screen === here) home(); }
          catch (e) { error.textContent = e.message; }
        }
        copy.append(picker('固定看板娘', available.map(k => [k, member[k][0]]), id, (draft, k) => {
          if (!draft.owned.includes('host.' + k)) return false;
          draft.host = k; draft.outfit = '1'; return true;
        }), picker('值日衣装', Object.entries(window.WhiteboxStudio.outfits), outfit, (draft, k) => {
          if (!draft.owned.includes('host.' + id)) return false;
          draft.host = id; draft.outfit = k; return true;
        }), error);
      }
      host.append(figure, copy); room.append(host, bubble);
    }
    function shop() {
      clear('shop');
      const p = store.current(), bar = wallet(p); bar.append(action('返回大厅', home)); room.append(bar);
      const guide = el('header', 'activity-banner arc-shop-guide');
      guide.append(el('h3', '', '404 秘密小卖部'), el('p', '', '挑战赚取的社团币可以兑换摄影棚装饰、值日看板娘衣装和私房小剧场。'));
      const error = el('p', 'activity-error'); error.setAttribute('role','status'); room.append(guide, error);
      function section(title, entries) {
        const block = el('section', 'arc-stock'); block.append(el('h3', '', title));
        for (const [key, name] of entries) {
          const row = el('div', 'arc-product'), owned = p.owned.includes(key);
          const [type, id] = key.split('.');
          row.append(type === 'decor' ? window.WhiteboxIcon('gallery') : face(id), el('strong', '', name));
          if (owned && key.startsWith('scene.')) {
            const lines = theatre[key.slice(6)], details = el('details');
            details.append(el('summary', '', '重看小剧场'), ...lines.slice(1).map(line => el('p', '', line))); row.append(details);
          } else {
            const buy = action(owned ? '✓ 已兑换' : price(key) + ' 币 · 兑换', async () => {
              const here = screen; buy.disabled = true;
              try { await store.change(draft => purchase(draft, key)); if (screen === here) shop(); }
              catch (e) { error.textContent = e.message; buy.disabled = false; }
            });
            buy.disabled = owned || p.coins < price(key); row.append(buy);
          }
          block.append(row);
        }
        room.append(block);
      }
      section('摄影棚贴纸与相框', Object.entries(decorations).map(([key, title]) => ['decor.' + key, title]));
      section('看板娘换装权（含全 6 套衣装）', ids.map(id => ['host.' + id, member[id][0]]));
      section('私房甜糖小剧场', ids.map(id => ['scene.' + id, theatre[id][0]]));
    }
    function briefing(id, mode = id) {
      clear('briefing');
      const game = games[id], sheet = el('section', 'arc-brief');
      sheet.style.setProperty('--scene', sceneUrl(game.bg));
      sheet.append(face(id), el('h3', '', game.title), el('p', '', game.hello));
      room.append(sheet);
      if (id === 'gemini') {
        const modes = el('div','arc-actions');
        for (const [key, title] of [['gemini','双星反应'],['memory','衣橱翻翻乐']]) {
          const b = action(title, () => briefing(id, key)); b.setAttribute('aria-pressed', String(key === mode)); modes.append(b);
        }
        room.append(modes);
      }
      const info = el('section', 'arc-guide');
      const marks = id === 'gpt' ? '铜牌 5 关 · 银牌 7 关 · 金牌 8 关全对' : ['铜牌','银牌','金牌'].map((name,i) => name + ' ' + game.marks[i] + ' 分').join(' · ');
      info.append(el('p', '', mode === 'memory' ? memoryHelp : game.help));
      if (id === 'deepseek') info.append(el('p', 'hint', '🍚 +100　🍳 +250　🌟 +500，随后 5 秒饭团雨双倍得分。🫐 扣一颗心，🟨 僵直 1.2 秒，🐱 方向反转 3 秒。'));
      if (mode !== 'memory') info.append(el('p','hint', (id === 'gpt' ? '每稿 ' : '限时 ') + game.time + ' 秒　' + marks));
      info.append(el('p', 'hint', '完成一局可得 50～300 白箱社团币，按本局分数结算。'));
      const best = store.current().records[id]?.modes?.[mode];
      if (best) info.append(el('p','hint','本模式最高 ' + best.score + ' · ' + ranks[best.rank]));
      const buttons = el('div','arc-actions');
      const start = action('开始挑战', () => play(id, mode));
      start.classList.add('arc-start'); start.prepend(window.WhiteboxIcon('play'));
      buttons.append(start, action('返回大厅', home)); info.append(buttons); room.append(info);
    }
    function play(id, mode) {
      clear('play'); audio.unlock();
      const game = games[id], here = screen;
      const head = el('div', 'arc-round-head'), points = el('strong'), clock = el('b'), status = el('span');
      const pause = action('暂停', () => setPaused(!paused)); head.append(clock, points, status, pause);
      const layout = el('div', 'arc-machine'), area = el('section', 'arc-play'), aside = el('aside', 'arc-announcer');
      layout.style.setProperty('--scene', sceneUrl(game.bg));
      const actor = pic('assets/sprites/' + id + '-1-front.webp', member[id][0]), line = el('p', '', game.hello);
      actor.dataset.actor = id;
      line.setAttribute('role', 'status');
      aside.append(actor, line); layout.append(area, aside);
      const cover = el('div','arc-pause'); cover.hidden = true;
      cover.append(el('strong','','已暂停'), action('继续挑战', () => setPaused(false)), action('放弃本局 · 返回大厅', home));
      const otherMode = mode === 'memory' ? 'gemini' : 'memory';
      const switchMode = () => briefing(id, otherMode);
      if (id === 'gemini') cover.append(action('放弃本局 · 切换双星玩法', switchMode));
      layout.append(cover); room.append(el('h3','arc-round-title',game.title), head, layout);
      let age = 0, left = mode === 'memory' ? Infinity : game.time, value = 0, prev = performance.now();
      let frame, paused = false, done = false, mechanics;
      const active = () => screen === here && !paused && !done && !document.hidden;
      const score = (s, info) => {
        if (value !== s || !points.textContent) points.textContent = s + ' 分';
        value = s;
        if (status.textContent !== info) status.textContent = info;
      };
      const updateClock = () => {
        const text = Number.isFinite(left) ? '剩余 ' + Math.ceil(left) + ' 秒' : '用时 ' + Math.floor(age) + ' 秒';
        if (clock.textContent !== text) clock.textContent = text;
      };
      function say(text, exp = 'normal', speaker = id) {
        line.textContent = text;
        const sprite = speaker + '-1';
        const pose = window.StudioPoses[sprite]?.includes(exp) ? '/' + exp : '-front';
        const path = 'assets/sprites/' + sprite + pose + '.webp';
        if (actor.getAttribute('src') !== path) {
          actor.dataset.actor = speaker;
          actor.alt = member[speaker][0];
          actor.src = path;
        }
      }
      function pair(a, b, fn) {
        const group = el('div', 'arc-pair');
        group.append(action(a, () => fn(0)), action(b, () => fn(1))); return group;
      }
      async function end(rank, summary) {
        if (done || screen !== here) return;
        done = true; cancelAnimationFrame(frame); pause.disabled = true;
        const payout = () => store.change(p => {
          const before = stars(p), coins = settle(p, id, mode, value, rank);
          return { coins, p, newLegend: before < 15 && stars(p) === 15 };
        });
        const result = el('section','arc-result'); result.setAttribute('role','status');
        area.replaceChildren(result); say(game.end, 'happy'); audio.effect(rank === 3 ? 'se_firework' : 'se_bell_chime');
        async function save() {
          result.replaceChildren(el('p', '', '正在结算…'));
          try {
            const { coins, p, newLegend } = await payout();
            if (screen !== here) return;
            result.replaceChildren(el('small','','本局成绩'), el('h3','',value + ' 分　' + ranks[rank]), el('p','',summary),
              el('strong','','+' + coins + ' 白箱社团币'), wallet(p));
            if (newLegend) result.append(el('p','arc-legend','五台街机全部金牌！解锁隐藏荣誉《白箱街机传奇》。'));
            result.append(action('再玩一次', () => play(id, mode)), action('返回大厅', home));
            if (id === 'gemini') result.append(action('切换双星玩法', switchMode));
          } catch (e) { result.replaceChildren(el('p','activity-error',e.message), action('重试结算', save), action('返回大厅', home)); }
        }
        await save();
      }
      const g = { el, button, pic, area, names: playerNames(), sound: audio.effect, say, pair, score, end, active,
        get age() { return age; }, get left() { return left; }, setTime(s) { left = s; updateClock(); } };
      score(0, ''); updateClock(); mechanics = window.ArcadeRounds[mode](g);
      function tick(now) {
        if (!active()) return;
        const dt = Math.min(Math.max(0, now - prev) / 1000, left); prev = now; age += dt; left -= dt;
        mechanics.tick?.(dt); updateClock();
        if (!done && left <= 0) mechanics.timeout();
        if (!done && !paused) frame = requestAnimationFrame(tick);
      }
      function setPaused(next) {
        if (done || screen !== here || (!next && document.hidden)) return;
        paused = next; cover.hidden = !paused; area.inert = paused;
        pause.textContent = paused ? '继续' : '暂停'; mechanics.blur?.(); cancelAnimationFrame(frame);
        if (paused) cover.querySelector('button').focus();
        else { prev = performance.now(); pause.focus(); frame = requestAnimationFrame(tick); }
      }
      function input(e) {
        if (done || e.isComposing || e.altKey || e.ctrlKey || e.metaKey || e.repeat) return;
        if (active() && mechanics.key?.(e.key.toLowerCase(), e.type === 'keydown')) e.preventDefault();
      }
      listen(document, 'keydown', input); listen(document,'keyup',input);
      listen(document,'visibilitychange', () => { if (document.hidden) setPaused(true); });
      listen(window,'blur', () => setPaused(true));
      leaving = () => { done = true; cancelAnimationFrame(frame); mechanics.blur?.(); };
      frame = requestAnimationFrame(tick);
    }
    const refresh = e => { if (e.key === 'whitebox.404.arcade') { if (view === 'home') home(); else if (view === 'shop') shop(); } };
    window.addEventListener('storage', refresh); home();
    return () => { clear('closed'); window.removeEventListener('storage', refresh); };
  }
  window.WhiteboxArcadeRoom = { mount };
})();
