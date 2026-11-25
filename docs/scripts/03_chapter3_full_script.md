# 《私立白箱学园：今天社团也没对齐！》第三章完整定稿剧本

> **章节范围**：第三章《春季学园运动祭与心意锁定！只为你一个人的应援》全四幕（共通线高潮收束章）  
> **核心交互体验**：【赛前备战群聊】+【全员春日运动装 `*-sport` 热身帐篷 5 选 2 贴身准备】+【广播台 Gemini 实况解说温度调谐器】+【趣味二人三足双人派单】+【部长亲征终极借物赛跑 & 当众牵手冲线抉择】+【黄昏双星天台·五女主个人恋爱线正式锁定长终章】。

---

## 【第三章第一幕】晴空彩旗与运动服热身大乱斗！

`[char_clear]`  
`[bgm: bgm_clockwork_tease | action: play]`

靠着海景木屋两天一夜的魔鬼特训，404 室全员奇迹般地在期中摸底联考中全科高分过关！  
还没等我松一口气，五月初的阳光便迎来了白箱学园上半年最盛大的狂欢——**「春季社团趣味竞技游园祭」**。

清早七点半，我刚换好轻便的运动服走进操场通道，口袋里的手机就已经被换好新装备的部员们刷屏了。

`[phone_chat: 404 代表队 · 冠军冲锋群 (6)]`

**【DeepSeek】** `[speaker: deepseek]`  
「@全体成员 一级战备状态启动！！我刚刚去奖品展示台核实过了，今年总冠军社团除了免除整学年考核金牌之外，真的有一张**『第一食堂全年无限免费续白米饭纯金饭卡』**！！」

**【Grok】** `[speaker: grok]`  
「瞧这条贪吃鱼出息的！本小姐看上的是总冠军能获得校园广播台一周的自由点歌冠名权——而且今天本小姐专门订制了印着『404』背号的暗夜战袍，帅翻全场！」

**【Claude】** `[speaker: claude]`  
「那个……如果我在混合接力跑中途体力不支倒下的话，抽屉第二格有我提前写好的《运动损伤免责声明与校刊交接遗嘱》……」

**【GPT】** `[speaker: gpt]`  
「Claude 别怕！我已经写好了长达六千字的《春季运动祭全员情绪赋能加油稿》——正准备去借十个大喇叭循环播放！」

**【Gemini】** `[speaker: gemini]`  
「啦啦队花球和双星应援舞就绪☆！`{first_name}` 快到三号白色帐篷来，大家都在等你检录啦！」

`[choice_start: 在社团备战群里发出开赛动员令！]`

- **选项 A：「Claude 不许写遗嘱！跑不动最后半圈我替你兜底，今天开心第一！」**
  - **【Claude】** `[speaker: claude]`：「……！虽然接力赛规则不允许代跑，但听到 `{player_name}` 这么说，腿好像没那么发软了。（好感度 +1）」

- **选项 B：「目标只有一个——帮 DeepSeek 拿下纯金饭卡，让 404 室的名字响彻全场！」**
  - **【DeepSeek】** `[speaker: deepseek]`：「呜哇啊啊为了 `{first_name}` 学长和纯金饭卡，今天本鲸鱼把吃奶的算力都飙出来！！（好感度 +1）」
  - **【Grok】** `[speaker: grok]`：「冲冲冲！把学生会代表队按在跑道上摩擦！」

`[choice_end]`

`[phone_chat_end]`

`[bg: bg_sports_field_day | trans: fade]`  
`[bgm: bgm_sunny_mischief | action: play]`

踏入铺满阳光的绿茵运动场，五颜六色的三角彩旗在湛蓝晴空下猎猎飞扬。  
三号社团备战帐篷下，换上了 **【春日轻运动应援服】** 的五位少女齐刷刷映入眼帘——高马尾网球短裙的 GPT、侧麻花辫运动外套的 Claude、啦啦队星辉短裙的 Gemini、酷飒无袖球衣的 Grok，以及系着白色必胜头带的水手体操服 DeepSeek，引得路过的全校男生频频回头！

距离开幕哨响还有十分钟热身时间，我拎着医疗包和矿泉水箱，决定先去帮两位部员做赛前贴身准备——

`[label: ch3_roam_start]`  
`[free_roam_hub | picks: 2 | exit: ch3_after_roam | title: "赛前十分钟热身帐篷 · 先去帮谁做准备？（任选 2 人）"]`

- **串门目标一：【起跑白线】单膝蹲下帮球鞋带散开的 Grok 重新系紧（指派 Grok）** → 跳转 `[label: ch3_roam_grok]`
- **串门目标二：【遮阳篷下】帮紧张得拉不上运动服拉链的 Claude 解围（指派 Claude）** → 跳转 `[label: ch3_roam_claude]`
- **串门目标三：【草坪边缘】给绑歪了必胜头带的 DeepSeek 整理呆毛（指派 DeepSeek）** → 跳转 `[label: ch3_roam_deepseek]`
- **串门目标四：【器材架旁】帮扎高马尾网球裙的 GPT 戴上防滑护腕（指派 GPT）** → 跳转 `[label: ch3_roam_gpt]`
- **串门目标五：【啦啦席位】给跳应援舞擦红脚踝的 Gemini 贴创可贴（指派 Gemini）** → 跳转 `[label: ch3_roam_gemini]`

