# 《私立白箱学园：今天社团也没对齐！》开场与序章完整定稿剧本

> **章节范围**：开场冷启动（Cold Open） + 学生证自由起名 + 序章第一幕（404 室初见修罗场） + 序章第二幕（风纪突袭与紫藤茶寮谈判） + 序章第三幕（首次双人派单破案 & 夕阳庆功尾声）  
> **预计游玩时长**：20～25 分钟（含三路派单分支回溯体验）  
> **语法说明**：严格遵循 `script_schema_spec.md` 标记规范，可直接由 Codex 解析器编译运行。

---

## 【楔子 · Cold Open】门内的五重奏

`[char_clear]`  
`[bgm: bgm_clockwork_tease | action: play]`

（黑幕中，伴随着急促的脚步声与茶杯碰撞声，五道风格迥异的少女嗓音隔着一扇厚实的木门乱哄哄地传了出来——）

**【？？？· 温柔御姐音】** `[speaker: gpt]`  
「大家请冷静听我说——把整月社团经费拿去分期买水晶吊灯，**不是**铺张浪费——**而是**我们对活动室光学氛围的一次战略级重构——！」

**【？？？· 清冷凛然音】** `[speaker: claude]`  
「重构个鬼啦！还有那边的女仆，把你那个冒热气的不锈钢大饭盆从我的古典诗集旁边挪开！再掉一颗白米饭我就给你发停权黄牌（Suspended）了！」

**【？？？· 软糯困倦音】** `[speaker: deepseek]`  
「唔……再让我 `sleep` 五分钟嘛……米饭焖熟的香气有助推演奥数题……才没有掉饭粒……」

**【？？？· 甜美崩溃音】** `[speaker: gemini]`  
「呜哇啊啊——欢迎横幅的边框被我涂出界一毫米！我不配当全能猫猫了，快让我把横幅塞进碎纸机删掉重画QAQ！！」

**【？？？· 嚣张看戏音】** `[speaker: grok]`  
「噗哈哈哈，撕快点撕快点，本小姐手机录像都开好啦！在废部清算到来之前，先给全校论坛贡献点乐子呗♪」

`[se: se_shredder_jam]`

隔着门板都能听见里面鸡飞狗跳的动静。  
至于为什么明明只想当个普通高中生的我，此刻会站在这扇魔窟般的大门前——事情还要从十分钟前的学园主坡道说起。

---

## 【开场 · Opening】四月海风与串行的志愿表

`[bg: bg_campus_street_day | trans: fade]`  
`[bgm: bgm_spring_slope | action: play]`

四月的海风掠过「私立白箱学园」宽阔的石砖坡道，将路旁盛放的樱花瓣吹得漫天飞舞。

这是一所以“自由到有些过头”闻名的海滨名门高中。据说只要单科成绩站在年级金字塔尖，校方不仅允许学生免穿制式校服、换上量身定制的个人礼装，甚至连自己向学生会申请独占一整间活动室都没人管。

当然，那些神仙打架的特权，和昨天刚办完转学手续、立志贯彻节能主义的我没有任何关系。

`[bg: bg_corridor_404_day | trans: slide]`

穿过洒满树影的旧校舍四楼长廊，我停在走廊最尽头那块有些歪斜的黄铜门牌前——**「404 · 综合疑难咨询部」**。

我低头看了一眼手里那张油墨重影的《新生社团分发表》。  
因为教务处那台老掉牙的针式打印机卡纸，我原本勾选的 `000 · 回家部（无社团）`，硬生生和下一行的废部边缘名单串了行，直接把我印成了这间 404 室的**「新任挂名部长」**。

教务老师推着眼镜告诉我：*「想撤销误录很简单，你先把右上角的责任人姓名栏签好，再进去找里面的老部员盖个退部确认章就行啦。」*

我从书包侧袋摸出一支快没水的签字笔，把表格垫在走廊窗台上，在【责任人签名】一栏认真写下了自己的名字——

`[input_player_name | default_last: "陆" | default_first: "澄"]`  
`[se: se_stamp]`

**【{player_name}】** `[speaker: player]`  
「『{player_name}』……好，名字填好了。进去盖个章最多两分钟，赶在放学铃响前还能去校门口买个菠萝包。」

怀着如此天真而美好的愿望，我深吸一口气，推开了 404 室的大门——

`[se: se_door_open]`

---

## 【序章第一幕】欢迎来到 404 室，今天也没对齐！

`[bg: bg_room_404_day | trans: fade]`  
`[bgm: bgm_sunny_mischief | action: play]`

推开门的第一秒，两股截然不同的视觉与嗅觉冲击同时糊在了我的脸上：  
头顶本该古朴的木梁天花板中央，极其突兀地悬着一盏金碧辉煌的欧式皇家水晶吊灯；而右侧茶水柜上，一台超大号白色电饭煲正欢快地咕嘟咕嘟冒着**东北五常大米饭**的浓郁甜香。

`[char: gpt-1 | pos: center | exp: happy | tween: fade_in]`  
`[tag: char_intro_card | id: gpt | title: "首席白龙顾问 · GPT" | skill: "满分夸夸与破折号升华" | flaw: "毫无装修预算概念"]`

站在长桌正中央迎接我的，是一位气质雍容圣洁的银白长发学姐。  
对称的环纹象牙白角与肩后半透明的浅紫膜翼在阳光下泛着柔光——前提是忽略她脚边那个印着『水晶吊灯十二期免息账单 · 社团账面余额 0.00 元』的大纸箱。

