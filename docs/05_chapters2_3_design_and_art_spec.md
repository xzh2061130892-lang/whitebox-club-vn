# 第二章与第三章企划、系统衔接与全新衣装/场景美术规范

> **文档定位**：本文件为《私立白箱学园：今天社团也没对齐！》共通线中后段高潮——**第二章《海风合宿与大停电之夜！》**与**第三章《春季运动祭与心意锁定！》**的完整企划、引擎衔接规范及新增美术提示词单，供 Codex 直接对接实装。

---

## 1. 二、三章整体叙事弧光与高密度交互设计

承接序章（初识立人设）与第一章（日常委托 + 周末私服初约会），第二、三章将角色关系从“欢脱社团同伴”推向**“脸红心跳的亲密拉扯与个人恋爱线正式分流”**：

### 1.1 第二章：《海风合宿与大停电之夜！谁溜进了部长的房间？》
- **核心危机**：期中摸底联考来袭！教导处警告：特优生社团若有一门副科不及格则冻结经费。偏偏五位部员严重偏科（DeepSeek 现代文阅读总去挑作者语病、Gemini 检查卷子强迫症发作会把整张答题卡擦破、Grok 校规题全写阴阳怪气锐评、GPT 帮全年级十七个人押题过劳导致背书串台、Claude 一到下午考场就困倦限流）。财务长 Qwen 批下临海半山腰的**「海景研修木屋」**，由部长 `{player_name}` 带队开启两天一夜封闭合宿！
- **交互节奏（全程高密度操作）**：
  1. **第一幕 · 合宿木屋开箱与【考前一对一弱科特训】（`[free_roam_hub | picks: 2]`）**：检查离谱行李 + 玩家任选 2 位部员贴身押题辅导（按住 Gemini 狂擦卷子的手、替迷糊串台的 GPT 额头测温、督促 DeepSeek 戒断饭团外包、陪 Claude 克服午后瞌睡、教 Grok 正经答题话术）。
  2. **第二幕 · 露天厨房野炊大混战（`[dispatch_board]` + 秘料抉择）**：Mistral 送来新鲜食材，部长指派双人掌勺搭档熬制合宿咖喱，并亲自拍板投入灵魂秘料。
  3. **第三幕 · 暴雨跳闸大停电！【黑夜壮胆调温器】（`[temp_tuner | actor: grok]`）+【熄灯被窝悄悄话】（`[phone_chat]`）**：春雷暴雨导致木屋停电，怕打雷却死鸭子嘴硬的 Grok 非要讲怪谈壮胆，由玩家拨动温度滑块控场（`T=1.6` 触发把她自己吓进部长怀里的爆笑回退彩蛋）；深夜十一点半熄灯后，手机群与私聊亮起，玩家亲自决定今晚为谁留门夜谈！
  4. **第四幕 · 深夜敲门声！【合宿居家睡衣与散发限定 `*-camp`】五女主独立夜话长支线**：换上柔软睡衣、卸下平日发饰散开长发的她抱枕头溜进房间/露台，展开高甜屋檐听雨独处对手戏。