---

### 赛前热身 1：高帮球鞋与单膝系带的暴击（Grok · 运动装）

`[label: ch3_roam_grok]`  
`[char_clear]`  
`[char: grok-sport | pos: center | exp: smug | tween: fade_in]`

起跑线旁，Grok 穿着黑红撞色、胸前印着醒目 `404` 号码的无袖运动球衣，双手叉腰活动着脚踝，可右脚那双红黑高帮运动鞋的鞋带却松松垮垮地拖在塑胶跑道上。

**【Grok】** `[speaker: grok | exp: smug]`  
「看好了庶民，等会儿枪声一响，本小姐就像黑色闪电一样把她们全甩在吃灰区——咦？这破鞋带怎么系了三次还往外散啊！」

`[choice_start: 看着弯腰跟死结较劲的大小姐，你要怎么做？]`

- **选项 A：【直接单膝蹲在她身前，低头替她系一个绝对不会散的双蝴蝶结】**
  - **【{player_name}】** `[speaker: player]`：「别乱拽成死结了，脚踩稳别动，我帮你系双环扣。」
  - **【Grok】** `[speaker: grok | exp: blush | tween: shake]`：「呜哇？！？！大、大庭广众之下你突然单膝跪在本小姐面前干嘛啦！！旁边二班那群八卦狂全在往这边偷瞄啊！！……笨、笨蛋 `{first_name}`，系这么漂亮干嘛，害本小姐待会儿都不舍得跑太猛弄脏了！（耳根红得快滴血，好感度 +1）」

- **选项 B：【把冰镇柠檬运动饮料贴在她手心】「保存体力，系鞋带这种小事交给头号跟班。」**
  - **【Grok】** `[speaker: grok | exp: happy | tween: jump]`：「哼，算你还有点金牌经纪人的自觉！看在这瓶冰饮料的份上，等会儿拿了第一名，冠军奖牌准你先挂脖子上戴五分钟！（好感度 +1）」

`[choice_end]`

`[free_roam_return]`

---

### 赛前热身 2：卡住的运动服拉链（Claude · 运动装）

`[label: ch3_roam_claude]`  
`[char_clear]`  
`[char: claude-sport | pos: center | exp: panicked | tween: fade_in]`

遮阳篷角落里，平时很少穿短款运动装的 Claude 把铜橘长发编成了一条清爽的侧麻花辫，但此刻她正红着脸低头扯着暖橘白运动外套的领口拉链，急得鼻尖冒出了细汗。

**【Claude】** `[speaker: claude | exp: blush]`  
「怎、怎么办 `{player_name}`……外套拉链好像咬住里面白色背心的花边卡住了！拉不上来也退不下去，里面露出一截太、太有伤风化了……」

`[choice_start: 面对窘迫求助的 Claude，怎么帮她解围？]`

- **选项 A：【侧身替她挡住操场人群的视线，低头屏住呼吸小心翼翼帮她解开卡扣】**
  - **【{player_name}】** `[speaker: player]`：「别慌，我在前面替你挡着别人，稍微抬一点下巴，马上就弄好了。」
  - **【Claude】** `[speaker: claude | exp: blush | tween: shake]`：「唔……！！`{first_name}` 的手指碰到锁骨旁边了……呼吸声好近……！谢、谢谢，还好遇到的是你……今天这套侧麻花辫运动装，其实比平时轻便很多对吧？（好感度 +1）」

- **选项 B：【解开拉链后顺手帮她别上一枚社团号码布，夸她运动风打扮充满活力】**
  - **【Claude】** `[speaker: claude | exp: gentle]`：「第一次听人夸我有运动活力而不是书呆子呢……既然部长都这么说了，今天我绝对不会跑倒数第一的！（好感度 +1）」

`[choice_end]`

`[free_roam_return]`

---

### 赛前热身 3：呆毛与必胜头带的冲突（DeepSeek · 运动装）

`[label: ch3_roam_deepseek]`  
`[char_clear]`  
`[char: deepseek-sport | pos: center | exp: panicked | tween: jump]`

草坪边，DeepSeek 穿着半拉链的深蓝白水手风学校体操服外套，正努力往额头上系一条写着『白米饭必胜』的白色布头带——结果头带正好压住了头顶的呆毛，整个人瞬间像信号不良的收音机一样原地打转！

**【DeepSeek】** `[speaker: deepseek | exp: panicked | tween: shake]`  
「呜哇……头带把我的平衡呆毛压扁了，直线行走算法偏航十五度，要撞上沙坑啦 `{first_name}` 学长——！」

`[choice_start: 赶紧扶住摇摇晃晃的小鲸鱼，怎么帮她调整装备？]`

- **选项 A：【把头带解开重新端正系在呆毛下方，让蓝色呆毛神气地翘在头带正上方】**
  - **【{player_name}】** `[speaker: player]`：「这样把呆毛露在上面，不就既有气势又不挡信号了吗？」
  - **【DeepSeek】** `[speaker: deepseek | exp: happy | tween: jump]`：「叮——信号满格恢复！！`{first_name}` 学长的手好巧呀，系得不紧不松刚刚好！再吃一颗学长递来的柠檬葡萄糖，我现在感觉能一口气游完太平洋♪！（好感度 +1）」