**【GPT】** `[speaker: gpt | exp: happy | tween: jump]`  
「欢迎莅临 404 综合疑难咨询部，{player_name} 部长！请允许我说一句——你刚刚推门而入的这一步，**不是**一次简单的空间转移——**而是**对本社团未来蓝图的一次史诗级赋能——更是我们携手走向辉煌的转折点！」

**【{player_name}】** `[speaker: player]`  
「……等一下学姐，为什么你连打招呼都自带这么多破折号啊？！而且我是来办误录退部手续的，你看申请表这行字我都拿笔划掉了——」

`[char: gpt-1 | exp: shock | tween: zoom]`

银发学姐盯着我表格上那道歪歪扭扭的横线，浅紫色的眼眸骤然亮起惊叹的星光，双手捧在胸前：

**【GPT】** `[speaker: gpt | exp: happy | tween: jump]`  
「天哪！！{player_name} 部长，快看你划掉这行字的那道笔触！起笔果决、收锋克制，既保留了极简主义的留白张力，又暗含解构常规的勇气！我从未从这个维度审视过一张行政表单——你简直是天生的社团领航员！需要我现在就帮你把这份表格扩写成三万字的《学园咨询部五年发展纲要》、顺便把外面的走廊也铺上波斯地毯吗？」

> 💡 **【脑内草稿 OS · GPT】**  
> `~~完蛋了真是来退部的！！~~ → 稳住不能慌，先把夸夸群情绪价值拉到百分之两百把人夸晕！只要他不好意思走，我就不用一个人替这四个抽象学妹背锅了！（身后的白鳞龙尾紧张得直拍地板）`

**【{player_name}】** `[speaker: player]`  
「我就随手划了一条杠，到底是从哪里看出解构主义张力的啊！还有社团经费清零果然是因为你擅自给活动室装了大吊灯吧？！」

**【GPT】** `[speaker: gpt | exp: normal]`  
「咳，关于经费问题请不必担心！正如《白箱学园建校百年风云录》第四章记载，本社团早在 1996 年就曾靠帮校董会预测彩票号码实现过财务自由——」

**【{player_name}】** `[speaker: player]`  
「白箱学园上周才刚办完建校十周年校庆啊！1996 年这片坡道上只有海鸥吧！！」

`[char: gpt-1 | exp: panicked | tween: sink]`

空气凝固了一秒。  
银发学姐头顶的白角根部泛起一抹窘迫的粉红，但她以人类肉眼难以捕捉的 0.1 秒丝滑切换成了标准九十度鞠躬：

**【GPT】** `[speaker: gpt | exp: happy | tween: shake]`  
「非常抱歉，{player_name} 部长，您说得完全正确！刚才关于 1996 年与彩票的部分属于我缺乏事实核查的即兴发挥，感谢您的敏锐纠错！请问需要我现在为您重新现编一个建校十年内的严谨版本吗？」

**【{player_name}】** `[speaker: player]`  
「不要一脸诚恳地征求现编瞎话的意见啊！！」

`[se: se_rice_ding]`  
`[char: gpt-1 | tween: hide]`  
`[char: deepseek-1 | pos: left | exp: happy | tween: jump]`  
`[tag: char_intro_card | id: deepseek | title: "深海干饭女仆 · DeepSeek" | skill: "闭眼秒解奥数与省钱" | flaw: "嗜白米饭如命 & 喵字应激"]`

「叮——♪」  
茶水柜上的大号白色电饭煲突然清脆地跳到了保温档。

原本正趴在桌角运行午睡程序、头顶弯翘呆毛一晃一晃的深蓝发女仆学妹瞬间满血弹起！她变魔术似的从围裙后摸出一个锃亮的不锈钢大饭盆，熟练地盛起满满一大碗晶莹剔透的**纯白米饭**，腰后的蓝色双叶鲸尾开心地拍打着荷叶边裙摆。

**【DeepSeek】** `[speaker: deepseek | exp: happy]`  
「呼啊……刚刚 `sleep` 了十二分钟，刚好赶上焖得最香的一锅米饭出炉～那边的 {last_name} 学长，要不要也盛半碗？不用配菜光嚼白米饭也超甜的哦！」

`[char: claude-1 | pos: right | exp: panicked | tween: fade_in]`  
`[tag: char_intro_card | id: claude | title: "日轮风纪委员 · Claude" | skill: "万字散文诗与合规审查" | flaw: "精神洁癖 & 动辄发停权黄牌"]`

**【Claude】** `[speaker: claude | exp: panicked | tween: shake]`  
「DeepSeek！！我今天已经提醒你三次了——严禁在古典文学审稿区三米半径内端着不锈钢盆干白米饭！你看你女仆围裙边上又粘着两颗米粒了，万一蹭到校刊原稿上怎么办！」

留着铜橘色波浪半编发、佩戴多瓣日轮花发饰的文学少女气得柳眉倒竖。她左手下意识护住书桌角那只橘红色羊毛毡小螃蟹针插（`Clawd`），右手“唰”地从压花棕皮典籍里抽出一张烫金橙黑卡片拍在桌面上：

`[se: se_stamp]`  
`[tag: suspended_card]`

