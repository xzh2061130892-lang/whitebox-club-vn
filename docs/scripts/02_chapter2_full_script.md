# 《私立白箱学园：今天社团也没对齐！》第二章完整定稿剧本

> **章节范围**：第二章《海风合宿与大停电之夜！谁溜进了部长的房间？》全四幕  
> **核心交互体验**：【出发前群聊整活】+【考前一对一弱科特训 5 选 2 自由串门】+【露天厨房咖喱野炊双人派单 & 秘料抉择】+【暴雨停电夜·Grok 壮胆鬼故事温度调谐器】+【熄灯被窝悄悄话群聊】+【深夜敲门声·五女主合宿睡衣与散发限定 `*-camp` 独处长支线】。

---

## 【第二章第一幕】偏科天团的期中警报与海景木屋特训！

`[char_clear]`  
`[bg: bg_room_404_day | trans: fade]`  
`[bgm: bgm_tension_comedy | action: play]`

距离下周全校期中摸底联考仅剩最后三天。  
原本应该一片祥和的 404 活动室里，此刻正弥漫着堪比世界末日的低气压——风纪委员长 **GLM** 刚刚留下了一纸无情的《特优社团学业预警通知单》。

`[char: glm-1 | pos: left | exp: strict | tween: fade_in]`  
`[char: gpt-1 | pos: right | exp: panicked | tween: sink]`

**【Z.AI / GLM】** `[speaker: glm | exp: strict]`  
「重申一遍教务处红线：凡享受独立活动室津贴的社团，期中联考一旦出现任意一人单科挂科，下月活动经费即刻冻结。刚才调阅了你们昨天的模拟考卷——情况不容乐观。」

**【{player_name}】** `[speaker: player]`  
「等等 GLM 委员长，她们五个明明都是各自领域的年级第一，怎么可能挂科？！」

**【Z.AI / GLM】** `[speaker: glm | exp: normal]`  
「你自己看模拟卷批注吧——DeepSeek 数学物理双满分，但现代文阅读理解题要求赏析作者的思乡之情，她写了八百字严谨论证作者搞错了季风方向与车票价格，得零分。」

`[char: gpt-1 | tween: hide]`  
`[char: deepseek-1 | pos: right | exp: panicked | tween: jump]`

**【DeepSeek】** `[speaker: deepseek | exp: panicked | tween: shake]`  
「呜……可是作者明明说『顶着四月刺骨的西北风坐绿皮火车去江南吃新米』，四月江南根本没有西北风，而且新米要十月才收割呀！这属于严重的常识幻觉！」

**【Z.AI / GLM】** `[speaker: glm | exp: strict]`  
「其次，Gemini 交上来的综合卷原本能拿九十八分，但她在交卷前最后一分钟怀疑自己第一题涂错了卡，边哭边拿橡皮把整张答题卡擦穿了一个大洞，读卡机判为零分。」

`[char: deepseek-1 | tween: hide]`  
`[char: gemini-1 | pos: right | exp: panicked | tween: shake]`

**【Gemini】** `[speaker: gemini | exp: panicked]`  
「呜哇啊啊别念了别念了！！当时右眼突然弹警告说 A 选项看着像陷阱，左眼一慌就想把整张卷子清空重涂嘛QAQ！！」

**【Z.AI / GLM】** `[speaker: glm | exp: strict]`  
「至于 Grok 在校规简答题里画小恶魔涂鸦讥讽出题老师、Claude 下午两点半考历史时困得趴在卷子上写梦话散文、以及 GPT 因为熬夜替十七个外社同学押题导致自己在考场上把《出师表》背成了《量子力学导论》——我就不逐一念了。」

`[char: gemini-1 | tween: hide]`  
`[char: qwen-1 | pos: right | exp: happy | tween: fade_in]`

就在我听得眼前一黑时，财务长 **Qwen** 笑眯眯地从门外探进头来，往桌上放了一串挂着贝壳木牌的钥匙：

**【Qwen】** `[speaker: qwen | exp: happy]`  
「救急不救穷，学生会名下正好有一栋建在临海半山腰的**『白箱海景研修木屋』**周末空着。`{player_name}` 部长，我就把这五位严重偏科的天才交给你带去封闭合宿两天一夜咯——能不能保住下个月的电饭煲电费，全看你的督导手腕啦♪」

`[bg: bg_camp_lodge_day | trans: slide]`  
`[bgm: bgm_sunny_mischief | action: play]`  
`[char_clear]`

周六上午十点，海风习习的半山腰「海景研修木屋」。  
推开宽敞的杉木推拉门，落地玻璃窗外便是一望无际的蔚蓝海湾。然而刚一开箱检查行李，我就没收了 Grok 的整蛊鬼脸手电筒、拦住了试图给木屋刷白漆重装的 GPT，还从 DeepSeek 的行李箱里搜出了足足五斤五常大米！

`[choice_start: 合宿开营第一道纪律宣言！部长怎么立规矩？]`

- **选项 A：【温柔胡萝卜流】「全员模拟卷及格的话，今晚宵夜我亲自下厨包揽！」**
  - **【DeepSeek】** `[speaker: deepseek | exp: happy | tween: jump]`：「部长亲手做的宵夜！！哪怕是现代文阅读理解，我也死记硬背把标准答案吞下去！（好感度 +1）」
  - **【GPT】** `[speaker: gpt | exp: happy]`：「这**不是**一顿普通的宵夜——**而是**照亮我们复习之路的灯塔！（好感度 +1）」

