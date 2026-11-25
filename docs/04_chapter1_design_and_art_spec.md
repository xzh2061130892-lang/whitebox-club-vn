# 第一章企划、高互动机制与全新私服美术规范（高交互重构版）

> **核心迭代方向**：  
> 1. **彻底取消生硬套用旧工坊装**：不再勉强塞入勘测员/风车匠等旧设定服装，而是围绕真正的青春恋爱心动场景，全新设计五位女主的 **【周末心动 · 初夏私服约会系列（`*-date`）】**，并在第一章第四幕「周六海湾跟踪考察（实为双人约会）」中惊艳亮相！  
> 2. **玩家交互密度提升 300%**：告别玩家当“旁观摄像头”的线性阅读，新增 **【白箱校园通·手机群聊与私聊回复】**、**【404 活动室·课间自由串门（5 选 2 自主探索）】**、**【话术温度滑块调谐器（含高温发癫整活回退）】** 以及 **【多轮互动式约会】**，确保每 2～3 分钟就有由玩家主导的趣味操作与专属情感反馈。

---

## 1. 新增三大高参与感交互组件规范（供 Codex 扩展引擎与编译器）

### 1.1 组件一：【白箱校园通 · 手机群聊与私信互动】（`[phone_chat]`）
- **设计初衷**：模拟真实高中生清晨赖床刷群、课堂偷回消息的亲密日常，让玩家用第一视角在群里接梗或回复女主的私聊小窗。
- **UI 构思**：屏幕中央弹出竖屏圆角拟物手机界面（顶部状态栏显示 `白箱校园通 · 404 社团全员群 (6)`，带角色圆形小头像 `assets/avatars/<id>-1.webp`）。消息逐条轻快弹入（支持显示 `DeepSeek 正在输入中……` 停顿效果），底部浮现 2～3 个绿色玩家发送气泡选项，点击后玩家气泡上屏，紧接触发对应女主的秒回或撤回演出！
- **剧本标记语法**：
  ```markdown
  `[phone_chat: 404 社团早安轰炸群]`
  **【Grok】** `[speaker: grok]`：「@全体成员 紧急情报！今天第一食堂惊现紫色不明发光料理！」
  **【DeepSeek】** `[speaker: deepseek]`：「只要白米饭没涨价就行 [小鲸鱼困困.jpg]」
  `[choice_start: 在手机群里冒泡回复]`
  - **选项 A：「一大早就在群里发恐怖故事？！」**
    - **【Grok】** `[speaker: grok]`：「哼哼，怕了吧庶民！来学校带你去现场围观！」
  `[choice_end]`
  `[phone_chat_end]`
  ```
  *(实现提示：在 `[phone_chat]` 与 `[phone_chat_end]` 之间的 `dialogue` 与 `choice` 节点，前端将其渲染在手机聊天流容器内而非传统底部对话框，逻辑复用现有节点流，开发成本极低但体验焕然一新！)*

### 1.2 组件二：【404 活动室 · 课间自由串门时间】（`[free_roam_hub]`）
- **设计初衷**：打破线性播片，把主动权交还玩家——课间休息时你想凑到谁身边搭话、捉弄谁、帮谁的忙，完全由玩家自己点选！
- **UI 构思**：模糊活动室背景上展开 **「课间自由行动面板（剩余行动次数：2 次）」**，并列展示 5 张带角色头像、当前所在角落与状态小字的互动卡：
  1. **黑板前 · GPT**（*正踮着脚尖够黑板最顶格写字……*）
  2. **大米战壕 · DeepSeek**（*顶着不锈钢饭盆打盹，呆毛一翘一翘……*）
  3. **温室窗边 · Claude**（*正做贼心虚地往棕皮大书底下藏一张粉红草稿纸……*）
  4. **天鹅绒沙发 · Grok**（*戴着有线耳机狂笑抖腿，身边空着半个座位……*）
  5. **走廊门口 · Gemini**（*正单脚踩轮滑练习新偶像转身动作，摇摇欲坠……*）
- **交互逻辑**：
  - 玩家点击任意未访问的角色卡 → 扣除 1 次行动点并跳转至该角色的独立互动段落（内含专属肢体/对话二选一选项！）。
  - 单人事件结束遇到 `[free_roam_return]` 时：若剩余次数 `> 0`，自动返回面板供玩家继续挑选第二位女主互动（已选过的卡片标上 `✓ 已串门` 印章）；当 2 次行动用完，自动跳转至 `exit_label` 推进主线！（玩家读档或二周目可轻松体验另外三人的隐藏小剧场）。