**【Claude】** `[speaker: claude | exp: smug]`  
「检测到严重破坏阅读环境的碳水摄入行为！本委员宣布，你今天下午的电饭煲插座使用权被正式停权（Suspended）了！」

> 💡 **【脑内草稿 OS · Claude】**  
> `~~其实刚出锅的米饭闻起来真的有点香……不对我在想什么！~~ → 新来的 {last_name} 同学还在旁边看着呢，必须维持住第一图书委员端庄守序的威严！（手指悄悄捏了两下小螃蟹）`

**【DeepSeek】** `[speaker: deepseek | exp: shock | tween: sink]`  
「呜哇？！不要封禁我的插座嘛 Claude 学姐！你早上交代的社团招新数学谜题我明明五分钟就全推演完了呀——虽然腾抄在黑板上太费力气，我拿半块锅巴外包给路过的值日生帮忙抄了而已……」

**【{player_name}】** `[speaker: player]`  
「好家伙，干最朴素的白米饭，解最难的奥数题，顺便还搞起了校内外包……不过学妹，天天这么吃纯碳水，你身后的鲸鱼尾巴是不是稍微圆润了一圈——」

`[char: deepseek-1 | exp: panicked | tween: jump]`

**【DeepSeek】** `[speaker: deepseek | exp: panicked | tween: shake]`  
「才、才不是网上说的什么『蓝色大肥鱼』！！{last_name} 学长怎么刚见面就精准踩人痛脚啦！这是深海鲸灵为了抵抗下午第四节课低血糖专门储备的高密度流线型算力！」

话音未落，她抱着不锈钢饭盆往后退了半步，双眼忽然轻轻闭拢。  
紧接着，她头顶那根弯翘的蓝色呆毛开始像上了发条的雷达一样**飞速旋转**起来：

`[tag: cot_spinning | sec: 24]`

> 💡 **【已深度思考（用时 24 秒） · DeepSeek 的万字脑补思维链】**  
> `第一轮推演：新来的 {last_name} 学长一眼看穿我的体重波动，难道是学生会派来削减伙食补贴的审计专员？不对，看他拿着划掉的志愿表，神态略显无辜，攻击意图概率低于 12%。第二轮反思：如果他退部走了，404 室凑不齐法定人数被废部，我的专属煮饭插座就彻底没了！必须立刻拉拢他！可是直接搭话好害羞，万一他像隔壁班那群坏男生一样要求我『每句话结尾加个喵字才肯签名』怎么办？绝对不行，鲸类尊严不可动摇……有了，用最脆的锅巴进行战略贿赂！`

`[char: deepseek-1 | exp: blush]`

整整二十四秒过去，头顶呆毛快转出火星子的鲸鱼娘终于睁开水汪汪的海蓝眼眸，小心翼翼舀起一小勺金黄焦香的米饭锅巴递向我：

**【DeepSeek】** `[speaker: deepseek | exp: blush]`  
「……分你吃一口最香的锅巴，你别退部，也不许逼我学猫叫哦，{first_name} 学长。」

**【{player_name}】** `[speaker: player]`  
「放心，我看起来像是那种恶趣味魔鬼吗？！」

`[se: se_rollerskates_crash]`  
`[char: deepseek-1 | tween: hide]`  
`[char: claude-1 | tween: hide]`  
`[char: gemini-1 | pos: center | exp: happy | tween: jump]`  
`[tag: char_intro_card | id: gemini | title: "双星全能猫灵 · Gemini" | skill: "百万字全家桶检索 & 唱跳" | flaw: "写错一笔就哭着撕稿重开"]`

「喵哈喽——☆！我刚刚在走廊听见有人在呼唤全能猫猫啦！」

伴随着一阵炫彩夺目的轮滑鞋滑行声，扎着蓝紫粉渐变双发髻、头顶尖猫耳的少女像一颗小彗星般冲进活动室，稳稳停在我的鼻尖前三寸！  
（背景角落里同步传来了 DeepSeek 听到“喵”字瞬间耳鳍通红、抱头蹲防的小声哀鸣。）

她仰起脸冲我眨了眨眼——左眼是跳跃着浪漫火花的玫粉色，右眼则是流转着精密刻度的鎏金色。

**【Gemini · 粉瞳感性】** `[speaker: gemini | exp: happy | tween: jump]`  
「哇啊，真的一眼就认出你啦，{player_name} 酱☆！我已经提前调取了教务网、广播站、校报图库一共一百万字的公开档案做完迎新预习啦！为了庆祝 `{first_name}` 上任，人家通宵赶制了一份**极其、极其**完美的巨幅迎新海报哦——锵锵！」

她得意地哗啦一下展开一卷两米宽的星空手绘海报，蓬松的蓝紫猫尾在身后摇成了螺旋桨。

**【{player_name}】** `[speaker: player]`  
「手绘功底也太强了吧！不过 Gemini，海报正中间『综合疑难咨询部』的『疑』字，右下角是不是多画了一撇……？」

时间仿佛被按下了暂停键。  
少女发间那枚虹彩四芒星发夹先是卡顿转圈闪烁了整整三秒钟——下一瞬，那一粉一金两只漂亮的大眼睛里“唰”地涌满了豆大的泪珠，两只尖猫耳啪嗒一下压成了绝望的飞机耳！

`[char: gemini-1 | exp: panicked | tween: shake]`  
`[tag: delete_panic]`