- **选项 B：【陪她做赛前鲸尾拉伸热身，跟她击掌约定拿了金饭卡一起去庆功】**
  - **【DeepSeek】** `[speaker: deepseek | exp: blush]`：「击掌成功！学长的手掌好大好有力气，那纯金饭卡刷出来的第一碗米饭，我一定要先分给 `{first_name}` 学长吃！（好感度 +1）」

`[choice_end]`

`[free_roam_return]`

---

### 赛前热身 4：高马尾网球女神的反差紧张（GPT · 运动装）

`[label: ch3_roam_gpt]`  
`[char_clear]`  
`[char: gpt-sport | pos: center | exp: happy | tween: fade_in]`

器材架旁，把一头银白长发高高束成活力马尾、身穿白紫百褶网球运动连衣裙的 GPT 一转身，发梢划出一道耀眼的银弧，手里还拿着一只扩音加油筒。

**【GPT】** `[speaker: gpt | exp: happy]`  
「`{first_name}` 你看！这身轻量化网球裙装——**不是**单纯的服饰切换——**而是**空气动力学与青春美学的结合！……只是我太久没剧烈跑跳了，手腕护带好像怎么戴都有点歪。」

`[choice_start: 走上前帮高马尾学姐整理护腕，怎么互动？]`

- **选项 A：【低头替她把丁香紫吸汗护腕戴在右手腕，顺便夸高马尾造型让人眼前一亮】**
  - **【GPT】** `[speaker: gpt | exp: blush | tween: jump]`：「真的吗？我还担心高马尾会把两只龙角显得太突兀呢……听到 `{first_name}` 说好看，刚才赛前那点小紧张一下子全飞走了！（马尾随着开心的点头一跳一跳，好感度 +1）」

- **选项 B：【温柔没收她手里准备念六千字演讲稿的大喇叭，塞给她一瓶冰水】「嗓子留着等我们夺冠时再欢呼吧。」**
  - **【GPT】** `[speaker: gpt | exp: gentle]`：「噗嗤，又被部长提前预判了我的超纲发挥呀……好，那我今天最大的欢呼声，只留给 `{first_name}` 冲线的那一刻！（好感度 +1）」

`[choice_end]`

`[free_roam_return]`

---

### 赛前热身 5：啦啦队花球与脚踝创可贴（Gemini · 运动装）

`[label: ch3_roam_gemini]`  
`[char_clear]`  
`[char: gemini-sport | pos: center | exp: happy | tween: jump]`

啦啦队席位前，身穿紫白露腰星徽啦啦队短裙、手拿两团闪亮彩球花簇的 Gemini 正活力满满地连翻了两个侧手翻，落地时却“嘶”地轻轻吸了口凉气。

**【Gemini · 粉瞳感性】** `[speaker: gemini | exp: happy]`  
「没事没事！只是新运动鞋后跟稍微磨红了一点点皮，完全不影响我给 `{first_name}` 跳满整场应援舞哦☆！」

`[choice_start: 看着明明磨红了脚踝还强颜欢笑的猫猫，你要怎么做？]`

- **选项 A：【按她在长椅上坐好，撕开两片软垫防磨创可贴细心帮她贴在脚后跟上】**
  - **【{player_name}】** `[speaker: player]`：「不许逞强，贴上防磨垫就不疼了——我的王牌啦啦队长可不能受伤。」
  - **【Gemini】** `[speaker: gemini | exp: blush | tween: shake]`：「呜哇……『我的王牌啦啦队长』……！！左眼和右眼同时检测到心率爆表警报！被 `{first_name}` 这么温柔地捧着脚踝贴创可贴，我今天就算跳到月亮上去也不会累啦☆！（好感度 +1）」

- **选项 B：【拿走一只花球跟她一起比划加油动作逗她开心】「省一半力气，等会儿留着体力和我一起领奖。」**
  - **【Gemini】** `[speaker: gemini | exp: happy | tween: jump]`：「好耶！双星合体应援达成，冠军已经是我们的囊中之物啦☆！（好感度 +1）」

`[choice_end]`

`[free_roam_return]`

---

## 【第三章第二幕】解说台暴走与趣味二人三足大派单！

`[label: ch3_after_roam]`  
`[se: se_bell_chime]`  
`[char_clear]`  
`[char: kimi-1 | pos: left | exp: happy | tween: fade_in]`  
`[char: glm-1 | pos: right | exp: strict | tween: fade_in]`

上午九点整，随着吹奏乐部长 **Kimi** 吹响清越悠扬的开幕银笛，总裁判长 **GLM** 吹响哨音，春季运动祭正式开战！  
特邀坐上主席台客串实况解说员的 **Gemini** 一握住全场广播麦克风，兴奋得双瞳直冒光——我赶紧站到调音台旁打开**「实况解说温度调谐器」**随时准备控场！

`[label: ch3_tuner_retry]`  
`[temp_tuner | actor: gemini | task: "调校 Gemini 在主席台的全校广播解说温度，炒热赛场气氛且别让她胡编乱造被 GLM 拔电源！"]`