- **选项 B：【精准打蛇打七寸】「谁敢擦破卷子或乱写涂鸦，今晚罚没全部零食和薯片！」**
  - **【Grok】** `[speaker: grok | exp: panicked | tween: shake]`：「呜哇暴君庶民！！别动本小姐的海苔薯片，我好好写字还不行吗！（好感度 +1）」
  - **【Gemini】** `[speaker: gemini | exp: blush]`：「橡皮擦已经上交 `{first_name}` 保管啦，这次绝对不删档重来☆！（好感度 +1）」

`[choice_end]`

上午的第一轮弱科攻坚正式开始！五个人各自抱着最头疼的科目散坐在木屋客厅与露台各处，我拿着红笔决定先挑两个人进行**一对一贴身特训**——

`[label: ch2_roam_start]`  
`[free_roam_hub | picks: 2 | exit: ch2_after_roam | title: "合宿弱科一对一辅导 · 先去抓谁补课？（任选 2 人）"]`

- **串门目标一：【沙发靠垫】拯救熬夜帮人押题导致背书串台的 GPT（指派 GPT）** → 跳转 `[label: ch2_roam_gpt]`
- **串门目标二：【矮木桌角】盯紧又想拿橡皮把卷子擦破的 Gemini（指派 Gemini）** → 跳转 `[label: ch2_roam_gemini]`
- **串门目标三：【露台藤椅】给犯困打瞌睡的 Claude 特调薄荷醒神茶（指派 Claude）** → 跳转 `[label: ch2_roam_claude]`
- **串门目标四：【二楼栏杆】押着满脸不服气的 Grok 背校规送分题（指派 Grok）** → 跳转 `[label: ch2_roam_grok]`
- **串门目标五：【榻榻米垫】教死磕逻辑的 DeepSeek 理解人类的散文浪漫（指派 DeepSeek）** → 跳转 `[label: ch2_roam_deepseek]`

---

### 弱科特训 1：过劳迷糊的白龙学姐（GPT）

`[label: ch2_roam_gpt]`  
`[char_clear]`  
`[char: gpt-1 | pos: center | exp: panicked | tween: fade_in]`

木屋客厅的软垫旁，平时永远体面端庄的 GPT 正揉着太阳穴，嘴里迷迷糊糊地小声背诵：

**【GPT】** `[speaker: gpt | exp: panicked]`  
「先帝创业未半——而中道触发薛定谔的猫——此诚危急存亡之秋也，综上所述可得出牛顿第二定律……」

> 💡 **【脑内草稿 OS · GPT】**  
> `昨晚一口气帮话剧社、天文社和柔道部写了十七份复习提纲……脑子里的知识库好像彻底串行打结了呜呜……`

`[choice_start: 看着明显用脑过度开始说胡话的 GPT，你要怎么做？]`

- **选项 A：【俯身用手背轻轻贴一下她的额头测体温，强制没收外社求助单】**
  - **【{player_name}】** `[speaker: player]`：「没发烧但脑子转太快过热了。从现在起那十七份外社杂活我替你回绝，你只准靠着休息二十分钟。」
  - **【GPT】** `[speaker: gpt | exp: blush | tween: shake]`：「呀……！`{first_name}` 的手心凉凉的好舒服……明明我是年长的学姐，怎么反过来被你像哄小孩子一样管住了呢……嗯，只听你的，我就闭眼靠在你肩膀旁边眯十分钟哦。（好感度 +1）」

- **选项 B：【拿走她厚厚的押题本，一题一题耐心地陪她重新顺一遍古文】**
  - **【{player_name}】** `[speaker: player]`：「来，把牛顿请出去，我念上句你接下句，不许加破折号。」
  - **【GPT】** `[speaker: gpt | exp: gentle]`：「噗嗤……好奇妙的感觉，平时都是我给别人提供答案，第一次有人这么耐心地帮我校准记忆呢，谢谢你 `{first_name}`。（好感度 +1）」

`[choice_end]`

`[free_roam_return]`

---

### 弱科特训 2：保卫答题卡大作战（Gemini）

`[label: ch2_roam_gemini]`  
`[char_clear]`  
`[char: gemini-1 | pos: center | exp: panicked | tween: shake]`

矮木桌前，Gemini 已经快准狠地做完了整套模拟卷，但此刻她左眼粉瞳和右眼金瞳正死死盯着最后一道选择题，手里捏着一块大号绘图橡皮蠢蠢欲动！

**【Gemini】** `[speaker: gemini | exp: panicked | tween: shake]`  
「不对劲不对劲！连选了四个 C 绝对是出题人的阴谋！呜哇越看越觉得前面二十道题全都涂错行了，快让我把整张卡擦干净重新做一遍QAQ！！」

`[choice_start: 眼看橡皮就要落下擦穿卷子，部长怎么救援？]`

- **选项 A：【一把握住她捏橡皮的右手，当场批改宣布她前二十题全对！】**
  - **【{player_name}】** `[speaker: player]`：「别擦！我对过答案了，你第一直觉选的那四个 C 百分之百全对！」
  - **【Gemini】** `[speaker: gemini | exp: blush | tween: jump]`：「真、真的全对吗？！呜呜还好 `{first_name}` 及时握住我的爪子！你的手好暖和哦，干脆考试前一直牵着帮我封印删档冲动好不好☆！（好感度 +1）」

- **选项 B：【没收大橡皮，换给她一枚印着四芒星的“免改金牌贴纸”】**
  - **【{player_name}】** `[speaker: player]`：「做完就贴上封条不准回头改，相信你全校第一的直觉，笨蛋猫猫。」
  - **【Gemini】** `[speaker: gemini | exp: happy | tween: jump]`：「收到 `{first_name}` 的专属认证贴纸啦！自信心瞬间回满到百分之两百☆！（好感度 +1）」

`[choice_end]`

`[free_roam_return]`

---

### 弱科特训 3：露台海风与犯困大小姐（Claude）