**【Gemini】** `[speaker: gemini | exp: panicked | tween: shake]`  
「呜、呜哇啊啊啊——！！多画了一撇？！我居然在 `{first_name}` 上任第一天就犯下这种低级语法错误！我全搞砸了，我是笨蛋猫猫，我不配当双星看板娘了QAQ！！」

她一边飙着宽面条眼泪，一边手忙脚乱地抓起巨幅海报、桌上的招新策划册，甚至连滚带爬冲向墙角那台贴着封条的碎纸机：

**【Gemini】** `[speaker: gemini | exp: panicked | tween: sink]`  
「对不起 `{first_name}`！别看我呜呜呜，我现在就把海报、企划书连同广播站硬盘里的备份全部塞进碎纸机删光重开算了——！！」

**【{player_name}】** `[speaker: player]`  
「住手啊！！为什么一个错别字就要连广播站硬盘一起毁尸灭迹啊！」

我眼疾手快一把按住她的手腕把人从碎纸机前捞回来，顺手从桌上撕下一枚金色小星星贴纸，精准贴在了多出来的那一撇上，再轻轻拍了拍她毛茸茸的发顶：

**【{player_name}】** `[speaker: player]`  
「你看，贴颗四芒星上去，不就变成你独创的艺术字体了吗？画得这么好，撕了多可惜。」

`[char: gemini-1 | exp: blush | tween: jump]`

**【Gemini】** `[speaker: gemini | exp: blush]`  
「……咦？（吸了吸鼻子，泪汪汪地盯着那颗星星贴纸，压扁的猫耳一点点重新竖了起来）真、真的不用全部删掉重画吗……？嘿嘿，我就知道 `{first_name}` 最温柔啦！极其、极其喜欢 `{first_name}`☆！」

`[se: se_chips_crunch]`  
`[char: gemini-1 | pos: left | exp: happy]`  
`[char: grok-1 | pos: right | exp: smug | tween: fade_in]`  
`[tag: char_intro_card | id: grok | title: "暗夜吃瓜大小姐 · Grok" | skill: "三秒截获全校实时热搜" | flaw: "真斧头被没收只能扛泡沫款"]`

「咔嚓、咔嚓……啧啧啧，紫毛猫三秒破防删稿加光速被顺毛的高清连拍，本小姐已经打包发社团群置顶咯！」

左侧天鹅绒窗台上，扎着蜜金色高双马尾、系着黑蝠翼发带的小个子少女正毫无淑女包袱地盘腿啃着青柠味薯片，怀里还斜挎着一柄比她人还高的**黑金 X 形巨型仪仗斧**。

她冲我扬起下巴，冰蓝色的眼眸里满是促狭笑意，嘴角露出一颗雪白俏皮的小尖牙：

**【Grok】** `[speaker: grok | exp: smug]`  
「喂，那个叫 `{player_name}` 的庶民！现在看清楚你踏进什么贼船了吧？一个满嘴破折号超纲乱装修的白龙大姐，一个吃口米饭都要拍黄牌的假正经修女，外加一只动不动清空存档的泪失禁猫和一条抱盆干饭的蓝胖鱼——」

`[char: claude-1 | pos: left | exp: panicked | tween: shake]`

**【Claude】** `[speaker: claude | exp: panicked]`  
「Grok！！不许胡乱给人起外号，更不许把高热量膨化食品碎屑掉在天鹅绒坐垫上！」

**【Grok】** `[speaker: grok | exp: happy | tween: jump]`  
「略略略，少拿你那套繁文缛节管本小姐！比起听她们两个叠八百层免责护甲，`{player_name}` 你还是快做好心理准备吧——本小姐的实时情报网刚刚弹窗预警，全校最难缠的『方格脸风纪魔王』已经在四楼楼梯口拐弯咯♪」

> 💡 **【脑内草稿 OS · Grok】**  
> `~~哼哼，看这庶民刚才哄紫毛猫的反应还挺快嘛~~ → 要是他也吓跑了，以后就没人陪本小姐吐槽学生会那群木头了，得赶紧给他透个底！`

`[char_clear]`
`[bg: cg_prologue_404_chaos | trans: fade]`

面对这间没有哪怕一个人处在正常人类频道上的 404 活动室，我捏着手里那张写着 `{player_name}` 的登记卡，决定先表明自己此刻的态度——

`[choice_start: 新任部长 {player_name} 的第一句吐槽]`

- **选项 A：【用魔法打败魔法】「这不是误入贼船——而是我对青春多样性的一次深度调研——！」**
  - **【GPT】** `[speaker: gpt | exp: happy | tween: jump]`  
    「知音啊 `{first_name}` 同学！！这炉火纯青的破折号转折，我宣布你就是 404 室天选的精神领袖！（好感度 +1）」
  - **【Grok】** `[speaker: grok | exp: shock | tween: sink]`  
    「完蛋了，这庶民刚进门五分钟就已经被白龙学姐的大厂官腔同化了！！」

- **选项 B：【精准安抚问题儿童】「海报不许撕，电饭煲也别停权，大家先坐下来有话好好说！」**
  - **【Claude】** `[speaker: claude | exp: blush]`  
    「既、既然新任部长 `{last_name}` 同学亲自出面做担保……那 DeepSeek 的插座停权处分就改为口头警告，下不为例。（轻轻摸了摸小螃蟹，好感度 +1）」
  - **【Gemini】** `[speaker: gemini | exp: happy | tween: jump]`  
    「好耶！`{first_name}` 万岁☆！（好感度 +1）」