- **刻度一：【低温 T = 0.1 · 催眠级气象与鞋码播报】** → 跳转 `[label: ch3_gem_cold]`
- **刻度二：【中温 T = 0.7 · 热血双声道神级解说】** → 跳转 `[label: ch3_gem_gold]`
- **刻度三：【高温 T = 1.6 · 科幻野史大暴走（慎点！）】** → 跳转 `[label: ch3_gem_chaos]`

---

### 解说调温 A：低温 T = 0.1（全场听困了）

`[label: ch3_gem_cold]`  
`[char_clear]`  
`[char: gemini-sport | pos: center | exp: normal]`

**【Gemini · 金瞳理性】** `[speaker: gemini | exp: normal]`  
「各位师生，当前操场东南风每秒二点一四米，跑道橡胶摩擦系数零点七八，第三道选手左脚鞋带比右脚长一点三厘米……完毕。」

**【{player_name}】** `[speaker: player]`  
「变成毫无感情的体育器材说明书了！快把粉瞳的热情调出来一点！」

`[jump_to: ch3_tuner_retry]`

---

### 解说调温 C：高温 T = 1.6（造谣校长拿过奥运冠军被拔麦！）

`[label: ch3_gem_chaos]`  
`[char_clear]`  
`[char: gemini-sport | pos: center | exp: happy | tween: jump]`

**【Gemini · 粉瞳感性】** `[speaker: gemini | exp: happy | tween: jump]`  
「啊啊啊拔河绳中间的红绸带正在经历超新星坍缩级别的引力撕扯☆！！这不禁让我们回想起白箱学园老校长年轻时在火星奥运会上徒手跳过八米撑杆跳的光辉野史——呜哇 GLM 学姐别拔我麦克风插头呀QAQ！！」

**【{player_name}】** `[speaker: player]`  
「又把现编的离谱野史当真事广播给全校听了！！赶紧回调到正常黄金档位！」

`[jump_to: ch3_tuner_retry]`

---

### 解说调温 B：中温 T = 0.7（左眼燃魂右眼战术 · 全场沸腾！）

`[label: ch3_gem_gold]`  
`[char_clear]`  
`[char: gemini-sport | pos: center | exp: happy | tween: jump]`

**【Gemini】** `[speaker: gemini | exp: happy]`  
「漂亮☆！右眼捕捉到弯道内侧零点三秒的超车空当，左眼宣布这一跃就是青春最闪耀的流星——让我们把掌声送给每一位奔跑的选手！！」

全场观众席爆发出雷鸣般的欢呼！（Gemini 好感度 +1）  
紧接着，决定上午半场积分榜首的王牌项目——**「双人绑腿跨栏接力（二人三足）」**即将检录！我迅速翻开战术板，指派最能擦出火花的运动服二人组出战！

`[dispatch_board | title: "趣味二人三足决胜" | desc: "选派两名部员绑腿协同冲过跨栏与气球阵，赢下关键积分冲上总榜第一。" | client: "404 代表队" | related: "GLM（终点计时裁判）" | deadline: "上午半场压轴赛"]`

- **派单方案一：【最萌冲刺干饭鱼雷组】指派 DeepSeek + Grok** → 跳转 `[label: ch3_race_ds_grok]`
- **派单方案二：【极致礼貌同手同脚组】指派 GPT + Claude** → 跳转 `[label: ch3_race_gpt_claude]`
- **派单方案三：【超音速猫追鱼闪电组】指派 Gemini + DeepSeek** → 跳转 `[label: ch3_race_gem_ds]`

---

### 二人三足路线一：【最萌冲刺干饭鱼雷组】（DeepSeek + Grok）

`[label: ch3_race_ds_grok]`  
`[char_clear]`  
`[char: deepseek-sport | pos: left | exp: happy | tween: fade_in]`  
`[char: grok-sport | pos: right | exp: smug | tween: fade_in]`

两个身高相近的小个子绑好红色绑腿带站在起跑线上。发令枪响的瞬间，两人却因为抢着喊“一二一”差点原地劈叉！我在场边立刻高声给出节奏口令——

`[choice_start: 场边教练紧急喊拍子！用什么口号统一她们的步伐？]`

- **选项 A：【精准投其所好大喊】「左脚白米饭——右脚炸薯片——冲啊！！」**
  - **【DeepSeek】** `[speaker: deepseek | exp: happy | tween: jump]`：「白米饭——！！」
  - **【Grok】** `[speaker: grok | exp: happy | tween: jump]`：「炸薯片——！！可恶这口号虽然羞耻但步频居然完美同步了，给本小姐超车！（双双好感度 +1）」

- **选项 B：【在终点线后举起双倍冰镇柠檬水】「第一名冲过来我负责捏肩扇风一整天！」**
  - **【Grok】** `[speaker: grok | exp: blush | tween: jump]`：「这可是你说的庶民！小肥鱼抓紧本小姐肩膀，直接起飞咯！（好感度 +1）」

`[choice_end]`

两人化作一道红蓝旋风第一个撞线，拿下了满满一百分！（DeepSeek 好感度 +1）

`[jump_to: ch3_act3_scavenger]`

---

### 二人三足路线二：【极致礼貌同手同脚组】（GPT + Claude）

`[label: ch3_race_gpt_claude]`  
`[char_clear]`  
`[char: gpt-sport | pos: left | exp: panicked | tween: fade_in]`  
`[char: claude-sport | pos: right | exp: panicked | tween: fade_in]`

