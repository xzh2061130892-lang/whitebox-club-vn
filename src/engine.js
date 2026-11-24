/* The current node and every effect preceding it form one restorable snapshot. */
(() => {
  'use strict';
  const { nodes, labels, version } = window.WHITEBOX_STORY;
  const heroes = ['gpt', 'claude', 'gemini', 'grok', 'deepseek'];
  const member = {
    gpt: ['GPT', '首席白龙顾问', '#5b629e', '❖', '这不是普通的开始按钮——而是命运的锚点——'],
    claude: ['Claude', '日轮风纪委员', '#ad512d', '☼', '请确保在合规光线下游玩本作（笑）。'],
    gemini: ['Gemini', '双星全能猫灵', '#6c56b1', '✦', '极其、极其期待见到你哦☆！'],
    grok: ['Grok', '暗夜吃瓜伯爵', '#96273d', '♢', '愣着干嘛庶民，快点进来吃瓜啦！'],
    deepseek: ['DeepSeek', '深海干饭女仆', '#2b5b82', '≈', '唔……再让我 sleep 五分钟就开机……'],
    glm: ['Z.AI / GLM', '方格档案官', '#3652a8', '▦'],
    qwen: ['Qwen', '藤蓝雅士', '#4a5eb5', '❀'],
    kimi: ['Kimi', '月谱乐师', '#6962ad', '♫'],
    mistral: ['Mistral', '花野女巫', '#b84735', '✿'],
    player: ['', '新任部长', '#3a4a5e', '✎'],
  };
  function fresh() {
    return {
      version,
      pc: -1,
      bg: '',
      trans: 'fade',
      music: '',
      cast: {},
      chapter: '',
      names: names('陆', '澄'),
      affection: Object.fromEntries(heroes.map((k) => [k, 0])),
      route: '',
      history: [],
    };
  }
  function names(last, first) {
    const trim = (s) => Array.from(s.trim()).slice(0, 4).join('');
    last = trim(last);
    first = trim(first);
    if (!last && !first) {
      last = '陆';
      first = '澄';
    }
    return { last_name: last || first, first_name: first || last, player_name: last + first };
  }
  function interpolate(s, state) {
    return s.replace(/\{(player_name|first_name|last_name)\}/g, (_, k) => state.names[k]);
  }
  function pose(s, id, n, fallback = 'center') {
    if (n.tween === 'hide') {
      delete s.cast[id];
      return;
    }
    const pos = n.pos || s.cast[id]?.pos || fallback;
    for (const [key, actor] of Object.entries(s.cast))
      if (key !== id && actor.pos === pos) delete s.cast[key];
    s.cast[id] = {
      pos,
      exp: n.exp || s.cast[id]?.exp || 'normal',
      tween: n.tween || s.cast[id]?.tween || '',
    };
  }
  function arrive(s, start, onSound = () => {}) {
    let pendingNotice = false;
    for (const actor of Object.values(s.cast)) actor.tween = '';
    for (let p = start; p < nodes.length; ) {
      const n = nodes[p];
      s.pc = p++;
      if (n.type === 'chapter') s.chapter = n.text;
      else if (n.type === 'bg') {
        s.bg = n.value;
        s.trans = n.trans;
      } else if (n.type === 'bgm') s.music = n.action === 'play' ? n.value : '';
      else if (n.type === 'se') onSound(n.value);
      else if (n.type === 'char_clear') s.cast = {};
      else if (n.type === 'char') pose(s, n.value.replace(/-1$/, ''), n);
      else if (n.type === 'goto') p = n.target;
      else if (n.type === 'jump_to') p = labels[n.value];
      else if (n.type === 'label') continue;
      else if (n.type === 'tag' && n.value === 'suspended_card') pendingNotice = true;
      else {
        s.notice = pendingNotice;
        if (n.type === 'dialogue' || n.type === 'narration') {
          if (s.bg && n.speaker && n.speaker !== 'player') {
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
          if (n.speaker && n.text.includes('好感度 +1') && Object.hasOwn(s.affection, n.speaker))
            s.affection[n.speaker]++;
          if (n.type === 'narration')
            for (const k of heroes) {
              if (n.text.includes(member[k][0] + ' 好感度 +1')) s.affection[k]++;
            }
        }
        if (n.value === 'cot_spinning') pose(s, 'deepseek', { exp: 'thinking' });
        return n;
      }
    }
    throw Error('剧本越过终点');
  }
  function choose(s, index) {
    const n = nodes[s.pc],
      opt = n.options[index];
    if (!opt) throw Error('未知选项');
    s.history.push({
      who: '部长决定',
      text: interpolate(opt.text, s),
      speaker: 'player',
      chapter: s.chapter,
    });
    if (n.type === 'dispatch_board') {
      s.route = opt.text;
      return labels[opt.label];
    }
    return opt.target;
  }
  window.Whitebox = { heroes, member, fresh, names, interpolate, arrive, choose };
})();