### 1.2 第三章：《春季运动祭与心意锁定！只为你一个人的应援》
- **核心高潮（共通线收束章）**：白箱学园一年一度的「春季趣味竞技游园祭」开幕！一等奖不仅是免除整学年社团考核的金牌，还有让 DeepSeek 两眼放光的“食堂全年免费加饭金卡”。404 室全员换上青春洋溢的 **【春日轻运动应援装 `*-sport`】** 出战！
- **交互节奏（全程高密度操作）**：
  1. **第一幕 · 赛前检录群聊冒泡（`[phone_chat]`）+ 赛前热身区自由串门（`[free_roam_hub | picks: 2]`）**：帮拉不开体操服拉链/系鞋带/涂防晒霜的少女们做赛前准备。
  2. **第二幕 · 广播台实况解说暴走！（`[temp_tuner | actor: gemini]`）+ 趣味三人四足派单（`[dispatch_board]`）**：Gemini 担任特邀解说，玩家用温度调谐器控制她的解说台风（`T=1.6` 把普通拔河解说成星际毁灭战笑翻全场）；随后指派两组部员出战障碍赛，GLM 与 Kimi 悉数登场互动。
  3. **第三幕 · 压轴决胜：部长亲征「双人借物冲刺赛」连续抉择**：`{player_name}` 亲自下场跑最后一棒，抽中全校瞩目的神秘借物题卡**『请牵起全场最让你放心不下、也最想并肩走下去的那个人冲过终点！』**——玩家在万众欢呼中做出抉择！
  4. **第四幕 · 黄昏星象天台：庆功烟花与【个人恋爱线正式锁定（Route Lock）】**：夕阳染红双星天台，你与选定的她独处吹风，回顾从推开 404 大门至今的点点滴滴，交换专属信物，正式确立进入她的**个人恋爱篇章**！

---

## 2. 引擎扩展与上一轮小细节顺手完善说明（供 Codex 对接）

1. **编译器与章节注册扩展**：
   - 在 `tools/compile.mjs` 的 `chapters` 数组中新增：
     - `['02_chapter2_full_script.md', 'chapter2.js', 'WHITEBOX_CHAPTER2']`
     - `['03_chapter3_full_script.md', 'chapter3.js', 'WHITEBOX_CHAPTER3']`
   - 在 `index.html` 引入 `src/chapter2.js` 与 `src/chapter3.js`，并在 `src/engine.js` 的 `stories` 注册 `chapter2` 与 `chapter3`。
   - 将 `src/engine.js` 第 79 行的立绘后缀剥离正则从 `/-(?:1|date)$/` 扩展为 `/-(?:1|date|camp|sport)$/`，即可原生支持第二章睡衣（`-camp`）与第三章运动服（`-sport`）及未生成时的自动回退！
2. **章节串联与第三章「高好感心意提示」**：
   - 第一章结算卡新增主按钮 **【进入第二章：海风合宿与停电夜 →】**；第二章结算卡新增主按钮 **【进入第三章：春季运动祭与心意锁定 →】**（均完整继承 `state.names` 与累计 `state.affection`）；标题界面【章节选择】同步列出序章至第三章。
   - **好感度引导增强**：在第三章第三幕终极借物选人（`choice_start: 终极借物卡`）渲染选项按钮时，若某选项跳转的角色正是当前 `state.affection` 累计最高者（或并列最高），可在该选项右侧自动附带一枚暖金色小徽章 `★ 心意共鸣最高`，既尊重玩家自由选择权，又让前三章积攒的好感度获得满满正反馈！
3. **顺手完善第一章实测发现的 2 个微瑕**：
   - 补生成漏掉的一张 `assets/sprites/grok-date/panicked.webp`；
   - 微调 `src/game.css` 中 `.school-phone` 的高度或压缩底部 `.reply` 按钮内边距，确保手机群聊弹出 3 个回复选项时，上方聊天记录区仍能清晰显示至少 3～4 条消息。

---

## 3. 新增 4 张场景背景（BG）生图提示词

统一采用 `1920 × 1080` `.webp` 放入 `assets/bg/`，保持与前作一致的新海诚/京都动画清透光影：

```text
[Style Prefix]: Masterpiece anime visual novel background illustration, Kyoto Animation and Makoto Shinkai inspired clean cel-shaded architectural detail, soft natural volumetric lighting, gentle warm highlights, crisp linework, rich lived-in props, 16:9 widescreen, no humans, nobody.
```

1. **`bg_camp_lodge_day.webp`（临海半山合宿木屋客厅 · 第二章一、二幕）**
   ```text
   [Style Prefix] Cozy two-story coastal wooden study camp lodge living room in bright sunny daytime, warm cedar wood walls and loft stairs, wide glass sliding doors opening onto a sunny wooden deck overlooking a sparkling blue ocean bay, a large low wooden study table in the center scattered with notebooks and textbooks, a small open kitchen counter in back with a steaming curry pot and rice cooker, cheerful high school training camp atmosphere.
   ```