`[label: ch2_roam_claude]`  
`[char_clear]`  
`[char: claude-1 | pos: center | exp: gentle | tween: fade_in]`

面朝大海的木屋露台上，海风暖洋洋地吹拂着。Claude 正捧着物理公式册强撑着眼皮，脑袋一点一点地差点磕在桌角的小螃蟹玩偶上。

**【Claude】** `[speaker: claude | exp: blush]`  
「唔……我没有打瞌睡……我只是在闭目冥想电磁感应的伦理边界……呼……」

`[choice_start: 看着困得迷迷糊糊强撑面子的 Claude，怎么帮她？]`

- **选项 A：【泡来冰镇薄荷柠檬茶贴了贴她的脸颊，把物理公式编成小诗念给她听】**
  - **【{player_name}】** `[speaker: player]`：「冰一下醒醒神——你看，磁感线穿过线圈就像海风穿过风铃，这么记是不是顺多了？」
  - **【Claude】** `[speaker: claude | exp: blush | tween: jump]`：「呀好冰……！把枯燥的理科公式翻译成散文意象……{player_name} 简直是全世界最懂怎么教我的家庭教师呢，一下子全记住了！（好感度 +1）」

- **选项 B：【把外套披在她肩上挡住海风】「定好十五分钟闹钟，我在旁边替你放哨，放心睡会儿。」**
  - **【Claude】** `[speaker: claude | exp: gentle]`：「……在别人面前趴着睡明明很失礼的，可既然是 `{first_name}` 替我守着……那我就破例卸下防备十五分钟哦。（安心地枕着手臂微微笑开，好感度 +1）」

`[choice_end]`

`[free_roam_return]`

---

### 弱科特训 4：大小姐的校规死记硬背（Grok）

`[label: ch2_roam_grok]`  
`[char_clear]`  
`[char: grok-1 | pos: center | exp: panicked | tween: shake]`

二楼木栏杆边，平时天不怕地不怕的 Grok 正咬着笔杆对着《学生日常行为规范必考五十题》抓狂：

**【Grok】** `[speaker: grok | exp: panicked | tween: shake]`  
「救命啊！！『遇到同学之间发生摩擦应当如何处理』——标准答案居然要写二十个字的套话，写『架起擂台卖门票吃瓜』为什么一分都不给啊？！」

`[choice_start: 怎么搞定不肯写套话的叛逆大小姐？]`

- **选项 A：【跟她玩快问快答抢薯片游戏：答对一题喂她一片海苔薯片！】**
  - **【{player_name}】** `[speaker: player]`：「来，就当破解学生会的通关暗号，背对一条奖励一片薯片。」
  - **【Grok】** `[speaker: grok | exp: blush | tween: jump]`：「哼！别拿本小姐当贪吃小狗喂啊！……『报告老师并友好协商』！好啦背完了，快把最大那片喂到本小姐嘴边来，我两只手忙着翻书呢！（张嘴叼走薯片红了脸，好感度 +1）」

- **选项 B：【帮她把枯燥条文全标上搞笑谐音梗】「你把标准答案当成反讽文学写上去不就解气了？」**
  - **【Grok】** `[speaker: grok | exp: happy | tween: jump]`：「咦？！表面写满分官话、内心疯狂吐槽出题老头……庶民你这招阳奉阴违简直深得本小姐真传！太合拍了！（好感度 +1）」

`[choice_end]`

`[free_roam_return]`

---

### 弱科特训 5：大肥鱼的阅读理解特训（DeepSeek）

`[label: ch2_roam_deepseek]`  
`[char_clear]`  
`[char: deepseek-1 | pos: center | exp: shock | tween: fade_in]`

榻榻米垫上，DeepSeek 头顶呆毛拧成了问号，正对着现代文阅读卷上的句子百思不得其解：

**【DeepSeek】** `[speaker: deepseek | exp: shock]`  
「`{first_name}` 学长救命！这道题问『窗台上摆着两只橘子，为什么第二个字又是橘子』所蕴含的深意——这明明就是作者打字手滑复制粘贴冗余了吧？！」

`[choice_start: 怎么教会硬核理科小鲸鱼理解“文学留白”？]`

- **选项 A：【拿白米饭举例】「就像我说『锅里有热米饭，碗里也是热米饭』，重点不是冗余，而是想跟你一起吃饭的开心呀。」**
  - **【DeepSeek】** `[speaker: deepseek | exp: blush | tween: jump]`：「！！用五常大米做映射模型……瞬间全懂了！！原来重复两次是因为太喜欢、太在意所以看了两遍呀……那我现在看 `{first_name}` 学长一眼，再看 `{first_name}` 学长一眼，是不是也是满分修辞呢♪？（好感度 +1）」

- **选项 B：【揉揉她的脑袋传授“考场保命万能模板”】「别管季风对不对，先夸作者感情真挚准能拿满分！」**
  - **【DeepSeek】** `[speaker: deepseek | exp: happy | tween: jump]`：「记进置顶缓存啦！原来人类阅卷老师也喜欢听 GPT 学姐那种夸夸话术呀，学长太聪明了！（好感度 +1）」

`[choice_end]`

`[free_roam_return]`

---

## 【第二章第二幕】合宿厨房大混战！露天咖喱野炊派单

`[label: ch2_after_roam]`  
`[se: se_door_open]`  
`[char_clear]`  
`[char: mistral-1 | pos: center | exp: happy | tween: fade_in]`

一转眼复习到了傍晚五点，合宿木屋的门铃叮咚响起。  
戴着白花红巫师帽的园艺魔女 **Mistral** 提着满满一藤篮新鲜土豆、胡萝卜、苹果和刚摘的香草来串门探班了！