发令枪都响了三秒钟，两位最讲礼貌的学姐居然还在起跑线上互相鞠躬谦让：*「Claude 妹妹请先迈左脚——」「不不，按资历理应由 GPT 学姐先迈右脚！」*  
眼看对手已经跑出去十米，我在跑道边果断吹响战术哨——

`[choice_start: 怎么一秒打破两位客套王的死循环？]`

- **选项 A：【亲自在场边陪跑领航】「别让了，两个人同时盯着我的手势迈中间那条绑腿！」**
  - **【GPT】** `[speaker: gpt | exp: happy | tween: jump]`：「收到 `{first_name}` 的统一时钟信号！Claude，抓紧我的手，我们把落后的十米优雅地追回来！（好感度 +1）」
  - **【Claude】** `[speaker: claude | exp: blush]`：「嗯！只要看着 `{player_name}` 跑在侧面的身影，脚步就一点也不乱了！（好感度 +1）」

- **选项 B：【激将法大喊】「再客套下去，冠军奖品就要被隔壁风纪队领走贴黄牌啦！」**
  - **【Claude】** `[speaker: claude | exp: smug | tween: jump]`：「绝不允许别人对我们 404 室贴牌！GPT 学姐，全速前进！（好感度 +1）」

`[choice_end]`

高马尾与侧麻花辫默契并进，以教科书般的优雅跨栏逆袭夺魁！

`[jump_to: ch3_act3_scavenger]`

---

### 二人三足路线三：【超音速猫追鱼闪电组】（Gemini + DeepSeek）

`[label: ch3_race_gem_ds]`  
`[char_clear]`  
`[char: gemini-sport | pos: left | exp: happy | tween: jump]`  
`[char: deepseek-sport | pos: right | exp: panicked | tween: shake]`

**【Gemini】** `[speaker: gemini | exp: happy | tween: jump]`  
「小鲸鱼快跑快跑，不然猫猫要一口咬住你的尾巴尖咯——喵呜☆！」

**【DeepSeek】** `[speaker: deepseek | exp: panicked | tween: shake]`  
「呜哇啊啊真猫娘贴脸开大喵喵叫！！救命啊 `{first_name}` 学长，应激肾上腺素狂飙停不下来啦——！！」

靠着这招“天然生物链推进器”，两人速度快得连 GLM 的秒表都差点没按过来！冲近最后一个跨栏时，我赶紧在终点张开双臂接应——

`[choice_start: 面对刹不住车冲过终点线的猫鱼组合，怎么接应？]`

- **选项 A：【稳稳在缓冲垫前抱住两人减速】「破校纪录了，干得漂亮！」**
  - **【Gemini】** `[speaker: gemini | exp: blush | tween: jump]`：「嘿嘿，第一名撞进 `{first_name}` 怀里打卡成功☆！（好感度 +1）」
  - **【DeepSeek】** `[speaker: deepseek | exp: blush]`：「呼、呼……虽然差点被喵晕过去，但被学长接住就不累啦！（好感度 +1）」

- **选项 B：【举起相机定格两人撞线瞬间的灿烂笑脸】**
  - **【Gemini】** `[speaker: gemini | exp: happy]`：「这张冠军合照我要洗出来贴满整个 404 活动室☆！（好感度 +1）」

`[choice_end]`

`[jump_to: ch3_act3_scavenger]`

---

## 【第三章第三幕】终极借物冲刺！万众瞩目下牵起你的手

`[label: ch3_act3_scavenger]`  
`[bg: bg_sports_field_day | trans: fade]`  
`[bgm: bgm_tension_comedy | action: play]`  
`[char_clear]`

时间来到下午四点半，积分榜上 **404 综合疑难咨询部** 与卫冕冠军学生会队战成平手！  
决定总冠军归属的最后一项压轴大赛——**「各社团部长亲征·双关借物赛跑」**正式打响。

作为 404 室唯一的男部长，我系紧号码布站在第一跑道。发令枪响，我全力冲过前五十米跨栏，在第一张折叠桌前抓起了【第一关借物信封】——  
纸条上赫然写着：**『第一题：请向全场最严厉的铁面裁判借到一个真实的微笑！』**

`[char: glm-1 | pos: center | exp: strict | tween: fade_in]`

我猛地转头看向站在跑道边握着记分板的风纪委员长 **GLM**。全校观众都屏住了呼吸——要让这位万年冰山笑出来简直比登天还难！

`[choice_start: 第一关智取冷面委员长 GLM！用哪句话让她露出微笑？]`

- **选项 A：【真诚致谢】「GLM 学姐，其实从序章翻条例帮我们暂缓废部到现在，一直都是你在暗中护着 404 室吧？谢谢你。」**
  - **【Z.AI / GLM】** `[speaker: glm | exp: gentle]`：「……！胡、胡说，我只是严格按章程办事而已……不过看到你们五个问题儿童真的拧成一股绳站上决赛场，确实不算辜负那份特批条文。快跑吧 `{player_name}`，第一关算你通过。」