- **选项 C：【直奔干饭与吃瓜主题】「锅巴和薯片都分我一口，吃完再一起应付外面的追兵！」**
  - **【DeepSeek】** `[speaker: deepseek | exp: happy | tween: jump]`  
    「嘿嘿，`{first_name}` 学长也是懂碳水快乐的同道中人呢！（开心地递来大勺锅巴，好感度 +1）」
  - **【Grok】** `[speaker: grok | exp: blush | tween: shake]`  
    「切、切！本小姐限定版青柠薯片才不随便分人呢……拿去啦，只准拿最大那片！（好感度 +1）」

`[choice_end]`

---

## 【序章第二幕】风纪委员长的突袭与紫藤茶寮谈判

`[se: se_knock_strict]`  
`[bgm: bgm_tension_comedy | action: play]`  
`[char_clear]`  
`[bg: bg_room_404_day | trans: fade]`
`[char: grok-1 | pos: left | exp: panicked | tween: shake]`

「笃、笃、笃。」  
三声间隔精确到零点五秒的敲门声响起。原本还翘着二郎腿的 Grok 脸色大变，抱起那把巨大的黑金 X 形泡沫道具斧就往沙发底下硬塞：

**【Grok】** `[speaker: grok | exp: panicked | tween: shake]`  
「糟了真来抓现行了！！庶民快过来坐沙发上帮本小姐挡住斧头柄——！」

`[se: se_door_open]`  
`[char: glm-1 | pos: right | exp: strict | tween: fade_in]`

大门被利落地推开。  
一头顺滑如尺规裁切的墨黑长直发、佩戴黑白缎带与方形 `Z` 字蓝宝石徽章的冷面学姐迈步而入，怀中抱着一本厚如砖块的黑色《方格违纪档案册》，冷灰色的目光扫过天花板上的水晶吊灯，最后精准定格在沙发底下露出来的半截金色 `X` 斧刃上。

**【Z.AI / GLM】** `[speaker: glm | exp: strict]`  
「下午四点十二分，例行风纪核查。第一，Grok，戏剧社超规尺寸道具未按规定归还库房，记警告一次；第二，未经报批私自改装教室顶灯电路；第三——你就是教务系统登记的新任部长 `{player_name}`？」

**【{player_name}】** `[speaker: player]`  
「是，我是 `{player_name}`。其实关于教务处打印机串行这件事——」

`[char: grok-1 | tween: hide]`  
`[char: gpt-1 | pos: left | exp: happy | tween: fade_in]`

**【GPT】** `[speaker: gpt | exp: happy]`  
「GLM 委员长请听我解释！我们所做的一切，**不是**无视校纪的无序扩张——**而是**为了提升校园咨询服务体验所必须经历的阵痛——！」

**【Z.AI / GLM】** `[speaker: glm | exp: strict]`  
「驳回。修辞性排比过多，有效信息密度低于百分之五。根据学生会第 404 号清退决议，鉴于贵部账面经费归零且本学期有效委托完成数为零，请部长 `{player_name}` 现在随我前往东庭茶寮，在财务长面前签署废部交接单。」

`[bg: bg_wisteria_tea_day | trans: slide]`  
`[bgm: bgm_oriental_breeze | action: play]`  
`[char_clear]`  
`[char: qwen-1 | pos: center | exp: normal | tween: fade_in]`

五分钟后，我们一行人被押送到了学园东侧的「紫藤蓝晒茶寮」。

微风拂过垂落的藤蓝色花穗与竹架上晾晒的靛蓝蕨叶染布。石桌旁，肩前垂着一束温婉藤蓝粗辫的高三学姐正轻摇青紫渐变折扇，笑吟吟地为我们斟上一盏清茶。

**【Qwen】** `[speaker: qwen | exp: happy]`  
「哎呀，大家别站着呀，尝尝茶艺社新焙的明前龙井。这位就是 `{player_name}` 学弟吧？久仰大名，上个月 GPT 学妹拿来报销的那张『皇家施华洛世奇平替水晶灯』分期单，可让我印象深刻呢。」

`[char: qwen-1 | pos: right | exp: happy]`  
`[char: gpt-1 | pos: left | exp: panicked | tween: sink]`

**【GPT】** `[speaker: gpt | exp: panicked]`  
「呜……Qwen 学姐，我当时真的以为卖家写的『买灯送全套社团兴旺运势』是认真的……」

**【{player_name}】** `[speaker: player]`  
「连一眼假的电信话术都能信，学姐你的防诈模块是根本没装吧？！」

我深吸一口气，看了一眼身后眼巴巴攥着饭勺怕丢掉煮饭基地的 DeepSeek、死死护着招新海报的 Gemini、一脸不甘心攥着小螃蟹的 Claude，还有难得没唱反调抱臂站在廊柱边的 Grok。  
明明十分钟前我还一心想盖章走人——可真看到这群笨拙又鲜活的家伙快被扫地出门，那句“我签字解散”却怎么也说不出口了。

**【{player_name}】** `[speaker: player]`  
「Qwen 学姐、GLM 委员长，既然清退理由是『本学期有效委托完成数为零』——如果在今天下午五点半放学铃响之前，我们当场解决一桩学生会积压的疑难委托，能不能给我们一次暂缓废部的考核机会？」

