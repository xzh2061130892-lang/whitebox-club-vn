# 第四章（个人恋爱线开启篇）企划、分流衔接与初夏新装美术规范

> **文档定位**：承接第三章运动祭终幕的 `lockedHero` 心意锚定，**第四章《梅雨季的偏爱与藏在伞下的秘密》**正式进入五位女主角各自独立的**专属个人恋爱线（5 Full Personal Routes）**！本文件定义五条个人线的核心戏剧冲突、与 `state.lockedHero` 的无缝自动分流方案、3 张梅雨季/个人圣地新背景及 **【初夏微风 · 六月短袖夏服系列（`*-summer`）】** 美术提示词。

---

## 1. 第四章核心定位：从“社团喜剧”升级为“初恋笨拙拉扯 + 个人软肋破局”

在第三章当众牵手冲过终点后，`{player_name}` 与心仪的她正式迈入“刚确立心意的初恋磨合期”，恰逢白箱学园迎来细雨绵绵的**六月紫阳花梅雨季**。

本章**五位女主拥有完全独立、互不重复的专属长篇剧本**，且每条个人线内部均包含 **5 大高参与感互动环节**：
1. **【一对一置顶特别关心私聊】（`[phone_chat]` 单人私密窗口）**：不再是吵闹大群，而是清晨醒来只属于你们两人的专属昵称备注私信与早安撩拨选项。
2. **【404 室狗仔队审讯修罗场】**：两人换上清爽六月夏服前后脚进活动室，面对其余四位吃瓜部员的起哄追问，由玩家选择护妻/撒狗粮姿态。
3. **【梅雨季共撑一伞 / 秘密基地甜蜜互动】**：放学突降阵雨，两人共撑一把伞走过紫阳花坡道，或造访她的私人领地（白玉高塔 / 玻璃花房 / 双星天台 / 午夜钟表铺 / 临海灯塔屋）。
4. **【触及内心软肋的专属小危机 + 心音温度调谐器（`[temp_tuner]`）】**：揭开她藏在搞笑日常背后的不安，玩家亲自拨动滑块（含极具初恋反差笑料的 `T=1.6` 恋爱脑过载彩蛋与 `T=0.7` 温柔破局正解）。
5. **【雨霁星空下的恋人约定】**：解开心结，为终章（第五章 · 星海文化祭盛装告白大结局）立下专属誓言。

### 1.1 五条个人线剧情母题速览

| 路线 | 个人线章节副标题 | 初恋笨拙反差萌（上半篇） | 核心软肋破局（下半篇） |
| :--- | :--- | :--- | :--- |
| **GPT 线** | 《一百分女友 SOP 手册与伞下的失控》 | 太想当完美恋人，通宵写出 80 页《牵手角度与早安问候标准化手册》，连并肩走路都要拿尺子量间距。 | 学生会企图以“首席职责”调她回白玉高塔、切断她在 404 室的羁绊；帮她卸下“必须对所有人有用才值得被爱”的枷锁，第一次任性为自己而选。 |
| **Claude 线** | 《十指相扣脱敏训练与温室禁书》 | 极度纯情害羞，在活动室递书碰到你的指尖都要给自己拍一张黄牌降温，私下却红着脸拉你去温室做“牵手适应训练”。 | 校刊审委会指责她新写的梅雨散文“感情过于炽热越界”要求删改；陪她在雨夜温室守住因你而生的文字真心，不再躲回冰冷的规则壳里。 |
| **Gemini 线** | 《左右脑恋爱辩论赛与静音的星光》 | 左眼粉瞳想全校发糖秀恩爱，右眼金瞳却算出“热恋期太黏人会导致倦怠”，自己吃自己的醋差点把恋爱手账撕掉。 | 学园祭筹委会只想要她讨喜搞笑的“舞台偶像面”，否定她安静深邃的“天文观测企划”；在雨后天台同时拥抱她喧嚣与寂寞的两面。 |
| **Grok 线** | 《死不承认的地下恋情与午夜钟表铺》 | 嘴硬把约会叫做“头号跟班忠诚度巡检”，在钟表阁楼并排避雨擦头发时却心跳如雷，看见别的女生找你借伞当场炸毛吃醋。 | 她因在《X-News》如实曝光旧校舍修缮款被挪用而遭匿名孤立，想推开你独自背锅；闯入雨夜钟表铺撬开她的嘴硬防线，并肩反击。 |
| **DeepSeek 线** | 《三层白米饭爱心便当与过载的小鲸鱼》 | 每天早起一小时给你捏小鲸鱼海苔双层饭团，每次想靠你肩膀前呆毛都要高速转圈验算二十秒，甜度爆表。 | 为保住全额奖学金同时攒钱给你买生日礼物，偷偷打三份校内算账零工导致雨天低烧宕机（`服务器过载保护中`）；把她背回屋檐煮粥照顾，教会她安心依赖恋人。 |