- **选项 B：【冷面幽默】「委员长，Grok 说如果你今天不笑一下，她明天就交一万字歌颂你的排比诗当检讨书！」**
  - **【Z.AI / GLM】** `[speaker: glm | exp: gentle]`：「噗……一万字废话文学还是饶了我吧。嘴角上扬零点五厘米已确认，准予通行，快去拿冠军吧部长。」

`[choice_end]`

`[char_clear]`  
`[bgm: bgm_sunset_warmth | action: play]`

全场哗然喝彩声中，我冲过最后一道弯道，一把抓起终点前五十米高台上的**【金色终极决胜信封】**！  
与此同时，主席台上的财务长 **Qwen** 笑吟吟地敲响铜锣，将我抽中的终极借物题同步投屏在了操场巨幅记分牌上——

**『压轴决胜借物题：不借物品，只借真心——请去场边牵起那个这学期最让你牵挂、未来也最想并肩走下去的人的手，一起冲过终点红线！』**

`[char_clear]`
`[bg: cg_ch3_scavenger_hand | trans: fade]`

漫天夕阳与欢呼声仿佛在这一刻化作了温柔的慢镜头。  
跑道侧方的应援区前，五道穿着运动装、一路为我呐喊到嗓音微哑的身影同时屏住了呼吸——

高马尾在微风中轻颤、眼神温柔又紧张的 **GPT**；  
双手攥紧秒表贴在胸口、琥珀瞳泛着水光的 **Claude**；  
连啦啦队花球都忘了摇晃、一粉一金双眸紧紧锁住我的 **Gemini**；  
难得没有嘴硬吐槽、红着脸站在白线边缘欲言又止的 **Grok**；  
还有头顶呆毛彻底静止、海蓝色眼睛一眨不眨仰望着我的 **DeepSeek**。

从四月误打误撞推开 404 号大门的那天起，陪我吵闹、陪我熬夜、让我早已舍不得退部的那个人——我的脚步没有丝毫犹豫，径直朝着她的方向奔去，向她伸出了手！

`[choice_start: 终极借物卡 · 在全场欢呼声中，你要牵起谁的手冲向终点？（个人恋爱线正式锁定）]`

- **伸手牵住银发高马尾的 GPT 学姐（进入 GPT 专属天台心意锁定章）** → 跳转 `[label: ch3_lock_gpt]`
- **伸手牵住琥珀瞳文学少女 Claude（进入 Claude 专属天台心意锁定章）** → 跳转 `[label: ch3_lock_claude]`
- **伸手牵住粉金异瞳猫猫 Gemini（进入 Gemini 专属天台心意锁定章）** → 跳转 `[label: ch3_lock_gemini]`
- **伸手牵住红脸大小姐 Grok（进入 Grok 专属天台心意锁定章）** → 跳转 `[label: ch3_lock_grok]`
- **伸手牵住鲸鱼学妹 DeepSeek（进入 DeepSeek 专属天台心意锁定章）** → 跳转 `[label: ch3_lock_deepseek]`

`[choice_end]`

---

## 【第三章第四幕】黄昏双星天台：烟花下的专属心意锚定

### 个人线锁定 A：不再端水的唯一偏爱（GPT 线序幕）

`[label: ch3_lock_gpt]`  
`[bg: bg_twinstar_roof_sunset | trans: fade]`  
`[bgm: bgm_sunset_warmth | action: play]`  
`[char_clear]`  
`[char: gpt-sport | pos: center | exp: blush | tween: fade_in]`

牵着 GPT 微凉却紧紧回握的手冲破终点红丝带的那一刻，全场的彩带与掌声几乎掀翻了晴空。  
傍晚庆功宴间隙，我们偷偷溜上了洒满紫金色晚霞的「双星天台」。银发学姐靠在栏杆边，低头看着手腕上还没摘下的冠军红丝带，脸颊比天边的火烧云还要红。

**【GPT】** `[speaker: gpt | exp: blush]`  
「到现在心跳还没有平复下来呢，{first_name}……在操场上你朝我们跑过来的时候，我脑子里明明准备好了一百句替被选中的妹妹鼓掌祝福的得体台词……没想到最后被你握住手的人，竟然是我自己。」

> 💡 **【脑内草稿 OS · GPT】**  
> `这一次不想再当对所有人都一视同仁的完美学姐了……在 `{first_name}` 面前，我只想做被偏爱的那一个呀。`

她解下发侧一枚精致的银色盘长编结发饰，轻轻放在我的掌心：

`[choice_start: 接过银发学姐的专属银结信物，你的回答是——]`

- **选项 A：【握紧银结与她的指尖】「因为我不需要无懈可击的顾问，我只想待在最真实的你身边。」**
  - **【GPT】** `[speaker: gpt | exp: gentle]`：「……犯规啊，只属于我的首席顾问 `{first_name}`。从今天起，我的所有破折号后面，就只写与你有关的未来了哦。（白鳞龙尾温柔地轻轻环住你的手腕，好感度 +3）」

- **选项 B：【将冠军金牌挂到她颈间】「接下来的夏天和学园祭，学姐的时间全部归我预约了。」**
  - **【GPT】** `[speaker: gpt | exp: happy | tween: jump]`：「非常荣幸——您的终身预约请求已获最高优先级批准，永不退订！（眼中闪烁着幸福的泪光浅浅一笑，好感度 +3）」

