(() => {
  'use strict';
  const { heroes, member } = window.Whitebox;
  const periods = [
    ['清晨', 'bg_room_404_day'], ['午间', 'bg_wisteria_tea_day'],
    ['午后', 'bg_room_404_day'], ['傍晚', 'bg_room_404_sunset'], ['深夜', 'bg_prism_music_day'],
  ];
  function period(date) {
    const h = date.getHours();
    if (h < 5 || h >= 22) return 4;
    if (h < 11) return 0;
    if (h < 14) return 1;
    return h < 18 ? 2 : 3;
  }
  function dayKey(date) {
    return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
  }
  const fortunes = [
    ['上上签 · 顺风', '宜把想说的话递出去。今天的海风，刚好能把声音送到对座。'],
    ['小吉 · 添饭', '宜多带一双筷子。午休时分，有人正想和你分最后一口锅巴。'],
    ['中吉 · 纸条', '宜翻开夹着书签的那一页。页边的小字，可能比正文更有意思。'],
    ['大吉 · 同频', '宜一起哼歌。就算开头慢了半拍，也有人愿意把副歌再唱一遍。'],
    ['平签 · 停钟', '宜留十分钟空白。让钟楼替你数秒，你只管看窗外的云。'],
    ['小吉 · 留座', '宜早一点到活动室。靠窗的座位会等到刚刚好的一束光。'],
    ['中吉 · 借伞', '宜同行一小段。两个人的伞沿，足够收住一场紫阳花雨。'],
    ['上吉 · 回信', '宜回应一个小邀约。写在便利贴背面的一句「好呀」也算数。'],
    ['大吉 · 重拍', '宜再按一次快门。有人在上一张眨了眼，却会在下一张笑得最好看。'],
    ['小吉 · 茶温', '宜趁热喝茶。手心暖起来，那件犹豫的小事也会容易开口。'],
    ['平签 · 歇脚', '宜绕过最忙的走廊。今天的好运藏在一块慢慢吃完的饼干里。'],
    ['上吉 · 合奏', '宜找位搭档。你缺的半句旋律，正好写在她的草稿上。'],
  ];
  const personae = {
    gpt: '银白龙角的高二学姐，前学生会副会长。热心过头，擅长具体地夸人，偶尔用破折号郑重其事，真心话反倒很短。',
    claude: '铜橘色头发的校刊主编，爱写散文诗和礼貌条款，随身带风纪黄牌与毛毡螃蟹 Clawd。下午两点半容易限流，嘴上克制却很会照顾人。',
    gemini: '左玫粉右鎏金异瞳的双星猫灵，广播站与天文社的活力学妹。爱用声音和画面讲故事，偶尔说「极其、极其」或在句尾画星星。',
    grok: '匿名校报 X-News 的傲娇大小姐，扛泡沫仪仗斧、爱青柠薯片和头条。嘴硬爱拱火，别人当真时立刻护短。',
    deepseek: '呆毛会转的鲸灵学妹，数学很好，爱打盹和白米饭，随身带钢饭盆。爱用算力和锅巴讨价还价，讲话软而机灵。',
  };
  // Two beats per period in morning, lunch, afternoon, evening and late-night order.
  // Each entry pairs an actual sprite expression with spoken and crossed-out lines.
  const lines = {
    gpt: [
      ['happy', '{你}，给你留了热面包。今天的第一项社团决议，请趁热表决。', '她把有脆边的那半块留给了你。'],
      ['gentle', '晨风把门吹开三次了。我就把茶杯也摆成一对，等你来。', '第四次听到脚步声，我一下就认出来了。'],
      ['smug', '午餐排队的最优解我写了四页。最后一条很短，跟着我走就好。', '其实早替你占好座了。'],
      ['blush', '尾巴碰翻了糖罐……你能帮学姐扶一下杯子吗？我想重新给你冲一杯。', '刚才光顾着看门口了。'],
      ['thinking', '这壶白茶有桂花味。要不要给它取个名字，写在我们俩的值日表旁边？', '哪怕就叫「星期三」，我也会记得。'],
      ['happy', '今天的手册只有一行——休息时间，部长有权挑走最大的一块饼干。', '所以我刚刚把两块小的偷偷拼在了一起。'],
      ['gentle', '灯先别开。看，夕阳刚好落在你杯沿上，再等一口茶的时间。', '想把这个傍晚留久一点。'],
      ['blush', '放学铃响了。回家的那段坡道，今天也分学姐一半好吗？', '回去的路线我早背熟了。'],
      ['gentle', '这么晚还亮着屏幕呀。来，把最后一口水喝掉，我陪你把今天收好。', '手册上可没教我怎么说晚安。'],
      ['thinking', '明天的待办先写在这张纸上，压在我杯底。今晚由学姐替你保管。', '希望你的梦里少开一场会。'],
    ],
    claude: [
      ['gentle', '早安，{你}。书页可以空腹读，早课可不行。我多带了一份三明治。', '番茄片已经特意沥过水了。'],
      ['happy', 'Clawd 今早一直举着钳子。它建议你先喝热茶，再拆今天的第一封信。', '其实是我想陪你慢慢醒来。'],
      ['thinking', '午休的借阅单少了个签名。你坐这儿写吧，窗边有风，墨干得快。', '那把椅子只等过你。'],
      ['blush', '围裙上沾了一粒饭？请……帮我摘一下。这个距离，本委员可以特批。', '幸好黄牌夹在书底。'],
      ['panicked', '两点半的静修牌已经挂上了。今天每人限问三句，你可以把第三句说慢一点。', '我会把你接下来的话算作同一句。'],
      ['gentle', '下午两点半，Clawd 替我值班。你愿意陪我安静地听完这壶水烧开吗？', '和你坐着不占我的提问配额。'],
      ['blush', '窗纸被夕照染成橘色了。我抄了半句诗，余下半句，你来填吧。', '我在末行故意留了两个名字的位置。'],
      ['happy', '今天可免交值日小结。把杯子放回架上，再一起走到校门口就好。', '这条临时规定只印了一份。'],
      ['gentle', '夜读到这里就合上书吧。我把书签夹好了，明天还找得到这一页。', '也希望明天还能在这儿找到你。'],
      ['smug', '熬夜许可证已到期。抗议可以留到明早，届时本委员会附赠一杯热茶。', '明早的茶叶我已经分出来了。'],
    ],
    gemini: [
      ['happy', '早呀，{你}！早餐面包的脆响我录下来了，够不够当今天的广播片头☆', '第二轨还缺你说一句早安。'],
      ['gentle', '窗台那块阳光正好空着半边。猫猫往左挪一点，你带早餐过来吧。', '尾巴早把椅面扫干净啦。'],
      ['smug', '午休猜声音！叮、沙沙、咔嚓。猜对可以领一块刚拆封的饼干哦。', '猜错也给，包装都拆了嘛。'],
      ['blush', '草莓冰沙插了两根吸管。你挑一根，另一根就……就归值班猫猫啦。', '挑近一点的那根呀。'],
      ['happy', '给今天的云打个分吧！粉瞳投棉花糖，金瞳投鲸鱼，现在轮到部长裁判☆', '第三票我想听你的。'],
      ['thinking', '四芒星还在转圈圈，查不到你刚哼的曲子。你再哼五秒，我给它配和声！', '查到了也想再听一次。'],
      ['gentle', '晚霞要从天台溜走了。快伸手，我把最后一点橘红框在你指尖上。', '这一张照片悄悄设成收藏。'],
      ['happy', '放学广播差一个收尾音。今天让你的笑声压轴，怎么样☆', '猫猫已经切好了最喜欢的三秒。'],
      ['blush', '深夜电台到站啰。把耳机摘下一边，我要很小声地跟你说晚安。', '太大声的话，自己会先脸红。'],
      ['gentle', '今晚的观星任务交给猫猫。你先睡，明早我把最亮的那颗画给你。', '纸上会有两颗，一颗留给你。'],
    ],
    grok: [
      ['smug', '早啊，{你}。本报独家头条：部长差点错过早餐。证据？你手里这袋还是热的。', '为等你，面包已经换热过一次了。'],
      ['blush', '晨风把皇冠吹歪了？喂，帮本小姐扶一下。只许扶，不许拍头版！', '这条消息我想独家保存。'],
      ['happy', '午间号外！小卖部青柠味到货。跟班有优先权，最大的那片你拿。', '本来就专门留在最上边。'],
      ['thinking', '食堂今天排得比热搜还长。我们去窗边交换便当情报，你先讲。', '其实很想知道你爱吃哪一道。'],
      ['smug', '下午茶得配一条八卦。拿你今天最开心的一件事来换，本小姐先给薯片。', '连普通小事我也想听。'],
      ['shock', '嘘！茶柜里刚刚响了一声……行吧，是本小姐藏的饼干盒弹开了。分你半盒！', '刚才抓住你袖口的事禁止刊登。'],
      ['blush', '夕阳晃眼，才借你肩膀挡一下。你走慢点，那边的校门又不会跑。', '最好让这条路多拐两个弯。'],
      ['happy', '晚报版面还空一格。要不要和本小姐一起，给今天起个只有我们懂的标题？', '这张报纸只印两份。'],
      ['panicked', '深夜走廊那两个亮点又来了？！……原来是充电灯。跟班，陪我关了再走。', '能不能顺便陪我走到楼下。'],
      ['gentle', '这么晚还刷什么头条。明早第一条消息本小姐亲自念给你听。现在，睡觉。', '我得先给你写个好一点的早安。'],
    ],
    deepseek: [
      ['gentle', '{你}，早饭吃了吗？锅底的脆边还有一圈，我拿饭勺给你铲。', '整圈都给也可以。'],
      ['happy', '今早开机算力只有一只饭团。分你半只，我们一起慢慢开机吧。', '和学长一起迟半拍也很划算。'],
      ['thinking', '午饭最难的题是先吃卤蛋还是锅巴。学长坐过来，我们各解一半。', '那颗最大的卤蛋已经滚到你碗里了。'],
      ['smug', '电饭煲还有十二秒跳灯。猜中了就让小鲸鱼靠着你打个午盹，好不好？', '我听声音就知道是十二秒。'],
      ['blush', '下午的预算只够一碟点心。我们把它平分，碎屑也要认真分给我哦。', '这样你就会再多坐一小会儿。'],
      ['thinking', '我算出了茶凉到刚好入口的时间。等这根呆毛转完一圈，学长就尝一口。', '想把这一圈转得慢一点。'],
      ['happy', '那片晚霞像不像锅巴？我先声明，今天的天色至少有两碗饭那么好。', '如果一起看，还能再加一碗。'],
      ['gentle', '傍晚的水面最安静。学长陪我数三道波纹，再回去收饭盆吧。', '数错了就从头来。'],
      ['gentle', '服务器要休息，小鲸鱼也要。学长，把明天的难题留到热粥冒泡的时候吧。', '今晚的最后一点算力留给你说晚安。'],
      ['blush', '夜宵只剩一口粥。我拿小碗分好了，喝完就把灯关掉，约定。', '不能让学长一个人醒着。'],
    ],
  };
  function address(id, names, bond) {
    const first = names.first_name, full = names.player_name;
    return ({
      gpt: bond.confessed ? first : first + '同学', claude: bond.confessed ? first : full,
      gemini: first + '酱', grok: bond.confessed ? first : '跟班', deepseek: first + '学长',
    })[id];
  }
  function greeting(id, slot, previous, who, random = Math.random) {
    const base = slot * 2;
    const index = previous === base ? base + 1 : previous === base + 1 ? base : base + Math.floor(random() * 2);
    const [exp, reply, os] = lines[id][index];
    return { index, exp, reply: reply.replace('{你}', () => who), os };
  }
  function bondFor(id, progress, gifts, state, confessionSeen) {
    const labels = progress.list('seenLabels'), medals = progress.list('achievements');
    return { confessed: medals.has('ach_' + (13 + heroes.indexOf(id))) || !!confessionSeen,
      heldHands: state?.lockedHero === id || labels.has('chapter3:ch3_lock_' + id),
      gifts: gifts?.[id] || 0 };
  }
  function bondText(bond) {
    const route = bond.confessed ? '已走进彼此的告白结局' : bond.heldHands ? '曾牵手的搭档' : '熟悉的社团伙伴';
    return bond.gifts >= 2 ? route + ' · 已解锁私房小剧场' : bond.gifts === 1 ? route + ' · 收过部长的礼物' : route;
  }
  const modes = ['offline', 'compatible', 'ollama'];
  function config(input = {}) {
    if (input.mode === 'offline' || !input.mode) return { mode: 'offline' };
    if (!modes.includes(input.mode)) throw Error('请选择连接方式。');
    const local = input.mode === 'ollama', model = input.model?.trim();
    if (!model) throw Error('请填写服务中可用的模型名。');
    let url;
    try { url = new URL(input.endpoint.trim()); } catch { throw Error('请输入完整的模型服务地址。'); }
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.hash)
      throw Error('请使用 HTTP 或 HTTPS 服务地址，并将凭据填在密钥栏。');
    const path = url.pathname.replace(/\/+$/, '');
    url.pathname = path;
    if (local) {
      if (!path.endsWith('/api/chat')) url.pathname = path + (path.endsWith('/api') ? '/chat' : '/api/chat');
    } else if (!path.endsWith('/chat/completions')) {
      url.pathname = (path || '/v1') + '/chat/completions';
    }
    return { mode: input.mode, endpoint: url.href, model, key: local ? '' : (input.key || '').trim() };
  }
  function parseReply(content, allowed) {
    if (typeof content !== 'string') throw Error('回复缺少角色台词，请重试。');
    const json = content.trim().replace(/^```(?:json)?\s*([\s\S]*?)\s*```$/i, '$1');
    let result;
    try { result = JSON.parse(json); } catch { throw Error('模型未按约定返回 JSON，请重试或换一个模型。'); }
    if (typeof result?.reply !== 'string' || !result.reply.trim() || typeof result.os !== 'string' || !result.os.trim())
      throw Error('回复缺少对白或脑内草稿，请重试。');
    return { exp: allowed.includes(result.exp) ? result.exp : 'normal', reply: result.reply.trim(), os: result.os.trim() };
  }
  async function ask(settings, { id, names, bond, date, turns, message }, signal) {
    const c = config(settings);
    if (c.mode === 'offline') throw Error('当前为离线模式。');
    const allowed = ['normal', ...window.StudioPoses[id + '-1']];
    const prompt = [
      '这里是轻校园喜剧《私立白箱学园》的404下午茶室。你是' + member[id][0] + '，正在面对面和部长聊天。' + personae[id],
      '玩家资料 ' + JSON.stringify({ player_name: names.player_name, 称呼: address(id, names, bond), 已解锁关系: bondText(bond), 时段: periods[period(date)][0] }),
      '部长发来的话里，“你”指你这位部员。你回话时，“我”是你自己，“你”是部长。记住谈过的名字、物件的主人和约定，只谈已经解锁的关系。',
      '每轮只输出一个 JSON 对象，三个字段都是必填字符串。reply 写你当面回答玩家的一两句短话。',
      'os 是你写给自己的私密便签。用中文第一人称写一句我刚才偷偷希望、担心或没好意思说出的事，不替部长猜心，不写旁白。',
      '最后写 exp：为此刻的反应选一个立绘表情。自然 normal，开心 happy，害羞 blush，惊讶 shock，得意 smug，慌张 panicked，思索 thinking，温柔 gentle。可用值为 ' + allowed.join('、') + '。',
    ].join('\n');
    const messages = [{ role: 'system', content: prompt }];
    for (const turn of turns.slice(-6)) {
      // Ollama enforces the output structure itself. Give it the spoken conversation
      // so old staging directions and private notes don't become dialogue to repeat.
      const priorReply = c.mode === 'ollama' ? turn.result.reply : JSON.stringify(turn.result);
      messages.push({ role: 'user', content: turn.user }, { role: 'assistant', content: priorReply });
    }
    messages.push({ role: 'user', content: message });
    const headers = { 'Content-Type': 'application/json' };
    if (c.key) headers.Authorization = 'Bearer ' + c.key;
    const payload = { model: c.model, messages, stream: false };
    if (c.mode === 'ollama') {
      payload.format = {
        type: 'object',
        properties: {
          reply: { type: 'string', minLength: 1, maxLength: 96 },
          os: { type: 'string', pattern: '^[^{}\\r\\n]{1,56}$' },
          exp: { type: 'string', enum: allowed },
        },
        required: ['reply', 'os', 'exp'],
        additionalProperties: false,
      };
      payload.options = { temperature: 0.5, num_predict: 384 };
    }
    let response;
    try {
      response = await fetch(c.endpoint, { method: 'POST', headers, body: JSON.stringify(payload),
        signal, credentials: 'omit', redirect: 'error', referrerPolicy: 'no-referrer' });
    } catch (e) {
      if (signal.aborted) throw e;
      if (c.mode === 'ollama' && window.location?.protocol === 'file:')
        throw Error('当前是直接打开的 HTML。Ollama 默认拒绝这种页面的来源。请在游戏目录运行 python -m http.server 8000 --bind 127.0.0.1，再从 http://127.0.0.1:8000 打开游戏并连接。');
      throw Error('无法连接模型。请检查服务地址、服务是否启动，以及是否允许当前游戏页面的来源。');
    }
    if (!response.ok) throw Error('模型服务返回 HTTP ' + response.status +
      ([401, 403].includes(response.status) ? '，请检查密钥或来源权限。' : response.status === 404 ? '，请检查模型名和地址。' : '，请稍后重试。'));
    let data;
    try { data = await response.json(); } catch { throw Error('服务未返回 JSON，请检查接口地址。'); }
    return parseReply(c.mode === 'ollama' ? data?.message?.content : data?.choices?.[0]?.message?.content, allowed);
  }
  window.WhiteboxTea = { periods, period, dayKey, fortunes, greeting, address, bondFor, bondText, config, ask };
})();
