(() => {
  'use strict';
  const games = {
    deepseek: { title: '大肥鱼接白米饭！', bg: 'bg_cafeteria_day', time: 60, marks: [2500, 5000, 8000],
      help: '拖动饭盆，或用 ← →、A / D 移动。接米饭、蛋和饭卡，躲开星空派、黄牌和铃铛。',
      hello: '饭盆就位！金饭卡掉下来的时候记得接住呀♪', end: '成绩单可以折成饭团包装纸吗？下一碗我还接得住！' },
    claude: { title: '红线审稿员：请拍黄牌！', bg: 'bg_greenhouse_lib_day', time: 90, marks: [1800, 3500, 5500],
      help: '只按桌上生效的红线审稿。A / ← 通过，D / → 停权。累计答对五份换规则，误判扣五秒。',
      hello: '请核对本期红线。即使是部长投稿，我也会认真审的。', end: '印泥借你擦一擦。今天守住校刊的这双手，辛苦了。' },
    gemini: { title: '双星异瞳大乱斗', bg: 'bg_prism_music_day', time: 60, marks: [1500, 3500, 6000],
      help: '看清指令，再按文字含义或字体颜色选粉或金。A / ← 选粉，D / → 选金。连续答对十题点亮双星。',
      hello: '左玫粉，右鎏金。这次轮到你指挥猫猫的左右脑啦☆', end: '同步结果已收到！快来跟猫猫击个掌☆' },
    grok: { title: '午夜吃瓜木头人！', bg: 'bg_clock_attic_night', time: 45, marks: [2000, 4200, 6800],
      help: '点击紫红色谣言，放过米绿色暖新闻。也可按数字 1–9。黄灯预警，红灯停手，熬过巡检加 300 分。',
      hello: '小声点，委员长的鞋跟一响就把锤子藏好！', end: '勉强准你明晚继续当本小姐的匿名墙搭档。' },
    gpt: { title: '破折号急救站！帮学姐砍废话', bg: 'bg_room_404_sunset', time: 15, marks: [5, 7, 8],
      help: '每关十五秒，点词块划掉赘语，再点可撤销。数字键选词，S 提交。八关全对拿金牌。',
      hello: '先声明，学姐的每个字都有它存在的——好啦，红笔给你。', end: '删到最后，学姐最想留下的，就是那句给你的话。' },
  };
  const ranks = ['未获牌', '🥉 铜牌', '🥈 银牌', '🥇 金牌'];
  const decorations = {
    instant: '拍立得胶片相框', seal: '404 封条贴纸', friends: '小鲸鱼、小螃蟹与四芒星', yellow: '烫金黄牌贴纸',
  };
  const theatre = {
    deepseek: ['周末饭团特训', 'DeepSeek：学长，把手伸过来。米饭要这样轻轻拢起来。', '部长：这颗怎么歪了？', 'DeepSeek：因为你刚才碰到我的手呀。歪的那颗归我，它最甜♪'],
    claude: ['深夜独家朗读会', 'Claude：这页还没发表，坐近些，我只读一遍。', '部长：最后一行怎么空着？', 'Claude：那里要填听众的名字。今晚……只有你。'],
    gemini: ['只给你听的安可', 'Gemini：散场啦，可猫猫还有一句唱给第一排！', '部长：第一排只有我呀。', 'Gemini：所以左右两只眼睛都看着你，谁也不用抢镜啦☆'],
    grok: ['帮 Grok 修怀表反被蹭脸', 'Grok：把齿轮按住！再靠近半寸就行。', '部长：修好啦。刚才蹭到我脸的是……', 'Grok：怀表的谢礼！本小姐可不许你把这条发上匿名墙。'],
    gpt: ['白龙学姐的短笺', 'GPT：本来写了八页，怕你没空看，就留下这一张。', '部长：上面只有「明天见」。', 'GPT：嗯。明天想见你，后天也想。这句不许删。'],
  };
  const greetings = {
    deepseek: ['早饭给你留了热饭团。', '午餐队伍排到我啦，想要双份吗？', '晚霞和锅巴都是金色的呀。', '饭煲在保温，你也休息一会儿嘛。'],
    claude: ['晨读铃响了，我给你夹好了书签。', '午间审稿暂停十分钟，一起喝茶吧。', '夕阳正好读诗，你来翻下一页？', '深夜朗读会，只给你留了一盏灯。'],
    gemini: ['早安☆ 猫猫的两只眼睛都开机啦！', '午休点歌，部长可以独占第一首！', '夕阳是金色的，晚霞是玫粉色的☆', '深夜耳机分你一半，小声听哦。'],
    grok: ['哼，早到是为了抢头条，才没在等你！', '午休了，来听本小姐最新的瓜。', '夜庭开门！跟班，替我拿着怀表。', '还没睡？那就陪本小姐看看钟楼的灯。'],
    gpt: ['早安！学姐把今日计划缩成了一张便签。', '午饭时间——好，听你的，吃完再演讲。', '晚霞很好看。就这一句，没有破折号。', '熬夜配额用完啦，让学姐陪你收工吧。'],
  };
  function shuffle(items) {
    const deck = [...items];
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }
  function grade(id, score) { return games[id].marks.filter(mark => score >= mark).length; }
  function memoryRank(moves, seconds) { return moves <= 14 && seconds <= 50 ? 3 : moves <= 21 && seconds <= 90 ? 2 : 1; }
  function stroopScore(hits) { return hits * 100 + (hits >= 30 ? 500 : 0) + (hits >= 45 ? 1000 : 0); }
  function profile(value) {
    return { coins: 0, records: {}, owned: [], host: '', outfit: '1', ...value };
  }
  function stars(p) { return Object.keys(games).reduce((sum, id) => sum + (p.records[id]?.rank || 0), 0); }
  function settle(p, id, mode, score, rank) {
    const best = p.records[id] || {}, prev = best.modes?.[mode] || {};
    const target = id === 'gpt' ? 8000 : games[id].marks[2];
    const coins = 50 + Math.round(250 * Math.min(1, score / target));
    p.coins += coins;
    p.records[id] = { score: Math.max(score, best.score || 0), rank: Math.max(rank, best.rank || 0),
      modes: { ...best.modes, [mode]: { score: Math.max(score, prev.score || 0), rank: Math.max(rank, prev.rank || 0) } } };
    return coins;
  }
  function price(key) {
    const [type, id] = key.split('.');
    if (type === 'decor' && Object.hasOwn(decorations, id)) return 200;
    if (!Object.hasOwn(games, id)) return;
    if (type === 'host') return 300;
    if (type === 'scene') return 400;
  }
  function purchase(p, key) {
    const cost = price(key);
    if (!cost || p.coins < cost || p.owned.includes(key)) return false;
    p.coins -= cost;
    p.owned.push(key);
    if (key.startsWith('host.')) { p.host = key.slice(5); p.outfit = '1'; }
    return true;
  }
  function cabinet(read, write) {
    const key = 'arcade';
    const current = () => profile(read(key));
    async function change(edit) {
      function commit() {
        const draft = current(), result = edit(draft);
        if (result === false) return false;
        if (!write(key, draft)) throw Error('游乐角记录未能保存，请检查浏览器存储后重试。');
        return result;
      }
      return navigator.locks ? navigator.locks.request('whitebox.404.arcade', commit) : commit();
    }
    return { current, change };
  }
  window.WhiteboxArcade = { games, ranks, decorations, theatre, greetings, shuffle, grade, stroopScore,
    memoryRank, stars, settle, price, purchase, cabinet };
})();