2. **`bg_camp_lodge_night.webp`（暴雨停电的烛光木屋客厅 · 第二章三、四幕）**
   ```text
   Same exact wooden lodge living room layout and camera angle as bg_camp_lodge_day, transformed into a cozy rainy night blackout scene. Raindrops streaking down the dark blue glass doors with distant sea mist, power out with electric ceiling lights off, illuminated warmly by a crackling stone fireplace and several flickering glass jar candles and a small camping lantern on the low wooden table, intimate warm amber shadows, romantic mystery night vibe, no humans.
   ```
3. **`bg_sports_field_day.webp`（白箱学园春季运动祭操场 · 第三章一至三幕）**
   ```text
   [Style Prefix] Vibrant private academy sports festival track and green turf field under a crisp blue spring sky with fluffy white clouds, colorful triangular bunting flags strung across the sky, white-tented club cheer booths and scoreboard along the sideline, chalk-lined running track in foreground, cherry blossom trees and European school clocktower in background, energetic youth festival atmosphere.
   ```
4. **`bg_twinstar_roof_sunset.webp`（黄昏星象天台与彩灯舞台 · 第三章第四幕个人线锁定圣地）**
   ```text
   [Style Prefix] Romantic academy rooftop at breathtaking golden-violet twilight sunset, split between a cozy wooden stargazing platform with a vintage brass armillary sphere and telescope on the right, and a charming string-lit mini acoustic stage decorated with glowing four-pointed star fairy lights on the left, overlooking a panoramic sunset ocean bay and distant festival fireworks glow, unforgettable confession atmosphere.
   ```

---

## 4. 第二章全新服装：【微醺月色 · 合宿居家睡衣系列（`*-camp`）】

专为第二章第四幕深夜独处设计，突出**“卸下防备、松散长发、毛茸茸居家反差萌”**（每套生成 `-front.webp` 即 `normal` + `happy`、`blush`、`gentle`、`panicked` 差分）：

1. **`gpt-camp`（丁香丝缎吊带睡裙配软绒开衫）**
   ```text
   Keep exact same anime dragon-girl identity, lavender eyes, pearl-white hair worn completely loose and soft, ivory horns, small pale wings and white-scaled tail from gpt-1-front.webp, full-body standing sprite on pure white/transparent background. Outfit: cozy elegant pajama set featuring a pastel lilac silk camisole nightdress under a fluffy cream-white oversized knit loungewear robe slipping slightly off one shoulder, cute plush white slippers, holding a warm ceramic mug of milk, soft sleepy affectionate blush.
   ```
2. **`claude-camp`（暖杏纯棉格子衬衫式睡裙与披肩散落长发）**
   ```text
   Keep exact same anime scholar-girl identity, warm amber eyes, copper-orange long wavy hair fully untied and flowing loosely over shoulders without formal ribbons, full-body standing sprite on pure white/transparent background. Outfit: modest cute apricot-and-cream soft flannel button-down pajama dress with delicate lace trim, hugging a small round orange crab plush pillow to her chest, warm cream fuzzy socks, shy flustered bedtime expression.
   ```
3. **`gemini-camp`（星空宽松大T恤睡裙配毛绒猫爪拖鞋）**
   ```text
   Keep exact same anime cat-girl identity, left eye rose-pink and right eye gold heterochromia, blue-purple-pink long hair down in loose wavy twin low pigtails, cat ears and fluffy purple-tipped tail, full-body standing sprite on pure white/transparent background. Outfit: playful oversized pastel navy sleep-shirt printed with glowing yellow stars reaching mid-thigh, cozy lavender thigh-high loungewear socks and fluffy cat-paw slippers, sleepy cute smile rubbing one eye.
   ```