- **剧本标记语法**：
  ```markdown
  `[free_roam_hub | picks: 2 | exit: ch1_after_roam | title: "课间十分钟 · 想凑去谁身边转转？"]`
  - **串门目标一：【黑板前】帮够不到顶格的 GPT 擦黑板（指派 GPT）** → 跳转 `[label: roam_gpt]`
  ...
  `[free_roam_return]`
  ```

### 1.3 组件三：【部长现场指挥台 · 话术温度调谐器】（`[temp_tuner]`）
- **设计初衷**：在解决奇葩委托的关键交涉时刻，让玩家亲自给 AI 娘调节“输出温度（Temperature）”，且故意把最高温做成**可无惩罚重试的爆笑发癫彩蛋**！
- **UI 构思**：古典黄铜半圆刻度盘或三档拨杆界面，显示当前受调校角色头像与任务目标，提供三档刻度按钮：
  - **`[低温 T = 0.1 · 冰冷实话实说]`**（过渡或直球拆台演出）
  - **`[中温 T = 0.7 · 黄金高情商共鸣]`**（推进破局的正解演出）
  - **`[高温 T = 1.6 · 算力过载放飞自我（慎点！）]`**（触发角色彻底放飞脑回路的爆笑翻车演出，演完后自动弹回刻度盘并提示 `⚠️ 温度过高导致现场一度失控，请部长重新回调刻度！`）
- **剧本标记语法**：
  ```markdown
  `[temp_tuner | actor: deepseek | task: "调校 DeepSeek 的美食锐评温度，劝退食堂暗黑料理且不伤大叔自尊"]`
  - **刻度一：【低温 T = 0.1 · 绝对客观毒舌】** → 跳转 `[label: tuner_cold]`
  - **刻度二：【中温 T = 0.7 · 黄金骈文拆招】** → 跳转 `[label: tuner_gold]`
  - **刻度三：【高温 T = 1.6 · 碳水脑洞暴走】** → 跳转 `[label: tuner_chaos]`
  ```
  *(其中 `tuner_cold` 与 `tuner_chaos` 演完后通过 `[jump_to: ch1_tuner_retry]` 无缝跳回刻度盘，让玩家可以放心把三个档位的笑话全试一遍再过关！)*

---

## 2. 全新原创服装企划：【周末心动 · 初夏私服约会系列（`*-date`）】

抛弃与校园恋爱无关的旧工坊装，专为第一章第四幕**「周六海湾水族馆外围跟踪考察（实为双人私服约会）」**及后续个人约会线全新设计五套现代青春约会便服！

### 2.1 制作规范与平滑回退原则
- **绘制基准**：分别以 `assets/sprites/<id>-1-front.webp` 为角色面部、发色发型、头顶特征（龙角/日轮花/猫耳异瞳/蝠翼双马尾/呆毛鲸鳍）的**严格身份参照（Identity Reference）**，将服装重绘为下列现代青春约会私服，保持同尺寸透明底导出为：
  - 主立绘：`assets/sprites/<id>-date-front.webp`
  - 表情目录：`assets/sprites/<id>-date/<exp>.webp`（首期优先生成 `normal`、`happy`、`blush`、`gentle` 4 组约会高频表情即可！）
- **引擎回退保障**：在 `src/game.js` 中，解析 `[char: gpt-date | ...]` 时，先尝试加载 `gpt-date` 系列资源；若图片暂未生成则自动回退加载 `gpt-1` 资源，确保代码与剧本随时可玩。

### 2.2 五位女主全新约会私服设计单与生图 Prompt