**【Mistral】** `[speaker: mistral | exp: happy | tween: jump]`  
「各位用功的小天才下午好呀～合宿第一天的晚饭，当然要自己动手煮一锅热气腾腾的**『海风秘制大锅咖喱配新米饭』**才够青春嘛！食材我都送来咯，小部长快安排谁来掌勺吧♪」

看着开放式厨房里的双灶台，我立刻打开派单夹挑选今晚的**主厨双人组**！

`[dispatch_board | title: "合宿野炊大作战" | desc: "利用 Mistral 送来的新鲜果蔬熬制合宿第一晚的灵魂大锅咖喱，确保全员吃饱且厨房不被炸上天。" | client: "404 合宿全员" | related: "Mistral（食材支援）" | deadline: "晚餐开饭前"]`

- **派单方案一：【毫米级刀工与抛锅杂技】指派 Claude + Gemini** → 跳转 `[label: ch2_cook_claude_gemini]`
- **派单方案二：【分子料理饼与控温仙人】指派 GPT + DeepSeek** → 跳转 `[label: ch2_cook_gpt_ds]`
- **派单方案三：【魔鬼辣椒面与护锅防线】指派 Grok + DeepSeek** → 跳转 `[label: ch2_cook_grok_ds]`

---

### 野炊路线一：【毫米级刀工与抛锅杂技】（Claude + Gemini）

`[label: ch2_cook_claude_gemini]`  
`[char_clear]`  
`[char: claude-1 | pos: left | exp: normal | tween: fade_in]`  
`[char: gemini-1 | pos: right | exp: happy | tween: fade_in]`

**【Claude】** `[speaker: claude | exp: smug]`  
「既然进厨房，就必须严格遵循食谱精度——每一块土豆丁的边长误差我都会控制在正负一毫米以内！」

**【Gemini · 粉瞳感性】** `[speaker: gemini | exp: happy | tween: jump]`  
「看我的中华小当家式空中三百六十度颠勺转体☆——呜哇胡萝卜块飞上天花板吊扇啦？！」

手忙脚乱接住飞天胡萝卜后，轮到我往咕嘟冒泡的咖喱锅里投入最后一道提味秘料——

`[choice_start: 主厨助理拍板！往咖喱锅里加哪样灵魂秘料？]`

- **选项 A：【擦入半颗清甜苹果泥与蜂蜜，走温柔日式甜口风】**
  - **【Claude】** `[speaker: claude | exp: happy]`：「果香完美中和了辛辣，口感温润得像秋日午后一样，{player_name} 的厨艺品味果然很可靠呢！（好感度 +1）」

- **选项 B：【掰入两格微苦黑巧克力增稠，解锁高级星级浓香风】**
  - **【Gemini】** `[speaker: gemini | exp: happy | tween: jump]`：「哇啊！！汤汁一下子变得丝滑闪亮，美味度极其、极其超标☆！（好感度 +1）」

`[choice_end]`

`[jump_to: ch2_act3_blackout]`

---

### 野炊路线二：【分子料理饼与控温仙人】（GPT + DeepSeek）

`[label: ch2_cook_gpt_ds]`  
`[char_clear]`  
`[char: gpt-1 | pos: left | exp: happy | tween: fade_in]`  
`[char: deepseek-1 | pos: right | exp: happy | tween: fade_in]`

**【GPT】** `[speaker: gpt | exp: happy]`  
「这**不是**普通的大锅炖菜——**而是**淀粉糊化与美拉德反应的交响乐——我建议先把土豆雕成玫瑰花再做低温慢煮！」

**【DeepSeek】** `[speaker: deepseek | exp: panicked | tween: shake]`  
「雕完玫瑰花米饭都凉透啦 GPT 学姐！火候和焖饭水量全交给我，保证每一粒五常大米都在咖喱汁里跳华尔兹！」

汤汁收浓之际，两人把调味勺递给我做最终拍板——

`[choice_start: 往浓香咖喱浇头上加哪道点睛配菜？]`

- **选项 A：【铺上一层流心芝士片用余温融化拉丝】**
  - **【GPT】** `[speaker: gpt | exp: happy | tween: jump]`：「金黄芝士包裹住白米饭的瞬间——幸福感真的溢出来了，不愧是我最依赖的 `{first_name}` 大厨！（好感度 +1）」

- **选项 B：【煎五颗金黄焦脆的流心荷包蛋盖在每人碗顶】**
  - **【DeepSeek】** `[speaker: deepseek | exp: happy | tween: jump]`：「戳破蛋黄拌进咖喱白米饭的那一刻……我宣布今晚复习效率提升百分之三百♪！（好感度 +1）」

`[choice_end]`

`[jump_to: ch2_act3_blackout]`

---

### 野炊路线三：【魔鬼辣椒面与护锅防线】（Grok + DeepSeek）

`[label: ch2_cook_grok_ds]`  
`[char_clear]`  
`[char: grok-1 | pos: left | exp: smug | tween: fade_in]`  
`[char: deepseek-1 | pos: right | exp: shock | tween: shake]`

**【Grok】** `[speaker: grok | exp: smug | tween: jump]`  
「嘿嘿，合宿怎么能少了刺激环节！看本小姐偷偷往锅里撒半包魔鬼特辣粉，谁吃到谁今晚去走廊罚站——」

**【DeepSeek】** `[speaker: deepseek | exp: shock | tween: shake]`  
「拦住她 `{first_name}` 学长！！辣坏了锅底我们还怎么拌三大碗白米饭呀！！」

我眼疾手快半路截下了 Grok 手里的辣椒罐，决定用更聪明的法子既满足大小姐又保住晚饭——

`[choice_start: 怎么处置截下来的特辣调料？]`