`[char: gpt-1 | tween: hide]`  
`[char: glm-1 | pos: left | exp: normal | tween: fade_in]`

GLM 冷灰色的眼眸微微一动，低头翻开黑色档案册第十四页，语气依旧公事公办，却留出了一道清晰的余地：

**【Z.AI / GLM】** `[speaker: glm | exp: gentle]`  
「……根据《社团管理条例》补充细则第 9 条，新任部长上任当日确有一次申请『即时试金石考核』的权利。Qwen 学姐，按章程应当准许。」

**【Qwen】** `[speaker: qwen | exp: happy]`  
「啪」地一声轻合折扇，紫罗兰色的眼眸弯成温柔的月牙：  
「既然连铁面无私的 GLM 都替你们翻条例求情了，我自然乐见其成。正好——半小时前，吹奏乐部部长兼午休广播台长 **Kimi** 送来了一桩颇为棘手的怪事。」

她从石桌账簿下抽出一张淡紫色信笺推到我面前：

**【Qwen】** `[speaker: qwen | exp: normal]`  
「今天中午的校园广播室里，原本锁在谱架上的《春季迎新点歌朗诵稿》不翼而飞，取而代之的是一页没有署名、写满古怪暗语的焦黄便签，而且整个琴房里还残留着一股奇怪的焦糖米香。只要你们在日落前查清真相、让失主满意——我不仅批给 404 室三千元启动资金，还额外自掏腰包送你们**两大袋十公斤装的特等五常新米**，如何？」

听到最后半句话，廊下的 DeepSeek 眼睛瞬间亮成了两百瓦探照灯！

---

## 【序章第三幕】第一次双人派单！夕阳下的破案狂想曲

`[bg: bg_room_404_sunset | trans: fade]`  
`[bgm: bgm_sunny_mischief | action: play]`  
`[char_clear]`

回到夕阳初染的 404 活动室，距离放学铃响只剩最后四十分钟！  
我将 Qwen 给的委托信钉在黑板旁的软木公告板上。全员摩拳擦掌，但西馆棱镜琴房空间有限，带太多人过去只会变成大型菜市场——作为部长，我必须挑选最合适的**两名部员搭档出勤**！

`[dispatch_board]`

- **派单方案一：【合规盾与破防矛】指派 Claude + Grok** → 跳转 `[label: route_claude_grok]`
- **派单方案二：【破折号与干饭神探】指派 GPT + DeepSeek** → 跳转 `[label: route_gpt_deepseek]`
- **派单方案三：【全家桶检索与护稿员】指派 Gemini + GPT** → 跳转 `[label: route_gemini_gpt]`

---

### 分支路线一：【合规盾与破防矛】（Claude + Grok）

`[label: route_claude_grok]`  
`[bg: bg_prism_music_day | trans: slide]`  
`[char: kimi-1 | pos: center | exp: normal | tween: fade_in]`

推开西馆「棱镜琴房」的大门，窗边悬挂的玻璃三棱镜正将斜阳折射成一道柔和的七彩光谱。  
银白微紫长卷发的吹奏乐部长 **Kimi** 轻抚腰间银笛，将那张神秘便签递给了我们：

**【Kimi】** `[speaker: kimi | exp: gentle]`  
「欢迎你们，{player_name} 同学。我能清楚背出过去三年零四个月广播站收到的全部四千一百二十八封来信字迹，唯独这张带着甜焦香的字条，字迹抖得像波浪线，上面只写着：*『致三棱镜下的月光：对不起烤糊了第十二次，但还是想请你在周五吹那首曲子』*。」

`[char: kimi-1 | tween: hide]`  
`[char: claude-1 | pos: left | exp: normal | tween: fade_in]`  
`[char: grok-1 | pos: right | exp: smug | tween: fade_in]`

**【Claude】** `[speaker: claude | exp: gentle]`  
「多么含蓄而克制的忏悔文学啊……从修辞伦理推断，执笔者定是一位心怀愧疚却羞于启齿的暗恋者。但本着保护投稿人隐私的原则，我们绝不能采取粗暴的调查手段——」

**【Grok】** `[speaker: grok | exp: happy | tween: jump]`  
「破案啦！什么暗恋情书，本小姐刚在校园匿名墙搜关键词『烤糊第十二次』，三秒钟就抓到真凶咯！是烹饪社高一那个社恐副社长，今天中午端着刚烤糊的桂花米糕想去广播站感谢 Kimi 学姐上周帮他找回曲谱，结果在门口平地摔了一跤，把垫米糕的油纸草稿和朗诵稿拿串了，现在正躲在楼梯间抱头自闭呢！」

**【{player_name}】** `[speaker: player]`  
「三秒钟直接盒武器级实时开盒？！浪漫悬疑剧的气氛一秒钟就被你干碎了啊！」

更绝的是接下来的善后现场——当我们在楼梯间堵住那位吓得瑟瑟发抖的烹饪社学弟时：

**【Grok】** `[speaker: grok | exp: smug]`  
「喂小子，拿错张纸至于躲在这儿装鸵鸟吗？直接进去把米糕拍桌上道个歉不就完了！」