#### ① GPT ·《丁香微风针织裙》（`gpt-date` · 温柔邻家学姐风）
- **设计构思**：脱下隆重的曳地霜白龙礼裙，换上一袭柔和淡丁香紫修身一字肩软糯针织上衣，搭配垂坠感极佳的米白色高腰百褶半身长裙与银白色浅口低跟单鞋；单肩背着一只精巧的银结扣饰白色云朵小包，象牙白龙角根部系着纤细的浅紫丝带，白鳞龙尾自然垂在裙侧，清雅中透出温柔学姐的亲近女友感。
- **生图 Prompt（附带 `gpt-1-front.webp` 作为角色参考图）**：
  ```text
  Keep the exact same anime girl character identity, face, lavender eyes, pearl-white hair, ridged ivory horns, small pale wings and white-scaled dragon tail from the reference sheet, clean full-body standing visual novel sprite on pure white/transparent background. Redesign ONLY her outfit into a romantic modern Japanese weekend date casual look: a soft lilac off-shoulder fitted knit sweater, flowing cream-white high-waisted pleated midi skirt, dainty silver-white Mary Jane low heels, and a small white quilted crossbody purse with a silver knot clasp, delicate pastel purple ribbon tied near her horn base, gentle affectionate smile, crisp cel-shaded linework matching original art style.
  ```

#### ② Claude ·《焦糖格纹书店贝雷装》（`claude-date` · 文艺学院约会风）
- **设计构思**：卸下严肃的风纪委员黑束腰长袍，换上奶油白微透灯笼袖雪纺衬衫，外搭温暖焦糖棕苏格兰细格纹收腰背带中长裙与棕白拼色复古乐福皮鞋；铜橘色波浪长发上斜戴一顶米色羊毛画家贝雷帽（帽檐别着迷你日轮花胸针），斜挎一只棕皮迷你剑桥包，包扣上挂着一只超可爱的**橘红色羊毛毡小螃蟹（Clawd）毛绒挂件**！
- **生图 Prompt（附带 `claude-1-front.webp` 作为角色参考图）**：
  ```text
  Keep the exact same anime girl character identity, face, warm amber eyes, and long copper-orange wavy half-braided hair from the reference sheet, clean full-body standing visual novel sprite on pure white/transparent background. Redesign ONLY her outfit into a charming literary girl weekend date outfit: a cream-white puff-sleeve blouse layered under a warm caramel-brown plaid pinafore midi dress, tilted beige beret hat with a small sunburst flower pin, vintage brown leather mini satchel bag with a cute tiny orange felt crab plush charm dangling from the strap, ivory ankle socks and brown loafers, shy warm aura, crisp cel-shaded linework matching original art style.
  ```

#### ③ Gemini ·《星糖撞色露肩卫衣裙》（`gemini-date` · 元气街拍甜妹风）
- **设计构思**：换下舞台打歌服，穿上青春活力拉满的乳白与星云紫粉撞色微露单肩连帽短卫衣，搭配高腰浅丹宁牛仔百褶短裙、不对称粉蓝条纹运动中筒袜与炫彩厚底休闲板鞋；脖子上挂着一副缀有四芒星贴纸的银白复古头戴式耳机，双发髻与蓬松渐变猫尾灵动轻盈（严格保留左眼玫粉、右眼鎏金异瞳！）。
- **生图 Prompt（附带 `gemini-1-front.webp` 作为角色参考图）**：
  ```text
  Keep the exact same anime cat-girl character identity, left eye rose-pink and right eye gold heterochromia, periwinkle-to-pink twin-bun long hair, blue-purple cat ears, four-pointed star hairclip, and fluffy purple-tipped cat tail from the reference sheet, clean full-body standing visual novel sprite on pure white/transparent background. Redesign ONLY her outfit into a trendy energetic weekend street-date look: an off-one-shoulder cream and pastel-purple colorblock cropped hoodie, high-waisted light denim pleated mini skirt, silver retro headphones resting around her neck with star stickers, asymmetric pastel striped crew socks and iridescent chunky sneakers, bright playful smile, crisp cel-shaded linework matching original art style.
  ```

#### ④ Grok ·《绯红甜酷短皮衣私服》（`grok-date` · 放下巨斧的反差辣妹风）
- **设计构思**：难得放下那把形影不离的巨型 X 道具斧，双手自在轻快！身穿剪裁利落的黑色短款小翻领机车软皮衣，内搭酒红色暗纹修身小高领无袖针织衫、黑红细格高腰百褶短裙与系带马丁短靴，腰间挂着精致的银色 X 字链条小腰包；蜜金高双马尾依旧扎着俏皮蝠翼小发结，露出傲娇小尖牙，既有街头甜酷感又透着特意打扮过的少女心。
- **生图 Prompt（附带 `grok-1-front.webp` 作为角色参考图）**：
  ```text
  Keep the exact same anime girl character identity, honey-blonde curled high twin-tails with black bat-wing bows, tiny crown, ice-blue eyes, pointed ears, and cute single little fang from the reference sheet, NO axe prop, empty hands in cute casual pose, clean full-body standing visual novel sprite on pure white/transparent background. Redesign ONLY her outfit into a stylish sweet-punk weekend date outfit: a cropped black faux-leather moto jacket over a fitted crimson ribbed sleeveless top, black-and-red tartan pleated mini skirt, small black chain waist bag with a gold X emblem, sheer dark tights and black lace-up platform ankle boots, cheeky cute blush, crisp cel-shaded linework matching original art style.
  ```