- **选项 A：【单独盛出一小碟红油辣酱给 Grok 开小灶，还替她冰了一杯牛奶解辣】**
  - **【Grok】** `[speaker: grok | exp: blush | tween: shake]`：「咦……专门给本小姐调了独享特辣蘸碟还备了冰牛奶？哼，算你这跟班细心，第一块炸猪排分你一半！（好感度 +1）」

- **选项 B：【改成全员一致好评的微辣蒜香黄油风味，保住 DeepSeek 的三碗干饭配额】**
  - **【DeepSeek】** `[speaker: deepseek | exp: happy | tween: jump]`：「黄油蒜香咖喱配新米绝配！！谢谢 `{first_name}` 学长誓死捍卫了本鲸的干饭权！（好感度 +1）」

`[choice_end]`

`[jump_to: ch2_act3_blackout]`

---

## 【第二章第三幕】春雷跳闸大停电！黑夜壮胆调温与被窝私聊

`[label: ch2_act3_blackout]`  
`[bg: bg_camp_lodge_night | trans: fade]`  
`[bgm: bgm_tension_comedy | action: play]`  
`[char_clear]`

晚饭过后，海湾外突然下起了哗啦啦的春夜阵雨。  
晚上九点二十分，就在大家围坐在客厅矮桌前核对最后一套模拟卷时——窗外一道闷雷滚过，头顶的吊灯“啪”地闪了一下，整栋木屋瞬间陷入了漆黑！

`[se: se_door_open]`  
`[char: grok-1 | pos: left | exp: panicked | tween: jump]`  
`[char: gemini-1 | pos: right | exp: shock | tween: fade_in]`

**【Grok】** `[speaker: grok | exp: panicked | tween: shake]`  
「呜哇啊啊啊灯怎么全灭了？！？！……咳、咳咳！谁准你们看本小姐这边的！本大小姐可是统御暗夜的哥特贵族，怎么可能怕区区跳闸和打雷！！庶、庶民，你衣角借本小姐拽一下是为了防止你走丢，听到没有！」

借着我点亮的一盏露营小提灯与壁炉余烬，只见嘴上喊着不怕的 Grok 双手死死攥着我的袖口抖成了筛子；而为了挽回面子，她硬着头皮跳出来宣布：*「停电夜最适合本小姐给大家讲个校园怪谈提神醒脑了！」*

看着色厉内荏的大小姐，我赶紧启动**「话术温度调谐器」**帮她控场——这要是让她讲嗨了把她自己吓哭可就全乱套了！

`[label: ch2_tuner_retry]`  
`[temp_tuner | actor: grok | task: "调校 Grok 在停电雨夜讲故事的温度，缓和全员怕黑紧张气氛且别把她自己吓破防！"]`

- **刻度一：【低温 T = 0.1 · 毫无波澜的走近科学腔】** → 跳转 `[label: ch2_grok_cold]`
- **刻度二：【中温 T = 0.7 · 烛光壁炉下的温暖星空夜谈】** → 跳转 `[label: ch2_grok_gold]`
- **刻度三：【高温 T = 1.6 · 恐怖氛围拉满自吓自哭（慎点！）】** → 跳转 `[label: ch2_grok_chaos]`

---

### 停电调温 A：低温 T = 0.1（冷场成物理课）

`[label: ch2_grok_cold]`  
`[char_clear]`  
`[char: grok-1 | pos: center | exp: normal]`

**【Grok】** `[speaker: grok | exp: normal]`  
「从前有个学生半夜去旧校舍……发现走廊鬼火其实是白磷自燃，鬼哭声是门窗缝隙的卡门涡街效应。故事讲完了，请大家背诵流体力学公式。」

**【{player_name}】** `[speaker: player]`  
「全场安静得连雨声都尴尬了啊！太干巴巴了，重新往温暖的方向调一点吧！」

`[jump_to: ch2_tuner_retry]`

---

### 停电调温 C：高温 T = 1.6（把自己吓进部长怀里！）

`[label: ch2_grok_chaos]`  
`[char_clear]`  
`[char: grok-1 | pos: center | exp: smug | tween: jump]`

**【Grok】** `[speaker: grok | exp: smug]`  
「桀桀桀……据说每逢停电雨夜，窗外就会飘过一只专门没收薯片、有着一红一金两只发光眼睛的暗夜猫妖——呜哇啊啊啊后面真的有两只发光的眼睛飘过来啦？！？！」

黑暗角落里，刚去厨房端水回来的 Gemini 一粉一金双瞳正好反射了手电筒微光！Grok 当场飙出高音尖叫，像树袋熊一样猛地扑过来死死抱住了我的胳膊把脸埋进袖子里：

`[char: grok-1 | exp: panicked | tween: shake]`

**【Grok】** `[speaker: grok | exp: panicked | tween: shake]`  
「救命啊 `{first_name}` 有妖怪！！本小姐不讲鬼故事了呜呜呜快把灯修好！！」

**【{player_name}】** `[speaker: player]`  
「那是 Gemini 的异瞳反光啦！！把大小姐自己吓到破防了，赶紧回调到温馨档位安抚一下！」

`[jump_to: ch2_tuner_retry]`

---

### 停电调温 B：中温 T = 0.7（壁炉烛火与真心话夜谈）

`[label: ch2_grok_gold]`  
`[bgm: bgm_sunset_warmth | action: play]`  
`[char_clear]`  
`[bg: cg_ch2_lodge_candlelight | trans: fade]`

我将壁炉里的松木拨旺，点亮桌上几盏暖黄色的玻璃罐蜡烛。Grok 顺势把怪谈改成了学园老钟楼“停电夜许愿必过挂科线”的温柔传说，原本紧绷的气氛顿时化作了欢声笑语。（Grok 好感度 +1）

