(() => {
  'use strict';
  const { heroes, member } = window.Whitebox;
  const { chapterBg } = window.WhiteboxReplay;
  const { medals } = window.WhiteboxReplayData;
  const kinds = { dispatch: '双人派单', roam: '自由串门', tuner: '心音调温', choice_hub: '路线抉择',
    route: '个人线', branch: '分支', merge: '交会点', ending: '章末', start: '章首' };
  const bands = ['低温', '黄金中温', '高温'];
  const values = ['0.1', '0.7', '1.6'];
  const svgNS = 'http://www.w3.org/2000/svg';
  const icon = window.WhiteboxIcon;
  const percent = (found, total) => (total ? Math.floor(found * 1000 / total) / 10 : 0).toFixed(1);

  function mount(root, { el, pic, button, meter, progress, chapters, lockHint, read, state, hasReturnPoint, jump, viewCg }) {
    const life = new AbortController();
    const listen = (target, event, fn, options) => target.addEventListener(event, fn, { ...options, signal: life.signal });
    const media = matchMedia('(max-width: 760px)');
    const currentChapter = state && (state.storyId ?? 'prologue');
    const current = progress.locate(state);
    const cleared = progress.list('clearedChapters'), seen = progress.list('seenLabels'), awards = progress.list('achievements');
    const visited = item => seen.has(item.key);
    const hasArt = id => !!id && !!read('album.' + id);
    const count = items => [...items].filter(visited).length;
    const info = chapters.map((chapter, index) => {
      const chart = progress.chart(chapter.id);
      return { ...chapter, chart, index, short: chapter.title.split(/[　（]/)[0],
        found: count(chart.entries.values()), total: chart.entries.size, open: progress.chapterUnlocked(chapter.id) };
    });
    const total = info.reduce((sum, c) => sum + c.total, 0);
    const explored = info.reduce((sum, c) => sum + c.found, 0);
    let chapter = info.find(c => c.id === currentChapter && c.open) || info.filter(c => c.open).at(-1);
    let filter = '', highlight = false, overview = false, selected, hovered, currentView, frame = 0, drag, suppressClick = false;
    let views = [], edges = [];
    const railButtons = [], filters = [];
    const bgPic = (bg, cls) => pic('assets/bg/' + bg + '.webp', '', cls);
    const portrait = (id, dress) => pic('assets/avatars/' + id + '-' + dress + '.webp', '', 'flow-face');
    const outfit = () => chapter.id === 'chapter5' ? 3 : 1;
    const ready = item => item?.pc != null && visited(item) && !!progress.checkpoint(item, chapter.id);
    const scene = item => item.bg.startsWith('cg_') && !hasArt(item.bg) ? chapterBg[chapter.id] : item.bg;

    root.classList.add('flow-atlas');
    const header = el('header', 'flow-header'), intro = el('div', 'flow-intro'), score = el('div', 'flow-score');
    const pct = percent(explored, total);
    const remark = hasReturnPoint ? '临时观测已登记。原坐标保留，随时可以归队。' :
      explored === total ? '所有世界线均已归档。部长，这次没有一格留白。' :
      Number(pct) >= 60 ? '图谱已成形。余下的虚线，值得逐一核对。' :
      Number(pct) >= 25 ? '分歧记录正在交汇。请核对尚未抵达的支线。' : '初始坐标已校准。虚线尽头，仍有尚未记录的可能。';
    intro.append(el('h3', '', 'GLM 的方格世界线观测图'), el('p', '', remark));
    const metric = el('div');
    metric.append(el('span', '', '总探索度'), el('strong', '', pct + '%'));
    score.append(metric, meter(explored, total, '总探索度'));
    const endings = [...info.at(-1).chart.entries.values()].filter(item =>
      item.kind === 'route' && (hasArt(item.cg) || awards.has(item.medal))).length;
    const collection = el('span', 'flow-collection', '告白终章 ' + endings + '/5');
    collection.prepend(icon('gallery'));
    header.append(portrait('glm', cleared.has('chapter5') ? 3 : 1), intro, collection, score);

    const toolbar = el('div', 'flow-toolbar');
    toolbar.setAttribute('role', 'group'); toolbar.setAttribute('aria-label', '角色筛选与路径视图');
    for (const id of ['', ...heroes]) {
      const b = button(id ? member[id][0] : '全员', () => { filter = id; paint(); }, 'flow-filter');
      b.dataset.hero = id;
      if (id) { b.style.setProperty('--tone', member[id][2]); b.prepend(el('i')); }
      filters.push(b); toolbar.append(b);
    }
    const toolsRight = el('div', 'flow-tools-right');
    const overviewButton = button('全景视图', () => {
      overview = !overview;
      root.classList.toggle('overview', overview);
      overviewButton.setAttribute('aria-pressed', String(overview));
      queueLinks();
    }, 'flow-overview-toggle');
    overviewButton.prepend(icon('map'));
    overviewButton.setAttribute('aria-pressed', 'false');
    const highlightButton = button('高亮未探索', () => { highlight = !highlight; paint(); }, 'flow-unseen-toggle');
    highlightButton.prepend(icon('zoom'));
    toolsRight.append(overviewButton, highlightButton);
    toolbar.append(toolsRight);

    const rail = el('nav', 'flow-rail');
    rail.setAttribute('aria-label', '切换观测章节');
    for (const c of info) {
      if (c.index === 4) {
        const divider = el('span', 'flow-divide');
        divider.setAttribute('aria-hidden', 'true');
        divider.append(el('small', '', '共通'), el('i', '', '→'), el('small', '', '个人'));
        rail.append(divider);
      }
      const b = button('', () => { if (c !== chapter && progress.chapterUnlocked(c.id)) { chapter = c; drawChapter(); } }, 'flow-film');
      railButtons.push(b); b.dataset.story = c.id; b.disabled = !c.open;
      b.setAttribute('aria-label', c.short + '，' + (c.open ? '已探索 ' + c.found + '/' + c.total : lockHint(c.index)));
      b.append(bgPic(chapterBg[c.id], 'flow-film-art'));
      const top = el('span', 'flow-film-top'); top.append(el('b', '', c.short));
      if (c.id === currentChapter) top.append(el('small', 'flow-here', '当前'));
      if (c.found === c.total) top.append(el('small', 'flow-complete', '完'));
      const detail = el('span', 'flow-film-detail', c.open ? c.found + ' / ' + c.total : lockHint(c.index));
      if (!c.open) detail.prepend(icon('lock'));
      b.append(top, detail, meter(c.found, c.total, c.short + '探索进度')); rail.append(b);
    }
    const stage = el('section', 'flow-stage'), map = el('div', 'flow-map');
    stage.tabIndex = 0; stage.setAttribute('aria-label', '章节路径图，可滚动查看节点');
    const svg = document.createElementNS(svgNS, 'svg');
    svg.classList.add('flow-links'); svg.setAttribute('aria-hidden', 'true');
    const inspector = el('section', 'flow-inspector');
    inspector.id = 'flow-inspector';
    inspector.setAttribute('aria-label', '节点档案'); inspector.setAttribute('aria-live', 'polite');
    stage.append(map); root.append(header, rail, toolbar, stage, inspector);
    const resize = new ResizeObserver(queueLinks);
    function queueLinks() {
      if (!frame) frame = requestAnimationFrame(() => { frame = 0; measure(); });
    }
    function shortTitle(item) {
      if (item.kind === 'ending') return '本章归档';
      if (item.cg === 'cg_grand_404_photo') return '404 盛装全家福';
      if (item.tempBand != null) return visited(item) ? item.title : item.hint;
      if (item.kind === 'route' && !visited(item)) return item.hint;
      if (item.kind === 'branch' && !visited(item)) return item.hint;
      // Undiscovered branch text and reunion names stay sealed until reached.
      if (item.kind === 'merge' && !visited(item)) return '主线交会点';
      return item.title;
    }
    function faces(ids) {
      const group = el('span', 'flow-faces');
      group.setAttribute('aria-label', ids.map(id => member[id][0]).join('、'));
      for (const id of ids) group.append(portrait(id, outfit()));
      return group;
    }
    function branchCopy(title) {
      const parts = title.split(' · ');
      if (parts.length !== 2) return el('strong', '', title);
      const wrap = el('span', 'flow-branch-copy');
      wrap.append(el('strong', '', parts[0]), el('small', '', parts[1]));
      return wrap;
    }
    function addNode(host, item, role = item.kind) {
      const b = el('button', 'flow-node flow-' + role);
      b.type = 'button'; b.dataset.key = item.key;
      const stamp = role === 'postage', knownArt = hasArt(item.cg);
      const isHub = item.pc != null, known = stamp ? knownArt : role === 'start' || visited(item);
      const colors = item.actors.map(id => member[id][2]);
      b.style.setProperty('--tone', colors.length <= 2 && colors[0] || 'var(--brass)');
      b.style.setProperty('--tone-end', colors[1] || colors[0] || 'var(--brass)');
      b.classList.toggle('unseen', !known);
      const mark = el('span', 'flow-node-mark', known ? '✓' : '？');
      if (stamp) {
        b.append(knownArt ? bgPic(item.cg, 'flow-stamp-image') : el('span', 'flow-negative', '？'));
        const text = el('span', '', '告白 CG');
        const seal = icon('medal'); seal.classList.toggle('earned', awards.has(item.medal)); text.append(seal);
        b.append(text);
      } else if (isHub) {
        const ribbon = el('span', 'flow-hub-scene'); ribbon.append(bgPic(scene(item)));
        const tag = el('span', 'flow-hub-type', kinds[item.kind]);
        if (ready(item)) tag.append(el('small', '', '空降 ↵'));
        ribbon.append(tag);
        b.append(ribbon, el('strong', '', item.title), el('small', 'flow-hub-count', '已探 ' + count(item.children) + ' / ' + item.children.length));
      } else if (role === 'route') {
        const record = [item, ...item.children, ...item.children.flatMap(child => child.children)];
        const sub = el('small', 'flow-route-meta');
        sub.append(el('span', '', chapter.id === 'chapter4' ? '六月个人线' : '后夜祭终章'),
          el('em', '', count(record) + '/' + record.length));
        b.append(portrait(item.actors[0], outfit()), el('strong', '', member[item.actors[0]][0]), sub);
      } else if (item.tempBand != null) {
        b.dataset.band = item.tempBand;
        b.append(el('span', '', ['❄', '✦', '♨'][item.tempBand]), el('b', '', values[item.tempBand]),
          item.tempBand !== 1 ? el('em', 'flow-retry-glyph', '↺') : el('i', 'flow-band-spacer'), mark);
      } else if (item.cg === 'cg_grand_404_photo') {
        b.classList.add('flow-finale');
        b.append(knownArt ? bgPic(item.cg) : el('span', 'flow-negative', '？'), el('strong', '', shortTitle(item)));
      } else {
        b.append(known && item.actors.length ? faces(item.actors) : mark, branchCopy(shortTitle(item)));
        if (known && item.actors.length) b.append(mark);
      }
      const here = role === 'start' || (current?.key === item.key && (stamp ? state?.bg === item.cg : !(role === 'route' && state?.bg === item.cg)));
      if (here) { b.classList.add('is-current'); b.append(el('small', 'flow-position', '当前')); }
      const label = (stamp ? member[item.actors[0]][0] + ' 告白 CG' : shortTitle(item)) + (known ? '，已探索' : '，未探索');
      b.setAttribute('aria-label', label + (here ? '，当前进度' : ''));
      b.setAttribute('aria-controls', inspector.id);
      const view = { item, b, role, known };
      b.dataset.view = views.length; views.push(view); host.append(b);
      if (here) currentView = view;
      return view;
    }
    function link(from, to, retry = false) {
      const path = document.createElementNS(svgNS, 'path');
      const edge = { from, to, retry, path };
      const ids = to.item.actors.length === 1 ? to.item.actors : from.item.actors.length <= 2 ? from.item.actors : to.item.actors;
      const color = ids.length && ids.length <= 2 ? member[ids[0]][2] : 'var(--brass)';
      path.style.setProperty('--wire', color);
      path.classList.toggle('untraced', !from.known || !to.known);
      path.classList.toggle('return-wire', retry);
      edges.push(edge); svg.append(path);
    }
    function column() { const col = el('div', 'flow-column'); map.append(col); return col; }
    function routes(hub) {
      const tracks = el('div', 'flow-lanes'), tails = [];
      map.append(tracks);
      for (const route of hub.item.children) {
        const lane = el('div', 'flow-lane');
        lane.style.setProperty('--lane', member[route.actors[0]][2]); tracks.append(lane);
        const head = addNode(lane, route);
        link(hub, head);
        const tuner = route.children.find(c => c.kind === 'tuner');
        const control = addNode(lane, tuner); link(head, control);
        const stops = el('div', 'flow-stops'); lane.append(stops);
        const options = tuner.children.map(c => addNode(stops, c));
        for (const opt of options) { link(control, opt); if (opt.item.tempBand !== 1) link(opt, control, true); }
        if (route.cg) {
          const print = addNode(lane, route, 'postage'); link(options[1], print); tails.push(print);
        } else tails.push(options[1]);
      }
      return tails;
    }
    function drawChapter() {
      resize.disconnect();
      svg.replaceChildren(); map.replaceChildren(svg); views = []; edges = []; selected = hovered = currentView = null;
      let tails = [];
      if (currentChapter === chapter.id && !current) {
        // Before the first recorded decision, the reader still has a position on the map.
        tails.push(addNode(column(), { kind: 'start', key: chapter.id + ':start', title: '本章开篇',
          actors: [], bg: state.bg || chapterBg[chapter.id] }));
      }
      for (const item of chapter.chart.roots) {
        if (item.technical && item.kind !== 'ending') continue;
        const hub = addNode(column(), item);
        tails.forEach(tail => link(tail, hub));
        if (!item.children.length) tails = [hub];
        else if (item.children[0].kind === 'route') tails = routes(hub);
        else {
          const group = column(); group.classList.add('flow-fan');
          const opts = item.children.map(c => addNode(group, c));
          for (const opt of opts) { link(hub, opt); if (opt.item.tempBand != null && opt.item.tempBand !== 1) link(opt, hub, true); }
          tails = item.kind === 'tuner' ? [opts[1]] : opts;
        }
      }
      for (const [i, b] of railButtons.entries()) b.setAttribute('aria-pressed', String(info[i] === chapter));
      stage.scrollTo(0, 0);
      select(currentView || views[0]); resize.observe(stage); resize.observe(map);
      views.forEach(v => resize.observe(v.b)); queueLinks();
      const film = railButtons[chapter.index];
      rail.scrollLeft = film.offsetLeft - (rail.clientWidth - film.offsetWidth) / 2;
      const node = selected.b.getBoundingClientRect(), panel = stage.getBoundingClientRect();
      if (currentView || node.bottom > panel.bottom) {
        stage.scrollTo(currentView ? node.left - panel.left + (node.width - panel.width) / 2 : 0,
          node.top - panel.top + (node.height - panel.height) / 2);
      }
    }
    function guidanceText(item, upstream) {
      if (!upstream) return 'GLM 批注 · 推进本章剧情，即可记录此坐标。';
      const names = item.actors.map(id => member[id][0]);
      if (item.tempBand != null)
        return '在「' + upstream.title + '」将温度拨至 ' + values[item.tempBand] + '（' + bands[item.tempBand] + '档）即可观测。';
      if (upstream.kind === 'dispatch')
        return '在「' + upstream.title + '」指派 ' + names.join(' + ') + ' 搭档出发即可观测。';
      if (upstream.kind === 'roam')
        return '在「' + upstream.title + '」前往与 ' + names.join('、') + ' 串门互动即可观测。';
      return '在「' + upstream.title + '」选择 ' + names.join(' / ') + ' 的方向即可观测。';
    }
    function select(view) {
      selected = view;
      const { item, known } = view;
      inspector.replaceChildren();
      const art = item.cg || scene(item);
      const canViewCg = Boolean(item.cg && hasArt(item.cg) && viewCg);
      let photo;
      if (item.cg && !hasArt(art)) {
        photo = el('div', 'flow-negative', '尚未收录');
      } else if (canViewCg) {
        photo = button('', () => viewCg(item.cg, shortTitle(item)), 'flow-dossier-thumb');
        photo.setAttribute('aria-label', '全屏鉴赏 ' + shortTitle(item));
        photo.append(bgPic(art, 'flow-dossier-art'));
      } else {
        photo = bgPic(art, 'flow-dossier-art');
      }
      const copy = el('div', 'flow-dossier-copy'), meta = el('div', 'flow-dossier-meta');
      meta.append(el('span', '', chapter.short + ' / ' + kinds[item.kind]));
      if (item.actors.length) meta.append(faces(item.actors));
      const title = el('h4', '', shortTitle(item));
      copy.append(meta, title);
      let upstream = item.parentKey && chapter.chart.entries.get(item.parentKey.split(':')[1]);
      while (upstream && upstream.pc == null) upstream = upstream.parentKey && chapter.chart.entries.get(upstream.parentKey.split(':')[1]);
      if (!known) copy.append(el('p', '', guidanceText(item, upstream)));
      if (item.cg || item.medal) {
        const labels = [];
        if (item.cg) labels.push('CG ' + (hasArt(item.cg) ? '已收录' : '待收录'));
        if (item.medal) labels.push(medals[item.medal][1] + ' · ' + (awards.has(item.medal) ? '已达成' : '待达成'));
        copy.append(el('small', 'flow-rewards', labels.join('　/　')));
      }
      const anchor = item.pc != null ? item : upstream;
      const action = el('div', 'flow-inspector-action');
      if (canViewCg) {
        const inspectArt = button('全屏鉴赏 CG', () => viewCg(item.cg, shortTitle(item)), 'system-action flow-cg-btn');
        inspectArt.prepend(icon('zoom'));
        action.append(inspectArt);
      }
      if (ready(anchor)) action.append(button(item === anchor ? '↳ 空降至此枢纽' : '↳ 跳至上游枢纽重玩', () => jump(chapter.id, anchor), 'system-action primary'));
      else if (!canViewCg) action.append(el('small', '', anchor ? '抵达该枢纽后可空降' : item.kind === 'start' ? '尚未到达首个枢纽' : '主线交会记录'));
      inspector.append(photo, copy, action); paint();
    }
    function causalEdges(focus) {
      const lit = new Set();
      if (!focus) return lit;
      const seenNodes = new Set([focus]);
      const queue = [focus];
      // Trace all upstream non-retry ancestors back to chapter start.
      while (queue.length) {
        const node = queue.shift();
        for (const edge of edges) {
          if (edge.retry || edge.to !== node) continue;
          lit.add(edge);
          if (!seenNodes.has(edge.from)) {
            seenNodes.add(edge.from);
            queue.push(edge.from);
          }
        }
      }
      // Highlight direct outgoing branches (and retry loops) from the focused node.
      for (const edge of edges) {
        if (edge.from === focus || (edge.retry && edge.to === focus)) lit.add(edge);
      }
      return lit;
    }
    function paint() {
      root.classList.toggle('highlight-unseen', highlight);
      highlightButton.setAttribute('aria-pressed', String(highlight));
      filters.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.hero === filter)));
      // Keep shared timeline anchors (start / merge / finale with no exclusive actor) visible under single-hero filter.
      const matches = v => !filter || v.item.actors.includes(filter) || v.item.actors.length === 0;
      const edgeMatches = (from, to) => {
        if (!filter) return true;
        const fromHas = from.item.actors.includes(filter), toHas = to.item.actors.includes(filter);
        if (from.item.actors.length && to.item.actors.length) return fromHas && toHas;
        if (from.item.actors.length) return fromHas;
        if (to.item.actors.length) return toHas;
        return true;
      };
      const lit = causalEdges(hovered || selected);
      for (const v of views) {
        v.b.classList.toggle('muted', !matches(v));
        v.b.setAttribute('aria-pressed', String(v === selected));
      }
      for (const edge of edges) {
        edge.path.classList.toggle('muted', !edgeMatches(edge.from, edge.to));
        edge.path.classList.toggle('adjacent', lit.has(edge));
      }
    }
    function measure() {
      if (!map.isConnected) return;
      const box = map.getBoundingClientRect(), vertical = media.matches;
      if (!box.width || !box.height) return;
      // CSS pixels in the map's own coordinate space, even while the dialog scales in.
      const sx = map.offsetWidth / box.width, sy = map.offsetHeight / box.height;
      svg.setAttribute('viewBox', '0 0 ' + map.offsetWidth + ' ' + map.offsetHeight);
      const bounds = new Map(views.map(v => {
        const r = v.b.getBoundingClientRect(), x = (r.left - box.left) * sx, y = (r.top - box.top) * sy;
        return [v, { x, y, w: r.width * sx, h: r.height * sy }];
      }));
      let leftSlot = 0, rightSlot = 0;
      for (const { from, to, retry, path } of edges) {
        const a = bounds.get(from), b = bounds.get(to);
        let d;
        if (vertical) {
          if (retry) {
            // Compact local loop beside the tuner hub rather than routing all the way to the viewport margin.
            const leftSide = from.item.tempBand === 0;
            const sx0 = leftSide ? a.x : a.x + a.w, sy0 = a.y + a.h / 2;
            const tx0 = leftSide ? b.x : b.x + b.w, ty0 = b.y + b.h * .65;
            const out = leftSide ? Math.max(4, Math.min(sx0, tx0) - 12) : Math.min(map.offsetWidth - 4, Math.max(sx0, tx0) + 12);
            d = 'M ' + sx0 + ' ' + sy0 + ' C ' + out + ' ' + sy0 + ' ' + out + ' ' + ty0 + ' ' + tx0 + ' ' + ty0;
          } else {
            const x = a.x + a.w / 2, y = a.y + a.h, tx = b.x + b.w / 2, ty = b.y;
            if (Math.abs(ty - y) > 76) {
              const useLeft = to.item.kind === 'branch' || to.item.kind === 'route';
              const side = useLeft ? 6 + (leftSlot++ % 5) * 4 : map.offsetWidth - 8 - (rightSlot++ % 5) * 4;
              d = 'M ' + x + ' ' + y + ' C ' + x + ' ' + (y + 10) + ' ' + side + ' ' + y + ' ' + side + ' ' + (y + 12) +
                ' L ' + side + ' ' + (ty - 12) + ' C ' + side + ' ' + ty + ' ' + tx + ' ' + (ty - 10) + ' ' + tx + ' ' + ty;
            } else {
              const mid = (y + ty) / 2;
              d = 'M ' + x + ' ' + y + ' C ' + x + ' ' + mid + ' ' + tx + ' ' + mid + ' ' + tx + ' ' + ty;
            }
          }
        } else if (retry) {
          // Outer upper/lower return arc so 0.1 & 1.6 loop-backs stay distinct from forward wires.
          const upper = from.item.tempBand === 0;
          const x = a.x + 14, y = upper ? a.y : a.y + a.h;
          const tx = b.x + b.w - 10, ty = upper ? b.y : b.y + b.h;
          const arcY = upper ? Math.min(y, ty) - 11 : Math.max(y, ty) + 11;
          const mid = (x + tx) / 2;
          d = 'M ' + x + ' ' + y + ' Q ' + mid + ' ' + arcY + ' ' + tx + ' ' + ty;
        } else {
          const x = a.x + a.w, tx = b.x;
          const y = a.y + a.h * .5, ty = b.y + b.h * .5, mid = (x + tx) / 2;
          d = 'M ' + x + ' ' + y + ' C ' + mid + ' ' + y + ' ' + mid + ' ' + ty + ' ' + tx + ' ' + ty;
        }
        path.setAttribute('d', d);
      }
    }
    const hit = e => {
      const b = e.target.closest('[data-view]');
      return b && views[Number(b.dataset.view)];
    };
    listen(stage, 'click', e => {
      const v = hit(e);
      if (!v || (suppressClick && e.detail)) return;
      select(v);
      if (!e.detail) inspector.querySelector('button')?.focus({ preventScroll: true });
    });
    listen(stage, 'dblclick', e => {
      const v = hit(e);
      if (ready(v?.item)) jump(chapter.id, v.item);
      else if (v?.role === 'postage' && hasArt(v.item.cg) && viewCg) viewCg(v.item.cg, shortTitle(v.item));
    });
    listen(stage, 'pointerover', e => { const v = hit(e); if (hovered !== v) { hovered = v; paint(); } });
    listen(stage, 'pointerleave', () => { hovered = null; paint(); });
    listen(stage, 'focusin', e => { hovered = hit(e); paint(); });
    listen(stage, 'focusout', () => { hovered = null; paint(); });
    listen(stage, 'wheel', e => {
      if (media.matches || e.ctrlKey || e.shiftKey || e.deltaX || !e.deltaY) return;
      if (map.querySelector('.flow-lanes') && (e.deltaY < 0 ? stage.scrollTop > 0 :
        stage.scrollTop + stage.clientHeight < stage.scrollHeight - 1)) return;
      const before = stage.scrollLeft;
      stage.scrollLeft += e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? stage.clientWidth : 1);
      if (before !== stage.scrollLeft) e.preventDefault();
    }, { passive: false });
    listen(stage, 'pointerdown', e => {
      suppressClick = false;
      if (e.pointerType === 'mouse' && e.button === 0) drag = { id: e.pointerId, x: e.clientX, y: e.clientY, left: stage.scrollLeft, top: stage.scrollTop };
    });
    listen(window, 'pointermove', e => {
      if (!drag || drag.id !== e.pointerId) return;
      const dx = drag.x - e.clientX, dy = drag.y - e.clientY;
      if (!suppressClick && Math.hypot(dx, dy) < 5) return;
      suppressClick = true; stage.setPointerCapture(e.pointerId); stage.classList.add('dragging');
      stage.scrollTo(drag.left + dx, drag.top + dy);
    });
    function stopDrag() { drag = null; stage.classList.remove('dragging'); }
    listen(window, 'pointerup', stopDrag); listen(window, 'pointercancel', stopDrag);
    listen(media, 'change', queueLinks);
    drawChapter();
    return () => { resize.disconnect(); cancelAnimationFrame(frame); life.abort(); };
  }
  window.WhiteboxFlowchart = { mount };
})();