4. **`grok-camp`（放下双马尾散落金发！黑红小恶魔连帽短绒睡衣）**
   ```text
   Keep exact same anime vampire-girl identity, ice-blue eyes, pointed ears, cute single little fang, honey-blonde long wavy hair COMPLETELY UNTIED and cascading down (hair-down gap moe, small black ribbon hairclip on side), NO axe, full-body standing sprite on pure white/transparent background. Outfit: cute cozy cropped black-and-crimson velour pajama hoodie with tiny bat-wing hood trim and matching lounge shorts, knee-high striped sleep socks, clutching a flashlight shyly, embarrassed blush.
   ```
5. **`deepseek-camp`（圆滚滚小蓝鲸兜帽珊瑚绒连体睡衣裙）**
   ```text
   Keep exact same anime whale-girl identity, indigo-to-powder-blue hair, curved ahoge, lateral whale-fin ears, sea-blue eyes, and blue whale tail, full-body standing sprite on pure white/transparent background. Outfit: ultra-adorable pastel sky-blue fluffy fleece oversized whale-hoodie pajama dress with a white belly pocket and cute little whale eyes on the hood resting behind her neck, soft white sleep socks, sleepy innocent smile.
   ```

---

## 5. 第三章全新服装：【晴空跃动 · 春日运动应援系列（`*-sport`）】

专为第三章春季竞技祭设计，突出**“青春元气、轻盈运动线条与专属代表色”**（每套生成 `-front.webp` + `happy`、`blush`、`panicked`、`gentle` 差分）：

1. **`gpt-sport`（白紫学院网球风运动Polo短裙与运动发带）**
   ```text
   Keep exact same anime dragon-girl identity, lavender eyes, pearl-white hair tied in a bouncy high ponytail, ivory horns, small wings and white-scaled tail, full-body standing sprite on pure white/transparent background. Outfit: crisp white-and-lavender athletic pleated tennis dress with silver-purple trim, lilac sweatband on wrist, sporty white sneakers with ankle socks, holding a megaphone cheer cone, bright encouraging smile.
   ```
2. **`claude-sport`（暖橘白撞色学院运动外套配体操短裤裙）**
   ```text
   Keep exact same anime girl identity, amber eyes, copper-orange long hair tied in a neat active side braid with sunburst hair tie, full-body standing sprite on pure white/transparent background. Outfit: clean cream-and-terracotta-orange zip-up school track jacket worn open over a white athletic tank and pleated navy track skort, holding a wooden clipboard and stopwatch, slightly breathless cute blush.
   ```
3. **`gemini-sport`（星紫粉啦啦队露腰运动背心裙与花球）**
   ```text
   Keep exact same anime cat-girl identity, left eye rose-pink and right eye gold heterochromia, periwinkle-pink twin buns, cat ears and tail, full-body standing sprite on pure white/transparent background. Outfit: energetic purple-and-white varsity cheerleader crop top with a gold four-pointed star emblem, matching pleated cheer miniskirt, striped athletic knee socks, holding sparkly pastel pom-poms, dazzling energetic grin.
   ```
4. **`grok-sport`（黑红酷飒无袖篮球风运动球衣配护腕）**
   ```text
   Keep exact same anime girl identity, honey-blonde high twin-tails with black ribbons, ice-blue eyes, pointed ears and single little fang, NO axe, full-body standing sprite on pure white/transparent background. Outfit: sporty black-and-crimson numbered "404" sleeveless varsity jersey layered over a fitted black athletic crop tee, dark sporty shorts, black wristbands and red-and-black high-top sneakers, confident competitive smirk.
   ```
5. **`deepseek-sport`（海蓝白水手风体操服外套配红色胜利头带）**
   ```text
   Keep exact same anime whale-girl identity, blue gradient hair, curved ahoge, whale-fin ears, sea-blue eyes and blue whale tail, full-body standing sprite on pure white/transparent background. Outfit: classic cute Japanese school navy-and-white athletic track jacket (jersey) half-zipped over a white gym shirt and navy bloomers/shorts, a cute white hachimaki headband tied neatly below her ahoge, white sneakers, determined adorable expression.
   ```