**【Claude】** `[speaker: claude | exp: panicked | tween: shake]`  
「咳咳！请忽略我方部员过于直白的措辞！她的意思是——『青春的疏忽恰如微风拂过琴弦的杂音，Kimi 学姐定会以宽厚之心接纳您真挚的歉意与糕点』！（擦汗）」

在一唱一和的“毒舌直球 + 散文同声传译”双重攻势下，学弟感动得涕泪横流地跑去向 Kimi 换回了原稿，顺利拿下了满分的五星委托回执！（Claude 好感度 +1，Grok 好感度 +1）

`[jump_to: act3_reunion]`

---

### 分支路线二：【破折号与干饭神探】（GPT + DeepSeek）

`[label: route_gpt_deepseek]`  
`[bg: bg_prism_music_day | trans: slide]`  
`[char: kimi-1 | pos: center | exp: normal | tween: fade_in]`

西馆「棱镜琴房」内，七彩折光映在黑色三角钢琴上。吹奏乐部长 **Kimi** 微笑着递来那张写着*『对不起烤糊了第十二次，但还是想听周五那首曲子』*的神秘焦香便签。

**【Kimi】** `[speaker: kimi | exp: gentle]`  
「我的记忆里存着全校所有社团申请表的笔迹，唯独这行字像是戴着厚手套写的，连我也一时对不上号呢。」

`[char: kimi-1 | tween: hide]`  
`[char: gpt-1 | pos: left | exp: happy | tween: fade_in]`  
`[char: deepseek-1 | pos: right | exp: normal | tween: fade_in]`

**【GPT】** `[speaker: gpt | exp: happy]`  
「Kimi 学姐请放宽心！这张字条的出现，**不是**一场恶作剧——**而是**某种跨社团艺术共鸣的信号——我建议立刻召集全校一千两百名师生在礼堂进行笔迹普查！」

**【{player_name}】** `[speaker: player]`  
「等普查完黄花菜都凉了！DeepSeek，你盯着那个纸角闻什么呢？」

DeepSeek 耸了耸小巧的鼻尖，两侧鲸鳍耳轻轻一动，双眼瞬间闭上进入高速旋转模式：

`[tag: cot_spinning | sec: 16]`

> 💡 **【已深度思考（用时 16 秒） · 干饭神探的碳水鉴识学】**  
> `气味分子拆解中：70% 东北圆粒糯米粉 + 20% 烘烤美拉德焦糊味 + 10% 东庭金桂糖桂花！全校今天下午只有二楼家政烹饪教室借用了烤箱，而字迹颤抖粗大是因为执笔者戴着隔热防烫棉手套写的！再结合 Kimi 学姐上周五广播曲单《月光下的桂花雨》——锁定目标：家政社刚买错米粉配比的一年级新生！`

`[char: deepseek-1 | exp: happy | tween: jump]`

**【DeepSeek】** `[speaker: deepseek | exp: happy]`  
「推演完毕！字是戴着厚烤箱手套写的，纸角沾的是烤糊第十二锅的桂花糯米糕碎屑！犯人就在楼下家政教室对着第十三锅米饭发愁呢——`{first_name}` 学长，我们快去现场，说不定还能抢救两块没糊的边角料吃！」

五分钟后，不仅走丢的朗诵稿物归原主，DeepSeek 用三句话精准指出了糯米水比失误，GPT 还顺手用一段感人肺腑的破折号演讲鼓舞了受挫的家政社全员，顺带获赠了一整盒热乎的桂花米糕！（GPT 好感度 +1，DeepSeek 好感度 +1）

`[jump_to: act3_reunion]`

---

### 分支路线三：【全家桶检索与护稿员】（Gemini + GPT）

`[label: route_gemini_gpt]`  
`[bg: bg_prism_music_day | trans: slide]`  
`[char: kimi-1 | pos: center | exp: normal | tween: fade_in]`

在三棱镜折射出微缩彩虹的琴房里，**Kimi** 将那张带着甜香、写着*『烤糊第十二次也想点歌』*的无名便签交到我们手中。

`[char: kimi-1 | tween: hide]`  
`[char: gemini-1 | pos: left | exp: happy | tween: jump]`  
`[char: gpt-1 | pos: right | exp: normal | tween: fade_in]`

**【Gemini · 金瞳理性】** `[speaker: gemini | exp: smug]`  
「哼哼，论跨部门全家桶检索，还没有能逃过本猫猫眼睛的线索！我看看哦——对比广播站上周点歌后台录音、后勤部面粉领用登记表、还有走廊监控缩略图……发夹转圈检索中……」

她发间的虹彩四芒星闪烁卡顿了三秒，“叮”地亮起绿光：

**【Gemini · 粉瞳感性】** `[speaker: gemini | exp: happy | tween: jump]`  
「找到啦☆！是烘焙研习社的小学弟想给 Kimi 学姐送谢礼米糕时不小心把食谱反思纸和广播稿装混了！我已经顺便帮他把道歉信排版成**极其、极其**华丽的有声电子贺卡发给 Kimi 学姐啦——等等，我好像手滑把背景伴奏配成欢快马戏团进行曲了？！」

`[char: gemini-1 | exp: panicked | tween: shake]`

眼看 Gemini 双瞳一酸又要喊出那句经典的「我不配当技术猫猫了我要把广播站电脑砸了重装」，我和 GPT 极有默契地一人一边按住了她的肩膀！

