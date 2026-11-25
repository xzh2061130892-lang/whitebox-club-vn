(() => {
  'use strict';
  const tea = window.WhiteboxTea;
  const { heroes, member } = window.Whitebox;
  const connectionKey = 'tea.connection';
  const localURL = 'http://localhost:11434';
  function savedConnection(read) {
    try { return tea.config(read(connectionKey) || {}); }
    catch { return { mode: 'offline' }; }
  }
  function settings(body, { el, button, read, write }, changed = () => {}) {
    let saved = savedConnection(read), keyEdited = false;
    const details = el('details', 'tea-settings');
    const form = el('form', 'activity-stack');
    const heading = el('summary'), stateLabel = el('span'), configure = el('b', '', '连接外部模型');
    configure.prepend(window.WhiteboxIcon('settings')); heading.append(stateLabel, configure);
    const mode = el('select'), endpoint = el('input'), model = el('input'), key = el('input');
    for (const [value, label] of [['offline', '离线闲聊'], ['compatible', '自带服务 · Chat Completions'], ['ollama', '本地 Ollama']])
      mode.add(new Option(label, value));
    endpoint.type = 'url'; endpoint.autocomplete = 'off'; endpoint.spellcheck = false;
    model.autocomplete = 'off'; model.spellcheck = false;
    key.type = 'password'; key.autocomplete = 'off'; key.spellcheck = false;
    function field(name, control) {
      const wrap = el('label', 'activity-field');
      control.setAttribute('aria-label', name);
      wrap.append(el('span', '', name), control);
      return wrap;
    }
    const endpointRow = field('服务地址', endpoint), modelRow = field('模型名', model), keyRow = field('API Key', key);
    const info = el('p', 'hint'), status = el('p', 'tea-status');
    status.setAttribute('role', 'status');
    const save = el('button', 'system-action primary', '保存连接设置');
    save.type = 'submit';
    const forget = button('清除连接与密钥', () => {
      if (!write(connectionKey, { mode: 'offline' })) { status.textContent = '未能清除，请检查浏览器存储。'; return; }
      saved = { mode: 'offline' }; mode.value = saved.mode; fields();
      status.textContent = '连接与密钥已清除，现在使用离线闲聊。'; changed();
    }, 'system-action');
    function fields() {
      keyEdited = false;
      stateLabel.textContent = '当前模式 · ' + ({ offline: '离线闲聊（无需 API）', ollama: '本地 Ollama', compatible: '外部模型' }[saved.mode]);
      const active = mode.value !== 'offline', local = mode.value === 'ollama', previous = saved.mode === mode.value;
      endpointRow.hidden = modelRow.hidden = !active;
      keyRow.hidden = !active || local;
      endpoint.disabled = model.disabled = !active;
      key.disabled = !active || local;
      endpoint.required = model.required = active;
      endpoint.placeholder = local ? localURL : 'https://服务域名/v1';
      endpoint.value = previous ? saved.endpoint || '' : local ? localURL : '';
      model.placeholder = local ? 'Ollama 中已安装的模型名' : '服务提供的模型 ID';
      model.value = previous ? saved.model || '' : '';
      key.value = previous && !key.disabled ? saved.key || '' : '';
      key.placeholder = '服务无需密钥时可留空';
      forget.hidden = saved.mode === 'offline';
      info.textContent = !active ? '离线闲聊使用游戏内置台词。保存离线模式会清除已有连接信息。' :
        (local ? '填写本机 Ollama 的地址和已安装的模型名。' : '可填写基础地址或完整的 /chat/completions 地址。密钥保存在本浏览器。') +
        '点击发送时，页面会把玩家名、该角色的关系和最近六轮对话直接发往所填服务。';
      if (local && location.protocol === 'file:')
        info.textContent += ' Ollama 默认接受本机 HTTP 页面。直接打开 HTML 的玩家可按 README 的本地服务器方式游玩。';
    }
    mode.value = saved.mode; fields();
    mode.onchange = () => { fields(); status.textContent = ''; };
    key.oninput = () => { keyEdited = true; };
    form.onsubmit = event => {
      event.preventDefault();
      try {
        const c = tea.config({ mode: mode.value, endpoint: endpoint.value, model: model.value, key: key.value });
        if (c.key && saved.key && !keyEdited && new URL(c.endpoint).origin !== new URL(saved.endpoint).origin) {
          key.value = ''; key.focus();
          status.textContent = '服务域名已更换。请填写新服务的密钥，或留空再保存。';
          return;
        }
        if (!write(connectionKey, c)) throw Error('未能保存，请检查浏览器存储。');
        saved = c; keyEdited = false; fields(); status.textContent = '连接设置已保存。'; changed();
      } catch (e) { status.textContent = e.message; }
    };
    const actions = el('div', 'tea-actions'); actions.append(save, forget);
    form.append(field('聊天方式', mode), endpointRow, modelRow, keyRow, info, actions, status);
    details.append(heading, form);
    body.append(details);
    return () => { saved = savedConnection(read); mode.value = saved.mode; fields(); status.textContent = ''; };
  }
  function mount(body, ui, { names, bondFor }) {
    const { el, button, read, write } = ui;
    const room = el('section', 'tea-room activity-stack'), seats = el('div', 'gallery-tabs tea-seats');
    seats.setAttribute('aria-label', '选择茶友');
    const table = el('div', 'tea-table'), stage = el('div', 'tea-stage'), sprite = el('img');
    const copy = el('div', 'tea-copy'), who = el('h3'), relation = el('p', 'tea-relation'), player = el('p', 'tea-player');
    const dialogue = el('p', 'tea-reply'), note = el('aside', 'tea-note'), thought = el('del');
    const actions = el('div', 'tea-actions'), fortuneCard = el('article', 'tea-fortune');
    const messageForm = el('form', 'tea-compose'), input = el('input'), send = el('button', 'system-action primary', '发送');
    const service = el('p', 'hint'), status = el('p', 'tea-status');
    const history = el('details', 'tea-history'), transcript = el('ol');
    history.append(el('summary', '', '本次聊天记录'), transcript);
    const conversations = Object.fromEntries(heroes.map(id => [id, { turns: [], draft: '', lastLine: -1 }]));
    let id = heroes[0], connection = savedConnection(read), request = null, closed = false;
    let currentPeriod, currentDay, lastFortune = read('tea.fortune');
    function cancel() {
      if (!request) return;
      clearTimeout(request.timer);
      request.controller.abort();
      request = null;
    }
    function syncComposer() {
      const online = connection.mode !== 'offline';
      messageForm.hidden = !online; service.hidden = !online;
      input.readOnly = !!request;
      send.disabled = !!request || !input.value.trim();
      stop.hidden = !request;
      service.textContent = online ? '发送至 ' + new URL(connection.endpoint).host + ' · ' + connection.model : '';
    }
    function paint(result, userLine = '') {
      const base = 'assets/sprites/' + id + '-1';
      sprite.alt = member[id][0] + '的立绘';
      sprite.src = base + (result.exp === 'normal' ? '-front' : '/' + result.exp) + '.webp';
      sprite.onerror = () => { sprite.onerror = null; sprite.src = base + '-front.webp'; };
      player.hidden = !userLine;
      player.textContent = userLine ? names.player_name + '「' + userLine + '」' : '';
      dialogue.textContent = result.reply;
      thought.textContent = result.os.replace(/^~~([\s\S]*)~~$/, '$1');
    }
    function showHistory() {
      const turns = conversations[id].turns;
      history.hidden = !turns.length; transcript.replaceChildren();
      for (const t of turns) {
        const item = el('li');
        item.append(el('strong', '', names.player_name), el('p', '', t.user),
          el('strong', '', member[id][0]), el('p', '', t.result.reply));
        transcript.append(item);
      }
    }
    function showFortune(date) {
      const day = tea.dayKey(date);
      const drawn = lastFortune?.day === day && Number.isInteger(lastFortune.index) && !!tea.fortunes[lastFortune.index];
      fortuneCard.hidden = !drawn;
      fortune.textContent = drawn ? '重读今日运势签' : '抽取今日白箱运势签';
      if (drawn) {
        const [title, words] = tea.fortunes[lastFortune.index];
        fortuneCard.replaceChildren(el('small', '', day + ' · 今日白箱运势签'), el('h4', '', title), el('p', '', words));
      } else fortuneCard.replaceChildren();
    }
    function time(date) {
      currentDay = tea.dayKey(date); currentPeriod = tea.period(date);
      const [label, bg] = tea.periods[currentPeriod];
      relation.textContent = label + ' · ' + tea.bondText(bondFor(id));
      stage.style.backgroundImage = 'url("assets/bg/' + bg + '.webp")';
      showFortune(date);
    }
    function smallTalk() {
      cancel();
      time(new Date());
      const chat = conversations[id];
      const next = tea.greeting(id, currentPeriod, chat.lastLine, tea.address(id, names, bondFor(id)));
      chat.lastLine = next.index;
      paint(next); status.textContent = ''; syncComposer();
    }
    function seat(next) {
      cancel();
      conversations[id].draft = input.value;
      id = next; input.value = conversations[id].draft;
      for (const b of seats.children) b.setAttribute('aria-pressed', String(b.dataset.hero === id));
      who.textContent = member[id][0];
      room.style.setProperty('--tea-tone', member[id][2]);
      history.open = false;
      showHistory(); smallTalk();
    }
    async function submit(event) {
      event.preventDefault();
      const message = input.value.trim();
      if (closed || request || !message || connection.mode === 'offline') return;
      const current = { controller: new AbortController() };
      const chat = conversations[id];
      request = current;
      current.timer = setTimeout(() => {
        if (request !== current) return;
        cancel(); syncComposer(); status.textContent = '等候模型超时，消息已保留，可以重试或离线聊一句。';
      }, 90000);
      status.textContent = member[id][0] + ' 正在回信…'; syncComposer();
      try {
        const result = await tea.ask(connection, { id, names, bond: bondFor(id), date: new Date(), turns: chat.turns, message }, current.controller.signal);
        if (request !== current || closed) return;
        chat.turns.push({ user: message, result });
        if (chat.turns.length > 6) chat.turns.shift();
        input.value = chat.draft = '';
        paint(result, message); showHistory(); status.textContent = '';
      } catch (e) {
        if (request === current && !closed) status.textContent = e.message + ' 消息已保留，也可以离线聊一句。';
      } finally {
        if (request === current) {
          clearTimeout(current.timer); request = null; syncComposer(); input.focus();
        }
      }
    }
    const stop = button('取消等待', () => {
      cancel(); syncComposer(); status.textContent = '已取消，消息已保留。'; input.focus();
    }, 'system-action');
    const fortune = button('抽取今日白箱运势签', async () => {
      function draw() {
        if (closed) return;
        const now = new Date(), day = tea.dayKey(now), stored = read('tea.fortune');
        if (stored?.day === day && Number.isInteger(stored.index) && tea.fortunes[stored.index]) lastFortune = stored;
        if (lastFortune?.day !== day || !Number.isInteger(lastFortune.index) || !tea.fortunes[lastFortune.index]) {
          lastFortune = { day, index: Math.floor(Math.random() * tea.fortunes.length) };
          write('tea.fortune', lastFortune);
        }
        showFortune(now);
        fortuneCard.focus();
      }
      // Tabs opened together should find the same slip in the jar.
      if (navigator.locks) {
        try { await navigator.locks.request('whitebox.404.tea.fortune', draw); }
        catch { draw(); }
      } else draw();
    }, 'system-action');
    for (const hero of heroes) {
      const b = button(member[hero][0], () => seat(hero)); b.dataset.hero = hero; seats.append(b);
    }
    fortuneCard.tabIndex = -1;
    dialogue.setAttribute('aria-live', 'polite'); status.setAttribute('role', 'status');
    input.type = 'text'; input.maxLength = 1000; input.placeholder = '给茶友写一句话…';
    input.setAttribute('aria-label', '发给茶友的消息'); input.oninput = syncComposer;
    send.type = 'submit'; messageForm.onsubmit = submit; messageForm.append(input, send, stop);
    note.append(el('small', '', '脑内草稿 OS'), thought);
    stage.append(sprite); copy.append(who, relation, player, dialogue, note); table.append(stage, copy);
    actions.append(button('离线聊一句', smallTalk, 'system-action'), fortune);
    room.append(seats, table, actions, fortuneCard, service, messageForm, status, history);
    function connectionChanged() {
      cancel();
      const next = savedConnection(read);
      if (connection.endpoint !== next.endpoint || connection.mode !== next.mode) {
        for (const chat of Object.values(conversations)) chat.turns.length = 0;
        showHistory();
      }
      connection = next; status.textContent = ''; syncComposer();
    }
    const connectionStrip = el('div'); room.prepend(connectionStrip);
    const refreshSettings = settings(connectionStrip, ui, connectionChanged); body.append(room);
    function refreshClock() {
      const now = new Date();
      if (tea.period(now) !== currentPeriod && player.hidden && !request) smallTalk();
      else if (tea.dayKey(now) !== currentDay || tea.period(now) !== currentPeriod) time(now);
    }
    function storage(e) {
      if (!e.key || e.key === 'whitebox.404.' + connectionKey) { refreshSettings(); connectionChanged(); }
      if (!e.key || e.key === 'whitebox.404.tea.fortune') { lastFortune = read('tea.fortune'); showFortune(new Date()); }
    }
    seat(id);
    const clock = setInterval(refreshClock, 30000);
    document.addEventListener('visibilitychange', refreshClock);
    window.addEventListener('storage', storage);
    return () => {
      closed = true; cancel(); clearInterval(clock);
      document.removeEventListener('visibilitychange', refreshClock);
      window.removeEventListener('storage', storage);
    };
  }
  window.WhiteboxTeaRoom = { mount, settings };
})();
