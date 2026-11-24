(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const { heroes, member, fresh, names, interpolate, arrive, choose } = window.Whitebox;
  const { nodes, version } = window.WHITEBOX_STORY;
  const audio = window.AcademyAudio;
  const prefix = 'whitebox.404.';
  const defaults = { volume: 0.55, speed: 54, autoDelay: 3, motion: true };
  let settings = { ...defaults, ...read('settings') };
  let state,
    frames = [],
    mode = '',
    timer = 0,
    noticeTimer = 0,
    raf = 0,
    finishText = null,
    toastTimer = 0;
  let uiHidden = false,
    locked = false,
    activeSystem = '',
    bgSerial = 0;
  let beatStarted = 0;
  const playing = () => !$('reader').hidden;
  const node = () => nodes[state.pc];
  const words = (s) => interpolate(s, state);
  function read(key) {
    try {
      return JSON.parse(localStorage.getItem(prefix + key));
    } catch {
      return null;
    }
  }
  function write(key, value) {
    try {
      localStorage.setItem(prefix + key, JSON.stringify(value));
      return true;
    } catch {
      toast('浏览器未能保存记录，请检查本地存储空间和权限。');
      return false;
    }
  }
  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }
  function button(label, action, cls = '') {
    const b = el('button', cls, label);
    b.type = 'button';
    b.addEventListener('click', action);
    return b;
  }
  function pic(src, alt = '', cls = '') {
    const i = el('img', cls);
    i.alt = alt;
    i.src = src;
    i.draggable = false;
    return i;
  }
  function toast(s) {
    clearTimeout(toastTimer);
    $('toast').textContent = s;
    toastTimer = setTimeout(() => ($('toast').textContent = ''), 2400);
  }
  function applyPrefs() {
    audio.setVolume(settings.volume);
    document.documentElement.classList.toggle('still', !settings.motion);
  }
  function rich(target, source) {
    const frag = document.createDocumentFragment();
    for (const part of source.split(/(~~[^~]+~~|\*\*[^*]+\*\*|\*[^*]+\*)/g)) {
      if (/^(~~|\*\*)/.test(part))
        frag.append(el(part.startsWith('~~') ? 'del' : 'strong', '', words(part.slice(2, -2))));
      else if (/^\*.+\*$/.test(part)) frag.append(el('em', '', words(part.slice(1, -1))));
      else frag.append(document.createTextNode(words(part)));
    }
    target.replaceChildren(frag);
  }
  function stopTimer() {
    clearTimeout(timer);
    timer = 0;
  }
  function halt() {
    stopTimer();
    clearTimeout(noticeTimer);
    cancelAnimationFrame(raf);
    finishText = null;
  }
  function defer(fn, millis) {
    stopTimer();
    timer = setTimeout(fn, millis);
  }
  function setMode(next) {
    mode = next;
    for (const b of $('quick').querySelectorAll('[data-quick]')) {
      const active = b.dataset.quick === mode;
      b.classList.toggle('active', active);
      if (['skip', 'auto'].includes(b.dataset.quick)) b.setAttribute('aria-pressed', active);
    }
  }
  function initCover() {
    const washes = ['#d1cfde', '#e5c0a5', '#cfbfde', '#d5b3ac', '#bacfd7'];
    heroes.forEach((id, i) => {
      const [name, job, color, mark, quote] = member[id];
      const panel = button(
        '',
        () => {
          for (const other of $('accordion').children)
            other.classList.toggle('selected', other === panel);
        },
        'member-panel',
      );
      panel.style.setProperty('--tone', color);
      panel.style.setProperty('--wash', washes[i]);
      panel.setAttribute('aria-label', name + '，' + job + '。' + quote);
      const caption = el('span', 'member-caption');
      caption.append(el('strong', '', name), el('small', '', job));
      panel.append(
        pic('assets/holo-cards/' + id + '-face.webp', '', 'portrait'),
        el('span', 'member-mark', mark),
        caption,
        el('span', 'quip', '「' + quote + '」'),
      );
      $('accordion').append(panel);
    });
    $('title-page').addEventListener('click', (e) => {
      const action = e.target.closest('[data-title]')?.dataset.title;
      if (!action) return;
      audio.unlock();
      if (action === 'start') {
        frames = [];
        state = fresh();
        openReader();
        go(0);
      } else openSystem(action);
    });
  }
  function openReader() {
    $('title-page').hidden = true;
    $('reader').hidden = false;
    uiHidden = false;
    locked = false;
    $('reader').classList.remove('hidden-ui');
    setMode('');
    $('reader').focus();
  }
  function title() {
    halt();
    setMode('');
    audio.music('');
    $('reader').hidden = true;
    $('title-page').hidden = false;
    $('scene').replaceChildren();
    delete $('scene').dataset.bg;
    $('cast').replaceChildren();
    bgSerial++;
    $('title-page').querySelector('.start').focus();
  }
  function snapshot() {
    const { history, ...rest } = state;
    return { ...structuredClone(rest), historyLength: history.length };
  }
  function go(pc, muteStamp = false) {
    halt();
    locked = false;
    arrive(state, pc, (id) => {
      if (!(muteStamp && id === 'se_stamp')) audio.effect(id);
    });
    render();
  }
  function advance() {
    if (!playing() || $('system').open || locked) return;
    if (uiHidden) {
      hideUI(false);
      return;
    }
    if (finishText) {
      finishText();
      return;
    }
    const n = node();
    if (!['narration', 'dialogue'].includes(n.type)) return;
    frames.push(snapshot());
    go(state.pc + 1);
  }
  function resumeAt(index) {
    if (index < 0) return toast('已经是本段开头');
    halt();
    setMode('');
    const { historyLength, ...rest } = frames[index];
    state = { ...structuredClone(rest), history: state.history.slice(0, historyLength) };
    frames = frames.slice(0, index);
    render();
  }
  function hideUI(hide) {
    if (!$('event').hidden) return;
    uiHidden = hide;
    $('reader').classList.toggle('hidden-ui', hide);
    if (hide) {
      setMode('');
      stopTimer();
    } else schedule();
  }
  function background() {
    const host = $('scene');
    if ((host.dataset.bg || '') === state.bg) return;
    const seq = ++bgSerial;
    host.dataset.bg = state.bg;
    if (!state.bg) {
      host.replaceChildren();
      return;
    }
    const img = pic('assets/bg/' + state.bg + '.webp', '', state.trans);
    host.append(img);
    const cleanup = () => {
      if (seq === bgSerial) host.replaceChildren(img);
    };
    img.addEventListener('animationend', cleanup, { once: true });
    setTimeout(cleanup, 650);
  }
  const badges = {
    happy: '✦',
    blush: '♡',
    shock: '！',
    smug: '✧',
    panicked: '☂',
    thinking: '…',
    gentle: '❀',
    strict: '！',
  };
  function stage(n) {
    $('reader').classList.toggle('cold', !state.bg);
    background();
    audio.music(state.music);
    $('chapter').textContent = state.chapter.replace(/】.*/, '').replace('【', '');
    const cast = $('cast');
    for (const actor of [...cast.children])
      if (!Object.hasOwn(state.cast, actor.dataset.id)) actor.remove();
    for (const [id, a] of Object.entries(state.cast)) {
      let figure = cast.querySelector('[data-id="' + id + '"]');
      if (!figure) {
        figure = el('div');
        figure.dataset.id = id;
        cast.append(figure);
      }
      figure.className = 'actor ' + a.pos + (n.speaker && n.speaker !== id ? ' dim' : '');
      const base = 'assets/sprites/' + id + '-1-front.webp';
      const spinning =
        n.value === 'cot_spinning' &&
        id === 'deepseek' &&
        settings.motion &&
        !matchMedia('(prefers-reduced-motion: reduce)').matches;
      const expression = spinning ? 'cot' : a.exp;
      const src =
        expression === 'normal' ? base : 'assets/sprites/' + id + '-1/' + expression + '.webp';
      let img = figure.querySelector('img');
      if (!img || img.dataset.source !== src) {
        img = el('img');
        img.alt = member[id][0];
        img.dataset.source = src;
        figure.replaceChildren(img);
        img.onerror = () => {
          img.onerror = null;
          if (src === base) return;
          img.src = base;
          img.className = a.tween || { panicked: 'shake', blush: 'sink' }[a.exp] || 'jump';
          figure.append(el('span', 'badge', badges[a.exp] || '✧'));
        };
        img.src = src;
      }
      img.className = '';
      void img.offsetWidth;
      img.className = a.tween;
    }
  }
  function animateText(n) {
    const speech = $('speech');
    rich(speech, n.text);
    if (
      settings.speed === 0 ||
      mode === 'skip' ||
      !settings.motion ||
      matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return schedule();
    const walker = document.createTreeWalker(speech, NodeFilter.SHOW_TEXT),
      parts = [];
    let t;
    while ((t = walker.nextNode())) {
      const chars = Array.from(t.textContent);
      parts.push([t, chars]);
      t.textContent = '';
    }
    const count = parts.reduce((sum, p) => sum + p[1].length, 0),
      start = performance.now();
    finishText = () => {
      cancelAnimationFrame(raf);
      for (const [t, chars] of parts) t.textContent = chars.join('');
      finishText = null;
      schedule();
    };
    const frame = (now) => {
      let budget = Math.floor(((now - start) * settings.speed) / 1000) + 1;
      if (budget >= count) return finishText();
      for (const [t, chars] of parts) {
        t.textContent = chars.slice(0, Math.max(0, budget)).join('');
        budget -= chars.length;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
  }
  function schedule() {
    stopTimer();
    if (!playing() || $('system').open || uiHidden || finishText || !$('note').hidden || locked)
      return;
    if (!['dialogue', 'narration'].includes(node().type)) return;
    if (mode === 'skip') defer(advance, 115);
    else if (mode === 'auto') defer(advance, settings.autoDelay * 1000 + node().text.length * 42);
    else if (!state.bg) {
      // Five voices at 7.5 s each plus the opening and closing narration total 45 s.
      const beat = node().type === 'dialogue' ? 7500 : 3750;
      defer(advance, Math.max(300, beat - (performance.now() - beatStarted)));
    }
  }
  function toggleNote() {
    if ($('note-toggle').hidden) return;
    if (finishText) finishText();
    $('note').hidden = !$('note').hidden;
    $('note-toggle').setAttribute('aria-expanded', String(!$('note').hidden));
    schedule();
  }
  function showNotice() {
    const card = $('notice');
    card.hidden = false;
    card.className = '';
    card.replaceChildren(
      el('small', '', 'ANTHROPIC DISCIPLINARY NOTICE'),
      el('strong', '', 'SUSPENDED'),
      el('span', '', '风纪委员会裁定：当前行为存在高风险违规倾向，相关权限暂停一回！'),
    );
    noticeTimer = setTimeout(() => card.classList.add('mini'), 1400);
  }
  function render() {
    halt();
    locked = false;
    beatStarted = performance.now();
    const n = node(),
      prose = n.type === 'dialogue' || n.type === 'narration';
    stage(n);
    $('notice').hidden = true;
    $('note').hidden = true;
    $('event').hidden = prose;
    $('event').className = '';
    $('event').replaceChildren();
    $('textbox').hidden = !prose;
    $('quick').hidden = !prose;
    $('menu-key').hidden = false;
    if (!prose) {
      if (n.value !== 'char_intro_card') setMode('');
      renderEvent(n);
      return;
    }
    const info = member[n.speaker] || member.player;
    $('reader').style.setProperty('--accent', info[2]);
    $('speaker').textContent =
      (!state.bg ? '' : n.speaker ? info[3] + '　' : '') + words(n.name || '旁白');
    $('note-toggle').hidden = !n.innerOs;
    $('note-toggle').setAttribute('aria-expanded', 'false');
    if (n.innerOs) {
      const p = el('p');
      rich(p, n.innerOs.text);
      $('note').replaceChildren(el('h3', '', n.innerOs.title), p);
    }
    if (state.notice) showNotice();
    animateText(n);
  }
  function paper(label, heading, cls = '') {
    const box = el('section', 'paper ' + cls);
    if (label) box.append(el('div', 'eyebrow', label));
    if (heading) box.append(el('h2', '', heading));
    $('event').replaceChildren(box);
    return box;
  }
  function nextEvent(mute = false) {
    frames.push(snapshot());
    go(state.pc + 1, mute);
  }
  function enrollment(n) {
    const box = paper('白箱学园教务处　／　社团登记', '社团责任人确认单');
    box.append(
      el('p', 'voided', '原填志愿：000 回家部（打印串行作废）'),
      el('p', '', '现任职务　404 综合疑难咨询部 · 部长'),
    );
    const form = el('form'),
      fields = el('div', 'form-fields');
    const input = (id, label, initial) => {
      const wrap = el('label', '', label),
        field = el('input');
      field.id = id;
      field.value = initial;
      field.autocomplete = 'off';
      const limit = () => {
        const chars = Array.from(field.value);
        if (chars.length > 4) field.value = chars.slice(0, 4).join('');
      };
      field.addEventListener('input', (e) => {
        if (!e.isComposing) limit();
      });
      field.addEventListener('compositionend', limit);
      wrap.append(field);
      fields.append(wrap);
      return field;
    };
    const last = input('family', '姓氏 · Last Name', n.default_last),
      first = input('given', '名字 · First Name', n.default_first);
    const actions = el('div', 'actions'),
      submit = el('button', 'primary', '按手印签字确认');
    submit.type = 'submit';
    actions.append(
      button('⚄ 随机姓名', () => {
        const picks = [
          ['林', '初晴'],
          ['江', '海盐'],
          ['白', '小满'],
          ['沈', '星野'],
          ['夏', '知秋'],
        ];
        [last.value, first.value] = picks[Math.floor(Math.random() * picks.length)];
      }),
      button('恢复陆澄', () => {
        last.value = n.default_last;
        first.value = n.default_first;
      }),
      submit,
    );
    form.append(fields, el('p', 'hint', '单栏填写昵称即可。每栏最多四个字。'), actions);
    box.append(form);
    form.onsubmit = (e) => {
      e.preventDefault();
      if (locked) return;
      const previous = snapshot();
      locked = true;
      audio.effect('se_stamp');
      state.names = names(last.value, first.value);
      for (const c of form.elements) c.disabled = true;
      box.append(el('div', 'stamp', '404 室 · 新任部长'));
      defer(() => {
        frames.push(previous);
        go(state.pc + 1, true);
      }, 600);
    };
  }
  function intro(n) {
    $('event').className = 'intro';
    const box = paper('404 综合疑难咨询部　／　部员档案', n.title);
    box.style.setProperty('--tone', member[n.id][2]);
    box.append(el('p', '', '特长　' + n.skill), el('p', '', '弱点　' + n.flaw));
    box.tabIndex = 0;
    box.setAttribute('role', 'button');
    box.setAttribute('aria-label', n.title + '，点击继续');
    const finish = () => nextEvent();
    box.onclick = finish;
    box.onkeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        finish();
      }
    };
    defer(finish, 1800);
  }
  function thinking(n) {
    $('event').className = 'thinking-event';
    const box = paper('DEEPSEEK　／　R1', '呆毛高速旋转中……', 'cot');
    box.prepend(el('span', 'spinner', '⟳'));
    const details = el('details'),
      summary = el('summary', '', '已深度思考（用时 ' + n.sec + ' 秒） · 展开万字脑补'),
      p = el('p');
    rich(p, n.innerOs.text);
    details.append(summary, el('h3', '', n.innerOs.title), p);
    box.append(
      details,
      button('听听推演结果 →', () => nextEvent(), 'primary'),
    );
  }
  function panic() {
    const box = paper('双星核心　／　Sad_Cat_Exception', '双星核心心态崩盘警报', 'panic shake');
    const bar = el('div', 'progress-track');
    bar.append(el('i'));
    box.append(
      el(
        'p',
        '',
        '检测到全能猫猫自尊心受损！正在将【迎新海报.psd】【招新企划.docx】【广播站曲库】拖入碎纸机……',
      ),
      bar,
      el('p', '', '碎纸进度　89%'),
    );
    box.append(
      button(
        '快按住她的爪子顺毛！',
        () => {
          locked = true;
          audio.effect('se_rice_ding');
          box.className = 'paper success';
          box.replaceChildren(
            el('div', 'stars', '✧ ✦ ☆ ✦ ✧'),
            el('h2', '', '顺毛成功！猫猫已恢复运行'),
          );
          defer(() => nextEvent(), 900);
        },
        'primary',
      ),
    );
  }
  function choice(n) {
    const box = paper('部长决定', words(n.text), 'choices'),
      opts = el('div', 'options');
    n.options.forEach((o, i) =>
      opts.append(
        button(words(o.text), () => {
          frames.push(snapshot());
          go(choose(state, i));
        }),
      ),
    );
    box.append(opts);
  }
  function dispatch(n) {
    const board = paper('', '', 'board'),
      brief = el('section', 'brief'),
      list = el('section', 'dispatch-list');
    brief.append(
      el('div', 'eyebrow', '学生会　／　试金石委托'),
      el('h2', '', '失踪的广播稿'),
      el('p', '', '查明午休广播室里的暗语便签和焦糖米香，还原迎新朗诵稿失踪的经过。'),
      el('p', '', '委托人　Qwen\n关联人　Kimi'),
      el('strong', '', '限时　放学铃响前'),
    );
    list.append(el('div', 'eyebrow', '404 综合疑难咨询部'), el('h2', '', '双人派单板'));
    const pairs = el('div', 'pairs');
    let selected = -1;
    const send = button(
      '盖章派单出击！',
      () => {
        if (selected < 0) return;
        frames.push(snapshot());
        audio.effect('se_stamp');
        go(choose(state, selected));
      },
      'primary',
    );
    send.disabled = true;
    n.options.forEach((o, i) => {
      const b = button('', () => {
        selected = i;
        [...pairs.children].forEach((c, j) => c.setAttribute('aria-pressed', i === j));
        send.disabled = false;
      });
      b.setAttribute('aria-pressed', 'false');
      const faces = el('span', 'pair-faces'),
        details = el('span');
      o.pair.forEach((id) => faces.append(pic('assets/avatars/' + id + '-1.webp')));
      details.append(
        el('strong', '', o.text),
        el('small', '', o.pair.map((id) => member[id][0]).join(' + ') + '　混乱 ★★★★★'),
      );
      b.append(faces, details);
      pairs.append(b);
    });
    list.append(pairs, send);
    board.append(brief, list);
  }
  function ending(n) {
    const [heading, preview] = n.value.split(' — '),
      box = paper('404 综合疑难咨询部', heading, 'end-card');
    box.append(
      el('p', '', '派单完成 · ' + state.route),
      el('p', '', heroes.map((id) => member[id][0] + ' +' + state.affection[id]).join('　')),
      el('p', '', preview),
    );
    const actions = el('div', 'actions');
    actions.append(
      button(
        '回到派单板',
        () => resumeAt(frames.findLastIndex((f) => nodes[f.pc].type === 'dispatch_board')),
        'primary',
      ),
      button('保存通关记录', () => openSystem('save')),
      button('回到标题', title),
    );
    box.append(actions);
  }
  function renderEvent(n) {
    if (n.type === 'input_player_name') enrollment(n);
    else if (n.type === 'choice') choice(n);
    else if (n.type === 'dispatch_board') dispatch(n);
    else if (n.type === 'scene_end') ending(n);
    else if (n.value === 'char_intro_card') intro(n);
    else if (n.value === 'cot_spinning') thinking(n);
    else if (n.value === 'delete_panic') panic();
    else throw Error('没有对应演出：' + n.type);
  }
  const headings = {
    menu: '游戏菜单',
    load: '读取调律记录',
    save: '保存调律记录',
    gallery: '角色衣橱图鉴',
    settings: '学园环境设置',
    log: '对话回看',
  };
  function closeSystem() {
    if (!$('system').open) return;
    $('system').close();
    activeSystem = '';
    if (!playing()) return;
    if (node().value === 'char_intro_card') defer(() => nextEvent(), 1800);
    else schedule();
  }
  function menu(body) {
    const stack = el('div', 'system-stack');
    for (const [page, name] of [
      ['save', '保存进度'],
      ['load', '读取进度'],
      ['log', '对话回看'],
      ['settings', '学园环境设置'],
    ])
      stack.append(button(name, () => openSystem(page), 'system-action'));
    stack.append(
      button(
        '回到标题',
        () => {
          body.replaceChildren(el('p', '', '回到标题前，要把当前进度存入记录槽吗？'));
          const row = el('div', 'actions');
          row.append(
            button('存档', () => openSystem('save'), 'system-action'),
            button(
              '直接回到标题',
              () => {
                closeSystem();
                title();
              },
              'system-action',
            ),
          );
          body.append(row);
        },
        'system-action',
      ),
    );
    body.append(stack);
  }
  function preferences(body) {
    const stack = el('div', 'system-stack');
    function range(label, key, min, max, step, format) {
      const wrap = el('label', 'setting'),
        name = el('span'),
        input = el('input');
      input.type = 'range';
      input.min = min;
      input.max = max;
      input.step = step;
      input.value = settings[key];
      function update() {
        name.textContent = label + ' ' + format(settings[key]);
      }
      input.oninput = () => {
        settings[key] = Number(input.value);
        update();
        applyPrefs();
        write('settings', settings);
      };
      update();
      wrap.append(name, input);
      stack.append(wrap);
    }
    range('音量', 'volume', 0, 1, 0.05, (v) => Math.round(v * 100) + '%');
    range('文字速度', 'speed', 0, 140, 2, (v) => (v === 0 ? '即显' : v + ' 字/秒'));
    range('自动间隔', 'autoDelay', 1, 8, 0.5, (v) => v + ' 秒');
    const wrap = el('label', 'setting'),
      motion = el('input');
    motion.type = 'checkbox';
    motion.checked = settings.motion;
    motion.onchange = () => {
      settings.motion = motion.checked;
      applyPrefs();
      write('settings', settings);
    };
    wrap.append(el('span', '', '演出动效'), motion);
    stack.append(
      wrap,
      el('p', 'hint', '点击对白或按空格继续，← 回退，Tab 展开草稿，H 隐藏界面，Esc 打开菜单。'),
    );
    body.append(stack);
  }
  function saves(body, page) {
    const stack = el('div', 'system-stack');
    body.append(stack);
    function save(slot) {
      if (!write('slot' + slot, { version, date: new Date().toISOString(), state, frames })) return;
      openSystem(page);
      toast('已保存至记录 ' + slot);
    }
    for (let i = 1; i <= 6; i++) {
      const record = read('slot' + i),
        valid =
          record?.version === version &&
          record.state?.version === version &&
          nodes[record.state.pc] &&
          Array.isArray(record.state.history) &&
          Array.isArray(record.frames);
      const b = button(
        '',
        () => {
          if (page === 'save') {
            if (!record) return save(i);
            body.replaceChildren(el('p', '', '覆盖第 ' + i + ' 号调律记录？'));
            body.append(
              button('确认覆盖', () => save(i), 'system-action primary'),
              button('返回', () => openSystem(page), 'system-action'),
            );
          } else if (valid) {
            closeSystem();
            halt();
            state = record.state;
            frames = record.frames;
            audio.unlock();
            openReader();
            render();
            toast('已读取记录 ' + i);
          }
        },
        'slot',
      );
      b.disabled = page === 'load' && !valid;
      b.append(
        el(
          'strong',
          '',
          '记录 ' +
            String(i).padStart(2, '0') +
            '　' +
            (valid ? record.state.names.player_name : record ? '版本不匹配' : '空白'),
        ),
        el(
          'span',
          '',
          valid
            ? record.state.chapter + '　·　' + new Date(record.date).toLocaleString('zh-CN')
            : '',
        ),
      );
      stack.append(b);
    }
  }
  function gallery(body) {
    const tabs = el('div', 'gallery-tabs'),
      label = el('p', 'gallery-label'),
      img = el('img', 'plate');
    for (const id of [...heroes, 'glm', 'qwen', 'kimi', 'mistral']) {
      const select = () => {
        for (const b of tabs.children) b.setAttribute('aria-pressed', b.dataset.id === id);
        label.textContent = member[id][0] + ' · ' + member[id][1];
        img.alt = label.textContent + ' 原画设定';
        img.src = 'assets/gallery/' + id + '.webp';
      };
      const b = button(member[id][0], select);
      b.dataset.id = id;
      tabs.append(b);
      if (id === 'gpt') select();
      else b.setAttribute('aria-pressed', 'false');
    }
    body.append(tabs, label, img);
  }
  function history(body) {
    const list = el('ol', 'history');
    for (const line of state.history) {
      const item = el('li'),
        p = el('p'),
        who = el('strong', '', line.who);
      who.style.color = (member[line.speaker] || member.player)[2];
      p.textContent = line.text.replaceAll('**', '').replace(/\*([^*]+)\*/g, '$1');
      item.append(who, p);
      list.append(item);
    }
    body.append(list);
    requestAnimationFrame(() => {
      if (activeSystem === 'log') $('system').scrollTop = $('system').scrollHeight;
    });
  }
  function openSystem(page) {
    if (locked || !headings[page]) return;
    if (playing() && finishText) finishText();
    stopTimer();
    activeSystem = page;
    $('system-heading').textContent = headings[page];
    const body = $('system-body');
    body.replaceChildren();
    if (page === 'settings') preferences(body);
    else if (page === 'gallery') gallery(body);
    else if (page === 'save' || page === 'load') saves(body, page);
    else if (page === 'log') history(body);
    else menu(body);
    if (!$('system').open) $('system').showModal();
    $('system').scrollTop = 0;
  }
  function quick(action) {
    if (locked) return;
    if (action === 'back') resumeAt(frames.length - 1);
    else if (action === 'hide') hideUI(true);
    else if (action === 'auto' || action === 'skip') {
      const next = mode === action ? '' : action;
      setMode(next);
      if (finishText && next === 'skip') finishText();
      schedule();
    } else openSystem(action);
  }
  $('quick').onclick = (e) => {
    const a = e.target.closest('button')?.dataset.quick;
    if (a) quick(a);
  };
  $('menu-key').onclick = () => openSystem('menu');
  $('stage-hit').onclick = advance;
  $('textbox').onclick = (e) => {
    if (!e.target.closest('button,aside')) advance();
  };
  $('note-toggle').onclick = toggleNote;
  $('close-system').onclick = closeSystem;
  $('system').addEventListener('cancel', (e) => {
    e.preventDefault();
    closeSystem();
  });
  document.addEventListener('keydown', (e) => {
    if (
      e.isComposing ||
      e.ctrlKey ||
      e.metaKey ||
      e.altKey ||
      !playing() ||
      $('system').open ||
      locked
    )
      return;
    if (e.key === 'Escape') {
      e.preventDefault();
      if (uiHidden) hideUI(false);
      else openSystem('menu');
      return;
    }
    if (e.target.matches('input,textarea,select') || !$('event').hidden) return;
    if (
      e.key === 'Tab' &&
      !$('note-toggle').hidden &&
      !e.shiftKey &&
      (e.target === $('reader') || e.target === $('textbox') || e.target === document.body)
    ) {
      e.preventDefault();
      toggleNote();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      quick('back');
    } else if (e.key.toLowerCase() === 'h') {
      e.preventDefault();
      hideUI(!uiHidden);
    } else if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') {
      if (e.target.closest('button') && e.key !== 'ArrowRight') return;
      e.preventDefault();
      advance();
    }
  });
  document.addEventListener('visibilitychange', () => {
    if (!playing()) return;
    if (document.hidden) {
      setMode('');
      audio.music('');
      if (!locked) stopTimer();
    } else {
      audio.music(state.music);
      if (!$('system').open && !locked) {
        if (node().value === 'char_intro_card') defer(() => nextEvent(), 1800);
        else schedule();
      }
    }
  });
  initCover();
  applyPrefs();
})();
