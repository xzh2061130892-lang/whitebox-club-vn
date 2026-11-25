/* Optional interactions run on the current story node. Only plain progress data enters a save. */
(() => {
  'use strict';
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  function bandAt(value = 0.75) {
    const v = Number(value.toFixed(2));
    if (v < 0.4) return 0;
    if (v > 1.35) return 2;
    return v >= 0.62 && v <= 0.88 ? 1 : null;
  }
  const nearestBand = value => bandAt(value) ?? 1;
  const direction = key => ['a', 'arrowleft', 'arrowup'].includes(key) ? -1 :
    ['d', 'arrowright', 'arrowdown'].includes(key) ? 1 : 0;

  function transition(story, state, option) {
    const { nodes } = story;
    if (option !== undefined) {
      if (state.storyId !== 'chapter3' || nodes[state.pc].type !== 'choice') return;
      for (let i = state.pc - 1; i >= 0; i--) {
        if (nodes[i].type === 'label') return nodes[i].value.startsWith('ch3_race_') ? 'relay' : undefined;
      }
      return;
    }
    if (state.storyId === 'chapter2') {
      let next = nodes[state.pc + 1];
      if (next?.type === 'goto') next = nodes[next.target];
      if (next?.type === 'jump_to' && next.value === 'ch2_act3_blackout') return 'curry';
    }
    if (state.storyId === 'chapter5' && !state.bg.startsWith('cg_')) {
      let p = state.pc + 1;
      while (['se', 'char_clear', 'bgm'].includes(nodes[p]?.type)) p++;
      if (nodes[p]?.type === 'bg' && nodes[p].value.startsWith('cg_confession_')) return 'fireworks';
    }
  }

  function mount(kind, host, m, options) {
    const { el, button, audio, paused, motion, done } = options;
    const abort = new AbortController();
    const surface = el('div', 'mg-surface');
    host.dataset.game = kind;
    host.append(surface);
    let frame, last, finished = false, tick, onKey, pose, release = () => {};
    // Menus, background tabs and lost pointer capture must never hold a control down.
    const listen = (node, type, fn) => node.addEventListener(type, fn, { signal: abort.signal });
    const sound = id => audio.effect(id);
    const note = (text = '') => {
      const p = el('p', 'mg-feedback', text);
      p.setAttribute('role', 'status');
      return p;
    };
    function finish(index) {
      if (finished || abort.signal.aborted || paused()) return;
      finished = true;
      done(index);
    }
    function reset() {
      for (const key of Object.keys(m)) delete m[key];
      options.retry();
    }
    function showResult() {
      const r = m.result;
      host.dataset.outcome = r.ok ? 'win' : 'miss';
      surface.className = 'mg-surface mg-result';
      const msg = note(r.text);
      surface.replaceChildren(msg);
      if (motion() && (kind === 'panic' || (kind === 'relay' && r.ok))) {
        const particles = el('div', 'mg-particles');
        particles.setAttribute('aria-hidden', 'true');
        for (let i = 0; i < 16; i++) {
          const bit = el('i', '', r.ok && kind === 'panic' ? '✦' : '');
          bit.style.setProperty('--x', ((i * 37 + 7) % 100) + '%');
          bit.style.setProperty('--delay', (i % 5) * 0.055 + 's');
          bit.style.setProperty('--turn', (i % 2 ? 1 : -1) * (50 + i * 11) + 'deg');
          particles.append(bit);
        }
        surface.append(particles);
      }
      if (!r.ok) {
        const actions = el('div', 'mg-actions');
        actions.append(button(kind === 'panic' ? '拿胶带粘好重抢 · 再来一次' : '再来一次', reset, 'primary'),
          button('直接过关看剧情', () => finish(kind === 'tuner' ? 1 : undefined)));
        surface.append(actions);
      }
    }
    function result(text, ok, delay = 0.9, index) {
      if (m.result || finished) return;
      release();
      m.result = { text, ok, delay, index };
      sound(ok ? 'se_rice_ding' : 'se_shredder_jam');
      showResult();
      scheduleFrame();
    }
    const skip = (label = '直接过关看剧情', index) =>
      button(label, () => finish(index), 'mg-skip');
    function pulse(target) {
      if (motion()) target.animate?.([{ transform: 'translateY(-3px)' }, { transform: 'translateY(0)' }], { duration: 180 });
    }
    function react(id, expression) {
      const actor = options.state.cast[id];
      const figure = document.querySelector('#cast [data-id="' + id + '"]');
      if (!figure || !actor) return;
      const src = 'assets/sprites/' + actor.sprite + '/' + expression + '.webp';
      if (pose?.getAttribute('src') === src) return;
      pose?.remove();
      pose = options.pic(src, '', 'mg-pose');
      const image = pose;
      image.onload = () => {
        if (!abort.signal.aborted && pose === image) figure.append(image);
      };
    }
    function canvas(cls, label) {
      const c = el('canvas', cls);
      c.setAttribute('role', 'img');
      c.setAttribute('aria-label', label);
      const ctx = c.getContext('2d');
      return { element: c, draw(paint) {
        if (!ctx) return;
        const w = c.clientWidth, h = c.clientHeight, dpr = Math.min(window.devicePixelRatio || 1, 2);
        if (!w || !h) return;
        const width = Math.round(w * dpr), height = Math.round(h * dpr);
        if (c.width !== width || c.height !== height) { c.width = width; c.height = height; }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, w, h);
        paint(ctx, w, h);
      }};
    }
    const game = { ...options, host, surface, m, note, listen, sound, pulse, react, canvas, finish, skip,
      win: (text, delay, index) => result(text, true, delay, index),
      miss: text => result(text, false),
      onTick(fn) { tick = fn; }, onKey(fn) { onKey = fn; },
      onRelease(fn) { release = fn; },
    };
    // Dispatch also restores the chosen pair and item underneath its departure message.
    const handlers = { panic, thinking, tuner, dispatch, notice, curry, relay, fireworks };
    const api = handlers[kind](game) || {};
    if (m.result) showResult();
    function scheduleFrame() {
      if (frame === undefined && !abort.signal.aborted && !finished && (m.result ? m.result.ok : tick))
        frame = requestAnimationFrame(update);
    }
    function update(now) {
      frame = undefined;
      if (abort.signal.aborted || finished) return;
      const dt = last === undefined ? 0 : clamp((now - last) / 1000, 0, 0.075);
      last = now;
      if (paused()) release();
      else if (m.result?.ok) {
        m.result.delay -= dt;
        if (m.result.delay <= 0) finish(m.result.index);
      } else if (!m.result) tick?.(dt);
      scheduleFrame();
    }
    listen(window, 'blur', () => { last = undefined; release(); });
    listen(document, 'visibilitychange', () => { last = undefined; release(); });
    scheduleFrame();
    return { ...api, dispose() { abort.abort(); cancelAnimationFrame(frame); release(); pose?.remove(); delete host.dataset.game; delete host.dataset.outcome; },
      keydown(e) {
        const key = e.key.toLowerCase(), dir = direction(key);
        if (paused() || finished || (!dir && key !== ' ')) return false;
        const focused = document.activeElement;
        if (focused?.closest('#menu-key,#quick') || (kind === 'notice' && !host.contains(focused) && !['a','d'].includes(key))) return false;
        const isAction = focused?.matches('button,summary') && host.contains(focused);
        const utility = isAction && (focused.classList.contains('mg-skip') || focused.matches('summary'));
        if (!m.result && !utility && onKey?.(key, dir, e)) { e.preventDefault(); return true; }
        const buttons = [...host.querySelectorAll('button:not(:disabled),summary')].filter(b => b.getClientRects().length);
        if (!buttons.length) return false;
        const i = buttons.indexOf(focused);
        e.preventDefault();
        if (dir) buttons[i < 0 ? (dir > 0 ? 0 : buttons.length - 1) : (i + dir + buttons.length) % buttons.length].focus();
        else if (!e.repeat) (isAction && i >= 0 ? focused : buttons[0]).click();
        return true;
      },
    };
  }

  function panic(g) {
    const { m, el, button, surface, n, state } = g;
    m.shred ??= 62;
    const sheet = el('div', 'mg-manuscript');
    sheet.dataset.title = { chapter1: '双海豚折纸贺卡', chapter4: '文化祭节目单' }[state.storyId] || '404 迎新海报';
    const label = el('output', 'mg-reading'), bar = el('progress', 'mg-meter');
    bar.max = 100;
    const feedback = g.note(), action = button('拉回稿件！', pull, 'primary mg-pull');
    const actions = el('div', 'mg-actions');
    const machine = el('span', 'mg-shredder', '碎纸机');
    function draw() {
      label.value = '碎纸进度　' + Math.ceil(m.shred) + '%';
      bar.value = m.shred;
      sheet.style.setProperty('--feed', m.shred / 100);
    }
    function pull() {
      if (m.result || m.repair) return;
      m.shred = Math.max(0, m.shred - 10.5);
      feedback.textContent = m.shred < 20 ? '快扯出来了！' : m.shred < 48 ? '呜哇部长力气好大！' : '不要拦我让我删光 QAQ！';
      g.react('gemini', m.shred < 20 ? 'happy' : 'panicked');
      g.pulse(sheet);
      draw();
      if (!m.shred) { m.repair = true; repair(); }
    }
    function fix() {
      if (!m.repair || m.result) return;
      g.win(n.success || '顺毛成功！猫猫已恢复运行');
    }
    function repair() {
      g.react('gemini', 'happy');
      sheet.className = 'mg-manuscript mg-repair';
      const target = button('✧', fix, 'mg-target');
      target.setAttribute('aria-label', '把四芒星贴到折角');
      const sticker = button('✦ 四芒星贴纸', () => { target.focus(); feedback.textContent = '对准金色虚线圈，贴下去！'; }, 'mg-sticker');
      g.listen(sticker, 'pointerdown', e => { sticker.setPointerCapture(e.pointerId); });
      g.listen(sticker, 'pointermove', e => {
        if (!sticker.hasPointerCapture(e.pointerId)) return;
        const rect = sticker.getBoundingClientRect();
        sticker.style.setProperty('--drag-x', (e.clientX - rect.left - rect.width / 2) + 'px');
        sticker.style.setProperty('--drag-y', (e.clientY - rect.top - rect.height / 2) + 'px');
      });
      const reset = () => { sticker.style.removeProperty('--drag-x'); sticker.style.removeProperty('--drag-y'); };
      g.listen(sticker, 'pointercancel', reset);
      g.listen(sticker, 'pointerup', e => {
        reset();
        if (target.contains(document.elementFromPoint(e.clientX, e.clientY))) fix();
      });
      sheet.replaceChildren(target, sticker);
      feedback.textContent = '点金圈，或将四芒星拖到折角。';
      surface.replaceChildren(sheet, feedback, g.skip());
      sticker.focus({ preventScroll: true });
    }
    actions.append(action, g.skip());
    sheet.append(machine);
    feedback.textContent = '连续点击或按空格，把稿件从刀口拉回来。';
    surface.append(sheet, label, bar, feedback, actions);
    draw();
    if (m.repair) repair();
    g.onTick(dt => {
      if (m.repair) return;
      m.shred = Math.min(100, m.shred + 13 * dt);
      m.clickClock = (m.clickClock || 0) + dt;
      if (m.clickClock >= 0.85) { m.clickClock = 0; g.sound('se_shredder_jam'); }
      draw();
      if (m.shred >= 100) g.miss('咔嚓！Gemini 抱着一捧纸条，默默递来了胶带。');
    });
  }

  function thinking(g) {
    const { m, el, button, surface, state } = g;
    m.popped ??= [];
    const core = state.storyId === 'chapter1' ? ['麻婆豆腐单独下饭', '保住食堂口碑', '留住委托人的线索']
      : state.storyId === 'chapter3' ? ['记住天台的约定', '先听听学长的心跳', '保管好小银贝']
      : ['留住新部长最关键', '锅巴贿赂方案可行', '先核对委托线索'];
    const stray = ['先 sleep 十分钟吧', '算算食堂打折券……', '偷偷外包给隔壁桌？'];
    const field = el('div', 'mg-bubbles'), meter = el('output', 'mg-purity'), feedback = g.note('戳破三个虚线杂念，保留实线线索。');
    const hear = button('听听推演结果 →', () => g.finish(), 'primary');
    function progress() {
      meter.value = '思维纯度　' + (40 + m.popped.length * 20) + '%';
      meter.style.setProperty('--purity', (40 + m.popped.length * 20) + '%');
      hear.disabled = m.popped.length !== 3;
      if (!hear.disabled) { feedback.textContent = '思绪对齐了。学长，要听我的推演吗？'; g.host.classList.add('mg-pruned'); }
      if (!hear.disabled) g.react('deepseek', 'gentle');
    }
    [stray[0],core[0],core[1],stray[1],stray[2],core[2]].forEach((text, i) => {
      const wrong = stray.includes(text);
      const b = button(text, () => {
        if (b.disabled) return;
        if (!wrong) { feedback.textContent = '这条推理很有用，别删掉呀！'; g.pulse(b); return; }
        m.popped.push(i); b.disabled = true;
        g.sound('se_bubble_pop'); feedback.textContent = '啊，差点又走神了！'; progress();
        if (!hear.disabled) hear.focus({ preventScroll: true });
      }, 'mg-bubble ' + (wrong ? 'stray' : 'clue'));
      b.setAttribute('aria-label', (wrong ? '杂念　' : '线索　') + text);
      b.style.setProperty('--delay', (-0.37 * i) + 's');
      b.disabled = m.popped.includes(i);
      field.append(b);
    });
    surface.append(meter, field, feedback, hear, g.skip());
    progress();
  }

  function tuner(g) {
    const { m, el, button, state, n } = g;
    const presets = [0.1, 0.75, 1.6];
    m.value ??= presets[state.tunerSelection] ?? 0.52;
    m.age ??= 0;
    const scope = g.canvas('mg-scope', '双轨心音示波器。白色虚线为目标频率，彩色实线为当前心音。');
    const readout = el('output', 'mg-reading'), hint = g.note();
    const slider = el('input', 'tuner-slider mg-slider');
    slider.type = 'range'; slider.min = 0; slider.max = 2; slider.step = 0.01;
    slider.setAttribute('aria-label', '连续心音温度');
    const stops = el('div', 'tuner-stops');
    function set(v) {
      m.value = clamp(v, 0, 2);
      const index = bandAt(m.value), golden = index === 1, value = m.value.toFixed(2);
      state.tunerSelection = index ?? 1;
      slider.value = value;
      const band = ['低温冷场', '黄金共鸣', '高温过载'][index] ?? '尚未对齐';
      readout.value = 'T = ' + value + '　' + band;
      slider.setAttribute('aria-valuetext', readout.value);
      g.host.classList.toggle('mg-resonant', golden);
      [...stops.children].forEach((b, i) => b.setAttribute('aria-pressed', i === index));
    }
    n.options.forEach((o, i) => {
      const [level, caption] = o.text.split(' · '), b = button('', () => set(presets[i]));
      b.append(el('strong', '', level), el('small', '', caption || ''));
      stops.append(b);
    });
    let holdingLock = false;
    const lock = button('锁定共鸣', () => {
      holdingLock = false;
      const index = bandAt(m.value);
      if (index === 1) g.sound('se_bell_chime');
      if (index !== null) return g.finish(index);
      g.miss('两道波形擦肩而过。再往金色小格里挪一点？');
    }, 'primary');
    g.listen(lock, 'pointerdown', e => { if (e.button === 0) holdingLock = true; });
    g.listen(lock, 'pointerleave', () => { holdingLock = false; });
    g.listen(lock, 'pointercancel', () => { holdingLock = false; });
    g.onRelease(() => { holdingLock = false; });
    const storm = state.storyId === 'chapter2' && n.actor === 'grok';
    const fever = state.storyId === 'chapter4' && n.actor === 'deepseek';
    const rhythms = { chapter1: 1.2, chapter3: 2.4, chapter4: 0.9, chapter5: 1.6 };
    const rhythm = rhythms[state.storyId] || 1;
    hint.textContent = (storm ? '雷声会推高指针。' : fever ? '体温正在缓慢上升。' : '指针随节拍轻摆。') + '拖动或用方向键微调，黄金区 0.62～0.88。';
    const panel = el('div', 'mg-instrument'), actions = el('div', 'mg-actions');
    const legend = el('div', 'mg-legend');
    legend.append(el('span', '', '目标共鸣'), el('span', '', '当前心音'));
    panel.append(legend, scope.element, readout, slider);
    actions.append(lock, g.skip('直接取中温', 1));
    g.surface.append(panel, hint, stops, actions);
    g.listen(slider, 'input', () => set(Number(slider.value)));
    g.onKey((key, dir, e) => {
      if (dir) { set(Number((m.value + dir * 0.02).toFixed(2))); return true; }
      if (key === ' ' && !stops.contains(e.target)) { if (!e.repeat) lock.click(); return true; }
      return false;
    });
    set(m.value);
    function wave(ctx, w, h, target) {
      const v = m.value, t = g.motion() ? m.age : 0, freq = target ? 2 : 1 + v / 0.75;
      const amp = target ? 0.27 : Math.min(0.43, 0.05 + v * 0.29);
      ctx.lineWidth = target ? 2 : 3;
      ctx.strokeStyle = target ? '#eef3f1' : v < 0.4 ? '#7dcdeb' : v > 1.35 ? '#f47eac' : '#ffda7b';
      ctx.setLineDash(target ? [6, 6] : []);
      ctx.beginPath();
      for (let x = 0; x <= w; x += 2) {
        const phase = freq * x / w - t * 0.45;
        const signal = !target && v > 1.35 ? 2 * (phase - Math.floor(phase + 0.5)) : Math.sin(2 * Math.PI * phase);
        const y = h * (0.5 - amp * signal);
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    g.onTick(dt => {
      const old = m.age; m.age += dt;
      if (!holdingLock) {
        if (storm && Math.floor(m.age / 2.8) > Math.floor(old / 2.8)) {
          set(m.value + 0.18); g.pulse(panel); g.sound('se_drum');
        } else if (fever) set(m.value + dt * 0.024);
        else if (!storm) set(m.value + 0.025 * (Math.sin(m.age * rhythm) - Math.sin(old * rhythm)));
      }
      scope.draw((ctx, w, h) => { wave(ctx, w, h, true); wave(ctx, w, h, false); });
    });
  }

  const supplies = {
    deepseek: ['应急锅巴包', '碳水充能', 'DeepSeek 抱紧锅巴包，续航拉满！'],
    claude: ['小螃蟹护身符', '防限流护盾', 'Claude 带着小螃蟹，审稿抗压 +100%！'],
    gemini: ['备用金星贴纸', '防删稿安心', 'Gemini 把金星贴到封面，今天一定留稿！'],
    grok: ['冰镇青柠汽水', '嘴硬降温', 'Grok 喝了一口汽水，这次肯听口令了！'],
    gpt: ['桂花白茶罐', '免破折号稳态', 'GPT 捧起白茶，把三段破折号咽了回去！'],
  };
  function dispatch(g) {
    const { m, el, button, list, send, n, state } = g;
    const kits = ({ chapter1: ['gemini','grok','gpt'], chapter2: ['claude','gpt','deepseek'],
      chapter3: ['grok','claude','gemini'] })[state.storyId] || ['deepseek','claude','gemini'];
    const row = el('div', 'mg-kits'), prediction = g.note();
    list.insertBefore(g.surface, send);
    g.surface.append(el('h3', '', '随队支援道具 · 选一件'), row, prediction);
    function message() {
      if (!n.options[m.pair] || !m.kit) return '选好搭档和道具，查看共鸣预测。';
      return n.options[m.pair].pair.includes(m.kit) ? '✦ ' + supplies[m.kit][1] + '　' + supplies[m.kit][2]
        : '常规支援　' + supplies[m.kit][0] + '已装进两人的随行包。';
    }
    function sync() {
      prediction.textContent = message();
      prediction.classList.toggle('mg-match', !!n.options[m.pair]?.pair.includes(m.kit));
      send.disabled = !!m.result || !(n.options[m.pair] && m.kit);
      [...row.children].forEach((b, i) => b.setAttribute('aria-pressed', kits[i] === m.kit));
    }
    for (const id of kits) row.append(button(supplies[id][0], () => { if (!m.result) { m.kit = id; sync(); } }));
    sync();
    return {
      selectPair(i) { if (!m.result) { m.pair = i; sync(); } },
      depart() {
        if (send.disabled || m.result) return;
        send.disabled = true; g.sound('se_stamp');
        g.win(message() + '　搭档出发！', 1.5, m.pair);
      },
    };
  }

  function notice(g) {
    const { m, el, button, host, surface } = g;
    const actions = el('div', 'mg-notice-actions'), back = el('p', 'mg-notice-back');
    function reveal(type) {
      if (m.verdict) return;
      m.verdict = type; m.age = 0;
      g.sound(type === 'torn' ? 'se_chips_crunch' : 'se_stamp');
      paint();
    }
    function paint() {
      actions.hidden = !!m.verdict;
      if (m.verdict) host.classList.remove('mini');
      host.classList.toggle('mg-torn', m.verdict === 'torn');
      back.textContent = m.verdict === 'torn' ? '……轻点撕，手劲小一点我就不计较了。'
        : m.verdict ? '部长特批 · 撤销停权' : '';
      back.classList.toggle('mg-seal', m.verdict === 'stamped');
      back.hidden = !m.verdict;
    }
    const tear = button('撕下黄牌 ◿', () => reveal('torn'), 'mg-corner');
    let start;
    g.listen(tear, 'pointerdown', e => { start = [e.clientX, e.clientY]; tear.setPointerCapture(e.pointerId); });
    g.listen(tear, 'pointermove', e => {
      if (start && Math.hypot(e.clientX - start[0], e.clientY - start[1]) > 22) { start = null; reveal('torn'); }
    });
    g.listen(tear, 'lostpointercapture', () => { start = null; });
    actions.append(tear, button('盖部长豁免红章', () => reveal('stamped')));
    const reopen = button('SUSPENDED ↗', () => {
      host.classList.remove('mini'); m.age = 0; tear.focus();
    }, 'mg-reopen');
    reopen.setAttribute('aria-label', '展开停权黄牌');
    surface.append(actions, back, reopen); paint();
    m.age ??= 0;
    g.onTick(dt => {
      if (host.contains(document.activeElement) && !m.verdict) return;
      m.age += dt;
      if (m.age > (m.verdict ? 2.1 : 5.5)) {
        if (m.verdict) host.hidden = true; else host.classList.add('mini');
      }
    });
  }

  function curry(g) {
    const { m, el, button, surface } = g;
    m.heat ??= 0.5; m.tasty ??= 0; m.age ??= 0;
    let held = false;
    const pot = el('div', 'mg-pot'), spoon = el('i', 'mg-spoon');
    pot.append(spoon, el('i', 'mg-steam'));
    const scale = el('div', 'mg-heat'), marker = el('i', 'mg-indicator');
    scale.append(el('span', 'mg-gold-zone', '香浓完美区'), marker);
    const meter = el('progress', 'mg-meter'), output = el('output', 'mg-reading');
    meter.max = 3.5;
    const stir = button('按住搅拌，松手收火', () => {}, 'primary mg-stir');
    const actions = el('div', 'mg-actions'); actions.append(stir, g.skip());
    surface.append(pot, scale, meter, output, actions);
    function hold() { if (!m.result) { m.started = true; held = true; pot.classList.add('stirring'); } }
    function release() { held = false; pot.classList.remove('stirring'); }
    g.onRelease(release);
    g.listen(stir, 'pointerdown', e => { if (e.button !== 0) return; stir.setPointerCapture(e.pointerId); hold(); });
    for (const event of ['pointerup','pointercancel','lostpointercapture']) g.listen(stir, event, release);
    g.listen(window, 'keyup', e => { if ([' ','a','d','arrowleft','arrowright','arrowup','arrowdown'].includes(e.key.toLowerCase())) release(); });
    g.onKey((key, dir) => { if (key === ' ' || dir) { if (dir < 0) release(); else hold(); return true; } });
    function paint() {
      marker.style.left = (m.heat * 100) + '%'; meter.value = m.tasty;
      output.value = '香浓火候　' + m.tasty.toFixed(1) + ' / 3.5 秒';
      scale.classList.toggle('in-zone', m.heat >= 0.34 && m.heat <= 0.66);
    }
    paint();
    g.onTick(dt => {
      if (!m.started) return;
      m.age += dt; m.heat = clamp(m.heat + dt * (held ? 0.245 : -0.17), 0, 1);
      if (m.heat >= 0.34 && m.heat <= 0.66) m.tasty = Math.min(3.5, m.tasty + dt);
      paint();
      if (m.tasty >= 3.5) g.win('绝品海风合宿咖喱大成功！全员满足度 MAX。');
      else if (m.age >= 12) g.miss('DeepSeek 舀起一勺。锅底这层算是限定口味的锅巴吧？');
    });
  }

  function relay(g) {
    const { m, el, button, state, surface } = g;
    m.steps ??= 0; m.age ??= 0; m.combo ??= 0; m.best ??= 0;
    const track = el('div', 'mg-track'), team = el('div', 'mg-team'), finish = el('span', 'mg-finish');
    for (const [id, actor] of Object.entries(state.cast).slice(-2)) {
      const img = g.pic('assets/sprites/' + actor.sprite + '-front.webp', id);
      team.append(img);
    }
    track.append(team, finish);
    const counter = el('output', 'mg-reading'), feedback = g.note('跟着鼓点左右交替。先迈左脚，空格也可跟拍。');
    function footButton(label, foot) {
      // Judge contact on the beat even when the player lifts their finger later.
      const control = button(label, e => { if (e.detail === 0) step(foot); });
      g.listen(control, 'pointerdown', e => { if (e.button === 0) step(foot); });
      return control;
    }
    const feet = el('div', 'mg-feet'), left = footButton('◀ 左脚　A', 0), right = footButton('右脚　D ▶', 1);
    feet.append(left, right);
    surface.append(track, counter, feet, feedback, g.skip());
    let sounded = -1;
    function paint() {
      const beat = Math.floor(m.age * 2), open = m.age - beat / 2 <= 0.34;
      left.classList.toggle('on-beat', open && beat % 2 === 0); right.classList.toggle('on-beat', open && beat % 2 === 1);
      team.style.left = (3 + 75 * m.steps / 10) + '%';
      counter.value = '同步冲刺　' + m.steps + ' / 10　·　连击 ' + m.combo;
    }
    function step(foot) {
      if (m.result) return;
      m.started = true;
      const beat = Math.floor(m.age * 2);
      if (m.lastBeat === beat) return;
      if (foot !== m.steps % 2 || foot !== beat % 2 || m.age - beat / 2 > 0.34) {
        m.combo = 0;
        feedback.textContent = '两人差点绊在一起！等' + (m.steps % 2 ? '右' : '左') + '脚亮起再迈步。';
      } else {
        m.combo = m.lastBeat === beat - 1 ? m.combo + 1 : 1;
        m.best = Math.max(m.best, m.combo);
        m.lastBeat = beat; m.steps++;
        feedback.textContent = m.combo >= 8 ? '完美同步！' : '合拍！下一步迈' + (m.steps % 2 ? '右' : '左') + '脚。';
        g.pulse(team); g.sound('se_poke');
        if (m.steps === 10) g.win(m.best >= 8 ? '完美同步 · 破校纪录冲线！' : '挽紧手臂，两人一起冲线！', 1.1);
      }
      paint();
    }
    g.onKey((key, dir, e) => {
      if (!e.repeat) step(dir ? (dir < 0 ? 0 : 1) : Math.floor(m.age * 2) % 2);
      return true;
    });
    paint();
    g.onTick(dt => {
      if (!m.started) return;
      m.age += dt;
      const beat = Math.floor(m.age * 2);
      if (beat !== sounded) { sounded = beat; g.sound(beat % 4 === 0 ? 'se_whistle' : 'se_drum'); }
      if (m.lastBeat !== undefined && beat > m.lastBeat + 1) m.combo = 0;
      paint();
      if (m.age >= 14) g.miss('绑腿带打了个蝴蝶结。裁判举旗，允许两位牵手补跑！');
    });
  }

  function fireworks(g) {
    const { m, el, button, surface } = g;
    const orbs = [
      [0.17,0.55,'#ccafff','霜紫'], [0.70,0.37,'#ffab68','琥珀橘'],
      [0.34,0.34,'#ffbed9','星粉金'], [0.83,0.59,'#ff6b82','绯红'], [0.50,0.45,'#8fdaff','海蓝与金'],
    ];
    m.age ??= 0; m.bursts ??= [];
    const sky = el('div', 'mg-sky'), layer = g.canvas('mg-fire-canvas', '后夜祭海面与五色烟花');
    const status = el('output', 'mg-reading');
    sky.append(layer.element);
    surface.append(sky, status, g.skip('直接看告白'));
    const visible = i => i < 4 ? m.age >= i * 1.15 : m.bursts.length >= 4 && m.age >= 6.1;
    const buttons = orbs.map(([x, y, color, name], i) => {
      const b = button(i === 4 ? '✦' : '✧', e => {
        if (!visible(i) || m.bursts.some(p => p.i === i)) return;
        const rect = sky.getBoundingClientRect(), target = b.getBoundingClientRect();
        const px = e.detail ? e.clientX : target.x + target.width / 2;
        const py = e.detail ? e.clientY : target.y + target.height / 2;
        m.bursts.push({ i, at: m.age, x: clamp((px - rect.left) / rect.width, 0, 1), y: clamp((py - rect.top) / rect.height, 0, 1) });
        g.sound(i === 4 ? 'se_firework_final' : 'se_firework');
        b.hidden = true; updateTargets();
      }, 'mg-orb');
      b.style.setProperty('--orb', i === 4 ? '#ffdb76' : color);
      b.style.left = x * 100 + '%';
      b.setAttribute('aria-label', '点亮' + name + '烟花');
      sky.append(b);
      return b;
    });
    function updateTargets() {
      buttons.forEach((b, i) => {
        b.hidden = !visible(i) || m.bursts.some(p => p.i === i);
        const age = Math.max(0, m.age - i * 1.15);
        const rise = g.motion() && i < 4 ? 0.23 * Math.exp(-age * 0.8) + 0.025 * Math.sin(age) : 0;
        b.style.top = ((orbs[i][1] + rise) * 100) + '%';
      });
      status.value = m.bursts.length === 4 ? '点亮中央的金色压轴烟花' : '点亮烟花　' + m.bursts.length + ' / 5';
    }
    updateTargets();
    g.onKey((key, dir, e) => {
      if (dir || key !== ' ') return false;
      if (!e.repeat) {
        const focused = buttons.includes(document.activeElement) && !document.activeElement.hidden;
        (focused ? document.activeElement : buttons.find(b => !b.hidden))?.click();
      }
      return true;
    });
    g.onTick(dt => {
      m.age += dt; updateTargets();
      const final = m.bursts.find(p => p.i === 4);
      layer.draw((ctx,w,h) => {
        for (let i = 0; i < 46; i++) {
          ctx.fillStyle = i % 4 ? '#b8bfdb' : '#ffffff';
          ctx.fillRect(((i * 73 + 17) % 101) / 101 * w, ((i * 29) % 83) / 100 * h, 1.4, 1.4);
        }
        for (const p of m.bursts) {
          const age = m.age - p.at, large = p.i === 4;
          if (age > 1.5) continue;
          const count = large ? 76 : 42, spread = Math.min(w,h) * (large ? 0.56 : 0.28);
          const growth = g.motion() ? 1 - Math.exp(-3.4 * age) : 0.63;
          ctx.globalAlpha = Math.max(0, 1 - age / 1.5);
          for (let j = 0; j < count; j++) {
            const a = 2 * Math.PI * j / count, r = spread * growth * (j % 3 ? 1 : 0.68);
            const x = Math.cos(a) * r, y = Math.sin(a) * r;
            ctx.strokeStyle = large && j % 3 ? '#ffdc7e' : orbs[p.i][2];
            ctx.lineWidth = large ? 2.8 : 2;
            ctx.beginPath(); ctx.moveTo(p.x*w+x*0.84, p.y*h+y*0.84+age*age*13);
            ctx.lineTo(p.x*w+x, p.y*h+y+age*age*13); ctx.stroke();
          }
        }
        ctx.globalAlpha = 1;
        if (final && g.motion()) {
          ctx.fillStyle = 'rgba(255,226,160,' + clamp((m.age-final.at-0.6)*0.65,0,0.48) + ')';
          ctx.fillRect(0,0,w,h);
        }
      });
      if (final && m.age - final.at >= 1.45) g.finish();
    });
  }

  window.WhiteboxStoryGames = { transition, mount, bandAt, nearestBand };
})();