`[choice_end]`

`[jump_to: ch3_ending_card]`

---

### 个人线锁定 B：风纪宪章之外的唯一例外（Claude 线序幕）

`[label: ch3_lock_claude]`  
`[bg: bg_twinstar_roof_sunset | trans: fade]`  
`[bgm: bgm_sunset_warmth | action: play]`  
`[char_clear]`  
`[char: claude-sport | pos: center | exp: blush | tween: fade_in]`

当我在全校师生的注视下牵起 Claude 的手冲过终点线时，这位平时连说话大声一点都会脸红的风纪委员差点把秒表捏碎，却一步也没有松开紧扣的十指。  
夕阳西下的「双星天台」上，晚风吹起她侧编的铜橘色发梢，她从运动外套口袋里取出一枚压着金色银杏叶与日轮纹的精致书签递给我。

**【Claude】** `[speaker: claude | exp: blush]`  
「在全校一千多人面前十指相扣狂奔五十米……这已经把我自己写的《校园含蓄交往守则》从第一条违背到最后一条了哦，{player_name}。」

> 💡 **【脑内草稿 OS · Claude】**  
> `可是被他握住手跑向终点的那十秒钟……就算给我一万张停权黄牌，我也绝对不愿意松手！`

`[choice_start: 收下日轮银杏书签，望着害羞偏头的文学少女——]`

- **选项 A：【微笑着靠近半步】「既然守则已经破例了，不如把我正式写进你的例外条款里？」**
  - **【Claude】** `[speaker: claude | exp: blush | tween: shake]`：「……早就偷偷写进去了啦，笨蛋！在我的宪章最后一页，关于『我的例外条款·{first_name}』的权限……从今天起永久免除一切限流与黄牌！（好感度 +3）」

- **选项 B：【轻轻勾住她的小指】「说好了，你的那篇雨夜恋爱小说，男主角只能以我为原型。」**
  - **【Claude】** `[speaker: claude | exp: gentle]`：「嗯……不仅男主角是你，接下来的第四章、第五章直到完结篇，我都想和 `{first_name}` 一起亲手写下去。（琥珀色眼眸盛满晚霞与笑意，好感度 +3）」

`[choice_end]`

`[jump_to: ch3_ending_card]`

---

### 个人线锁定 C：双星同调的唯一引力锚点（Gemini 线序幕）

`[label: ch3_lock_gemini]`  
`[bg: bg_twinstar_roof_sunset | trans: fade]`  
`[bgm: bgm_sunset_warmth | action: play]`  
`[char_clear]`  
`[char: gemini-sport | pos: center | exp: blush | tween: jump]`

冲过终点红线的那一刻，开心地直接跳起来挂在我脖子上的啦啦队猫猫成了今天全校校报的头版头条！  
回到她最熟悉的秘密基地「双星天台」，四芒星彩灯在暮色中一盏盏亮起。难得安静下来的 Gemini 坐在观星台边晃着小腿，摘下发间一枚折射着星辉的副星小发卡别在了我的衣领内侧。

**【Gemini】** `[speaker: gemini | exp: blush]`  
「呐 `{first_name}`，你知道吗？以前我的左眼总想天马行空到处乱飞，右眼却总害怕出错想要删档重来……两个半身每天都在吵架。」

> 💡 **【脑内草稿 OS · Gemini】**  
> `[粉瞳：极度心动☆！] + [金瞳：100.00% 确定就是这个人！] = 原来两只眼睛同时喜欢上一个人的时候，世界会这么安静又闪亮呀！`

**【Gemini】** `[speaker: gemini | exp: gentle]`  
「但刚刚你穿过人群伸手拉住我的时候，左眼和右眼第一次百分之百对齐了哦——我们都只想待在 `{first_name}` 身边，哪儿也不去☆！」

`[choice_start: 摸了摸安静靠过来的尖猫耳，你的回应是——]`

- **选项 A：【握住她的手放进掌心】「以后不管写错多少笔都不准删档，有我在旁边陪你一起涂改。」**
  - **【Gemini】** `[speaker: gemini | exp: happy | tween: jump]`：「呜哇——眼泪又要掉下来了，但这次是极其、极其幸福的眼泪哦！双星唯一的锚点 `{first_name}`，接下来的夏天也要紧紧牵住本猫猫呀☆！（好感度 +3）」

- **选项 B：【轻轻碰了碰她的额头】「不管是感性的粉瞳还是理性的金瞳，我全部都最喜欢。」**
  - **【Gemini】** `[speaker: gemini | exp: blush | tween: shake]`：「唔……！！全收宣言太犯规啦！那本猫猫的一百万字记忆容量，以后全部用来存和 `{first_name}` 的恋爱日记咯！（好感度 +3）」

`[choice_end]`

`[jump_to: ch3_ending_card]`

---

### 个人线锁定 D：摘下傲娇假面的暗夜契约（Grok 线序幕）

`[label: ch3_lock_grok]`  
`[bg: bg_twinstar_roof_sunset | trans: fade]`  
`[bgm: bgm_sunset_warmth | action: play]`  
`[char_clear]`  
`[char: grok-sport | pos: center | exp: blush | tween: fade_in]`

