(() => {
  'use strict';
  const { shuffle, grade, memoryRank, stroopScore } = window.WhiteboxArcade;
  const { papers, edits, rumors } = window.ArcadeDecks;
  const side = key => ['a', 'arrowleft'].includes(key) ? 0 : ['d', 'arrowright'].includes(key) ? 1 : -1;

  function rice(g) {
    const field = g.el('div', 'rice-field'), bowl = g.el('div', 'rice-bowl');
    field.setAttribute('aria-label', '拖动饭盆接食物，也可按左右方向键');
    bowl.append(g.pic('assets/sprites/deepseek-1-front.webp', 'DeepSeek'), g.el('b', '', '🍚'));
    field.append(bowl); g.area.append(field);
    const items = [], keys = new Set();
    const food = ['🍚', '🍳', '🌟', '🫐', '🟨', '🐱'];
    const lines = ['香喷喷！算力回满！', '配米饭绝杀！再吃三碗！', '纯金饭卡降临！全屏米饭暴走啦♪！',
      '呜哇是王大叔的黑暗料理，快吐掉！', 'Claude：不许在食堂狂奔干饭！', '呜喵？！呆毛信号反了救命呀！'];
    let x = 0.5, lives = 3, combo = 0, best = 0, score = 0, spawn = 0, fever = 0, stun = 0, reverse = 0, bag = [];
    function status() {
      const effects = [fever > g.age && 'Fever ×2', stun > g.age && '黄牌僵直', reverse > g.age && '方向反转'].filter(Boolean);
      g.score(score, '♥ ' + lives + '　连击 ' + combo + (effects.length ? '　' + effects.join(' · ') : ''));
      field.classList.toggle('fever', fever > g.age);
      bowl.classList.toggle('frozen', stun > g.age);
    }
    function move(v) {
      x = Math.max(0.055, Math.min(0.945, v));
      bowl.style.left = (x * 100) + '%';
    }
    let pointer = null, lastX;
    function pointerMove(e) {
      if (e.pointerId !== pointer || !g.active()) return;
      const delta = (e.clientX - lastX) / field.clientWidth;
      lastX = e.clientX;
      if (stun <= g.age) move(x + delta * (reverse > g.age ? -1 : 1));
    }
    field.onpointerdown = e => {
      if (!g.active() || pointer !== null) return;
      pointer = e.pointerId; lastX = e.clientX;
      field.setPointerCapture(pointer);
      if (stun <= g.age) {
        const pos = (e.clientX - field.getBoundingClientRect().left) / field.clientWidth;
        move(reverse > g.age ? 1 - pos : pos);
      }
    };
    field.onpointermove = pointerMove;
    field.onlostpointercapture = () => { pointer = null; };
    function drop() {
      if (!bag.length) bag = shuffle([0,0,0,0,0,0,0,0,1,1,1,1,2,3,3,4,5]);
      const type = fever > g.age ? (Math.random() < 0.86 ? 0 : 1) : bag.pop();
      const icon = g.el('span', 'rice-drop', food[type]), at = 0.06 + Math.random() * 0.88;
      icon.classList.toggle('trap', type >= 3);
      icon.style.left = at * 100 + '%'; field.append(icon);
      items.push({ type, at, y: -0.05, speed: 0.34 + Math.random() * 0.18, icon });
    }
    function catchItem(type) {
      if (type < 3) {
        score += [100, 250, 500][type] * (fever > g.age ? 2 : 1);
        best = Math.max(best, ++combo);
        if (type === 2) fever = g.age + 5;
      } else if (type === 3) { lives--; combo = 0; }
      else if (type === 4) stun = g.age + 1.2;
      else reverse = g.age + 3;
      g.sound(type < 3 ? 'se_rice_ding' : 'se_stamp');
      if (type === 4) g.say(lines[type], 'smug', 'claude');
      else g.say(lines[type], type < 3 ? 'happy' : type === 5 ? 'shock' : 'panicked');
    }
    function finish() { g.end(grade('deepseek', score), '最高连击 ' + best + ' · 剩余生命 ' + lives); }
    status(); move(x);
    return {
      tick(dt) {
        if (stun <= g.age) {
          const left = keys.has('a') || keys.has('arrowleft'), right = keys.has('d') || keys.has('arrowright');
          if (left !== right) move(x + (right ? 1 : -1) * (reverse > g.age ? -1 : 1) * dt * 1.12);
        }
        if (g.age >= spawn) { drop(); spawn = g.age + (fever > g.age ? 0.16 : 0.47); }
        for (let i = items.length - 1; i >= 0; i--) {
          const it = items[i], before = it.y;
          it.y += it.speed * dt; it.icon.style.top = it.y * 100 + '%';
          const caught = before <= 0.97 && it.y >= 0.87 && Math.abs(x - it.at) <= 0.105;
          if (caught) catchItem(it.type);
          if (caught || it.y >= 1.08) { it.icon.remove(); items.splice(i, 1); }
          if (!lives) { status(); finish(); return; }
        }
        status();
      },
      key(key, down) { if (side(key) < 0) return false; if (down) keys.add(key); else keys.delete(key); return true; },
      blur() { keys.clear(); pointer = null; }, timeout: finish,
    };
  }

  function review(g) {
    const ruleText = ['禁破折号「——」', '禁干饭与拼单私货', '禁校园八卦造谣与挑衅', '禁匿名、拒署名和外星猫署名'];
    const order = shuffle([1,2,3,4]);
    const rules = g.el('div', 'arc-rules'), paper = g.el('article', 'arc-paper');
    const title = g.el('h4'), by = g.el('small'), body = g.el('p');
    paper.append(title, by, body);
    let deck = [], current, hits = 0, combo = 0, score = 0, activeRules;
    function deal() {
      if (!deck.length) deck = shuffle(papers);
      current = deck.pop();
      const phase = Math.floor(hits / 5), count = Math.min(3, phase + 1);
      activeRules = Array.from({ length: count }, (_, i) => order[(phase + 1 - count + i) % 4]);
      rules.replaceChildren(...activeRules.map(id => g.el('span', '', 'R' + id + ' ' + ruleText[id - 1])));
      title.textContent = '《' + current.title + '》';
      by.textContent = '署名　' + window.Whitebox.interpolate(current.author, g);
      body.textContent = current.body;
      if (!document.documentElement.classList.contains('still') && !matchMedia('(prefers-reduced-motion: reduce)').matches)
        paper.animate([{ opacity: 0.7, transform: 'translateX(8px)' }, { opacity: 1, transform: 'none' }], 140);
    }
    function answer(index) {
      if (!g.active()) return;
      const violations = current.rules.filter(r => activeRules.includes(r));
      if (Boolean(violations.length) === Boolean(index)) {
        hits++; combo++; score += 150 * Math.min(3, 1 + Math.floor((combo - 1) / 5));
        g.say(violations.length ? '黄牌生效！触犯 ' + violations.map(r => 'R' + r).join('、') : '准予刊登，这份稿子很干净。', 'happy');
      } else {
        combo = 0; g.setTime(Math.max(0, g.left - 5));
        g.say(violations.length ? '呜哇把违纪稿印上校刊了！' : '误封好同学了，快去道歉！', 'panicked');
      }
      g.sound('se_stamp'); g.score(score, '正确 ' + hits + '　连击 ' + combo + '　倍率 ×' + Math.min(3, 1 + Math.floor(combo / 5)));
      if (!g.left) finish(); else deal();
    }
    function finish() { g.end(grade('claude', score), '正确审稿 ' + hits + ' 份'); }
    const verdicts = g.pair('准予通过', '拍黄牌停权', answer);
    verdicts.classList.add('review-verdicts');
    verdicts.children[0].append(g.el('kbd', '', 'A / ←'));
    verdicts.children[1].append(g.el('kbd', '', 'D / →'));
    g.area.append(rules, paper, verdicts); deal();
    return { key: binary(answer), timeout: finish };
  }

  function binary(answer) {
    return (key, down) => {
      const index = side(key);
      if (index < 0) return false;
      if (down) answer(index);
      return true;
    };
  }
  function reaction(g) {
    const sign = g.el('strong', 'stroop-rule'), star = g.el('div', 'stroop-star');
    let word, ink, byInk, hits = 0, combo = 0, best = 0;
    function draw() {
      word = Math.floor(Math.random() * 2); ink = Math.floor(Math.random() * 2); byInk = Math.random() < 0.5;
      sign.textContent = byInk ? '看字体颜色！' : '看文字含义！';
      star.textContent = word ? '金瞳演算' : '粉瞳浪漫';
      star.style.color = ink ? '#D99B26' : '#E24A96';
    }
    function answer(index) {
      if (!g.active()) return;
      if (index === (byInk ? ink : word)) {
        hits++; best = Math.max(best, ++combo);
        g.sound('se_bubble_pop'); g.say(combo >= 10 ? '双星高速同调☆！' : '答对啦，给你一颗星！', 'happy');
      } else { combo = 0; g.sound('se_drum'); g.say('呜哇左右眼信号撞车啦！', 'shock'); }
      star.classList.toggle('synced', combo >= 10);
      g.score(stroopScore(hits), '正确 ' + hits + '　连击 ' + combo); draw();
    }
    g.area.append(sign, star, g.pair('左 · 玫粉', '右 · 鎏金', answer)); draw();
    return { key: binary(answer), timeout: () => g.end(grade('gemini', stroopScore(hits)), '正确 ' + hits + ' 题 · 最高 ' + best + ' 连') };
  }

  function memory(g) {
    const { actors, outfits, clothesFor } = window.WhiteboxStudio;
    const quips = {
      gpt: '两张衣装完美对齐——这句可以不用改！', claude: '两张照片都有署名。准予成双！',
      gemini: '一只眼睛记一张，合起来刚刚好☆', grok: '哼，这么好看的本小姐，当然要收藏两张！',
      deepseek: '衣兜里有两张半价券，也刚好凑一对♪', glm: '归档完毕，配对误差为零。',
      qwen: '好事成双。茶也替你斟两杯。', kimi: '两张照片，合成一个和弦。', mistral: '认出两朵一样的花，奖励一阵春风！',
    };
    const looks = shuffle(actors).slice(0, 8).map(id => {
      const costume = shuffle(clothesFor(id))[0];
      return { id, costume, name: window.Whitebox.member[id][0] + ' · ' + outfits[costume] };
    });
    const deck = shuffle([...looks, ...looks]), grid = g.el('div', 'arc-memory');
    const cards = [], open = [], matched = new Set();
    let moves = 0, turnBack = 0;
    function paint(i, show) {
      const c = cards[i], look = deck[i];
      c.classList.toggle('flipped', show);
      c.setAttribute('aria-label', '第 ' + (i+1) + ' 张 · ' + (show ? look.name : '翻牌'));
      c.replaceChildren(...(show ? [g.pic('assets/sprites/' + look.id + '-' + look.costume + '-front.webp', ''), g.el('small','',look.name)]
        : [g.el('b', '', '白')]));
    }
    function flip(i) {
      if (!g.active() || matched.has(i) || open.includes(i) || open.length >= 2) return;
      paint(i, true); open.push(i); g.sound('se_poke');
      if (open.length < 2) return;
      moves++;
      if (deck[open[0]] === deck[i]) {
        open.forEach(j => { matched.add(j); cards[j].classList.add('paired'); cards[j].setAttribute('aria-disabled', 'true'); }); open.length = 0;
        const id = deck[i].id;
        g.say(window.Whitebox.member[id][0] + '：' + quips[id], 'happy', id); g.sound('se_bell_chime');
      } else turnBack = g.age + 0.85;
      const pairs = matched.size / 2;
      g.score(pairs * 300, pairs + ' / 8 对　' + moves + ' 步');
      if (pairs === 8) {
        const rank = memoryRank(moves, g.age);
        g.score([0,1500,3500,6000][rank] + Math.max(0, 24 - moves) * 10, '全部配对');
        g.end(rank, moves + ' 步 · ' + Math.ceil(g.age) + ' 秒');
      }
    }
    deck.forEach((_, i) => {
      cards.push(g.button('', () => flip(i))); paint(i, false); grid.append(cards[i]);
    });
    g.area.append(grid); g.score(0, '0 / 8 对　0 步');
    return { tick() { if (open.length === 2 && g.age >= turnBack) { open.forEach(i => paint(i, false)); open.length = 0; } },
      key(key, down) {
        const delta = { arrowleft: -1, arrowright: 1, arrowup: -4, arrowdown: 4 }[key];
        if (!delta) return false;
        const i = cards.indexOf(document.activeElement);
        if (down) cards[i < 0 ? 0 : (i + delta + 16) % 16].focus();
        return true;
      } };
  }

  function rumor(g) {
    const grid = g.el('div', 'rumor-board'), lamp = g.el('p', 'rumor-lamp');
    const cells = [], entries = Array(9).fill(null);
    let score = 0, combo = 0, spawn = 0, deck = [], phase = 'green', caught = false, frozen = 0, inspections = 0;
    const interval = () => 10 + Math.random() * 4;
    let warnAt = interval(), changeAt;
    function status() { g.score(score, '连击 ' + combo + '　巡检通过 ' + inspections); }
    function light(color, text) { phase = color; grid.dataset.light = color; lamp.dataset.light = color; lamp.textContent = text; }
    function clear(i) {
      entries[i] = null; cells[i].className = ''; cells[i].replaceChildren(g.el('small', '', String(i + 1)));
      cells[i].setAttribute('aria-label', (i + 1) + ' 号空位');
    }
    function hit(i) {
      if (!g.active() || !entries[i] || frozen > g.age) return;
      if (phase === 'red') {
        caught = true; combo = 0; frozen = g.age + 2.5;
        g.say('GLM：巡检期间擅自动锤。罚站两秒半。', 'strict', 'glm'); g.sound('se_stamp');
      } else {
        const fake = entries[i].fake;
        score = Math.max(0, score + (fake ? 200 : -100)); combo = fake ? combo + 1 : 0;
        g.say(fake ? '这瓜是假的，盖章辟谣！' : '笨蛋！那条是真的暖新闻！', fake ? 'smug' : 'panicked');
        g.sound(fake ? 'se_chips_crunch' : 'se_stamp'); clear(i);
      }
      status();
    }
    for (let i = 0; i < 9; i++) { cells.push(g.button('', () => hit(i))); clear(i); grid.append(cells[i]); }
    g.area.append(lamp, grid); light('green', '绿灯 · 可以辟谣'); status();
    return { tick() {
      if (phase === 'green' && g.age >= warnAt) {
        light('yellow','⚠️ 走廊传来方格鞋脚步声……'); changeAt = g.age + 0.8; g.sound('se_knock_strict');
      } else if (phase === 'yellow' && g.age >= changeAt) {
        light('red','▦ 风纪委员长 GLM 巡检中！全员静止 1.5 秒！'); caught = false; changeAt = g.age + 1.5;
      } else if (phase === 'red' && g.age >= changeAt) {
        if (!caught) { score += 300; inspections++; status(); g.say('巡检通过！摸鱼奖励 +300。', 'smug'); }
        light('green','绿灯 · 可以辟谣'); warnAt += interval();
      }
      grid.classList.toggle('frozen', frozen > g.age);
      for (let i = 0; i < 9; i++) if (entries[i] && g.age >= entries[i].until) clear(i);
      if (g.age < spawn) return;
      spawn = g.age + 0.43;
      const i = shuffle(cells.map((_, j) => j).filter(j => !entries[j]))[0];
      if (i === undefined) return;
      if (!deck.length) deck = shuffle(rumors);
      const [line, fake] = deck.pop();
      entries[i] = { fake, until: g.age + 2.4 };
      cells[i].className = fake ? 'rumor-fake' : 'rumor-real';
      const tag = fake ? '假瓜' : '暖闻';
      cells[i].setAttribute('aria-label', (i + 1) + ' ' + tag + ' · ' + line);
      cells[i].firstChild.textContent = (i + 1) + ' · ' + tag;
      cells[i].append(g.el('span', '', line));
    }, key(key, down) {
      if (!/^[1-9]$/.test(key)) return false;
      if (down) hit(Number(key) - 1); return true;
    }, timeout: () => g.end(grade('grok', score), '巡检通过 ' + inspections + ' 次') };
  }

  function edit(g) {
    const heading = g.el('h4'), tokens = g.el('div', 'edit-tokens'), paper = g.el('article', 'arc-paper');
    const submit = g.button('✂ 提交清爽定稿', () => judge(false), 'system-action primary');
    let level = 0, clears = 0, score = 0, selected = new Set();
    const text = word => window.Whitebox.interpolate(word, g);
    function toggle(i) {
      if (!g.active() || i < 0 || i >= edits[level].length) return;
      if (selected.has(i)) selected.delete(i); else selected.add(i);
      tokens.children[i].setAttribute('aria-pressed', String(selected.has(i)));
      if (selected.has(i) && edits[level][i][1]) { g.say('抱歉，您删得完全正确！', 'blush'); g.sound('se_poke'); }
    }
    function deal() {
      g.setTime(15); selected = new Set();
      heading.textContent = '第 ' + (level + 1) + ' / 8 稿';
      tokens.replaceChildren(...edits[level].map(([word], i) => {
        const b = g.button(text(word), () => toggle(i)); b.setAttribute('aria-pressed', 'false'); return b;
      }));
    }
    function judge(expired) {
      if (!g.active()) return;
      const line = edits[level], ok = !expired && line.every(([, remove], i) => selected.has(i) === remove);
      if (ok) { clears++; score += 1000; }
      const draft = line.filter(([, remove]) => !remove).map(([word]) => text(word)).join('');
      g.say((ok ? '定稿通过！' : expired ? '到点交稿。参考定稿：' : '再精炼一点。参考定稿：') + draft, ok ? 'happy' : 'thinking');
      g.sound(ok ? 'se_bell_chime' : 'se_stamp'); g.score(score, '通过 ' + clears + ' 稿');
      if (++level === edits.length) g.end(grade('gpt', clears), '准确完成 ' + clears + ' / 8 稿 · ' + draft);
      else deal();
    }
    paper.append(heading, g.el('small', 'edit-help', '点击废话词块划除 · 再点恢复 · 按 S 提交'), tokens);
    g.area.append(paper, submit); deal();
    return { key(key, down) {
      if (key !== 's' && !/^[1-8]$/.test(key)) return false;
      if (down) { if (key === 's') judge(false); else toggle(Number(key) - 1); }
      return true;
    }, timeout: () => judge(true) };
  }
  window.ArcadeRounds = { deepseek: rice, claude: review, gemini: reaction, memory, grok: rumor, gpt: edit };
})();