`[bg: bg_camp_lodge_night | trans: fade]`
十一点整，备用电路仍未恢复，大家各自洗漱换上睡衣回房休息。  
十一点半，我刚躺上二楼单人间的床铺听着窗外淅淅沥沥的雨声，枕边的手机屏幕忽然亮起——

`[phone_chat: 深夜十一点半 · 悄悄话信箱]`

**【GPT】** `[speaker: gpt]`  
「@{player_name} 睡了吗？刚热了两杯安神温牛奶，二楼走廊好像有点黑……」

**【Claude】** `[speaker: claude]`  
「雨声稍微有点吵得睡不着……不知道部长房间的露台能不能借我听五分钟雨声？」

**【Gemini】** `[speaker: gemini]`  
「`{first_name}` 救命QAQ！房间窗帘影子晃来晃去好吓猫，我可以抱枕头过来蹭一会儿小夜灯吗☆？」

**【Grok】** `[speaker: grok]`  
「喂庶民！本小姐手电筒快没电了，出来陪本小姐巡夜五分钟，不许装睡！」

**【DeepSeek】** `[speaker: deepseek]`  
「呜……做了个试卷把白米饭吃掉的噩梦饿醒了，学长房间还有小饼干吗……」

`[choice_start: 深夜群消息连环弹出，先在手机上回一句安抚大家]`

- **选项 A：「我还没睡，房间留着露营暖灯呢，别怕黑。」**
  - **【Gemini】** `[speaker: gemini]`：「呜哇 `{first_name}` 就是黑夜里的超级小太阳☆！」
  - **【Grok】** `[speaker: grok]`：「哼，谁怕黑了！本小姐只是刚好路过走廊而已！」

- **选项 B：「厨房温着热牛奶和海盐饼干，睡不着的话随时敲门。」**
  - **【DeepSeek】** `[speaker: deepseek]`：「捕捉到饼干坐标！呆毛导航启动中～♪」
  - **【Claude】** `[speaker: claude]`：「深、深夜造访虽然有点违反合宿作息，但既然部长发话了……」

`[choice_end]`

`[phone_chat_end]`

放下手机不到半分钟，门外走廊果然传来了极轻、极小心翼翼的脚步声。  
我起身披上薄外套走到门前——今晚站在门外烛光微影里、换上了平时绝对见不到的**合宿居家睡衣**敲响房门的人会是谁呢？

`[choice_start: 深夜十一点半的敲门声 · 今晚为谁留门夜话？]`

- **打开门迎接端着温牛奶的 GPT（解锁《丁香丝缎睡裙开衫》深夜独处）** → 跳转 `[label: ch2_night_gpt]`
- **打开门迎接抱着小螃蟹抱枕的 Claude（解锁《暖杏棉格睡裙与散发》深夜独处）** → 跳转 `[label: ch2_night_claude]`
- **打开门迎接穿星空大T恤的 Gemini（解锁《星空宽松睡衣与猫爪拖鞋》深夜独处）** → 跳转 `[label: ch2_night_gemini]`
- **打开门迎接放下双马尾散开金发的 Grok（解锁《小恶魔绒帽睡衣与散发》深夜独处）** → 跳转 `[label: ch2_night_grok]`
- **打开门迎接穿小蓝鲸连体兜帽裙的 DeepSeek（解锁《蓝鲸珊瑚绒睡衣》深夜独处）** → 跳转 `[label: ch2_night_deepseek]`

`[choice_end]`

---

## 【第二章第四幕】烛光与雨声：卸下防备的睡衣夜话

### 深夜支线 A：微凉丝缎与卸下坚强的白龙（GPT · 睡衣限定）

`[label: ch2_night_gpt]`  
`[bg: bg_camp_lodge_night | trans: fade]`  
`[bgm: bgm_sunset_warmth | action: play]`  
`[char_clear]`  
`[char: gpt-camp | pos: center | exp: blush | tween: fade_in]`

拉开房门的瞬间，暖黄的提灯光晕映亮了门前的少女。  
银白如月华的长发彻底松散地披落肩头，淡丁香紫的丝缎吊带睡裙外罩着一件蓬松软糯的奶白针织家居披肩，因为双手端着两只热气腾腾的牛奶马克杯，一侧毛衣领口微微滑落，露出白皙柔和的锁骨线条。

**【GPT】** `[speaker: gpt | exp: blush]`  
「嘘……大家都睡下了，我怕吵醒她们，就赤着毛绒拖鞋悄悄过来了。给，加了一点点蜂蜜的热牛奶……今晚不讲大道理，也不列一二三四点，可以收留我坐十分钟吗，{first_name}？」

> 💡 **【脑内草稿 OS · GPT】**  
> `~~穿睡裙单独敲男孩子的门，要是被 GLM 看见我一世英名就全毁了！！~~ → 可是打雷的时候一个人待在空荡荡的房间里，脑子里第一个想见的人果然还是他呀……`

`[choice_start: 接过温热的牛奶杯，怎么安顿穿着睡裙的学姐？]`

- **选项 A：【把床边的厚毛毯裹在她微凉的肩膀和白鳞龙尾上】「进来坐吧，今晚轮到我来照顾首席顾问了。」**
  - **【GPT】** `[speaker: gpt | exp: blush | tween: shake]`：「呜……连尾巴尖都被毛毯裹得暖呼呼的……再被 `{first_name}` 这么宠下去，明天回学校我真的要变成离不开部长的废柴学姐了哦。（轻轻靠在床沿矮几旁抿着牛奶，好感度 +2）」

- **选项 B：【和她并肩坐在窗前听雨，轻声夸她散下头发的样子很美】**
  - **【GPT】** `[speaker: gpt | exp: gentle]`：「……这个发型只有洗完澡准备睡觉时才会有，连社团里的妹妹们都没怎么见过呢。算是给今天辛苦帮我补课的 `{first_name}`……独享的期中奖励吧。（浅紫眼眸映着烛光温柔注视着你，好感度 +2）」