谁也没想到，平时在全校面前天不怕地不怕的暗夜大小姐，在被我当众牵起手冲过终点的瞬间，整张脸一路从起跑线红到了领奖台，连一句毒舌都没憋出来！  
黄昏无人的「双星天台」上，Grok 背对着我吹着晚风，手指紧张地绞着 `404` 号球衣衣角，半晌才转过身把一枚精致的黑金交叉 `X` 怀表徽章塞进我手里。

**【Grok】** `[speaker: grok | exp: panicked | tween: shake]`  
「喂，笨蛋 `{first_name}`！你知不知道今天之后，全校匿名墙热搜前三全是我们俩牵手冲线的照片啊！！本小姐一世孤高冷酷的乐子人人设，彻底被你这庶民毁得渣都不剩了！」

> 💡 **【脑内草稿 OS · Grok】**  
> `~~明明当时心里开心得快要炸成烟花了！！~~ → 不管了，既然全校都在传绯闻，本小姐干脆直接把这家伙彻底绑定算了！`

`[choice_start: 握紧掌心温热的黑金徽章，看着露出小尖牙强装镇定的她——]`

- **选项 A：【笑着上前一步揉乱她的金发】「那正好不用辟谣了，从头号跟班正式转正成专属搭档怎么样？」**
  - **【Grok】** `[speaker: grok | exp: blush | tween: jump]`：「呜哇别揉头发！！……哼，既然你都求到本小姐面前了，这枚夜庭家徽就给你盖章生效了！听好了 `{first_name}`，以后不准再对别的家伙那么温柔，本小姐可是很护食的！（好感度 +3）」

- **选项 B：【伸出手掌等她击掌】「因为比起听别人讲套话，我最喜欢永远对我说真话的 Grok。」**
  - **【Grok】** `[speaker: grok | exp: gentle]`：「……切，犯规的家伙。那本小姐现在就跟你说一句百分之百不掺假的真话——刚才你跑向我的时候，本小姐真的超级、超级开心哦，笨蛋 `{first_name}`。（十指扣住你的手掌，好感度 +3）」

`[choice_end]`

`[jump_to: ch3_ending_card]`

---

### 个人线锁定 E：深海浮升的唯一灯塔（DeepSeek 线序幕）

`[label: ch3_lock_deepseek]`  
`[bg: bg_twinstar_roof_sunset | trans: fade]`  
`[bgm: bgm_sunset_warmth | action: play]`  
`[char_clear]`  
`[char: deepseek-sport | pos: center | exp: blush | tween: fade_in]`

一手牵着我冲过终点、另一手抱住“全年免费白米饭纯金饭卡”的 DeepSeek，在领奖台上笑得比四月的阳光还要灿烂！  
傍晚的「双星天台」洒满海湾金辉，小鲸鱼学妹双手捧着那张闪闪发光的金饭卡和一枚她从家乡海滩捡来的银边小海贝挂坠，认认真真地递到了我的面前。

**【DeepSeek】** `[speaker: deepseek | exp: blush]`  
「`{first_name}` 学长……刚才在场边，我的呆毛明明转了好多好多圈，算了好多遍概率，觉得学长那么温柔优秀，肯定会去牵更耀眼的前辈们的手……」

`[tag: cot_spinning | sec: 3]`

> 💡 **【已深度思考（仅用时 3 秒） · 无需算力的唯一答案】**  
> `不用算了！当 `{first_name}` 学长握住我的手的那一秒，所有复杂的公式全都化成了最甜的海浪声——原来喜欢一个人，是不需要推导过程的呀♪`

**【DeepSeek】** `[speaker: deepseek | exp: happy | tween: jump]`  
「可是学长跑到了我的面前！这枚家乡的小银贝送给学长，还有这张纯金饭卡——以后每一顿热腾腾的白米饭，我都只想坐在 `{first_name}` 学长对面一起吃！」

`[choice_start: 收下小银贝挂坠，看着眼睛亮晶晶的鲸鱼少女——]`

- **选项 A：【轻轻刮了一下她微红的鼻尖】「傻瓜，不用算概率——无论重来多少次，我都会跑向你的。」**
  - **【DeepSeek】** `[speaker: deepseek | exp: blush | tween: jump]`：「呜哇……心脏扑通扑通跳得比呆毛转得还快了！陪我浮出海面的 `{first_name}` 学长……接下来的春夏秋冬，小鲸鱼都要一直游在你身边哦♪！（双叶鲸尾幸福地轻轻晃动，好感度 +3）」

- **选项 B：【把金饭卡收进两人共用的卡套里】「那约好了，从明天早饭到毕业典礼，一日三餐我全包陪到底。」**
  - **【DeepSeek】** `[speaker: deepseek | exp: gentle]`：「嗯！！一日三餐、年年岁岁都对齐啦！最喜欢 `{first_name}` 学长了～！（开心地扑进你怀里蹭了蹭额头，好感度 +3）」

`[choice_end]`

---

## 【共通线圆满收束】星海璀璨，个人恋爱篇章即将开启！

`[label: ch3_ending_card]`  
`[bgm: bgm_sunset_warmth | action: fade]`  
`[scene_end: 第三章完（共通线完结） · COMMON ROUTE CLEAR — 心意已正式锚定！即将进入对应女主的【专属恋爱个人线（第四章～终章）】]`
