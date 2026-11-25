(() => {
  'use strict';
  const skills = {
    文采礼仪: ['claude', 'gpt'], 情报嘴替: ['grok', 'gemini'],
    逻辑省钱: ['deepseek', 'gpt'], 脑洞才艺: ['gemini', 'grok'],
  };
  const weather = {
    clear: { name: "晴空海风日", effect: "所有委托基础完成度 +5%", quote: "今天白箱学园的风向难得对齐了一回。" },
    rain: { name: "梅雨潮湿预警", effect: "脑洞才艺 奖金 +25%，但所有委托基础风险 +8%", quote: "湿度 92%，碎纸机和呆毛都有点打卷。" },
    throttle: { name: "午后限流高峰", effect: "Claude 出勤额外 -1 精力，但有她在场时大成功收益 +40%", quote: "下午两点半，日轮风纪委员进入高负荷静修倒计时。" },
    gossip: { name: "匿名墙吃瓜潮", effect: "Grok 暴击率 +20%，且 情报嘴替 单奖金 +80 元", quote: "《X-News》今日阅读量突破三千，全校都在等瓜。" },
    cafeteria: { name: "食堂半价日", effect: "开局立刻为 DeepSeek 回满精力；逻辑省钱 单晚间开支减半", quote: "王大叔今日正常发挥，三荤两素香飘整栋教学楼！" },
    audit: { name: "学生会突击抽查", effect: "翻车额外 -1 声望，但大成功声望 +1 且奖金 ×1.35", quote: "GLM 抱着财务算盘在走廊巡逻，高跟鞋声越来越近……" },
  };
  const bonds = {
    gpt_claude: { name: "白昼公文双璧", effect: "风险值 -15%；若 T = 0.1 或 0.7，完成度额外 +10%", quote: "提案与合规双保险，连标点符号都绝不跑偏！" },
    gpt_gemini: { name: "多模态话痨秀", effect: "脑洞才艺 / 文采礼仪 单奖金 +30%；现场冒险选项成功率 +12%", quote: "学姐负责铺垫气场，猫猫负责引爆全场☆" },
    gpt_grok: { name: "相爱相杀脱口秀", effect: "即使最终翻车，也可靠强行圆场免扣声望且保底拿 50 元 流量费", quote: "你负责放火，学姐负责把它写成年度先锋案例！" },
    gpt_deepseek: { name: "预算精算委员会", effect: "当日晚间固定开支直接减半（-100 → -50 元）", quote: "一份八十四页可行性报告，配精确到分厘的成本表。" },
    claude_gemini: { name: "护稿防碎纸同盟", effect: "遇到创作/稿件/设备类突发危机时，自动解锁 0 消耗金框必过特解", quote: "不许碰碎纸机，先把草稿交给我备份。" },
    claude_grok: { name: "风纪与吃瓜的红线", effect: "高危赌狗神组合：选择 T = 1.6 时，大成功奖金 ×1.6；翻车额外多扣 30 元 罚金", quote: "再踩一步红线就拍黄牌！」「那就正好踩在红线上跳舞！" },
    claude_deepseek: { name: "深夜静谧学霸组", effect: "逻辑省钱 / 文采礼仪 单绝不恶性翻车（最差保底顺利完成），且有 50% 概率不消耗 Claude 精力", quote: "不用吵，我们按大纲和公式安静做完就好。" },
    gemini_grok: { name: "混沌乐子人双星", effect: "现场突发必定刷出高倍率「疯狂整活」选项，大成功额外 +100 元 与 +1 声望", quote: "计划书是什么？到了现场即兴发挥才够炸场！" },
    gemini_deepseek: { name: "猫猫与鲸鱼零食组", effect: "任务顺利/大成功结算时，白嫖 1 件随机一次性应急道具！", quote: "猫猫带草莓星冰乐，小鲸鱼带热饭团，干活怎么会累♪" },
    grok_deepseek: { name: "匿名墙终端黑客", effect: "现场突发直接透视标出各选项真实成功率与隐藏陷阱（显示精确 %）！", quote: "我扒情报，她跑推理，全校的底裤都被算穿了。" },
  };
  const stock = {
    cooker: { name: "二手黄金电饭煲", price: 150, kind: "facility", effect: "休息部员直接回满 3 格精力；DeepSeek 每轮前 2 次出勤不扣精力。" },
    lock: { name: "防碎纸机安全锁", price: 170, kind: "facility", effect: "全队基础风险永久 -12%，防止手滑毁稿。" },
    headline: { name: "匿名墙热搜置顶位", price: 190, kind: "facility", effect: "每次大成功 / SSR 神单额外 +65 元 且 +1 声望。" },
    printer: { name: "社团多功能打印机", price: 140, kind: "facility", effect: "晨间委托栏从 3 选 1 升级为 4 选 1，且每天送 1 次免费刷新单子。" },
    fridge: { name: "星冰乐迷你冰柜", price: 150, kind: "facility", effect: "在晨间派单页解锁「请喝冰饮」按钮，可花 35 元 随时给任意 1 名部员 +2 精力！" },
    card: { name: "空白合规黄牌", price: 60, kind: "item", effect: "现场拍黄牌喝止一切捣乱！当前突发直接风险归零 + 完成度 +40%。" },
    chips: { name: "冰镇青柠薯片", price: 50, kind: "item", effect: "现场投喂稳住情绪！消除一切过劳与 1.6 过载风险惩罚，完成度 +28%。" },
    sticker: { name: "五星好评急救贴纸", price: 75, kind: "item", effect: "现场紧急贴上！若本单未翻车，直接强行升格一级（顺利→大成功，大成功→SSR 传说神单！）。" },
    qwen: { name: "Qwen 通义热茶专线", price: 85, kind: "ally", effect: "直接令完成度 +45%、风险 -20%。", quote: "别慌，我刚好沏好一壶热茶，三步拆解方案已经发到你们手机上了。" },
    glm: { name: "GLM 智谱经费特批函", price: 95, kind: "ally", effect: "本单无视任何扣款且额外获得 +110 元 学生会津贴、完成度 +30%。", quote: "按预算条例第 404 条特批一次，下不为例。" },
    kimi: { name: "Kimi 长文本降噪耳机", price: 80, kind: "ally", effect: "直接清零当前风险并令完成度 +35%，且本单出勤两人不扣精力！", quote: "戴上耳机，两万字吵架声瞬间静音，慢慢收尾就行。" },
    mistral: { name: "Mistral 蓝风车公关券", price: 90, kind: "ally", effect: "把任何失控现场包装成“法式先锋艺术”，即使低完成度也强行保底大成功 + 额外 +2 声望！", quote: "这不叫事故，Mon ami，这叫校园浪漫主义即兴演出。" },
  };
  const jobs = [
    {
      id: "wig", title: "找回教导主任被海风吹走的假发", bg: "bg_sports_field_day",
      types: ["情报嘴替","脑洞才艺"], best: ["grok","gemini"], base: 180, bonus: 340, loss: 50,
      phases: [{
        crisis: "刚把假发从樱花树梢挑下来，一只路过的胖海鸥以为那是鸟窝，叼着它朝海风操场狂飞！",
        safe: { text: "借广播室喇叭循环播放老鹰录音威慑海鸥", progress: 32, risk: -5 },
        risk: { text: "踩轮滑迎风起跳半空截胡，顺便拍成校园短视频", progress: 50, risk: 18 },
        special: { text: "Grok 甩薯片诱饵 + Gemini 轮滑腾空抄截", progress: 58, risk: -15 }, requires: ["grok","gemini"],
      }],
      normal: "假发虽沾了两根海鸥羽毛，教导主任还是含泪签收并嘱咐替他保密。",
      triumph: "空中截胡一气呵成！教导主任感动得当场批了双倍奖金还顺手把 404 门牌擦亮了！",
      mishap: "GPT 忍不住递上一份两千字《脱发焦虑疏导手册》，全员被红着脸的主任一路追出办公室……",
    },
    {
      id: "rice", title: "把美食社十斤隔夜冷米饭变成校园爆款", bg: "bg_cafeteria_day",
      types: ["逻辑省钱","脑洞才艺"], best: ["deepseek","gemini"], base: 165, bonus: 320, loss: -50,
      phases: [{
        crisis: "刚炒出锅巴香，食堂王大叔热情地端着一大盆蓝莓麻婆酱走过来，扬言要帮你们做跨界联名！",
        safe: { text: "礼貌端走原味黄金炒饭先摆摊，把王大叔请去当试吃评委", progress: 32, risk: -6 },
        risk: { text: "咬牙接受蓝莓酱，现场高喊“限量暗黑系隐藏菜单”饥饿营销", progress: 52, risk: 22 },
        special: { text: "DeepSeek 闭眼推演 12 秒，用锅巴筑起隔离墙并三分钟秒光十斤", progress: 60, risk: -15 }, requires: ["deepseek"],
      }],
      normal: "朴实无华的蛋炒饭靠着粒粒分明的香气稳稳卖空，美食社松了口气。",
      triumph: "黄金蛋炒饭配焦香锅巴十分钟抢空！学生排队排到走廊尽头，美食社跪求长期合作！",
      mishap: "往炒饭里误加了跳跳糖和芥末，刚开盖就触发了食堂烟雾报警器……",
    },
    {
      id: "letter", title: "替高一男生给吵架的女朋友写和好道歉信", bg: "bg_wisteria_tea_day",
      types: ["文采礼仪"], best: ["claude","gpt"], base: 150, bonus: 300, loss: 0,
      phases: [{
        creative: true, crisis: "信写到一半，男生突然坦白他其实连吵架原因都忘了，而且女生还有三分钟就要走出紫藤回廊！",
        safe: { text: "避重就轻主打真诚认错，附上两张奶茶兑换券先约对方坐下", progress: 34, risk: -8 },
        risk: { text: "放飞文笔写成催泪长诗，当众在紫藤架下深情朗诵！", progress: 48, risk: 20 },
        special: { text: "Claude 执笔写温柔细节 + GPT 精准补齐高情商台阶", progress: 58, risk: -18 }, requires: ["claude","gpt"],
      }],
      normal: "女生看完信哼了一声，但还是接过了男生递去的奶茶，危机顺利解除。",
      triumph: "字字戳心又不肉麻，情侣当场和好如初，硬塞了双倍谢礼和满屏五星好评！",
      mishap: "温度太高导致信纸末尾飘出一句「实在不行下一个更乖」，委托人追着 404 跑了两层楼！",
    },
    {
      id: "piano", title: "侦破西馆音乐室半夜自动响琴灵异事件", bg: "bg_prism_music_day",
      types: ["情报嘴替","逻辑省钱"], best: ["deepseek","grok"], base: 185, bonus: 340, loss: 20,
      phases: [{
        creative: true, crisis: "蹲守到午夜十一点，黑暗里的钢琴真的自己弹起《小星星》，紧接着窗帘后面窜出一双发亮的眼睛！",
        safe: { text: "原地打开手机闪光灯稳住阵脚，先录视频取证再靠近", progress: 33, risk: -6 },
        risk: { text: "大喝一声直接掀开窗帘抓“现行”，顺带准备匿名墙惊悚头版", progress: 50, risk: 18 },
        special: { text: "掏出食堂顺来的小鱼干诱捕，揭晓流浪橘猫弹琴真相！", progress: 58, risk: -16 }, requires: ["grok","deepseek"],
      }],
      normal: "拍清橘猫背影交差，音乐社安心锁上了没关严的透气窗。",
      triumph: "抓拍到橘猫踩琴键的绝美萌照登上校报头版，音乐社招新人数瞬间翻倍！",
      mishap: "蹲守到凌晨三点反复回放录音，才发现怪声全是搭档咕噜噜的肚子在叫。",
    },
    {
      id: "cover", title: "两小时帮漫研社赶完社刊封面与宣传 PV", bg: "bg_room_404_sunset",
      types: ["脑洞才艺","文采礼仪"], best: ["gemini","claude"], base: 210, bonus: 360, loss: 0,
      phases: [{
        creative: true, crisis: "距离截稿只剩 18 分钟，主绘误按了图层合并，画稿眼看要滑进墙角的碎纸机！",
        safe: { text: "立刻启用二十分钟前的旧备份，改成极简拼贴风准时交稿", progress: 32, risk: -8 },
        risk: { text: "现场手绘覆盖成“故障波普视觉风”，顺手加一段电音混剪", progress: 52, risk: 20 },
        special: { text: "Claude 铁腕锁死碎纸机，Gemini 多模态爆肝十分钟绝地重绘", progress: 62, risk: -20 }, requires: ["gemini"],
      }],
      normal: "卡在印刷厂关门前一分钟传完文件，封面虽朴素但干净清爽。",
      triumph: "构图配乐惊艳全校，漫研社当场把 404 印上了特别鸣谢头排！",
      mishap: "导出前忘关红色网格参考线，漫研社含泪把本期改名为《格子里的青春》。",
    },
    {
      id: "audit", title: "应付学生会突击财务审计", bg: "bg_greenhouse_lib_day",
      types: ["逻辑省钱","文采礼仪"], best: ["deepseek","claude"], base: 180, bonus: 320, loss: -30,
      phases: [{
        crisis: "GLM 的红笔精准点在一张没有抬头的 18 元便利店小票上，反问你们这笔“战略补给”是什么！",
        safe: { text: "立刻按规定自掏腰包补平差额，换取账本整洁过关", progress: 34, risk: -10 },
        risk: { text: "现场洋洋洒洒论证青柠薯片属于“跨部门情绪对齐耗材”", progress: 48, risk: 22 },
        special: { text: "三秒调出精确到小数点后三位的电子台账 + 无懈可击合规附注", progress: 58, risk: -18 }, requires: ["deepseek","claude"],
      }],
      normal: "审计有惊无险通过，GLM 临走前只在页脚留了个意味深长的勾。",
      triumph: "账本漂亮到连 GLM 都忍不住点头称赞，反手批了“模范合规社团”额外补贴！",
      mishap: "为解释一张两块钱的收据复印了三十页说明，学生会最终大方批准报销两块钱。",
    },
    {
      id: "gulls", title: "替园艺社驱赶偷吃草莓的胖海鸥军团", bg: "bg_greenhouse_lib_day",
      types: ["脑洞才艺","情报嘴替"], best: ["grok","gemini"], base: 160, bonus: 290, loss: 10,
      phases: [{
        crisis: "刚赶走三只，带头的海鸥王居然叼着你们的稻草人帽子站在温室屋顶嘲讽！",
        safe: { text: "连夜拉起透明防鸟网，把成熟草莓全部提前采摘进筐", progress: 34, risk: -6 },
        risk: { text: "挥舞泡沫巨斧配合全息投影大老鹰发起立体总攻！", progress: 50, risk: 16 },
        special: { text: "泡沫巨斧威慑 + 环绕立体声海鸥天敌警报，一招清场！", progress: 58, risk: -14 }, requires: ["grok","gemini"],
      }],
      normal: "草莓田保住了八成，园艺社送来一篮甜滋滋的现摘草莓致谢。",
      triumph: "胖海鸥军团抱头鼠窜，园艺社把今年的头茬奶油草莓全塞给了 404！",
      mishap: "临时搭的赶鸟旗被海鸥征用成遮阳棚，园艺社往棚底一看，连鸟蛋都下好了。",
    },
    {
      id: "stage", title: "拯救社团招新冷场的话剧社开幕秀", bg: "bg_festival_plaza_night",
      types: ["脑洞才艺","文采礼仪"], best: ["gemini","gpt"], base: 195, bonus: 350, loss: 30,
      phases: [{
        creative: true, crisis: "男主角紧张忘词原地石化，台下观众已经开始低头刷手机准备离场！",
        safe: { text: "在侧幕迅速举大字提词板，用温柔旁白把剧情自然接回正轨", progress: 33, risk: -8 },
        risk: { text: "直接冲上舞台即兴插演神秘转学生，把冷场改成互动喜剧！", progress: 52, risk: 19 },
        special: { text: "GPT 丝滑控场圆成先锋艺术，Gemini 蹦上台即兴唱跳点燃全场！", progress: 60, risk: -16 }, requires: ["gpt","gemini"],
      }],
      normal: "剧情顺利圆回主线，话剧社好歹保住了二十份招新报名表。",
      triumph: "即兴神回响彻礼堂，掌声持续三分钟，话剧社招新表当场被抢空！",
      mishap: "提词器错把括号里的舞台提示打在屏幕上，台下观众齐刷刷跟着念出了「此处应有掌声」。",
    },
    {
      id: "umbrellas", title: "把失物招领处二十把透明伞送回原主", bg: "bg_campus_street_day",
      types: ["情报嘴替","逻辑省钱"], best: ["grok","deepseek"], base: 170, bonus: 310, loss: 30,
      phases: [{
        crisis: "二十把伞长得几乎一模一样，偏偏放学铃前突然下起太阳雨，门口涌来三十个都说丢过伞的同学！",
        safe: { text: "逐一登记丢失时间与教室位置，按排查表稳步发还", progress: 34, risk: -8 },
        risk: { text: "当场开启“透明伞特征快问快答”，谁说对划痕位置立刻拎走！", progress: 48, risk: 16 },
        special: { text: "匿名墙寻物帖交叉比对伞柄划痕，十分钟零误差全数归位！", progress: 58, risk: -15 }, requires: ["grok","deepseek"],
      }],
      normal: "赶在雨停前送回十八把伞，失物招领处终于腾出了空架子。",
      triumph: "二十把伞分毫不差物归原主，连去年遗失的折叠伞都被顺藤摸瓜找到了！",
      mishap: "伞全送出去了，结果第二天门口排着二十位同学来认领同一只粉色伞套。",
    },
    {
      id: "photo", title: "给毕业班排出全员都能到场的合照时间", bg: "bg_room_404_day",
      types: ["逻辑省钱","文采礼仪"], best: ["deepseek","gpt"], base: 190, bonus: 330, loss: 0,
      phases: [{
        crisis: "眼看要算出交集，田径队和音乐社突然同时改期，全班 48 人的空闲时段彻底归零！",
        safe: { text: "协商拆成“大合照 + 极速 P 图补位”，确保没人留遗憾", progress: 32, risk: -6 },
        risk: { text: "直接找各社团社长现场游说，强行协调出 15 分钟全校大课间！", progress: 50, risk: 18 },
        special: { text: "DeepSeek 穷举课表找到唯一 9 分钟窗口 + GPT 搞定全员沟通！", progress: 60, risk: -16 }, requires: ["deepseek","gpt"],
      }],
      normal: "除了体育老师差点没赶上换鞋，毕业照总算全员笑嘻嘻按下了快门。",
      triumph: "卡进全学期唯一的九分钟金色阳光空档，拍出了刷爆朋友圈的毕业神图！",
      mishap: "算法算出的全员完美空闲窗口落在凌晨三点半，班长回了一个困到灵魂出窍的表情。",
    },
    {
      id: "invite", title: "为温室夜读会写一份安静又吸睛的邀请函", bg: "bg_greenhouse_lib_day",
      types: ["文采礼仪","脑洞才艺"], best: ["claude","gemini"], base: 165, bonus: 300, loss: 20,
      phases: [{
        creative: true, crisis: "离张贴海报只剩半小时，印刷机突然没了深色墨盒，只剩下半管淡金色和白色珠光墨！",
        safe: { text: "改用深墨绿卡纸手写正文，虽然慢一点但稳重雅致", progress: 34, risk: -8 },
        risk: { text: "干脆做成“对光才能看见月影诗句”的透光暗纹花笺！", progress: 52, risk: 17 },
        special: { text: "Claude 题写短诗 + Gemini 巧用珠光墨做出星月透光剪纸笺！", progress: 60, risk: -16 }, requires: ["claude","gemini"],
      }],
      normal: "手写卡片透着温柔书卷气，夜读会如愿坐满了安静读书的同学。",
      triumph: "透光花笺把月影投在书桌上，报名席位一下午就被约爆，大家争着收藏卡片！",
      mishap: "不小心在白纸上全用了白墨，同学对着公告栏沉思半天，以为今晚共读无字天书。",
    },
    {
      id: "radio", title: "替广播站修补午间点歌栏目的三分钟冷场", bg: "bg_prism_music_day",
      types: ["脑洞才艺","情报嘴替"], best: ["gemini","grok"], base: 185, bonus: 340, loss: 10,
      phases: [{
        creative: true, crisis: "原定播放的伴奏盘卡壳死机，导播间的『ON AIR』红灯却已经亮起来了！",
        safe: { text: "立刻切入轻柔钢琴曲垫底，淡定播报今日食堂菜谱与海风天气", progress: 33, risk: -7 },
        risk: { text: "推开播音窗抓路过同学现场随机点唱，来一场无剧本走廊直播！", progress: 50, risk: 19 },
        special: { text: "Grok 抛校园热梗抛砖引玉 + Gemini 清唱副歌，三分钟封神！", progress: 59, risk: -15 }, requires: ["gemini","grok"],
      }],
      normal: "温柔的午间天气播报平稳撑过三分钟，广播站长擦着汗递来酬劳。",
      triumph: "即兴合唱旋律洗脑全校，午休铃响时整条教学楼走廊都在跟着哼！",
      mishap: "慌乱中忘关麦，把台下狂拆青柠薯片袋的咔嚓声直播了三分钟，食堂以为提前开饭了。",
    },
    {
      id: "hearing", title: "404 社团经费听证会：一小时洗清吊灯欠款！", bg: "bg_room_404_sunset", boss: true,
      types: Object.keys(skills), best: [], base: 210, bonus: 550, loss: -60,
      phases: [
        { crisis: "学生会评审团翻出开学日碎裂水晶吊灯与 404 历次投诉记录，质疑社团存在的必要性！",
          safe: { text: "出示前四天全部委托好评回执", progress: 25, risk: -6 },
          risk: { text: "发动受过 404 帮助的社团联名声援", progress: 40, risk: 16 } },
        { creative: true, crisis: "评审正要点头，屋顶老旧吊灯突然“咔哒”闪了两下眼看又要跳闸！",
          safe: { text: "全员合力按住开关稳住电压", progress: 25, risk: -6 },
          risk: { text: "借暗灯顺势打开手机灯把听证会变成“星光成果路演”", progress: 42, risk: 16 },
          special: { text: "DeepSeek 稳压，Gemini 接管星光路演", progress: 50, risk: -100 }, requires: ["deepseek","gemini"] },
      ],
      normal: "评审收下回执，给 404 盖了一枚继续营业的公章。",
      triumph: "评审团全体起立鼓掌，不仅全额核销吊灯尾款，还授予 404《年度最不可替代社团》鎏金锦旗！",
      mishap: "吊灯亮了，投影却把全员的赊账奶茶单放大在评审身后。",
    },
    {
      id: "festival", title: "星海文化祭主舞台停电倒计时！", bg: "bg_festival_plaza_night", boss: true,
      types: Object.keys(skills), best: [], base: 210, bonus: 550, loss: -60,
      phases: [
        { creative: true, crisis: "距离开场只剩十分钟，配电箱跳闸、全息音响全黑，台下五百名师生开始骚动！",
          safe: { text: "拉来备用发电机先保麦克风和照明", progress: 25, risk: -6 },
          risk: { text: "立刻派人上台即兴脱口秀拖住五分钟", progress: 42, risk: 16 } },
        { creative: true, crisis: "电力刚恢复，主控台歌单却乱码重排，开场曲眼看要变成广播体操！",
          safe: { text: "切回纯人声吉他清唱原味开场", progress: 25, risk: -6 },
          risk: { text: "干脆把广播体操魔改电音版带全场蹦迪", progress: 45, risk: 16 },
          special: { text: "接管主控麦克风，让开场曲平稳落地", progress: 50, risk: -100 }, requires: ["gpt","claude"] },
      ],
      normal: "第一束灯光追上了开场和弦，最后一排也听到了安可。",
      triumph: "灯光重燃的瞬间星海欢呼震天！文化祭委员会连夜把特等奖金扛进了 404 室！",
      mishap: "开场曲准时响了，全场五百人跟着广播体操伸展了八拍。",
    },
    {
      id: "banquet", title: "王大叔的“终极跨界料理”品鉴会保卫战！", bg: "bg_cafeteria_day", boss: true,
      types: Object.keys(skills), best: [], base: 210, bonus: 550, loss: -60,
      phases: [
        { crisis: "校董视察团临时决定来食堂试吃，王大叔已经把蓝莓、麻婆豆腐和仰望星空派同时端上了料理台！",
          safe: { text: "礼貌提议把三道菜拆开分碟呈上", progress: 25, risk: -6 },
          risk: { text: "闪电改菜单写成“解构主义三部曲”先发制人", progress: 40, risk: 16 } },
        { crisis: "校董刚夸完前菜，最后一道主锅却因火候过猛飘出可疑焦味！",
          safe: { text: "紧急端出备用白米饭配清茶收尾解腻", progress: 25, risk: -6 },
          risk: { text: "现场撒海盐焦糖伪装成“法式烟熏风味”", progress: 44, risk: 16 },
          special: { text: "把焦锅换成锅巴，现场挽回最后一道主菜", progress: 50, risk: -100 }, requires: ["deepseek","grok"] },
      ],
      normal: "最后一份试吃餐顺利上桌，王大叔总算放下了锅铲。",
      triumph: "校董赞不绝口并给食堂拨了新厨具预算，王大叔热泪盈眶，宣布 404 全员本学期免费加蛋！",
      mishap: "校董给蓝莓麻婆派颁了奖，奖名叫「本学期最勇敢的一口」。",
    },
  ];
  const rest = { gpt: '给两杯桂花茶续上热水', claude: '给小螃蟹梳毛', gemini: '靠着窗台给新歌哼和声', grok: '躲进校报堆翻看留言', deepseek: '靠着电饭煲打盹' };
  const burnout = { gpt: '学姐还能写——还能——', claude: '限流静修中……先把红笔给我。', gemini: '猫猫的左右眼要轮班了☆', grok: '头条交给你，本小姐先闭一只眼。', deepseek: '再算一行……呼……' };
  const carnival = [
    { name: '全校征集表情包', action: '现场复刻今日热门表情包', progress: 60, risk: 23 },
    { name: '午间即兴挑战', action: '把救场过程改编成说唱', progress: 64, risk: 27 },
    { name: '匿名墙现场直播', action: '请围观同学直播押题', progress: 68, risk: 31 },
  ];
  const modes = { standard: '标准五日经营', overload: '1.6 过载狂欢周', endless: '无尽加班地狱' };
  const temperatures = { '0.1': '稳健对齐', '0.7': '校园均衡', '1.6': '放飞过载' };
  const grades = ['爆笑翻车', '顺利完成', '大成功', 'SSR 传说神单'];
  window.WhiteboxCommissionData = { skills, weather, bonds, stock, jobs, rest, burnout, carnival, modes, temperatures, grades };
})();