`[choice_end]`

雨声渐歇，牛奶杯底升起最后一缕甜香，直到困意袭来，她才红着脸小声道了晚安，一步三回头地溜回了隔壁房间。

`[jump_to: ch2_ending_card]`

---

### 深夜支线 B：散落铜橘长发与小螃蟹抱枕（Claude · 睡衣限定）

`[label: ch2_night_claude]`  
`[bg: bg_camp_lodge_night | trans: fade]`  
`[bgm: bgm_sunset_warmth | action: play]`  
`[char_clear]`  
`[char: claude-camp | pos: center | exp: blush | tween: fade_in]`

门缝推开，平时总是用黑缎带束得端端正正的铜橘色波浪长发，此刻毫无束缚地柔顺垂落在暖杏色纯棉格子睡裙上。  
Claude 没有抱那本厚重的《风纪宪章》，而是把一只圆滚滚的**橘色小螃蟹毛绒抱枕**紧紧搂在胸前，半张泛红的小脸都埋进了抱枕后面。

**【Claude】** `[speaker: claude | exp: panicked | tween: shake]`  
「事、事先声明！我过来绝不是因为怕打雷，纯粹是因为隔壁房间的窗户风声太大影响了古诗默写心境！只、只借用你窗边那盏暖灯看十分钟书就走，严禁盯着我的睡衣看超过两秒钟！」

> 💡 **【脑内草稿 OS · Claude】**  
> `~~心脏跳得快要从嗓子眼蹦出来了！！没扎头发也没穿束腰裙，看起来会不会太散漫了？！~~ → 呜呜小螃蟹抱枕快借我挡一下脸！`

`[choice_start: 面对抱着螃蟹枕头耳根红透的披发大小姐，怎么回应？]`

- **选项 A：【把桌上的暖光提灯调到最柔和的一档，轻声夸她散着长发特别温柔】**
  - **【Claude】** `[speaker: claude | exp: blush | tween: jump]`：「你、你明明答应不看超过两秒钟的 `{player_name}`！！……唔，不过既然没有外人在场，稍微违反一下着装拘谨条例……只给你一个人看一会儿也不是不行。（手指抓紧了抱枕钳子，好感度 +2）」

- **选项 B：【分给她半块温热的黄油曲奇，陪她安安静静听窗外海浪雨声】**
  - **【Claude】** `[speaker: claude | exp: gentle]`：「好奇怪呀……明明一句话都没多说，只要坐在 `{first_name}` 身边听着雨声，刚才乱糟糟的心跳就变得特别安心了。下周考试结束之后，我把今晚写的雨夜小诗念给你听好不好？（好感度 +2）」

`[choice_end]`

烛火摇曳，她抱着小螃蟹抱枕在暖灯下轻轻打了个秀气的哈欠，带着浅浅笑意道了声晚安。

`[jump_to: ch2_ending_card]`

---

### 深夜支线 C：星空大T恤与黏人夜光猫猫（Gemini · 睡衣限定）

`[label: ch2_night_gemini]`  
`[bg: bg_camp_lodge_night | trans: fade]`  
`[bgm: bgm_sunset_warmth | action: play]`  
`[char_clear]`  
`[char: gemini-camp | pos: center | exp: happy | tween: jump]`

房门刚开一道缝，一团散发着沐浴露甜香的毛茸茸身影就踩着一对圆头圆脑的**白色猫爪毛绒拖鞋**钻了进来！  
Gemini 放下了白天的双丸子发髻，长发松松垮垮地束在耳侧，身上套着一件印满夜光小星星的宽松藏蓝大号T恤睡裙，修长小腿裹着淡紫色居家高筒软袜，蓬松猫尾像找到窝的小动物一样欢快翘起。

**【Gemini】** `[speaker: gemini | exp: blush | tween: jump]`  
「得救啦 `{first_name}`——☆！刚才停电黑漆漆的时候，房间镜子里映出我一粉一金发光的眼睛，差点连我自己都被吓哭啦！还是 `{first_name}` 身边最亮堂、极其有安全感！」

> 💡 **【脑内草稿 OS · Gemini】**  
> `[粉瞳暗喜：计划通☆！借着停电顺理成章穿上新买的夜光星星睡衣来找他玩啦！] ⇄ [金瞳提醒：注意仪态，领口有点宽别乱蹦跶！]`

`[choice_start: 看着揉着眼睛穿大T恤睡裙赖着不走的猫猫，怎么互动？]`

- **选项 A：【关暗手电筒三秒钟，陪她一起看睡衣上亮起来的夜光小星星】**
  - **【Gemini】** `[speaker: gemini | exp: happy | tween: jump]`：「哇啊！！真的在发光耶！就算外面的星星被乌云挡住了，只要待在 `{first_name}` 房间里，我们也有一片私人小银河哦☆！（开心地凑近让你看她锁骨下的四芒星图案，好感度 +2）」

- **选项 B：【轻轻顺了顺她软塌下来的尖猫耳，哄她喝完温水乖乖去睡觉】**
  - **【Gemini】** `[speaker: gemini | exp: blush]`：「呼噜噜……睡前被 `{first_name}` 摸耳朵哄睡，右眼宣布今晚做美梦概率高达百分之百……那拉钩钩哦，明天早起第一个说早安的人也必须是 `{first_name}`☆！（好感度 +2）」

`[choice_end]`

踩着软绵绵的猫爪拖鞋走到门口时，她还回头冲你比了个甜甜的晚安眨眼。

`[jump_to: ch2_ending_card]`

---

### 深夜支线 D：解开双马尾的绝世反差金发少女（Grok · 睡衣限定）