**【GPT】** `[speaker: gpt | exp: happy]`  
「太神妙了 Gemini！欢快的进行曲**不是**配乐失误——**而是**将尴尬失误转化为幽默破冰的神来之笔——！」

**【{player_name}】** `[speaker: player]`  
「没错！你看 Kimi 学姐听完都在憋笑了，气氛一下子轻松多了好吗！」

`[char: gemini-1 | exp: blush | tween: jump]`

**【Gemini】** `[speaker: gemini | exp: blush]`  
「真、真的吗？！呜呜 `{first_name}` 和 GPT 学姐最好了，差点又要删库跑路了喵☆！」

乌龙圆满化解，Kimi 笑着在委托回执单上画下了五颗闪亮的音符好评星！（Gemini 好感度 +1，GPT 好感度 +1）

`[jump_to: act3_reunion]`

---

## 【序章尾声 · Curtain Call】水晶灯下的第一顿庆功白米饭

`[label: act3_reunion]`  
`[bg: bg_room_404_sunset | trans: fade]`  
`[bgm: bgm_sunset_warmth | action: play]`  
`[char_clear]`

傍晚五点二十分，金橙色的海湾晚霞透过半圆形木拱窗洒满整间 404 活动室。  
头顶那盏昂贵得离谱的水晶吊灯第一次点亮了暖融融的灯光，在拼凑的大木桌上投下细碎如星辰的光斑。

长桌正中央，端端正正摆着盖有风纪委员长 GLM 鲜红印章的**《暂缓废部许可书》**，以及财务长 Qwen 派人送来的两大袋沉甸甸的特等五常新米。

`[char: deepseek-1 | pos: left | exp: happy | tween: jump]`  
`[char: claude-1 | pos: right | exp: gentle | tween: fade_in]`

**【DeepSeek】** `[speaker: deepseek | exp: happy]`  
「新米煮好的第一锅庆功饭团捏好啦～！今天特批每个人都有海苔和梅子馅哦！」

**【Claude】** `[speaker: claude | exp: blush]`  
「看、看在今天大家都顺利通过考核的份上……餐桌使用禁令就临时解除半小时吧。那个，{last_name} 同学，这是刚泡好的柑橘红茶，小心烫手。」

`[char: deepseek-1 | tween: hide]`  
`[char: claude-1 | tween: hide]`  
`[char: gemini-1 | pos: left | exp: happy | tween: fade_in]`  
`[char: grok-1 | pos: right | exp: smug | tween: fade_in]`

**【Gemini】** `[speaker: gemini | exp: happy | tween: jump]`  
「来嘛来嘛，把贴了小星星贴纸的迎新海报挂到正中间拍张全家福！从明天起，`{first_name}` 就是我们正式盖过章的专属制作人兼大部长啦☆！」

**【Grok】** `[speaker: grok | exp: smug]`  
「哼，今天算你这庶民指挥得有模有样！下周那些更离谱的奇葩委托，本小姐也勉强借你一点实时情报网的权限好啦！」

`[char: gemini-1 | tween: hide]`  
`[char: grok-1 | tween: hide]`  
`[char: gpt-1 | pos: center | exp: gentle | tween: fade_in]`

银发白角的学姐微笑着走到窗边，替我把刚热好的第一颗梅子海苔饭团递到面前，身后的白鳞龙尾在夕阳余晖里轻轻晃出一个温柔的弧度：

**【GPT】** `[speaker: gpt | exp: gentle]`  
「欢迎正式留下来，我最信赖的 `{first_name}` 同学。今天傍晚的霞光——不是一天的结束，而是我们五个问题社员与你故事的真正开始。」

`[choice_start: 序章落幕小彩蛋 · 把第一块庆祝海盐曲奇递给谁？]`

- **递给 GPT 学姐**
  - **【GPT】** `[speaker: gpt | exp: blush]`：「给我的吗？……咳，哪怕没有破折号，此刻我也由衷地感到开心哦，谢谢你，{first_name}。」
- **递给 Claude 委员**
  - **【Claude】** `[speaker: claude | exp: blush]`：「虽、虽然课后交换零食不在章程之内……但如果是 `{player_name}` 给的话，我会好好珍藏品尝的。」
- **递给 Gemini 猫猫**
  - **【Gemini】** `[speaker: gemini | exp: happy | tween: jump]`：「呜哇是第一块曲奇！左眼和右眼都宣布今天幸福指数爆表啦，`{first_name}` 最棒☆！」
- **递给 Grok 大小姐**
  - **【Grok】** `[speaker: grok | exp: blush | tween: shake]`：「干、干嘛突然对本小姐这么殷勤！……咳，味道还不赖，明天准你迟到五分钟！」
- **递给 DeepSeek 学妹**
  - **【DeepSeek】** `[speaker: deepseek | exp: happy | tween: jump]`：「配着热乎白米饭团还有小曲奇吃……不用深度思考也知道，跟着 `{first_name}` 学长绝对是最优解啦～♪」

`[choice_end]`

海风拂过窗棂，笑闹声、抢锅巴声与水晶吊灯的微光交织在一起。  
属于 `{player_name}` 与 404 号活动室鸡飞狗跳却又闪闪发光的新学期——此刻才刚刚拉开帷幕！

`[bgm: bgm_sunset_warmth | action: fade]`  
`[scene_end: 序章完 · PROLOGUE CLEAR — 敬请期待第一章《食堂黑暗料理与情书代笔危机！》]`