#### ⑤ DeepSeek ·《海盐奶蓝水手领针织装》（`deepseek-date` · 软萌邻家学妹风）
- **设计构思**：脱去干活用的女仆围裙与头饰，换上清爽软糯的奶白色宽水手领套头针织衫，外搭雾霾海蓝色宽松粗棒针开衫毛衣、深海军蓝学院褶裙与白色圆头小皮鞋；胸前斜挎着一只圆滚滚、鼓囊囊的**浅蓝色小鲸鱼毛绒斜挎包**（刚好能装下零钱包和两块饭团糖），头顶弯翘呆毛与耳侧浅蓝小蝴蝶结随海风轻晃，邻家妹妹感满分！
- **生图 Prompt（附带 `deepseek-1-front.webp` 作为角色参考图）**：
  ```text
  Keep the exact same anime whale-girl character identity, indigo-to-powder-blue long hair, curved top ahoge, lateral whale-fin ears with cyan bows, clear sea-blue eyes, and blue twin-fluke whale tail from the reference sheet, NO maid headband, clean full-body standing visual novel sprite on pure white/transparent background. Redesign ONLY her outfit into a cozy adorable weekend aquarium-date casual look: a soft cream sailor-collar knit sweater layered under an oversized powder-blue cardigan, navy pleated skirt, a chubby cute plush blue whale crossbody pouch bag resting at her hip, white crew socks and navy Mary Jane flats, sweet gentle smile, crisp cel-shaded linework matching original art style.
  ```

---

## 3. 第一章新增 3 张场景背景（BG）生图提示词

导出规格统一为 `1920 × 1080` `.webp`，存放于 `assets/bg/`：

1. **`bg_cafeteria_day.webp`（白箱学园第一食堂 · 第二幕主场）**
   ```text
   Masterpiece anime visual novel background illustration, Kyoto Animation and Makoto Shinkai inspired clean cel-shaded architectural detail, soft natural volumetric lighting, 16:9 widescreen, no humans, nobody. Spacious bright private academy dining hall cafeteria at lunchtime, warm sunlit timber trusses and tall paned windows, neat wooden dining tables, a lively serving counter on the right with chalkboard daily specials menu, steam rising from bamboo rice steamers, one comical mysterious blueberry pie dish glowing faintly purple under a glass cloche on the counter.
   ```
2. **`bg_greenhouse_lib_day.webp`（第一温室阅览角 · 第三幕主场）**
   ```text
   Masterpiece anime visual novel background illustration, Kyoto Animation and Makoto Shinkai inspired clean cel-shaded architectural detail, soft natural volumetric lighting, 16:9 widescreen, no humans, nobody. Sunlit Victorian botanical glasshouse reading corner inside a school library, arched wrought-iron glass roof streaming warm golden afternoon sunbeams, lush potted ferns beside tall oak bookshelves, a polished wooden reading table in foreground with a botanical wooden press, fountain pen, stack of orange-gold notice cards, and a tiny cute orange felt crab pincushion on the corner.
   ```
3. **`bg_tide_cafe_sunset.webp`（海湾水族馆外步道与灯塔茶歇露台 · 第四幕周六私服约会主场）**
   ```text
   Masterpiece anime visual novel background illustration, Kyoto Animation and Makoto Shinkai inspired clean cel-shaded architectural detail, soft natural volumetric lighting, 16:9 widescreen, no humans, nobody. Scenic coastal bay promenade at golden sunset outside a modern glass-domed marine aquarium, a cozy seaside boardwalk tea stall in foreground with blue-and-white striped awning and warm fairy lights, wooden deck tables overlooking sparkling orange-gold sunset ocean waves and a distant red-and-white harbor lighthouse, romantic weekend date atmosphere.
   ```
