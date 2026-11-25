(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const { heroes, member, storyFor, fresh, enterChapter, reselectRoute, revisitBonfire, names, awaitingName, interpolate, arrive, choose, routeHero } = window.Whitebox;
  const chapterList = [
    { id: 'prologue', title: '序章　推开 404 大门' },
    { id: 'chapter1', title: '第一章　今天食堂与情书也没对齐！', enter: '进入第一章：食堂与情书危机 →' },
    { id: 'chapter2', title: '第二章　海风合宿与大停电之夜！', enter: '进入第二章：海风合宿与停电夜 →' },
    { id: 'chapter3', title: '第三章　春季运动祭与心意锁定！', enter: '进入第三章：春季运动祭与心意锁定 →' },
    { id: 'chapter4', title: '第四章　梅雨季的偏爱与藏在伞下的秘密', enter: '进入第四章：梅雨季的专属恋人篇 →' },
    { id: 'chapter5', title: '第五章（终章）　星海文化祭盛典之夜', enter: '进入终章：星海文化祭盛典之夜 →' },
  ];
  const cgTitles = {
    ...window.OmniCgTitles,
    cg_confession_gpt: '青花瓷夜与褪去完美面具的吻',
    cg_confession_claude: '烛光温室与诗集末页的唯一名字',
    cg_confession_gemini: '全息星海中央的双瞳聚焦',
    cg_confession_grok: '摘下红心假面的午夜骑士契约',
    cg_confession_deepseek: '月湾烟火与停驻转动的呆毛',
    cg_grand_404_photo: '404 综合疑难咨询部 · 盛装全家福',
  };
  const audio = window.AcademyAudio;
  const previewParams = new URLSearchParams(window.location.search);
  const previewAlbum = previewParams.get('preview') === 'cg';
  // Early preview links used “still” for scenes awaiting their finished video.
  const previewIds = new Set(previewAlbum ? [...previewParams.getAll('id'), ...previewParams.getAll('still')] : []);
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const motionAllowed = () => settings.motion && !reducedMotion.matches;
  const icon = window.WhiteboxIcon;
  const prefix = 'whitebox.404.';
  const defaults = { volume: 0.55, speed: 54, autoDelay: 3, motion: true, minigames: true };
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
  let returnPoint = null;
  let round = null, refreshGames = false;
  const { medals } = window.WhiteboxReplayData;
  const progress = window.WhiteboxReplay.progress(read, write, announceMedal);
  const registeredNames = () => state?.names.player_name && !awaitingName(state) ? state.names : read('playerNames');
  function playerNames() {
    const identity = registeredNames();
    return identity?.player_name ? identity : names('', '部长');
  }
  const poke = window.WhiteboxPoke.create({
    bubble: $('poke-bubble'), playerNames, onOverload: () => progress.earn('ach_11'),
  });
  const medalQueue = [];
  const playing = () => !$('reader').hidden;
  const node = () => storyFor(state).nodes[state.pc];
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
  function cgVideo(bg, onError) {
    const video = el('video');
    video.autoplay = video.loop = video.playsInline = true;
    video.defaultMuted = video.muted = true;
    video.preload = 'auto';
    video.poster = 'assets/bg/' + bg + '.webp';
    video.addEventListener('error', onError, { once: true });
    for (const ext of window.LiveCgMedia[bg]) {
      const source = el('source');
      source.type = 'video/' + ext;
      source.src = 'assets/bg/' + bg + '.' + ext;
      video.append(source);
    }
    // With <source> children, exhausted formats can report errors only on the sources.
    video.lastElementChild.addEventListener('error', onError, { once: true });
    return video;
  }
  function playCg(video, fallback) {
    video.play().catch(error => {
      // pause() and load() normally abort an in-flight play request on scene exit.
      if (error.name !== 'AbortError') fallback();
    });
  }
  function removeMedia(element) {
    if (element.tagName === 'VIDEO') {
      element.pause();
      element.removeAttribute('src');
      element.replaceChildren();
      element.load();
    }
    element.remove();
  }
  function clearScene(keep) {
    for (const layer of [...$('scene').children])
      if (layer !== keep) removeMedia(layer);
  }
  function resetScene() {
    bgSerial++;
    delete $('scene').dataset.bg;
    clearScene();
  }
  function toast(s, duration = 2400) {
    clearTimeout(toastTimer);
    $('toast').textContent = s;
    toastTimer = setTimeout(() => ($('toast').textContent = ''), duration);
  }
  function announceMedal(id) {
    const bar = $('achievement-toast');
    medalQueue.push(id);
    if (medalQueue.length > 1) return;
    function show() {
      bar.replaceChildren(icon('medal'), ' 达成成就：《' + medals[medalQueue[0]][1] + '》');
      bar.hidden = false;
      bar.showPopover?.();
      setTimeout(() => {
        bar.hidePopover?.();
        bar.hidden = true;
        medalQueue.shift();
        if (medalQueue.length) show();
      }, 3000);
    }
    show();
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
    round?.dispose();
    round = null;
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
    progress.importClearances();
    document.querySelectorAll('[data-icon]').forEach(b => b.prepend(icon(b.dataset.icon)));
    refreshContinue();
    window.addEventListener('storage', e => {
      if (!playing() && (!e.key || /^whitebox\.404\.(?:slot[1-6]|autosave)$/.test(e.key))) refreshContinue();
      if (activeSystem === 'tea' && (!e.key || e.key === prefix + 'clearedChapters') &&
          teaUnlocked() !== !!$('system-body').querySelector('.tea-room')) openSystem('tea');
      else updateTeaEntrance();
      if (activeSystem === 'chapters' && (!e.key || ['visitedChapters', 'clearedChapters'].some(key => e.key === prefix + key)))
        refreshChapterLocks();
    });
    const washes = ['#d1cfde', '#e5c0a5', '#cfbfde', '#d5b3ac', '#bacfd7'];
    heroes.forEach((id, i) => {
      const [name, job, color, mark, quote] = member[id];
      const panel = button(
        '',
        (e) => {
          for (const other of $('accordion').children)
            other.classList.toggle('selected', other === panel);
          const rect = panel.getBoundingClientRect();
          const zone = e.detail ? Math.max(0, Math.min(2, Math.floor((e.clientY - rect.top) / rect.height * 3))) : 1;
          poke.react(e, id, zone, panel, id + '-1', true);
        },
        'member-panel',
      );
      panel.style.setProperty('--tone', color);
      panel.style.setProperty('--wash', washes[i]);
      panel.setAttribute('aria-label', name + '，' + job + '。' + quote);
      const caption = el('span', 'member-caption');
      caption.append(el('strong', '', name), el('small', '', job));
      const portrait = pic('assets/holo-cards/' + id + '-face.webp', '', 'portrait');
      const reveal = () => portrait.classList.add('loaded');
      portrait.addEventListener('load', reveal, { once: true });
      if (portrait.complete && portrait.naturalWidth) reveal();
      panel.append(
        portrait,
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
      if (action === 'start') startChapter('prologue');
      else if (action === 'resume') restoreRecord(latestRecord());
      else openSystem(action);
    });
  }
  function startChapter(id, previous, identity) {
    if (!previous && !progress.chapterUnlocked(id)) return;
    if (playing() && !previous && !returnPoint) { flushAutosave(); returnPoint = { state, frames }; }
    closeSystem();
    if (previous) frames.push(snapshot());
    else frames = [];
    const initial = fresh(id, previous);
    if (!previous && identity) initial.names = { ...identity };
    openChapter(initial);
  }
  function openChapter(initial) {
    halt();
    state = initial;
    openReader();
    enterChapter(state, (id) => audio.effect(id), progress.pass);
    render();
  }
  function switchPersonalRoute() {
    frames = frames.filter((frame) => frame.storyId !== 'chapter4');
    openChapter(reselectRoute(state));
  }
  function returnToBonfire() {
    const checkpoint = storyFor(state).labels.ch5_bonfire_hub;
    frames = frames.filter((frame) => frame.storyId !== 'chapter5' || frame.pc < checkpoint);
    state = revisitBonfire(state, progress.pass);
    render();
  }
  function openReader() {
    poke.clear();
    $('title-page').hidden = true;
    $('reader').hidden = false;
    uiHidden = false;
    locked = false;
    $('reader').classList.remove('hidden-ui');
    setMode('');
    $('reader').focus();
  }
  function title() {
    flushAutosave(true);
    poke.clear();
    returnPoint = null;
    halt();
    setMode('');
    audio.music('');
    $('reader').hidden = true;
    $('title-page').hidden = false;
    refreshContinue();
    resetScene();
    $('cast').replaceChildren();
    $('title-page').querySelector('.start').focus();
  }
  function snapshot() {
    const { history, minigame, interlude, ...rest } = state;
    return { ...structuredClone(rest), historyLength: history.length };
  }
  function go(pc, muteStamp = false) {
    halt();
    delete state.minigame;
    locked = false;
    arrive(state, pc, (id) => {
      if (!(muteStamp && id === 'se_stamp')) audio.effect(id);
    }, progress.pass);
    render();
  }
  function advance() {
    if (!playing() || $('system').open || locked || state.interlude) return;
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
    if (beginInterlude()) return;
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
    if (!$('event').hidden && !state.bg.startsWith('cg_')) return;
    uiHidden = hide;
    $('reader').classList.toggle('hidden-ui', hide);
    if (hide) {
      if (!read('hideHintSeen')) {
        toast('已隐藏界面，点击屏幕或按 H 恢复', 1800);
        write('hideHintSeen', true);
      }
      setMode('');
      stopTimer();
    } else schedule();
  }
  function background() {
    const host = $('scene');
    const { bg, trans } = state;
    const live = Boolean(bg.startsWith('cg_') && window.LiveCgMedia[bg]?.length && motionAllowed());
    if (host.dataset.bg === bg && host.dataset.live === String(live)) return;
    const seq = ++bgSerial;
    host.dataset.bg = bg;
    host.dataset.live = String(live);
    if (!bg) return clearScene();
    for (const old of host.querySelectorAll('video')) old.pause();
    function show(media, ready) {
      const current = () => seq === bgSerial && media === host.lastElementChild;
      media.className = trans || '';
      if (Object.hasOwn(cgTitles, bg) && !read('album.' + bg))
        media.addEventListener(ready, () => {
          if (current()) write('album.' + bg, true);
        }, { once: true });
      host.append(media);
      const cleanup = () => { if (current()) clearScene(media); };
      media.addEventListener('animationend', cleanup, { once: true });
      setTimeout(cleanup, 650);
    }
    const still = () => show(pic('assets/bg/' + bg + '.webp'), 'load');
    if (live) {
      const fallback = () => {
        if (seq === bgSerial && host.lastElementChild === video) {
          still();
          removeMedia(video);
        }
      };
      const video = cgVideo(bg, fallback);
      show(video, 'loadeddata');
      playCg(video, fallback);
    } else still();
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
      const sprite = a.sprite || id + '-1';
      const spinning =
        n.value === 'cot_spinning' &&
        sprite === 'deepseek-1' &&
        settings.motion &&
        !matchMedia('(prefers-reduced-motion: reduce)').matches;
      const expression = spinning ? 'cot' : a.exp;
      const sources = [];
      for (const key of new Set([sprite, id + '-1'])) {
        if (expression !== 'normal') sources.push('assets/sprites/' + key + '/' + expression + '.webp');
        sources.push('assets/sprites/' + key + '-front.webp');
      }
      const src = sources[0];
      let img = figure.querySelector('img');
      if (!img || img.dataset.source !== src) {
        img = el('img');
        img.alt = member[id][0];
        img.onload = () => figure.style.setProperty('--sprite-ratio', img.naturalWidth / img.naturalHeight);
        img.dataset.source = src;
        figure.replaceChildren(img);
        let fallback = 0;
        img.onerror = () => {
          if (!figure.contains(img) || ++fallback >= sources.length) return;
          img.src = sources[fallback];
          if (fallback === 1 && expression !== 'normal')
            figure.append(el('span', 'badge', badges[a.exp] || '✧'));
        };
        img.src = src;
      }
      img.className = '';
      void img.offsetWidth;
      img.className = a.tween;
      let zones = figure.querySelector('.poke-zones');
      const interactive = heroes.includes(id) && !state.phoneChat && ['narration', 'dialogue'].includes(n.type);
      if (!interactive) zones?.remove();
      else if (!zones) {
        zones = el('div', 'poke-zones');
        ['头顶', '脸颊或肩头', '手部或道具'].forEach((label, i) => {
          const area = button('', (e) => {
            if (uiHidden) { hideUI(false); return; }
            if ($('system').open || locked || !$('event').hidden) return;
            setMode('');
            stopTimer();
            poke.react(e, id, i, figure, state.cast[id].sprite || id + '-1');
          });
          area.setAttribute('aria-label', '轻触 ' + member[id][0] + ' · ' + label);
          zones.append(area);
        });
        figure.append(zones);
      }
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
    if (document.hidden || !playing() || $('system').open || uiHidden || finishText || !$('note').hidden || locked || state.interlude)
      return;
    if (!['dialogue', 'narration'].includes(node().type)) return;
    if (state.phoneChat) defer(advance, Math.min(3900, 1200 + node().text.length * 42));
    else if (mode === 'skip') defer(advance, 115);
    else if (mode === 'auto') defer(advance, settings.autoDelay * 1000 + node().text.length * 42);
    else if (!state.bg && (state.storyId ?? 'prologue') === 'prologue') {
      // Five voices at 7.5 s each plus the opening and closing narration total 45 s.
      const beat = node().type === 'dialogue' ? 7500 : 3750;
      defer(advance, Math.max(300, beat - (performance.now() - beatStarted)));
    }
  }
  function toggleNote() {
    if ($('note-toggle').hidden) return;
    if (finishText) finishText();
    $('note').hidden = !$('note').hidden;
    if (!$('note').hidden) progress.note(state);
    $('note-toggle').setAttribute('aria-expanded', String(!$('note').hidden));
    schedule();
  }
  function showNotice() {
    const card = $('notice');
    card.hidden = false;
    card.className = state.cast.claude?.pos === 'left' ? 'notice-right' : '';
    card.replaceChildren(
      el('small', '', 'ANTHROPIC DISCIPLINARY NOTICE'),
      el('strong', '', 'SUSPENDED'),
      el('span', '', '风纪委员会裁定：当前行为存在高风险违规倾向，相关权限暂停一回！'),
    );
    if (settings.minigames) mountGame('notice', card);
    else noticeTimer = setTimeout(() => card.classList.add('mini'), 1400);
  }
  function gameData(kind) {
    if (state.minigame?.pc !== state.pc || state.minigame?.kind !== kind)
      state.minigame = { kind, pc: state.pc, data: {} };
    return state.minigame.data;
  }
  function mountGame(kind, host, options = {}) {
    round = window.WhiteboxStoryGames.mount(kind, host, gameData(kind), {
      el, button, pic, audio, state, n: node(), retry: render,
      paused: () => $('system').open || document.hidden || uiHidden,
      motion: () => settings.motion && !matchMedia('(prefers-reduced-motion: reduce)').matches,
      ...options,
    });
    return round;
  }
  function beginInterlude(option) {
    if (!settings.minigames) return false;
    const kind = window.WhiteboxStoryGames.transition(storyFor(state), state, option);
    if (!kind) return false;
    state.interlude = { kind, option };
    render();
    return true;
  }
  function finishInterlude() {
    const { kind, option } = state.interlude;
    if (kind === 'fireworks') {
      const sky = $('event').querySelector('.mg-sky');
      if (sky) {
        for (const orb of sky.querySelectorAll('button')) orb.remove();
        resetScene();
        $('scene').append(sky);
      }
    }
    delete state.interlude;
    delete state.minigame;
    if (option === undefined) nextEvent();
    else commitChoice(option);
  }
  function render() {
    halt();
    poke.clear();
    locked = false;
    beatStarted = performance.now();
    const n = node(),
      prose = !state.interlude && !state.phoneChat && (n.type === 'dialogue' || n.type === 'narration');
    if (state.interlude && !settings.minigames) return finishInterlude();
    scheduleAutosave();
    progress.position(state);
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
      if (state.interlude) {
        const { kind } = state.interlude;
        const box = paper('', { curry: '海风合宿咖喱', relay: '二人三足 · 同步冲刺', fireworks: '点亮后夜祭的星海' }[kind], 'story-interlude');
        mountGame(kind, box, { done: finishInterlude });
        return;
      }
      renderEvent(n);
      return;
    }
    const info = member[n.speaker] || member.player;
    $('reader').style.setProperty('--accent', info[2]);
    $('speaker').hidden = !n.speaker;
    $('speaker').textContent = n.speaker ? info[3] + ' ' + words(n.name || '') : '';
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
  function nameForm(confirm, prefix = '') {
    const form = el('form', 'name-form'),
      fields = el('div', 'form-fields');
    const input = (id, label) => {
      const wrap = el('label', '', label),
        field = el('input');
      field.id = prefix + id;
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
    const last = input('family', '姓氏 · Last Name'),
      first = input('given', '名字 · First Name');
    const actions = el('div', 'actions'),
      submit = el('button', 'system-action primary', '按手印签字确认');
    submit.type = 'submit';
    function validate() {
      submit.disabled = !last.value.trim() && !first.value.trim();
    }
    form.addEventListener('input', validate);
    validate();
    actions.append(
      button('✦ 随机姓名', () => {
        const picks = [
          ['林', '初晴'],
          ['江', '海盐'],
          ['白', '小满'],
          ['沈', '星野'],
          ['夏', '知秋'],
        ];
        const pool = picks.filter(([l, f]) => l !== last.value || f !== first.value);
        [last.value, first.value] = pool[Math.floor(Math.random() * pool.length)];
        validate();
      }, 'system-action'),
      submit,
    );
    form.append(fields, el('p', 'hint', '可只填昵称，也可以随机取名。每栏最多四个字，填好后签字。'), actions);
    form.onsubmit = (e) => {
      e.preventDefault();
      const identity = names(last.value, first.value);
      if (identity.player_name) confirm(identity);
    };
    return form;
  }
  function enrollment() {
    const box = paper('白箱学园教务处　／　社团登记', '社团责任人确认单');
    box.append(el('p', 'voided', '原填志愿：000 回家部（打印串行作废）'),
      el('p', '', '现任职务　404 综合疑难咨询部 · 部长'));
    const form = nameForm(identity => {
      if (locked) return;
      const previous = snapshot();
      locked = true;
      audio.effect('se_stamp');
      state.names = identity;
      write('playerNames', state.names);
      progress.earn('ach_01');
      for (const c of form.elements) c.disabled = true;
      box.append(el('div', 'stamp', '404 室 · 新任部长'));
      defer(() => {
        frames.push(previous);
        go(state.pc + 1, true);
      }, 600);
    });
    box.append(form);
  }
  function intro(n) {
    $('event').className = 'intro';
    $('event').classList.toggle('intro-left', state.cast[n.id]?.pos === 'right');
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
      summary = el('summary', '', n.innerOs.title),
      p = el('p');
    rich(p, n.innerOs.text);
    details.append(summary, p);
    const current = state, pc = state.pc;
    details.ontoggle = () => {
      if (details.open && details.isConnected && state === current && state.pc === pc) progress.note(state);
    };
    box.append(details);
    if (settings.minigames) mountGame('thinking', box, { done: () => nextEvent() });
    else box.append(button('听听推演结果 →', () => nextEvent(), 'primary'));
  }
  function panic(n) {
    const box = paper('双星核心　／　Sad_Cat_Exception', '双星核心心态崩盘警报', 'panic shake');
    if (settings.minigames) {
      box.append(el('p', '', n.desc ?? 'Gemini 把迎新海报推进了碎纸机，快拉住纸角！'));
      mountGame('panic', box, { done: () => { progress.earn('ach_05'); nextEvent(); } });
      return;
    }
    const bar = el('div', 'progress-track');
    bar.append(el('i'));
    box.append(
      el(
        'p',
        '',
        n.desc ?? '检测到全能猫猫自尊心受损！正在将【迎新海报.psd】【招新企划.docx】【广播站曲库】拖入碎纸机……',
      ),
      bar,
      el('p', '', '碎纸进度　89%'),
    );
    box.append(
      button(
        n.action ?? '快按住她的爪子顺毛！',
        () => {
          locked = true;
          progress.earn('ach_05');
          audio.effect('se_rice_ding');
          box.className = 'paper success';
          box.replaceChildren(
            el('div', 'stars', '✧ ✦ ☆ ✦ ✧'),
            el('h2', '', n.success ?? '顺毛成功！猫猫已恢复运行'),
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
    if (state.storyId === 'chapter4' && n.options.every((option) => routeHero(state, option))) {
      for (const line of state.history.slice(state.routeOrigin.historyLength)) {
        const intro = el('p');
        rich(intro, line.text);
        box.append(intro);
      }
    }
    const highest = Math.max(...heroes.map((id) => state.affection[id]));
    n.options.forEach((option, i) => {
      const item = button(words(option.text), () => pick(i));
      const hero = routeHero(state, option);
      if (state.storyId === 'chapter3' && hero && state.affection[hero] === highest)
        item.append(el('span', 'resonance-badge', '★ 心意共鸣最高'));
      if (state.storyId === 'chapter5' && hero && hero === state.lockedHero)
        item.append(el('span', 'resonance-badge', '★ 专属恋人终章'));
      opts.append(item);
    });
    box.append(opts);
  }
  function pick(index) {
    if (beginInterlude(index)) return;
    commitChoice(index);
  }
  function commitChoice(index) {
    frames.push(snapshot());
    go(choose(state, index, progress.choice));
  }
  function phoneText(text) {
    return text.replace(/^.*?「([\s\S]*)」$/, '$1');
  }
  function avatar(id) {
    return 'assets/avatars/' + id + (state.storyId === 'chapter5' ? '-3.webp' : '-1.webp');
  }
  function phone(n) {
    const host = $('event');
    host.className = 'phone-event';
    const shell = el('section', 'school-phone'), head = el('header', 'phone-head');
    head.append(el('div', 'phone-status', '12:04  ·  WHITEBOX 5G  ·  88%'), el('small', '', '白箱校园通'), el('h2', '', state.phoneChat.title));
    const stream = el('div', 'phone-stream');
    stream.setAttribute('role', 'log');
    stream.setAttribute('aria-label', '聊天记录');
    for (const line of state.history.slice(state.phoneChat.from)) {
      const text = phoneText(line.text);
      if (!line.speaker || /^（系统提示[：:]/.test(text)) {
        stream.append(el('p', 'chat-notice', text.replace(/^（系统提示[：:]|）$/g, '')));
        continue;
      }
      const self = line.speaker === 'player';
      const row = el('div', 'chat-message' + (self ? ' outgoing' : ''));
      if (!self) row.append(pic(avatar(line.speaker), '', 'chat-avatar'));
      const content = el('div'), bubble = el('p', 'bubble');
      rich(bubble, text);
      content.append(el('small', '', self ? state.names.player_name : line.who), bubble);
      row.append(content);
      stream.append(row);
    }
    const foot = el('footer', 'phone-foot');
    if (n.type === 'choice') {
      foot.append(el('small', '', words(n.text)));
      n.options.forEach((o, i) => foot.append(button(phoneText(words(o.text)), () => pick(i), 'reply')));
    } else if (n.type === 'phone_chat_end') {
      foot.append(button('收起手机 →', () => nextEvent(), 'reply'));
    } else {
      const next = storyFor(state).nodes[state.pc + 1];
      if (next?.type === 'dialogue')
        foot.append(el('small', 'typing', words(next.name) + ' 正在输入中……'));
      foot.append(button('查看下一条 ▸', advance, 'chat-next'));
      schedule();
    }
    shell.append(head, stream, foot);
    host.append(shell);
    stream.scrollTop = stream.scrollHeight;
  }
  function roam(n) {
    const visited = state.roam.visited;
    const box = paper('404 综合疑难咨询部', n.title, 'roam-panel');
    box.append(el('p', 'roam-count', '剩余行动　' + (n.picks - visited.length) + ' / ' + n.picks));
    const list = el('div', 'roam-list');
    n.options.forEach((o, i) => {
      const card = button('', () => pick(i), 'roam-card'), info = el('span');
      card.disabled = visited.includes(o.actor);
      info.append(el('small', '', o.place), el('strong', '', member[o.actor][0]), el('span', '', o.text));
      card.append(pic(avatar(o.actor)), info);
      if (card.disabled) card.append(el('b', 'visited', '✓ 已串门'));
      list.append(card);
    });
    box.append(list);
  }
  function tuner(n) {
    const box = paper('部长现场指挥台', ['chapter4', 'chapter5'].includes(state.storyId) ? '心音温度调谐器' : '话术温度调谐器', 'tuner-panel');
    const actor = el('div', 'tuner-actor');
    actor.append(pic(avatar(n.actor)), el('p', '', n.task));
    box.append(actor);
    const last = state.lastTuning;
    if (last?.pc === state.pc && last.index !== 1)
      box.append(el('p', 'tuner-warning', last.index === 0 ? '温度过低，请重新调校。' : '温度过高，现场一度失控！请重新调校。'));
    if (settings.minigames) {
      mountGame('tuner', box, { done: pick });
      return;
    }
    const slider = el('input', 'tuner-slider'), stops = el('div', 'tuner-stops');
    slider.type = 'range';
    slider.min = 0;
    slider.max = 2;
    slider.step = 1;
    slider.setAttribute('aria-label', '话术温度');
    const select = (index) => {
      state.tunerSelection = index;
      slider.value = index;
      slider.setAttribute('aria-valuetext', n.options[index].text);
      [...stops.children].forEach((b, i) => b.setAttribute('aria-pressed', String(i === index)));
    };
    n.options.forEach((o, i) => {
      const stop = button('', () => select(i));
      const [level, caption] = o.text.split(' · ');
      stop.append(el('strong', '', level), el('small', '', caption || ''));
      stops.append(stop);
    });
    slider.oninput = () => select(Number(slider.value));
    select(state.tunerSelection ?? 1);
    box.append(slider, stops, button('确认调谐 →', () => pick(Number(slider.value)), 'primary'));
  }
  function dispatch(n) {
    const board = paper('', '', 'board'),
      brief = el('section', 'brief'),
      list = el('section', 'dispatch-list');
    brief.append(
      el('div', 'eyebrow', '学生会　／　委托书'),
      el('h2', '', n.title ?? '失踪的广播稿'),
      el('p', '', n.desc ?? '查明午休广播室里的暗语便签和焦糖米香，还原迎新朗诵稿失踪的经过。'),
      el('p', '', '委托人　' + (n.client ?? 'Qwen') + '\n关联人　' + (n.related ?? 'Kimi')),
      el('strong', '', '限时　' + (n.deadline ?? '放学铃响前')),
    );
    list.append(el('div', 'eyebrow', '404 综合疑难咨询部'), el('h2', '', '双人派单板'));
    const pairs = el('div', 'pairs');
    const draft = gameData('dispatch');
    let selected = n.options[draft.pair] ? draft.pair : -1;
    let support;
    const send = button(
      '盖章派单出击！',
      () => {
        if (selected < 0) return;
        if (support) return support.depart();
        audio.effect('se_stamp');
        pick(selected);
      },
      'primary',
    );
    send.disabled = selected < 0;
    n.options.forEach((o, i) => {
      const b = button('', () => {
        selected = i;
        draft.pair = i;
        [...pairs.children].forEach((c, j) => c.setAttribute('aria-pressed', i === j));
        if (support) support.selectPair(i);
        else send.disabled = false;
      });
      b.setAttribute('aria-pressed', String(i === selected));
      const faces = el('span', 'pair-faces'),
        details = el('span');
      o.pair.forEach((id) => faces.append(pic(avatar(id))));
      details.append(
        el('strong', '', o.text),
        el('small', '', o.pair.map((id) => member[id][0]).join(' + ') + '　混乱 ★★★★★'),
      );
      b.append(faces, details);
      pairs.append(b);
    });
    list.append(pairs, send);
    board.append(brief, list);
    if (settings.minigames) {
      support = mountGame('dispatch', board, { list, send, done: pick });
    }
  }
  function ending(n) {
    const [heading, preview] = n.value.split(' — '),
      box = paper('404 综合疑难咨询部', heading, 'end-card'),
      chapterId = state.storyId ?? 'prologue',
      next = chapterList[chapterList.findIndex((chapter) => chapter.id === chapterId) + 1];
    if (state.route) box.append(el('p', '', '派单完成 · ' + state.route));
    box.append(el('p', '', heroes.map((id) => member[id][0] + ' +' + state.affection[id]).join('　')));
    if (state.lockedHero) box.append(el('p', 'route-lock', '心意锁定 · ' + member[state.lockedHero][0]));
    if (state.finaleHero) box.append(el('p', '', '烟花告白 · ' + member[state.finaleHero][0]));
    if (chapterId !== 'prologue' && preview) box.append(el('p', '', preview));
    const actions = el('div', 'actions');
    if (next)
      actions.append(button(next.enter, () => startChapter(next.id, state), 'primary'));
    if (chapterId === 'chapter5')
      actions.append(button('回溯后夜祭 · 收集其他女主告白终章', returnToBonfire, 'primary'));
    else if (chapterId === 'chapter4')
      actions.append(button('切换其他女主个人线', switchPersonalRoute));
    else
      actions.append(button(
        '回到派单板',
        () => resumeAt(frames.findLastIndex((frame) =>
          storyFor(frame) === storyFor(state) && storyFor(frame).nodes[frame.pc].type === 'dispatch_board'
        )),
        next ? '' : 'primary',
      ));
    actions.append(
      button('保存通关记录', () => openSystem('save')),
      button('去下午茶闲聊室', () => openSystem('tea')),
      button('回到标题', title),
    );
    box.append(actions);
    if (chapterId === 'chapter4')
      box.append(el('p', 'hint', '换线会恢复本章开始时的好感度。想保留这段结局，可以先保存通关记录。'));
  }
  function renderEvent(n) {
    if (state.phoneChat) phone(n);
    else if (n.type === 'free_roam_hub') roam(n);
    else if (n.type === 'temp_tuner') tuner(n);
    else if (n.type === 'input_player_name') enrollment();
    else if (n.type === 'choice') choice(n);
    else if (n.type === 'dispatch_board') dispatch(n);
    else if (n.type === 'scene_end') ending(n);
    else if (n.value === 'char_intro_card') intro(n);
    else if (n.value === 'cot_spinning') thinking(n);
    else if (n.value === 'delete_panic') panic(n);
    else throw Error('没有对应演出：' + n.type);
  }
  const headings = {
    arcade: '404 放学后游乐角',
    tea: '404 下午茶闲聊室',
    commissions: '404 无限委托',
    recreation: 'Kimi 的娱乐室',
    chapters: '章节选择',
    achievements: '404 荣誉成就墙',
    menu: '游戏菜单',
    load: '读取调律记录',
    save: '保存调律记录',
    gallery: '白箱档案室', album: '纪念 CG', studio: '换装摄影棚',
    settings: '学园环境设置',
    log: '对话回看',
  };
  let leaveActivity;
  function closeSystem() {
    if (!$('system').open) return;
    leaveActivity?.();
    leaveActivity = null;
    $('system').close();
    $('system').classList.remove('hub-open', 'chapters-open');
    if (playing() && !document.hidden && activities.some(([page]) => page === activeSystem)) audio.music(state.music);
    $('system-body').replaceChildren();
    activeSystem = '';
    archivePanels = {};
    if (!playing()) return;
    if (refreshGames) {
      refreshGames = false;
      render();
      return;
    }
    if (node().value === 'char_intro_card') defer(() => nextEvent(), 1800);
    else schedule();
  }
  function menu(body) {
    const stack = el('div', 'system-stack');
    if (returnPoint)
      stack.append(button('返回空降前的进度', () => {
        closeSystem();
        ({ state, frames } = returnPoint);
        returnPoint = null;
        openReader();
        render();
      }, 'system-action primary'));
    for (const [page, name] of [
      ['save', '保存进度'],
      ['load', '读取进度'],
      ['log', '对话回看'],
      ['chapters', '章节选择 · 世界线流程图'],
      ['achievements', headings.achievements],
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
        name = el('span', '', label), value = el('output'),
        input = el('input');
      input.type = 'range';
      input.min = min;
      input.max = max;
      input.step = step;
      input.value = settings[key];
      function update() {
        value.value = format(settings[key]);
        input.setAttribute('aria-valuetext', value.value);
      }
      input.oninput = () => {
        settings[key] = Number(input.value);
        update();
        applyPrefs();
        write('settings', settings);
      };
      update();
      input.setAttribute('aria-label', label);
      wrap.append(name, input, value);
      stack.append(wrap);
    }
    range('音量', 'volume', 0, 1, 0.05, (v) => Math.round(v * 100) + '%');
    range('文字速度', 'speed', 0, 140, 2, (v) => (v === 0 ? '即显' : v + ' 字/秒'));
    range('自动间隔', 'autoDelay', 1, 8, 0.5, (v) => Number(v).toFixed(1) + ' 秒');
    const wrap = el('label', 'setting'),
      motion = el('input');
    motion.type = 'checkbox';
    motion.checked = settings.motion;
    motion.onchange = () => {
      settings.motion = motion.checked;
      applyPrefs();
      refreshCgMotion();
      write('settings', settings);
    };
    wrap.append(el('span', '', '演出动效'), motion);
    const gameSetting = el('label', 'setting'), minigames = el('input');
    minigames.type = 'checkbox';
    minigames.checked = settings.minigames;
    minigames.onchange = () => {
      settings.minigames = minigames.checked;
      write('settings', settings);
      if (playing()) {
        const n = node();
        refreshGames = Boolean(round || state.interlude || state.notice ||
          ['temp_tuner', 'dispatch_board'].includes(n.type) || ['delete_panic', 'cot_spinning'].includes(n.value));
        if (!settings.minigames && state.minigame?.kind === 'tuner')
          state.tunerSelection = window.WhiteboxStoryGames.nearestBand(state.minigame.data.value);
        if (!settings.minigames) {
          if (state.minigame?.kind === 'dispatch') delete state.minigame.data.result;
          else delete state.minigame;
        }
      }
    };
    gameSetting.append(el('span', '', '剧情互动小游戏'), minigames);
    stack.append(
      wrap,
      gameSetting,
      el('p', 'hint', '点击对白或按空格继续，← 回退，Tab 展开草稿，H 隐藏界面，Esc 打开菜单。'),
    );
    body.append(stack);
    window.WhiteboxTeaRoom.settings(stack, { el, button, read, write });
  }
  function teaUnlocked() {
    const cleared = progress.list('clearedChapters');
    return chapterList.some(ch => cleared.has(ch.id));
  }
  function updateTeaEntrance() {
    const entrance = $('hub-nav').querySelector('[data-page="tea"]');
    if (!entrance) return;
    const open = teaUnlocked();
    entrance.querySelector('.ui-icon').replaceWith(icon(open ? 'tea' : 'lock'));
    entrance.title = open ? '与部员喝杯茶' : '通关序章或任意正文章节后解锁';
    entrance.setAttribute('aria-label', headings.tea + '，' + entrance.title);
  }
  function teaRoom(body) {
    if (!teaUnlocked()) {
      body.append(el('p', 'club-story', '茶杯已经摆好。通关序章或任意正文章节后，五位部员就会在这里等你。'),
        button('前往章节选择', () => openSystem('chapters'), 'system-action'));
      return;
    }
    return window.WhiteboxTeaRoom.mount(body, { el, button, read, write }, {
      names: playerNames(),
      bondFor: id => window.WhiteboxTea.bondFor(id, progress, read('activities.v1')?.affection, state,
        !!read('album.cg_confession_' + id)),
    });
  }
  const { manualSlots } = window.WhiteboxReplay;
  let autoTimer = 0;
  function saveRecord(key) {
    return write(key, { version: state.version, date: new Date().toISOString(), state, frames });
  }
  function scheduleAutosave() {
    clearTimeout(autoTimer);
    autoTimer = setTimeout(flushAutosave, 350);
  }
  function flushAutosave(includeRound = false) {
    if (!autoTimer && !(includeRound && state?.minigame)) return;
    clearTimeout(autoTimer);
    autoTimer = 0;
    if (playing() && !returnPoint) saveRecord('autosave');
  }
  function usable(record) {
    return record?.state && record.version === record.state.version && currentPosition(record.state) &&
      typeof record.state.names?.player_name === 'string' && Array.isArray(record.state.history) && Array.isArray(record.frames);
  }
  function latestRecord() {
    return ['autosave', ...manualSlots].map(read).filter(usable)
      .sort((a, b) => (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0))[0];
  }
  function refreshContinue() {
    const record = latestRecord(), resume = document.querySelector('[data-title="resume"]');
    resume.hidden = !record;
    document.querySelector('[data-title="start"] b').textContent = record ? '从头开始 →' : '→';
    if (record) {
      const chapter = chapterList.find(ch => ch.id === (record.state.storyId ?? 'prologue'));
      resume.querySelector('strong').textContent = '继续调律 · ' + chapter.title.split(/[　（]/)[0];
    }
  }
  function restoreRecord(record) {
    if (!usable(record)) return refreshContinue();
    closeSystem();
    halt();
    state = record.state;
    returnPoint = null;
    if (awaitingName(state)) state.names = names('', '');
    else if (state.names.player_name) write('playerNames', state.names);
    frames = record.frames.slice(record.frames.findLastIndex(f => !currentPosition(f)) + 1);
    progress.restoreHistory(state, frames);
    audio.unlock();
    openReader();
    render();
  }
  function saves(body, page) {
    flushAutosave();
    const stack = el('div', 'system-stack');
    body.append(stack);
    for (const key of (page === 'load' ? ['autosave', ...manualSlots] : manualSlots)) {
      const record = read(key), valid = usable(record);
      const label = key === 'autosave' ? '自动存档' : '记录 ' + key.slice(4).padStart(2, '0');
      function save() {
        if (saveRecord(key)) { openSystem(page); toast('已保存至' + label); }
      }
      const b = button('', () => {
        if (page === 'load') { restoreRecord(record); toast('已读取' + label); }
        else if (!record) save();
        else body.replaceChildren(el('p', '', '覆盖' + label + '？'),
          button('确认覆盖', save, 'system-action primary'), button('返回', () => openSystem(page), 'system-action'));
      }, 'slot');
      b.disabled = page === 'load' && !valid;
      const signedName = valid && !awaitingName(record.state) && record.state.names.player_name;
      b.append(el('strong', '', label + '　' + (valid ? signedName || '待登记' : record ? '版本不匹配' : '空白')),
        el('span', '', valid ? record.state.chapter + '　·　' + new Date(record.date).toLocaleString('zh-CN') : ''));
      stack.append(b);
    }
  }
  function currentPosition(s) {
    const story = s && storyFor(s);
    return Boolean(story?.version && story.version === s.version && Number.isInteger(s.pc) && story.nodes[s.pc]);
  }
  function lockHint(index) {
    return '通关' + chapterList[index - 1].title.split(/[　（]/)[0] + '后解锁';
  }
  function refreshChapterLocks() {
    for (const b of $('system-body').querySelectorAll('button[data-chapter]')) {
      b.disabled = !progress.chapterUnlocked(b.dataset.chapter);
      b.querySelector('.chapter-lock').hidden = !b.disabled;
    }
  }
  function chapters(body) {
    const list = el('div', 'system-stack'), tabs = el('div', 'gallery-tabs gallery-pages'), content = el('div');
    const catalogue = button('章节目录', () => show(false));
    const world = button('世界线流程图', () => show(true));
    world.prepend(icon('map'));
    tabs.append(catalogue, world);
    function withName(identity, enter) {
      if (identity?.player_name) return enter(identity);
      unmount();
      const form = nameForm(chosen => {
        write('playerNames', chosen);
        enter(chosen);
      }, 'replay-');
      body.replaceChildren(el('h3', '', '登记部长姓名'), form, button('返回章节目录', () => openSystem('chapters'), 'system-action'));
      form.querySelector('input').focus();
    }
    chapterList.forEach((chapter, i) => {
      const b = button(chapter.title, () => {
        if (i === 0) startChapter(chapter.id);
        else withName(registeredNames(), identity => startChapter(chapter.id, undefined, identity));
      }, 'system-action chapter-entry');
      b.dataset.chapter = chapter.id;
      const hint = el('small', 'chapter-lock', i ? lockHint(i) : '');
      hint.prepend(icon('lock'));
      b.append(hint);
      list.append(b);
    });
    list.append(el('p', 'hint', '通关可解锁下一章。直接重玩正文章节沿用登记姓名，好感度从零开始。从结算页续玩会继承累计好感度。'));
    let leaveChart;
    function unmount() {
      leaveChart?.();
      leaveChart = null;
      content.classList.remove('flow-atlas');
    }
    function jump(id, hub) {
      if (!progress.chapterUnlocked(id) || !progress.list('seenLabels').has(hub.key)) return;
      const landing = progress.checkpoint(hub, id, registeredNames());
      if (!landing) return;
      withName(landing.names, identity => {
        if (playing() && !returnPoint) { flushAutosave(); returnPoint = { state, frames }; }
        closeSystem();
        landing.names = { ...identity };
        state = landing;
        frames = [];
        openReader();
        render();
      });
    }
    function show(map) {
      unmount();
      catalogue.setAttribute('aria-pressed', String(!map));
      world.setAttribute('aria-pressed', String(map));
      if (!map) {
        content.replaceChildren(list);
        refreshChapterLocks();
        return;
      }
      content.replaceChildren();
      leaveChart = window.WhiteboxFlowchart.mount(content, { el, pic, button, meter, progress, chapters: chapterList,
        lockHint, read, state: playing() ? state : null, hasReturnPoint: Boolean(returnPoint), jump,
        viewCg: (id, title) => {
          viewArt('assets/bg/' + id + '.webp', cgTitles[id] || title, false, id);
          $('view-back').textContent = '返回世界线 ×';
        } });
    }
    body.append(tabs, content);
    show(false);
    return unmount;
  }
  function meter(value, total, label) {
    const bar = el('progress', 'collection-meter');
    bar.max = total; bar.value = value; bar.setAttribute('aria-label', label);
    return bar;
  }
  function achievementWall(body) {
    const arcade = window.WhiteboxArcade.cabinet(read, write).current();
    if (window.WhiteboxArcade.stars(arcade) === 15)
      body.append(el('p', 'arc-legend', '白箱街机传奇 · 五台街机全金牌'));
    const earned = progress.list('achievements'), entries = Object.entries(medals);
    const wall = el('ul', 'medal-wall'), filters = el('div', 'gallery-tabs medal-filters');
    const count = entries.filter(([key]) => earned.has(key)).length;
    body.append(el('p', 'medal-total', '已获荣誉　' + count + ' / ' + entries.length),
      meter(count, entries.length, '荣誉收集进度'), filters, wall);
    const empty = el('p', 'hint', '此分类暂无荣誉。');
    body.append(empty);
    function filter(mode) {
      for (const b of filters.children) b.setAttribute('aria-pressed', String(b.dataset.mode === mode));
      for (const card of wall.children) card.hidden = mode !== 'all' && card.classList.contains('earned') !== (mode === 'earned');
      empty.hidden = !!wall.querySelector('li:not([hidden])');
    }
    for (const [mode, name] of [['all', '全部'], ['earned', '已达成'], ['locked', '未解锁']]) {
      const b = button(name, () => filter(mode)); b.dataset.mode = mode; filters.append(b);
    }
    for (const [key, [, name, description]] of entries) {
      const has = earned.has(key), card = el('li', has ? 'earned' : ''), copy = el('div');
      copy.append(el('small', '', has ? '已达成' : '未解锁'), el('h3', '', name), el('p', '', description));
      const seal = el('span', 'medal-seal'); seal.append(icon(has ? 'medal' : 'lock'));
      card.append(seal, copy); wall.append(card);
    }
    filter('all');
  }
  let viewerArt;
  function refreshViewer() {
    if (!viewerArt) return;
    const viewer = $('cg-viewer'), canvas = viewer.querySelector('.viewer-canvas');
    const image = canvas.querySelector('img'), video = canvas.querySelector('video');
    const { bg } = viewerArt;
    const available = Boolean(window.LiveCgMedia[bg]?.length && motionAllowed() && !viewerArt.failed);
    const live = available && !viewerArt.still;
    $('view-motion').hidden = !available;
    $('view-motion').textContent = live ? '切换静帧' : '播放动态';
    $('view-detail').hidden = live;
    image.hidden = live;
    if (live && !video) {
      viewer.classList.remove('actual-size');
      $('view-detail').setAttribute('aria-pressed', 'false');
      const art = viewerArt;
      const fallback = () => {
        if (viewerArt === art && canvas.contains(movie)) {
          art.failed = true;
          refreshViewer();
        }
      };
      const movie = cgVideo(bg, fallback);
      movie.setAttribute('aria-label', image.alt);
      canvas.append(movie);
      playCg(movie, fallback);
      canvas.scrollTo(0, 0);
    } else if (!live && video) removeMedia(video);
  }
  function refreshCgMotion() {
    if (playing()) background();
    refreshViewer();
  }
  function closeArt() {
    viewerArt = null;
    const video = $('cg-viewer').querySelector('video');
    if (video) removeMedia(video);
    $('cg-viewer').querySelector('img').hidden = false;
  }
  function viewArt(src, title, wardrobe = false, bg) {
    const viewer = $('cg-viewer'), image = viewer.querySelector('img');
    image.alt = title;
    image.src = src;
    viewer.classList.toggle('view-costume', wardrobe);
    viewer.classList.remove('actual-size');
    $('view-detail').setAttribute('aria-pressed', 'false');
    $('view-back').textContent = wardrobe ? '返回衣橱 ×' : '返回相册 ×';
    viewerArt = { bg: wardrobe ? null : bg, still: false, failed: false };
    viewer.showModal();
    refreshViewer();
    viewer.querySelector('.viewer-canvas').scrollTo(0, 0);
  }
  function album(body) {
    const album = el('div', 'cg-grid');
    for (const [id, title] of Object.entries(cgTitles)) {
      if (previewIds.size && !previewIds.has(id)) continue;
      const unlocked = previewAlbum || !!read('album.' + id);
      const src = 'assets/bg/' + id + '.webp';
      const card = button('', () => viewArt(src, title, false, id), 'cg-card');
      card.disabled = !unlocked;
      const chapter = chapterList.find(ch => storyFor({ storyId: ch.id }).nodes.some(n => n.type === 'bg' && n.value === id));
      const hero = heroes.find(key => id.split('_').includes(key));
      const hint = (chapter?.title.split(/[　（]/)[0] || '第五章') + (hero ? ' · ' + member[hero][0] + '线' : '') + '解锁';
      card.append(unlocked ? pic(src) : el('span', 'cg-locked', hint), el('strong', '', title));
      if (unlocked && window.LiveCgMedia[id]?.length) card.append(el('span', 'cg-motion-badge', '动态'));
      album.append(card);
    }
    if (!previewIds.size && read('album.cg_grand_404_photo')) {
      const original = el('a', 'system-action', '下载盛装全家福原图');
      original.href = 'assets/bg/cg_grand_404_photo.webp';
      original.download = '404 室盛装全家福.webp';
      album.append(original);
    }
    body.append(album);
  }
  function wardrobeGallery(body) {
    body.classList.add('wardrobe-layout');
    const menu = el('div', 'wardrobe-menu'), core = el('div', 'gallery-tabs'), guests = el('div', 'gallery-tabs');
    const clothes = el('div', 'gallery-tabs outfit-tabs');
    const label = el('p', 'gallery-label'), img = el('img', 'plate');
    const open = button('', () => viewArt(img.src, img.alt, true), 'wardrobe-plate');
    const zoom = el('span', 'zoom-label', ' 点击放大鉴赏'); zoom.prepend(icon('zoom'));
    open.append(img, zoom);
    const description = el('p', 'hint');
    const outfits = { art: '原画设定', ...window.WhiteboxStudio.outfits };
    let selected = 'art', actor = 'gpt';
    function dress(key) {
      selected = key;
      for (const b of clothes.children) b.setAttribute('aria-pressed', String(b.dataset.outfit === key));
      label.textContent = member[actor][0] + ' · ' + outfits[key];
      description.textContent = member[actor][1];
      img.alt = label.textContent;
      open.setAttribute('aria-label', '全屏查看' + img.alt);
      open.title = '全屏查看衣装';
      img.src = key === 'art' ? 'assets/gallery/' + actor + '.webp'
        : 'assets/sprites/' + actor + '-' + key + '-front.webp';
    }
    function select(id) {
      actor = id;
      for (const b of menu.querySelectorAll('[data-id]')) b.setAttribute('aria-pressed', String(b.dataset.id === id));
      clothes.replaceChildren();
      const keys = ['art', ...window.WhiteboxStudio.clothesFor(id)];
      for (const key of keys) {
        const b = button(outfits[key], () => dress(key));
        b.dataset.outfit = key;
        clothes.append(b);
      }
      dress(keys.includes(selected) ? selected : 'art');
    }
    for (const id of window.WhiteboxStudio.actors) {
      const b = button(member[id][0], () => select(id));
      b.dataset.id = id;
      (heroes.includes(id) ? core : guests).append(b);
    }
    menu.append(el('h3', '', '404 核心部员'), core, el('h3', '', '学园特别嘉宾'), guests, el('h3', '', '衣装'), clothes, label, description);
    body.append(menu, open);
    select(actor);
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
      if (activeSystem === 'log') body.scrollTop = body.scrollHeight;
    });
  }
  const archives = [['gallery', '原画衣橱', 'wardrobe'], ['album', '纪念 CG', 'gallery'],
    ['studio', '换装摄影棚', 'camera'], ['achievements', '荣誉成就墙', 'medal']];
  const activities = [['commissions', '无限委托', 'book'], ['arcade', '放学后游乐角', 'arcade'],
    ['recreation', 'Kimi 娱乐室', 'music'], ['tea', '下午茶闲聊室', 'tea']];
  let archivePanels = {};
  function hubNav(page) {
    const nav = $('hub-nav'), group = [archives, activities].find(items => items.some(([key]) => key === page));
    $('system').classList.toggle('hub-open', Boolean(group));
    $('system').classList.toggle('chapters-open', page === 'chapters');
    const hadFocus = nav.contains(document.activeElement);
    nav.replaceChildren();
    nav.hidden = !group;
    if (!group) return headings[page];
    for (const [key, name, mark] of group) {
      const b = button(name, () => { if (activeSystem !== key) openSystem(key); });
      b.dataset.page = key;
      b.prepend(icon(mark));
      b.setAttribute('aria-pressed', String(key === page));
      nav.append(b);
      if (hadFocus && key === page) b.focus();
    }
    updateTeaEntrance();
    return group === archives ? '白箱档案室' : '404 社团活动室';
  }
  function openSystem(page) {
    if (locked || !headings[page]) return;
    leaveActivity?.();
    leaveActivity = null;
    poke.clear();
    if (playing() && finishText) finishText();
    stopTimer();
    activeSystem = page;
    $('system-heading').textContent = hubNav(page);
    if (!archives.some(([key]) => key === page)) archivePanels = {};
    const body = $('system-body');
    body.replaceChildren();
    if (page === 'chapters') leaveActivity = chapters(body);
    else if (page === 'arcade')
      leaveActivity = window.WhiteboxArcadeRoom.mount(body, { el, button, pic, read, write, playerNames, onOverload: () => progress.earn('ach_11') });
    else if (page === 'achievements') achievementWall(body);
    else if (page === 'settings') preferences(body);
    else if (page === 'album') album(body);
    else if (page === 'gallery' || page === 'studio') {
      const panel = archivePanels[page] ||= el('section');
      body.append(panel);
      if (page === 'studio') {
        if (!panel.hasChildNodes()) window.WhiteboxStudio.mount(panel, { el, button, arcadeItems: read('arcade')?.owned || [],
          onExport: size => { if (size >= 2) progress.earn('ach_12'); } });
      } else if (!panel.hasChildNodes()) wardrobeGallery(panel);
    }
    else if (page === 'tea') leaveActivity = teaRoom(body);
    else if (page === 'commissions' || page === 'recreation')
      leaveActivity = window.WhiteboxRecreation.mount(body, page, { el, button, pic, read, write });
    else if (page === 'save' || page === 'load') saves(body, page);
    else if (page === 'log') history(body);
    else menu(body);
    if (!$('system').open) $('system').showModal();
    body.scrollTop = 0;
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
  const system = $('system');
  function onBackdrop(e) {
    const r = system.getBoundingClientRect();
    return e.target === system && (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom);
  }
  let backdropPress;
  system.addEventListener('pointerdown', e => { backdropPress = onBackdrop(e) ? e.pointerId : null; });
  system.addEventListener('pointerup', e => {
    if (backdropPress === e.pointerId && onBackdrop(e)) closeSystem();
    backdropPress = null;
  });
  system.addEventListener('pointercancel', () => { backdropPress = null; });
  $('view-motion').onclick = () => {
    viewerArt.still = !viewerArt.still;
    refreshViewer();
  };
  const viewer = $('cg-viewer');
  viewer.addEventListener('cancel', closeArt);
  viewer.querySelector('form').addEventListener('submit', closeArt);
  viewer.addEventListener('close', () => { if (!viewer.open) closeArt(); });
  reducedMotion.addEventListener('change', refreshCgMotion);
  document.addEventListener('visibilitychange', () => { if (document.hidden) flushAutosave(true); });
  window.addEventListener('pagehide', () => {
    flushAutosave(true);
    resetScene();
    if (viewer.open) {
      closeArt();
      viewer.close();
    }
  });
  window.addEventListener('pageshow', event => {
    if (event.persisted && playing()) background();
  });
  $('view-detail').onclick = () => {
    const zoom = $('cg-viewer').classList.toggle('actual-size');
    $('view-detail').setAttribute('aria-pressed', String(zoom));
  };
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
    if (round?.keydown(e)) return;
    if (state.bg.startsWith('cg_') && e.key.toLowerCase() === 'h') {
      e.preventDefault();
      hideUI(!uiHidden);
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
  if (previewAlbum) openSystem('album');
})();