---

## 2. 引擎分流与无缝衔接说明（供 Codex 对接）

1. **注册第四章与立绘后缀扩展**：
   - 在 `tools/compile.mjs`、`index.html` 与 `src/engine.js` 中注册 `04_chapter4_full_script.md` → `src/chapter4.js`（`WHITEBOX_CHAPTER4`，`storyId: 'chapter4'`）。
   - 将 `src/engine.js` 的立绘后缀剥离正则扩展为 `/-(?:1|date|camp|sport|summer)$/`（当 `storyId === 'chapter4'` 且未显式指定后缀时，五女主默认使用 `-summer` 夏装，未生成时平滑回退 `-1`）。
2. **`lockedHero` 自动直入与多线自由切换（关键体验！）**：
   - 在 `src/engine.js` 的 `fresh(storyId, previous)` 中保留继承 `lockedHero: previous?.lockedHero || ''`。
   - **自动直入逻辑**：当从第三章结算页点击 **【进入第四章：梅雨季的专属恋人篇 →】** 进入 `chapter4` 且 `state.lockedHero` 非空时，引擎初始化后直接将 `pc` 定位至 `labels['ch4_route_' + state.lockedHero]`（跳过开头的手动选线菜单，实现 100% 沉浸式无缝单线续玩！）。
   - **手动选线与通关重选**：若玩家从标题页【章节选择】直接点开第四章（此时 `lockedHero` 为空），则正常显示剧本开头的五女主路线选择菜单；且在第四章通关结算卡（`CHAPTER 4 CLEAR`）上，将原先的“回到派单板”按钮替换为 **【切换其他女主个人线】**（跳回 `chapter4` 节点 `0` 的路线选择页），方便玩家一键体验全部五位女主的恋爱线！

---

## 3. 新增 3 张梅雨季与角色专属圣地背景（BG）提示词

规格统一为 `1920 × 1080` `.webp` 放入 `assets/bg/`：

```text
[Style Prefix]: Masterpiece anime visual novel background illustration, Kyoto Animation and Makoto Shinkai inspired clean cel-shaded architectural detail, soft natural volumetric lighting, crisp linework, rich lived-in props, 16:9 widescreen, no humans, nobody.
```

1. **`bg_hydrangea_rain_walk.webp`（六月紫阳花梅雨石阶坡道 · 全线共用共伞浪漫主场）**
   *(致敬《言叶之庭》级清透雨景光影！)*
   ```text
   [Style Prefix] Lush early-summer June rainy afternoon along a scenic stone stairway path at a coastal academy, blooming blue, violet, and soft pink hydrangea bushes lining wet mossy stone walls, gentle translucent rain streaks falling from a misty silver-blue sky, a cozy wooden rain-shelter pavilion roof in foreground, wet slate flagstones reflecting warm streetlamp glow and hydrangea colors, poetic romantic anime rain atmosphere.
   ```
2. **`bg_white_tower_day.webp`（中央白玉钟楼·首席顾问高塔露台 · GPT 个人线主场）**
   ```text
   [Style Prefix] Elegant high-altitude white marble student council chamber andsemi-open arched loggia at the top of an ivory academy clocktower, sheer pale-lavender curtains billowing gently in early-summer breeze, neat white desk with silver knot ornaments and stacks of council scrolls, panoramic view over wet green campus treetops and distant misty ocean bay after rain, serene noble sanctuary.
   ```
