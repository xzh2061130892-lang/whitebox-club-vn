(() => {
  'use strict';
  const { heroes, member, chapterIds, storyFor, awaitingName, interpolate } = window.Whitebox;
  const { medals } = window.WhiteboxReplayData;
  const manualSlots = Array.from({ length: 6 }, (_, i) => 'slot' + (i + 1));
  const chapterBg = {
    prologue: 'bg_room_404_day', chapter1: 'bg_cafeteria_day', chapter2: 'bg_camp_lodge_night',
    chapter3: 'bg_sports_field_day', chapter4: 'bg_hydrangea_rain_walk', chapter5: 'bg_festival_plaza_night',
  };
  const hubKinds = { dispatch_board: 'dispatch', free_roam_hub: 'roam', temp_tuner: 'tuner', choice: 'choice_hub' };
  const temperatureHints = ['低温冷场档 · T=0.1', '黄金破局正解 · T=0.7', '异常高温彩蛋 · T=1.6'];
  const finaleMedals = ['ach_13', 'ach_14', 'ach_15', 'ach_16', 'ach_17'];

  const hubNames = {
    route_claude_grok: '第三幕双人派单板', roam_gpt: '第一幕自由串门',
    ch1_route_claude_ds: '第三幕双人派单板', ch1_date_gpt: '周六私服约会选择',
    ch2_roam_gpt: '合宿一对一辅导', ch2_cook_claude_gemini: '合宿厨房派单',
    ch2_night_gpt: '深夜留门选择', ch3_roam_grok: '赛前热身帐篷',
    ch3_race_ds_grok: '二人三足派单', ch3_lock_gpt: '终极借物卡 · 牵手选择',
    ch4_route_gpt: '六月个人线入口', ch5_roam_gpt: '星海文化祭巡展',
    ch5_end_gpt: '后夜祭告白邀约',
  };
  const labelNames = {
    act3_reunion: '夕阳庆功会', ch1_roam_start: '大课间开始', ch1_after_roam: '课间集合',
    ch1_invite_setup: '海湾之约', ch2_roam_start: '合宿开营', ch2_after_roam: '合宿厨房集合',
    ch2_act3_blackout: '木屋停电', ch3_roam_start: '运动祭开场', ch3_after_roam: '热身结束',
    ch3_act3_scavenger: '部长借物赛跑', ch5_roam_start: '文化祭开幕',
    ch5_bonfire_hub: '后夜祭篝火', ch5_grand_epilogue: '盛装全家福',
  };
  function branchName(option) {
    if (option.place) return member[option.actor][0] + ' · ' + option.place;
    const id = option.label.split('_').at(-1);
    if (option.label.startsWith('ch2_night_'))
      return member[id][0] + (id === 'grok' ? ' 散发睡衣夜话' : ' 睡衣夜话');
    if (option.label.startsWith('ch1_date_')) return member[id][0] + ' 周六私服约会';
    if (option.label.startsWith('ch3_lock_')) return member[id][0] + ' 天台牵手';
    return option.text.match(/《(.+?)》/)?.[1] || option.text;
  }
  function labelActors(label) {
    const aliases = { ds: 'deepseek', gem: 'gemini' };
    return [...new Set(label.split('_').map(k => aliases[k] || k).filter(k => heroes.includes(k)))];
  }
  function branchHint(id, parent, band) {
    if (band != null) return temperatureHints[band];
    if (parent?.kind === 'dispatch') return '双人搭档派单分支';
    if (parent?.kind === 'roam') return '自由串门专属互动';
    for (const [prefix, hint] of [
      ['ch1_date_', '周六私服约会支线'], ['ch2_night_', '深夜合宿睡衣夜话'], ['ch3_lock_', '双星天台心意锁定'],
      ['ch4_route_', '六月梅雨个人恋爱线'], ['ch5_end_', '后夜祭盛装告白终章'],
    ]) if (id.startsWith(prefix)) return hint;
    return '沿本章主线继续观测';
  }
  // Every branch has one key even when both a choice and its destination label report it.
  function atlas(storyId) {
    const story = storyFor({ storyId }), roots = [], entries = new Map(), hubs = new Map();
    let bg = chapterBg[storyId], route, arriving;
    function entry(label, title, parent, kind, actors, band, pc) {
      const item = {
        id: label, key: storyId + ':' + label, parentKey: parent?.key ?? null, title, children: [], pc,
        scriptPc: pc ?? story.labels[label], kind, actors, bg, tempBand: band ?? null,
        technical: /_(?:tuner_retry|roam_start|after_roam|ending_card)$/.test(label),
        hint: branchHint(label, parent, band),
      };
      if (label.startsWith('ch5_end_')) {
        item.cg = 'cg_confession_' + actors[0];
        item.medal = finaleMedals[heroes.indexOf(actors[0])];
      } else if (label === 'ch5_grand_epilogue') item.cg = 'cg_grand_404_photo';
      else if (label === 'ch2_grok_chaos') item.medal = 'ach_08';
      entries.set(label, item);
      (parent?.children || roots).push(item);
      return item;
    }
    for (const [pc, n] of story.nodes.entries()) {
      if (n.type === 'bg') {
        bg = n.value;
        if (arriving) arriving.bg = bg;
      }
      if (!['bg', 'bgm', 'char', 'char_clear', 'label'].includes(n.type)) arriving = null;
      if (n.options?.every(o => o.label)) {
        const first = n.options[0].label;
        const title = hubNames[first] || (n.type === 'temp_tuner' ? member[n.actor][0] + ' 温度调谐' : n.title || n.text);
        const tuner = n.type === 'temp_tuner';
        const hub = entry('@' + first, title, tuner ? route : null, hubKinds[n.type], tuner ? [n.actor] : [], null, pc);
        hubs.set(pc, hub);
        for (const [i, o] of n.options.entries()) {
          const actors = o.pair || (o.actor || tuner ? [o.actor || n.actor] : labelActors(o.label));
          const kind = /^ch4_route_|^ch5_end_/.test(o.label) ? 'route' : 'branch';
          entry(o.label, branchName(o), hub, kind, [...actors], tuner ? i : null);
        }
        hub.actors = [...new Set(hub.children.flatMap(child => child.actors))];
      } else if (n.type === 'label') {
        if (/^ch4_route_|^ch5_end_/.test(n.value)) route = entries.get(n.value);
        arriving = entries.get(n.value);
        if (arriving) continue;
        const retry = n.value.endsWith('_tuner_retry');
        const title = labelNames[n.value] || (retry ? '调谐准备' : n.value.endsWith('_ending_card') ? '章节结算' : '剧情交会点');
        arriving = entry(n.value, title, retry ? route : null, n.value.endsWith('_ending_card') ? 'ending' : 'merge', labelActors(n.value));
      }
    }
    return { roots, entries, hubs };
  }

  // These are the actual committed dialogue options, including the prologue cookie.
  const feedingChoices = [
    '递给 DeepSeek 学妹', '投喂唤醒干饭鲸鱼', '温热卤蛋放进她怀里', '学长请客管饱',
    '保住 DeepSeek 的三碗干饭配额', '给她冲了一杯热乎乎的麦片牛奶', '一日三餐我全包',
    '换我早起给你带早餐', '糖心蛋先喂到 DeepSeek 嘴边',
  ];
  function progress(read, write, notify) {
    const charts = new Map(), unsaved = new Map();
    const get = (key, fallback) => unsaved.get(key) ?? read(key) ?? fallback;
    function put(key, value) {
      if (write(key, value) === false) unsaved.set(key, value);
      else unsaved.delete(key);
    }
    function chart(id) {
      if (!charts.has(id)) charts.set(id, atlas(id));
      return charts.get(id);
    }
    function locate(state) {
      if (!state) return null;
      const atlas = chart(state.storyId ?? 'prologue');
      const scene = state.bg?.startsWith('cg_') && [...atlas.entries.values()].find(item => item.cg === state.bg);
      if (scene) return scene;
      let nearest = null;
      for (const item of atlas.entries.values()) {
        if (item.scriptPc <= state.pc && (!nearest || item.scriptPc > nearest.scriptPc)) nearest = item;
      }
      if (nearest?.technical && nearest.kind !== 'ending') {
        // Present the visible hub a transition leads into, not its internal retry label.
        return [...atlas.hubs.values()].find(hub => hub.pc > nearest.scriptPc) ?? null;
      }
      return nearest;
    }
    const list = (key) => new Set(get(key, []));
    function add(key, value) {
      const values = list(key);
      if (values.has(value)) return false;
      values.add(value);
      put(key, [...values]);
      return true;
    }
    function earn(id) {
      if (!medals[id] || !add('achievements', id)) return;
      notify(id);
      if (finaleMedals.includes(id) && finaleMedals.every(k => list('achievements').has(k)))
        earn('ach_18');
    }
    function count(id, threshold) {
      if (list('achievements').has(id)) return;
      const key = 'count.' + id, next = get(key, 0) + 1;
      put(key, next);
      if (next >= threshold) earn(id);
    }
    function pass(state, n) {
      if (n.type === 'label') {
        add('seenLabels', (state.storyId ?? 'prologue') + ':' + n.value);
        if (n.value === 'ch2_grok_chaos') earn('ach_08');
      } else if (n.value === 'suspended_card') count('ach_04', 2);
    }
    function choice(state, n, index) {
      const o = n.options[index];
      if (o.label) add('seenLabels', (state.storyId ?? 'prologue') + ':' + o.label);
      if (n.type === 'temp_tuner' && index !== 1) count(index === 0 ? 'ach_03' : 'ach_02', 3);
      if (n.type === 'choice' && feedingChoices.some(fragment => o.text.includes(fragment))) count('ach_07', 3);
      if (state.storyId === 'chapter3' && n.text?.includes('第一关智取冷面委员长 GLM')) earn('ach_10');
    }
    function note(state) {
      const key = (state.storyId ?? 'prologue') + ':' + state.pc;
      if (add('openedNotes', key) && list('openedNotes').size >= 8) earn('ach_06');
    }
    function position(state) {
      const id = state.storyId ?? 'prologue', n = storyFor(state).nodes[state.pc];
      add('visitedChapters', id);
      const hub = chart(id).hubs.get(state.pc);
      if (hub) {
        const key = 'hub.' + hub.key;
        const prior = get(key);
        // Prefer the original, unused roam board when an older save first opens mid-visit.
        if (prior?.version !== state.version || (prior.roam?.visited.length && !state.roam?.visited.length)) {
          const { history, historyLength, ...rest } = state;
          const point = structuredClone(rest);
          // Replay starts its own backlog. Keep route/bonfire affection baselines.
          for (const origin of [point.routeOrigin, point.bonfireOrigin])
            if (origin) origin.historyLength = 0;
          put(key, point);
        }
        add('seenLabels', hub.key);
      }
      if (n.type !== 'scene_end') return;
      add('clearedChapters', id);
      const cleared = list('clearedChapters');
      if (cleared.has('chapter1') && cleared.has('chapter2')) earn('ach_09');
      if (id === 'chapter5' && heroes.includes(state.finaleHero))
        earn(finaleMedals[heroes.indexOf(state.finaleHero)]);
    }
    function chapterUnlocked(id) {
      const index = chapterIds.indexOf(id);
      if (index < 0) return false;
      const cleared = list('clearedChapters');
      return index === 0 || list('visitedChapters').has(id) || cleared.has(id) || cleared.has(chapterIds[index - 1]);
    }
    // Backfill chapters actually reached, including runs begun with the old selector.
    function importClearances() {
      if (finaleMedals.some(id => list('achievements').has(id))) add('clearedChapters', 'chapter5');
      const visited = new Set([...list('seenLabels')].map(key => key.split(':')[0]));
      let latest = null;
      for (const key of ['autosave', ...manualSlots]) {
        const record = read(key);
        if (!record?.state || record.version !== record.state.version) continue;
        const frames = Array.isArray(record.frames) ? record.frames : [];
        for (const frame of [...frames, record.state]) {
          const story = frame && storyFor(frame);
          if (!story?.version || frame.version !== story.version || !Number.isInteger(frame.pc) || !story.nodes[frame.pc]) continue;
          const id = frame.storyId ?? 'prologue';
          visited.add(id);
          if (story.nodes[frame.pc].type === 'scene_end') add('clearedChapters', id);
          if (!awaitingName(frame) && frame.names?.player_name && (!latest || record.date >= latest.date))
            latest = { date: record.date || '', names: frame.names };
        }
      }
      for (const id of chapterIds) {
        const nodes = storyFor({ storyId: id })?.nodes;
        if (visited.has(id) || nodes?.some(n => n.type === 'bg' && n.value.startsWith('cg_') && get('album.' + n.value)))
          add('visitedChapters', id);
      }
      if (latest && !get('playerNames')?.player_name) put('playerNames', latest.names);
    }
    // Old slots already contain the visited choice panels and the player's replies.
    // Import these facts only. Loading a slot must never increment action counters.
    function restoreHistory(state, frames) {
      for (const frame of frames) {
        const id = frame.storyId ?? 'prologue', n = storyFor(frame).nodes[frame.pc];
        if (n.type === 'input_player_name') earn('ach_01');
        if (n.value === 'delete_panic') earn('ach_05');
        if (n.type === 'scene_end') position(frame);
        if (!n.options) continue;
        if (chart(id).hubs.has(frame.pc)) position(frame);
        const reply = state.history[frame.historyLength];
        if (reply?.who !== '部长决定') continue;
        const selected = n.options.find(o => interpolate(o.text, frame) === reply.text);
        if (selected?.label) pass(frame, { type: 'label', value: selected.label });
      }
    }
    function checkpoint(hub, id, names) {
      const point = get('hub.' + hub.key);
      if (point?.version !== storyFor({ storyId: id }).version || point.pc !== hub.pc) return;
      return { ...structuredClone(point), names: { ...(names?.player_name ? names : point.names) }, history: [] };
    }
    return { chart, locate, list, earn, pass, choice, note, position, checkpoint, restoreHistory, chapterUnlocked, importClearances };
  }
  window.WhiteboxReplay = { progress, manualSlots, chapterBg };
})();
