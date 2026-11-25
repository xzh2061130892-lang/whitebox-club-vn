(() => {
  'use strict';
  const club = window.WhiteboxClub, audio = window.AcademyAudio;
  const { member, heroes } = window.Whitebox;
  const tracks = {
    bgm_spring_slope: ['四月海风坡道', '开学日 · 樱影主校道'],
    bgm_sunny_mischief: ['404 室的鸡飞狗跳', '部员集合 · 双人派单'],
    bgm_sunset_warmth: ['夕阳下的白米饭', '庆功晚餐 · 社团的第一份回忆'],
    bgm_clockwork_tease: ['门内的五重奏', '序章楔子 · 推门之前'],
    bgm_tension_comedy: ['风纪委员突击检查', '旧校舍 · 经费危机'],
    bgm_oriental_breeze: ['紫藤回廊的茶香', '东庭茶寮 · 午后谈判'],
  };
  const effects = {
    se_rice_ding: '电饭煲叮', se_stamp: '拍黄牌盖章', se_chips_crunch: '嚼薯片',
    se_rollerskates_crash: '轮滑急停', se_shredder_jam: '碎纸机卡纸',
    se_knock_strict: '严厉三连敲', se_bell_chime: '温室风铃', se_shutter: '快门咔嚓',
  };
  function mount(body, page, { el, button, pic, read, write }) {
    const storeKey = 'activities.v1', storageName = 'whitebox.404.' + storeKey;
    const get = () => club.normalize(read(storeKey));
    const arcade = window.WhiteboxArcade.cabinet(read, write);
    let tab = page === 'commissions' ? 'jobs' : 'music';
    let track = '', timer = 0, closed = false, pending = false;
    const nav = el('div', 'gallery-tabs gallery-pages activity-tabs');
    const panel = el('section', 'activity-stack'), error = el('p', 'activity-error');
    error.setAttribute('role', 'alert');
    body.append(nav, error, panel);
    function stopMusic() {
      if (track) audio.music('');
      track = '';
    }
    function visibility() {
      if (track) audio.music(document.hidden ? '' : track);
    }
    function sync(e) { if (e.key === storageName || (tab === 'shop' && e.key === 'whitebox.404.arcade') || e.key === null) draw(); }
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('storage', sync);
    function close() {
      closed = true;
      clearInterval(timer);
      stopMusic();
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('storage', sync);
    }
    const tabs = page === 'commissions'
      ? [['jobs', '委托派单台'], ['codex', '奇闻剪报图鉴'], ['shop', '404 小卖部']]
      : [['music', '棱镜点唱机 · 音效板'], ['quiz', '默契十题测验'], ['shop', '404 小卖部']];
    for (const [id, name] of tabs) {
      const b = button(name, () => {
        if (tab === id) return;
        stopMusic(); tab = id; body.scrollTop = 0; draw();
      });
      b.dataset.tab = id;
      nav.append(b);
    }
    // Re-read under the shared lock so a stale tab cannot spend a balance or claim a day twice.
    function save(data) {
      if (!write(storeKey, data)) throw Error('本次操作未能保存，请检查浏览器存储后重试。');
    }
    // Both locks are taken in the same order. The debit and receipt survive a
    // reload between the two saves, so recovery can deliver the credit once.
    async function deliver(data) {
      if (!data.exchange) return;
      await arcade.change(p => {
        if (p.lastCommissionExchange === data.exchange) return false;
        p.coins += 100;
        p.lastCommissionExchange = data.exchange;
        return true;
      });
      delete data.exchange;
      save(data);
    }
    async function change(mutate, afterSave) {
      if (pending || closed) return;
      pending = true;
      try {
        const update = async () => {
          if (closed) return;
          const data = get();
          if (data.exchange) await deliver(data);
          if (mutate(data) === false) return;
          save(data);
          if (data.exchange) await deliver(data);
          if (!closed) afterSave?.(data);
        };
        if (navigator.locks) await navigator.locks.request(storageName, update);
        else await update();
        error.textContent = '';
      } catch (e) {
        error.textContent = e.message;
      } finally {
        pending = false;
      }
      if (!closed) draw();
    }
    const action = (label, fn) => button(label, fn, 'system-action primary');
    const hint = text => el('p', 'hint', text);
    function banner(background, name, detail) {
      const cover = el('header', 'activity-banner');
      cover.style.backgroundImage = 'linear-gradient(90deg, #112e29f5, #163b32c9 55%, #183e382e), url("assets/bg/' + background + '.webp")';
      cover.append(el('h3', '', name), el('p', '', detail));
      return cover;
    }
    function draw() {
      clearInterval(timer);
      panel.dataset.tab = tab;
      const data = get();
      for (const b of nav.children) b.setAttribute('aria-pressed', String(tab === b.dataset.tab));
      const focus = panel.contains(document.activeElement) ? document.activeElement.dataset.cm : '';
      const phase = panel.firstElementChild?.dataset.phase, top = body.scrollTop;
      panel.replaceChildren();
      if (tab === 'music') jukebox();
      if (tab === 'quiz') quiz(data);
      if (tab === 'shop') shop(data);
      if (tab === 'jobs' || tab === 'codex') window.WhiteboxCommissionsUI.render(panel, tab, data,
        { el, pic, button, change, audio, body });
      if (phase && panel.firstElementChild?.dataset.phase === phase) {
        body.scrollTop = top;
        if (focus) panel.querySelector('[data-cm="' + CSS.escape(focus) + '"]:not(:disabled)')?.focus({ preventScroll: true });
      }
    }
    function jukebox() {
      panel.append(banner('bg_prism_music_day', 'Kimi 的棱镜点唱机', '选曲循环试听，再点一次停播。'));
      const list = el('div', 'track-list');
      for (const [id, [name, scene]] of Object.entries(tracks)) {
        const b = button('', () => {
          audio.unlock();
          track = track === id ? '' : id;
          audio.music(track);
          update();
        }, 'track');
        b.dataset.track = id;
        const label = el('span');
        label.append(el('strong', '', name), el('small', '', scene));
        const play = el('span', 'play-mark');
        play.setAttribute('aria-hidden', 'true');
        b.append(play, label); list.append(b);
      }
      const stop = button('■ 停止试听', () => {
        const last = list.querySelector('[aria-pressed="true"]'); stopMusic(); update(); last?.focus();
      }, 'system-action stop-preview');
      function update() {
        stop.hidden = !track;
        for (const b of list.children) {
          const active = track === b.dataset.track;
          b.setAttribute('aria-pressed', String(active));
          if (active) b.firstChild.replaceChildren(...Array.from({ length: 3 }, () => el('i')));
          else b.firstChild.replaceChildren(window.WhiteboxIcon('play'));
        }
      }
      update();
      const board = el('div', 'sound-board');
      for (const [id, name] of Object.entries(effects))
        board.append(button(name, () => { audio.unlock(); audio.effect(id); }, 'sound-pad'));
      panel.append(list, stop, el('h3', '', '玩梗音效板'), board);
    }
    function shop(data) {
      panel.append(banner('bg_wisteria_tea_day', '404 小卖部', '钱包 ' + data.wallet + ' 元 · 每件礼物 ' + club.giftPrice + ' 元'),
        hint('购买即送给对应部员。送满两次，她会为你留下一段可以重看的私房小剧场。'));
      const exchange = action(data.exchange ? '领取待到账社团币' : '兑换 100 社团币', () => change(d => {
        if (data.exchange || d.wallet !== data.wallet) return false;
        return club.exchangeToArcadeCoins(d);
      }));
      const complete = heroes.every(id => (data.affection[id] || 0) >= club.affectionGoal);
      exchange.disabled = !data.exchange && (!complete || data.wallet < 100);
      const counter = el('div', 'cm-exchange');
      counter.append(el('div', '', '五位部员的私房小剧场全部解锁后，每 100 元钱包余额可兑换 100 社团币。'),
        hint('游乐角余额 ' + arcade.current().coins + ' 社团币'), exchange);
      panel.append(counter);
      for (const [id, [gift, title, scene]] of Object.entries(club.gifts)) {
        const count = data.affection[id] || 0, unlocked = count >= club.affectionGoal;
        const row = el('article', 'shop-row'), text = el('div');
        text.append(el('strong', '', gift), el('small', '', member[id][0] + ' · 娱乐室亲密度 ' + count + ' / ' + club.affectionGoal));
        row.append(pic('assets/avatars/' + id + '-1.webp'), text);
        if (unlocked) {
          const theatre = el('details', 'club-theatre');
          theatre.append(el('summary', '', '阅读《' + title + '》'), el('p', '', scene));
          row.append(theatre);
        } else {
          const buy = button('购买并送礼', () => change(d => {
            if ((d.affection[id] || 0) !== count) return false;
            return club.give(d, id);
          }), 'system-action');
          buy.disabled = data.wallet < club.giftPrice; row.append(buy);
        }
        panel.append(row);
      }
    }
    function quiz(data) {
      const q = data.quiz;
      const start = () => change(d => {
        if ((d.quiz?.id || '') !== (q?.id || '') || (d.quiz && d.quiz.answers.length < 5)) return false;
        d.quiz = club.newQuiz();
      });
      if (!q) {
        panel.append(banner('bg_prism_music_day', '你真的和她们对齐了吗？', '十题题库 · 每轮随机五题'),
          el('p', '', '每题限时 ' + club.seconds + ' 秒，答对一题就给小卖部钱包添 ' + club.quizPay + ' 元。'),
          action('开始默契测验', start));
        return;
      }
      const total = q.answers.length, score = q.answers.filter(a => a === 0).length;
      const index = q.deadline ? total : total - 1;
      const [prompt, ...answers] = club.questions[q.deck[index]];
      const question = el('h3', 'quiz-question', prompt);
      question.tabIndex = -1;
      panel.append(banner('bg_prism_music_day', '默契测验 · 第 ' + (index + 1) + ' / 5 题',
        '本轮答对 ' + score + ' 题　／　钱包 ' + data.wallet + ' 元'), question);
      if (q.deadline) {
        const countdown = el('div', 'quiz-clock'), choices = el('div', 'quiz-options');
        const bar = el('progress'), time = el('b');
        bar.max = club.seconds; bar.setAttribute('aria-label', '答题剩余秒数');
        countdown.append(bar, time);
        function respond(choice) { return change(d => club.answer(d, q.id, index, choice)); }
        for (const choice of q.orders[index])
          choices.append(button(answers[choice], () => respond(choice), 'system-action'));
        function tick() {
          const remaining = Math.max(0, Math.ceil((q.deadline - Date.now()) / 1000));
          bar.value = Math.max(0, (q.deadline - Date.now()) / 1000);
          countdown.classList.toggle('urgent', remaining <= 5);
          time.textContent = '剩余 ' + remaining + ' 秒';
          if (!remaining && !pending) { clearInterval(timer); respond(-1); }
        }
        panel.append(countdown, choices);
        if (!nav.contains(document.activeElement)) question.focus({ preventScroll: true });
        timer = setInterval(tick, 250);
        tick();
      } else {
        const last = q.answers[index];
        panel.append(el('p', 'club-story', last === 0 ? '答对了！钱包 +' + club.quizPay + ' 元。' :
          (last < 0 ? '本题超时。' : '你选了「' + answers[last] + '」。') + '正确答案是「' + answers[0] + '」。'));
        if (total === 5) {
          panel.append(el('h3', 'club-grade', score + ' / 5 · ' + club.quizTitle(score)),
            hint('本轮收入 ' + score * club.quizPay + ' 元　／　历史最高称号：' + club.quizTitle(data.bestQuiz)),
            action('再测一轮', start));
        } else panel.append(action('下一题', () => change(d => {
          if (d.quiz?.id !== q.id || d.quiz.answers.length !== total || d.quiz.deadline) return false;
          d.quiz.deadline = Date.now() + club.seconds * 1000;
        })));
      }
    }
    draw();
    const stored = read(storeKey);
    if ((stored?.run && stored.run.v !== 2) || stored?.exchange) change(() => true);
    return close;
  }
  window.WhiteboxRecreation = { mount };
})();