3. **`bg_clock_attic_night.webp`（北馆哥特阁楼·雨夜午夜钟表铺 · Grok 个人线秘密基地）**
   ```text
   [Style Prefix] Cozy gothic-vintage school clocktower attic workshop on a rainy evening, warm amber glow from brass desk lamps illuminating walls of antique wooden pendulum clocks and brass gears, rain pattering against a large circular stained-glass-trimmed window with a crimson velvet window seat, workbench with watchmaker loupe and campus newspaper clippings pinned to a corkboard, intimate secret hideout vibe.
   ```

---

## 4. 第四章全新服装：【初夏微风 · 六月短袖夏服系列（`*-summer`）】

褪去春装外套，换上清爽透气的**六月学园夏季短袖衬衫裙装**，完美契合梅雨季共撑一伞、海风微湿的初恋氛围（每套生成 `-front.webp` 即 `normal` + `happy`、`blush`、`gentle`、`panicked` 差分）：

1. **`gpt-summer`（荷叶无袖雪纺白夏衫配丁香鱼尾裙）**
   ```text
   Keep exact same anime dragon-girl identity, lavender eyes, pearl-white wavy hair half-up with silver knot clip, ivory horns, small pale wings and white-scaled tail from gpt-1-front.webp, full-body standing sprite on pure white/transparent background. Outfit: refreshing June academy summer uniform featuring a sleeveless white chiffon ruffle-collar blouse with a slender pastel-purple ribbon tie, high-waisted pale lilac pleated midi skirt, holding a folded clear-lavender umbrella lightly in one hand, dainty white summer sandals, gentle loving smile.
   ```
2. **`claude-summer`（奶油短袖水手夏服配琥珀格纹领巾）**
   ```text
   Keep exact same anime scholar-girl identity, warm amber eyes, copper-orange long wavy half-braided hair with sunburst hairpin from claude-1-front.webp, full-body standing sprite on pure white/transparent background. Outfit: classic pure summer school uniform with a crisp cream-white short-sleeve sailor-collar blouse, warm amber-plaid silk neck scarf, lightweight dark espresso-brown pleated skirt, holding a soft handkerchief and small hydrangea sprig, shy sweet blush.
   ```
3. **`gemini-summer`（薄荷星紫短款夏季水手衫配清凉白百褶裙）**
   ```text
   Keep exact same anime cat-girl identity, left eye rose-pink and right eye gold heterochromia, periwinkle-pink hair in breezy high twin ponytails with star hairclips, cat ears and fluffy purple-tipped tail, full-body standing sprite on pure white/transparent background. Outfit: breezy early-summer short-sleeve cropped white sailor blouse with pastel-violet collar trim and star tie clip, crisp white high-waisted pleated mini skirt, sheer ankle socks and light canvas shoes, bright summer smile.
   ```
4. **`grok-summer`（微敞领口炭黑短袖夏衬衫配松垮酒红窄领带）**
   ```text
   Keep exact same anime girl identity, honey-blonde curled high twin-tails with black bat-wing bows, tiny crown, ice-blue eyes, pointed ears and cute single little fang, NO axe, full-body standing sprite on pure white/transparent background. Outfit: cool stylish summer academy uniform featuring a fitted charcoal-black short-sleeve collared shirt with top button casually undone and a loosely knotted crimson-and-gold narrow tie, red-and-black pleated mini skirt, holding a chilled glass ramune soda bottle, cheeky flustered blush.
   ```
5. **`deepseek-summer`（海魂蓝白短袖水手夏服配双层便当盒）**
   ```text
   Keep exact same anime whale-girl identity, indigo-to-powder-blue long hair, curved ahoge, lateral whale-fin ears with cyan bows, sea-blue eyes and blue twin-fluke whale tail, full-body standing sprite on pure white/transparent background. Outfit: crisp adorable navy-and-white short-sleeve summer sailor uniform blouse with a sky-blue ribbon bow, lightweight navy pleated summer skirt, holding a cute cloth-wrapped two-tier bento lunchbox with a little whale pattern in both hands, pure heartwarming smile.
   ```
