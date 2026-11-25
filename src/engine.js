/* The current node and every effect preceding it form one restorable snapshot. */
(() => {
  'use strict';
  const stories = {
    prologue: window.WHITEBOX_STORY,
    chapter1: window.WHITEBOX_CHAPTER1,
    chapter2: window.WHITEBOX_CHAPTER2,
    chapter3: window.WHITEBOX_CHAPTER3,
    chapter4: window.WHITEBOX_CHAPTER4,
    chapter5: window.WHITEBOX_CHAPTER5,
  };
  // Saves made before chapter selection was introduced belong to the prologue.
  const storyFor = (s) => stories[s.storyId ?? 'prologue'];
  const chapterIds = Object.keys(stories);
  const registrationPc = stories.prologue?.nodes.findIndex(n => n.type === 'input_player_name') ?? -1;
  const awaitingName = s => (s.storyId ?? 'prologue') === 'prologue' && s.pc <= registrationPc;
  const heroes = ['gpt', 'claude', 'gemini', 'grok', 'deepseek'];
  const uniforms = { chapter3: '-sport', chapter4: '-summer' };
  const routePrefixes = { chapter3: 'ch3_lock_', chapter4: 'ch4_route_', chapter5: 'ch5_end_' };
  const member = {
    gpt: ['GPT', '首席白龙顾问', '#5b629e', '❖', '这不是普通的开始按钮——而是命运的锚点——'],
    claude: ['Claude', '日轮风纪委员', '#ad512d', '☼', '请确保在合规光线下游玩本作（笑）。'],
    gemini: ['Gemini', '双星全能猫灵', '#6c56b1', '✦', '极其、极其期待见到你哦☆！'],
    grok: ['Grok', '暗夜吃瓜大小姐', '#96273d', '♢', '愣着干嘛庶民，快点进来吃瓜啦！'],
    deepseek: ['DeepSeek', '深海干饭女仆', '#2b5b82', '≈', '唔……再让我 sleep 五分钟就开机……'],
    glm: ['Z.AI / GLM', '方格档案官', '#3652a8', '▦'],
    qwen: ['Qwen', '藤蓝雅士', '#4a5eb5', '❀'],
    kimi: ['Kimi', '月谱乐师', '#6962ad', '♫'],
    mistral: ['Mistral', '花野女巫', '#b84735', '✿'],
    player: ['', '新任部长', '#3a4a5e', '✎'],
  };
  function fresh(storyId = 'prologue', previous) {
    const lockedHero = heroes.includes(previous?.lockedHero) ? previous.lockedHero : '';
    const s = {
      storyId,
      version: stories[storyId].version,
      pc: -1,
      bg: '',
      trans: 'fade',
      music: '',
      cast: {},
      chapter: '',
      names: previous ? { ...previous.names } : names('', ''),
      affection: previous ? { ...previous.affection } : Object.fromEntries(heroes.map((k) => [k, 0])),
      route: '',
      lockedHero,
      history: previous ? [...previous.history] : [],
    };
    if (storyId === 'chapter4') {
      s.routeOrigin = { affection: { ...s.affection }, historyLength: s.history.length };
      if (previous?.storyId === 'chapter3' && lockedHero)
        s.pc = stories.chapter4.labels[routePrefixes.chapter4 + lockedHero] ?? -1;
    }
    return s;
  }
  function enterChapter(s, onSound, onPass) {
    let n = arrive(s, Math.max(0, s.pc), onSound, onPass);
    // The manual selector displays its opening narration and five choices together.
    if (s.storyId === 'chapter4' && !s.lockedHero)
      while (n.type === 'narration') n = arrive(s, s.pc + 1, onSound, onPass);
    return n;
  }
  function reselectRoute(s) {
    return fresh('chapter4', {
      names: s.names,
      affection: s.routeOrigin.affection,
      history: s.history.slice(0, s.routeOrigin.historyLength),
    });
  }
  function revisitBonfire(s, onPass) {
    const origin = s.bonfireOrigin;
    const replay = fresh('chapter5', {
      ...s, affection: origin.affection, history: s.history.slice(0, origin.historyLength),
    });
    let n = arrive(replay, stories.chapter5.labels.ch5_bonfire_hub, undefined, onPass);
    while (n.type === 'narration') n = arrive(replay, replay.pc + 1, undefined, onPass);
    return replay;
  }
  function names(last, first) {
    const trim = (s) => Array.from(s.trim()).slice(0, 4).join('');
    last = trim(last);
    first = trim(first);
    return { last_name: last || first, first_name: first || last, player_name: last + first };
  }
  function interpolate(s, state) {
    return s.replace(/\{(player_name|first_name|last_name)\}/g, (_, k) => state.names[k]);
  }
  function pose(s, id, n, fallback = 'center', sprite) {
    if (s.bg.startsWith('cg_')) return;
    if (n.tween === 'hide') {
      delete s.cast[id];
      return;
    }
    const pos = n.pos || s.cast[id]?.pos || fallback;
    for (const [key, actor] of Object.entries(s.cast))
      if (key !== id && actor.pos === pos) delete s.cast[key];
    const uniform = s.storyId === 'chapter5' ? '-3' : (heroes.includes(id) && uniforms[s.storyId]) || '-1';
    s.cast[id] = {
      sprite: sprite || s.cast[id]?.sprite || id + uniform,
      pos,
      exp: n.exp || s.cast[id]?.exp || 'normal',
      tween: n.tween || s.cast[id]?.tween || '',
    };
  }
  function arrive(s, start, onSound = () => {}, onPass) {
    const { nodes, labels } = storyFor(s);
    let pendingNotice = false;
    for (const actor of Object.values(s.cast)) actor.tween = '';
    for (let p = start; p < nodes.length; ) {
      if (s.phoneChat && (p <= s.phoneChat.begin || p > s.phoneChat.end)) delete s.phoneChat;
      const n = nodes[p];
      s.pc = p++;
      if (n.type === 'chapter') s.chapter = n.text;
      else if (n.type === 'bg') {
        s.bg = n.value;
        s.trans = n.trans;
        if (s.bg.startsWith('cg_')) s.cast = {};
      } else if (n.type === 'bgm') s.music = n.action === 'play' ? n.value : '';
      else if (n.type === 'se') onSound(n.value);
      else if (n.type === 'char_clear') s.cast = {};
      else if (n.type === 'char') pose(s, n.value.replace(/-(?:1|3|date|camp|sport|summer)$/, ''), n, 'center', n.value);
      else if (n.type === 'phone_chat') {
        s.phoneChat = { title: n.value, begin: s.pc, end: n.end, from: s.history.length };
      } else if (n.type === 'free_roam_return') {
        if (!s.roam) throw Error('串门缺少起始面板');
        const hub = nodes[s.roam.pc];
        s.cast = {};
        if (s.roam.visited.length < hub.picks) p = s.roam.pc;
        else {
          p = labels[hub.exit];
          delete s.roam;
        }
      } else if (n.type === 'goto') p = n.target;
      else if (n.type === 'jump_to') p = labels[n.value];
      else if (n.type === 'label') {
        onPass?.(s, n);
        if (s.storyId === 'chapter5' && n.value === 'ch5_bonfire_hub')
          s.bonfireOrigin = { affection: { ...s.affection }, historyLength: s.history.length };
        for (let j = s.pc - 1; j >= 0; j--)
          if (nodes[j].type === 'chapter') {
            s.chapter = nodes[j].text;
            break;
          }
      } else if (n.type === 'tag' && n.value === 'suspended_card') {
        pendingNotice = true;
        onPass?.(s, n);
      }
      else {
        s.notice = pendingNotice;
        if (n.type === 'dialogue' || n.type === 'narration') {
          if (!s.phoneChat && s.bg && !s.bg.startsWith('cg_') && n.speaker && n.speaker !== 'player') {
            const occupied = new Set(Object.values(s.cast).map((a) => a.pos));
            const free = ['center', 'right', 'left'].find((pos) => !occupied.has(pos));
            pose(s, n.speaker, n, free || 'center');
          }
          const who = interpolate(n.name || '旁白', s);
          s.history.push({
            who,
            text: interpolate(n.text, s),
            speaker: n.speaker || '',
            chapter: s.chapter,
          });
          const reward = n.text.match(/好感度\s*\+(\d+)/);
          if (reward && Object.hasOwn(s.affection, n.speaker))
            s.affection[n.speaker] += Number(reward[1]);
          if (n.type === 'narration')
            for (const k of heroes) {
              if (n.text.includes(member[k][0] + ' 好感度 +1')) s.affection[k]++;
            }
        }
        if (n.type === 'free_roam_hub' && s.roam?.pc !== s.pc)
          s.roam = { pc: s.pc, visited: [] };
        if (n.value === 'cot_spinning') pose(s, 'deepseek', { exp: 'thinking' });
        return n;
      }
    }
    throw Error('剧本越过终点');
  }
  function routeHero(s, option) {
    const prefix = routePrefixes[s.storyId];
    if (prefix) return heroes.find((id) => option.label === prefix + id);
  }
  function choose(s, index, onChoice) {
    const { nodes, labels } = storyFor(s);
    const n = nodes[s.pc],
      opt = n.options[index];
    if (!opt) throw Error('未知选项');
    const hero = routeHero(s, opt);
    if (hero && s.storyId === 'chapter5') s.finaleHero = hero;
    else if (hero) s.lockedHero = hero;
    if (n.type === 'free_roam_hub') {
      if (s.roam.visited.includes(opt.actor) || s.roam.visited.length >= n.picks)
        throw Error('该串门目标已访问或行动次数已用尽');
      s.roam.visited.push(opt.actor);
    }
    if (n.type === 'temp_tuner') {
      s.lastTuning = { pc: s.pc, index };
      delete s.tunerSelection;
    }
    s.history.push({
      who: '部长决定',
      text: interpolate(opt.text, s),
      speaker: 'player',
      chapter: s.chapter,
    });
    onChoice?.(s, n, index);
    if (n.type === 'dispatch_board') {
      s.route = opt.text;
      return labels[opt.label];
    }
    return opt.label ? labels[opt.label] : opt.target;
  }
  window.Whitebox = { heroes, member, chapterIds, storyFor, fresh, enterChapter, reselectRoute, revisitBonfire, names, awaitingName, interpolate, arrive, choose, routeHero };
})();