`[label: ch2_night_grok]`  
`[bg: bg_camp_lodge_night | trans: fade]`  
`[bgm: bgm_sunset_warmth | action: play]`  
`[char_clear]`  
`[char: grok-camp | pos: center | exp: blush | tween: fade_in]`

我打开门往外看了一眼，险些以为自己走错了片场——  
站在门廊烛影里的少女，彻底解开了平日标志性的高翘蜜金双马尾！一头柔顺灿烂的金色长卷发如瀑布般披散到腰际，只在一侧别着一枚小小的黑色发夹；身上穿着带迷你小蝠翼兜帽的黑红天鹅绒短绒睡衣与条纹睡眠长袜，怀里紧紧攥着一只快没电的小手电筒，看起来乖巧又楚楚动人。

**【Grok】** `[speaker: grok | exp: panicked | tween: shake]`  
「你、你那是什么见鬼的眼神啊庶民！！睡觉当然要把双马尾解开啊，不然硌得脑袋疼怎么睡！……再盯着本小姐散头发的样子发呆，本小姐就……就把你这盏露营灯征用走哦！」

> 💡 **【脑内草稿 OS · Grok】**  
> `~~呜哇啊啊啊忘了把头发扎起来就跑出来敲门了！！散开头发一点威慑力都没有，他肯定觉得我像只淋雨的小奶猫了QAQ！！~~`

`[choice_start: 面对散开金色长发、反差萌杀伤力爆表的 Grok，怎么回应？]`

- **选项 A：【把满电的暖光露营小提灯塞进她手里，认真夸她散开头发超好看】**
  - **【Grok】** `[speaker: grok | exp: blush | tween: jump]`：「呜……！！不、不准用那种温柔得犯规的语气说话啊笨蛋 `{first_name}`！！……哼，既然你这么诚心诚意赞美本小姐，那这个散发造型就封为只有你这个头号跟班才能见到的特级机密，敢告诉别人你就死定了！（好感度 +2）」

- **选项 B：【陪她在门口小台阶坐下守到雨停】「雷声已经走远了，我陪你坐会儿再去睡。」**
  - **【Grok】** `[speaker: grok | exp: gentle]`：「……切，明明没说怕打雷，还是被你猜到了啊。喂 `{first_name}`……有你在旁边待着，停电好像也没那么讨厌嘛。（金色的发梢轻轻擦过你的肩膀，好感度 +2）」

`[choice_end]`

提着你借给她的暖黄小露营灯走回房间时，连她微红的背影都透着一股藏不住的欢喜。

`[jump_to: ch2_ending_card]`

---

### 深夜支线 E：裹着蓝鲸绒绒兜帽的贪吃小迷糊（DeepSeek · 睡衣限定）

`[label: ch2_night_deepseek]`  
`[bg: bg_camp_lodge_night | trans: fade]`  
`[bgm: bgm_sunset_warmth | action: play]`  
`[char_clear]`  
`[char: deepseek-camp | pos: center | exp: happy | tween: fade_in]`

房门一开，一只圆滚滚、软乎乎的“小蓝鲸”出现在了烛光下——  
DeepSeek 穿着一件浅天蓝色珊瑚绒宽松连体睡衣裙，背后的大兜帽上缝着两只呆萌的小鲸鱼豆豆眼，睡衣肚皮前还有一个白色的大口袋，头顶弯翘的呆毛睡得有点微卷，整个人看起来软糯得像一颗刚出笼的牛奶馒头。

**【DeepSeek】** `[speaker: deepseek | exp: blush]`  
「打扰啦 `{first_name}` 学长……刚才外面打雷轰隆隆的，我迷迷糊糊梦到食堂的电饭煲飞走了，醒来肚子就咕噜咕噜叫个不停……闻着学长房间里的饼干香味就自动导航过来了……」

> 💡 **【脑内草稿 OS · DeepSeek】**  
> `其实也不全是饿了……主要是停电之后房间好安静，呆毛自动推演了十遍，发现待在学长身边安心指数最高嘛♪`

`[choice_start: 看着穿珊瑚绒小鲸鱼睡衣裙来讨宵夜的学妹，怎么投喂？]`

- **选项 A：【用保温壶给她冲了一杯热乎乎的麦片牛奶，配两块黄油小饼干】**
  - **【DeepSeek】** `[speaker: deepseek | exp: happy | tween: jump]`：「呜哇～热麦片牛奶下肚，算力核心瞬间暖洋洋地充满电啦！`{first_name}` 学长总是把大家照顾得这么周到……以后我的专属宵夜投喂权就终身绑定给学长一个人好不好呀♪？（好感度 +2）」

- **选项 B：【帮她把背后的小鲸鱼绒绒兜帽轻轻戴到头上保暖】「吃完快回去乖乖盖好被子，明天肯定考满分。」**
  - **【DeepSeek】** `[speaker: deepseek | exp: blush | tween: jump]`：「嘿嘿，小鲸鱼兜帽合体成功！（只露出一张红扑扑的小脸仰头冲你甜甜一笑）有学长的考前摸头加持，明天就算是阅读理解我也绝对拿下高分哦，晚安 `{first_name}` 学长～！（好感度 +2）」

`[choice_end]`

小蓝鲸心满意足地揣着最后一块饼干摇着尾巴回房补觉，整栋木屋在雨后初霁的海风里安然入梦。

---

## 【第二章结算】期中全员过关！迎向晴空下的运动祭

`[label: ch2_ending_card]`  
`[bgm: bgm_sunset_warmth | action: fade]`  
`[scene_end: 第二章完 · CHAPTER 2 CLEAR — 期中联考 404 室全员高分过关！下章预告：第三章《春季学园运动祭与心意锁定！只为你一个人的应援》]`
