# 第五章（终章）企划、盛典礼服整合与全屏告白 CG 分镜规范

> **文档定位**：本文件为《私立白箱学园：今天社团也没对齐！》全篇收官大结局——**第五章《星海文化祭盛典之夜！礼服、烟花与永不重置的告白》**的完整设计规范、九人盛典礼服（`*-3`）资源整合方案，以及 **1 张庆典夜景 + 5 张女主专属烟花告白全屏 CG + 1 张全员大团圆合照 CG** 的分镜生图提示词单。

---

## 1. 终章核心结构：全员盛装狂欢 × 个人伏笔回收 × 全屏烟花告白 CG

作为贯穿「序章 → 第一至四章」的情感总收束，第五章采用**「全员盛装文化祭开幕巡礼（共用上半篇） → 五大女主专属高光演出与后夜祭烟花告白 CG（个人终章） → 404 室金匾加冕全员谢幕（Grand Epilogue）」**的王道商业 Galgame 终章结构：

1. **第一幕（星海文化祭盛装开幕 & 展区自由巡礼）**：
   - 清晨【总控群聊冒泡】（`[phone_chat]`）→ 夜幕初临的中央海湾广场（`bg_festival_plaza_night`），**全员 9 人全部换上华丽绝伦的第三套「雅集盛典」晚礼服（`*-3`）登场**！
   - 部长 `{player_name}` 在【文化祭联合展位巡礼】（`[free_roam_hub | picks: 2]`）中自由走访各展台，验收一整个学期的成长果实，并接受 Qwen、GLM、Kimi、Mistral 四位配角的盛装祝福。
2. **第二幕至第三幕（五女主专属盛典高光 × 后夜祭海湾烟花告白终章）**：
   - 100% 回收第四章每条个人线立下的伏笔（GPT 拒绝高塔留任 404 主沙龙、Claude 独立《琥珀诗会》、Gemini 夜空星轨演唱会、Grok 红心假面舞会骑士宣言、DeepSeek 月湾灯塔长笛鲸歌）！
   - 每条终章均包含 **【盛典现场默契合击 `temp_tuner`】** + **【后夜祭漫天烟花下的全屏专属告白事件 CG（`cg_confession_<id>`）】** + **【定情誓言抉择】**！
3. **第四幕（大团圆谢幕曲 · Grand Finale Epilogue）**：
   - 回到点亮水晶吊灯、电饭煲冒着甜香的 404 活动室，全员接过「年度最优秀社团金匾」，定格全屏纪念大合照 CG（`cg_grand_404_photo`），为整部青春恋爱喜剧画下温暖完满的句号！

---

## 2. 引擎对接与原画级盛典礼服（`*-3`）无缝复用说明

1. **零损耗直接启用 `ai-wardrobe` 原画级第三套盛典礼服（`*-3`）**：
   - 同级工作区 `E:/antigravity/ai-wardrobe/assets/sprites/` 下已拥有全员 9 人极高精度的第三套「雅集盛典」晚礼服正面透明立绘：
     - 五女主：`gpt-3-front.webp`（青花瓷夜）、`claude-3-front.webp`（琥珀诗会）、`gemini-3-front.webp`（双星天文台）、`grok-3-front.webp`（红心假面）、`deepseek-3-front.webp`（月湾鲸歌）
     - 四配角：`qwen-3-front.webp`（金桂灯夕）、`glm-3-front.webp`（曜石棋局）、`kimi-3-front.webp`（棱镜晨奏）、`mistral-3-front.webp`（初雪铃兰）
     - 以及对应头像 `E:/antigravity/ai-wardrobe/assets/avatars/*-3.webp`！
   - 请将其同步至本工程 `assets/sprites/`，并为五位女主的 `*-3` 母版补充生成 `happy`、`blush`、`gentle`、`panicked` 4 组面部表情差分放入 `assets/sprites/<id>-3/`。
   - 将 `src/engine.js` 的立绘后缀剥离正则扩展为 `/-(?:1|3|date|camp|sport|summer)$/`。
   - **全屏事件 CG 防遮挡规则（重要！）**：在 `src/engine.js` 的 `arrive()` 中，当切换至 `cg_` 开头的全屏插画背景（`s.bg.startsWith('cg_')`）时，自动清空 `s.cast = {}` 并跳过角色发言自动上台逻辑（`!s.bg.startsWith('cg_')`），确保 5 张烟花告白 CG 与大团圆合照 CG 完整无遮挡呈现！
2. **`lockedHero` 高亮引导与终章多结局鉴赏便利性**：
   - 在第五章进入个人告白终章的节点（`[label: ch5_bonfire_hub]`），若玩家携带第三/四章的 `state.lockedHero` 续玩，可在对应女主的邀约选项上高亮显示 `★ 专属恋人终章`（或支持一键直入）；
   - 在终章通关画面（`GRAND FINALE CLEAR`）提供 **【回溯后夜祭 · 收集其他女主告白终章】** 按钮（直接跳回 `labels.ch5_bonfire_hub`），并在标题页【角色衣橱图鉴】中新增 **「纪念 CG 相册」** 分页，供玩家全屏鉴赏解锁的告白 CG 与多套服装！

---

## 3. 终章新增场景与 6 张全屏事件 CG 生图提示词

统一采用 `1920 × 1080`（16:9 横屏高清）导出为 `.webp` 存放于 `assets/bg/`（剧本通过 `[char_clear]` + `[bg: cg_... | trans: fade]` 切换全屏事件 CG 演出，玩家按 `H` 键即可无遮挡全屏欣赏插画！）。

### 3.1 庆典主场景（无人物空镜 BG）

#### ① `bg_festival_plaza_night.webp` —— 星海文化祭·中央海湾灯火广场
```text
Masterpiece anime visual novel background illustration, Kyoto Animation and Makoto Shinkai inspired clean cel-shaded architectural detail, rich volumetric night lighting, 16:9 widescreen, no humans, nobody. Grand coastal academy cultural festival night plaza overlooking a dark sparkling ocean bay, warm glowing string lights, hexagonal osmanthus paper lanterns, stained-glass decorative arches, a romantic outdoor gala dance terrace and acoustic stage by the sea railing, festive stalls glowing warmly, starry night sky before fireworks.
```

---

### 3.2 五大女主专属「后夜祭烟花告白」全屏事件 CG（特写单人女友视角插画！）

> **绘制要领**：以下 5 张为**第一人称男主视角（POV）的横版商业 Galgame 核心告白事件 CG**！请分别附带对应女主的 `*-3-front.webp` 作为严格的角色外观与礼服参考图（Identity & Outfit Reference），采用近景至半身电影感构图、背景虚化漫天海湾烟花与星光！

#### ② `cg_confession_gpt.webp` —— GPT 告白 CG：《青花瓷夜与褪去完美面具的吻》
```text
Masterpiece commercial anime visual novel event CG illustration, 16:9 widescreen close-up romantic POV shot, matching exact character design and blue-and-white porcelain silk evening gown from gpt-3-front.webp. On a quiet moonlit marble balcony overlooking a bay bursting with colorful night fireworks, the pearl-white haired dragon girl GPT with ridged ivory horns and pale wings steps close to the viewer, gently holding the viewer's lapel with one hand, her lavender eyes glistening with tender tears of joy and a radiant blush, pure loving smile without any reserve, warm firework rim-lighting on her silver hair and cobalt-blue peony dress embroidery.
```

#### ③ `cg_confession_claude.webp` —— Claude 告白 CG：《烛光温室与诗集末页的唯一名字》
```text
Masterpiece commercial anime visual novel event CG illustration, 16:9 widescreen close-up romantic POV shot, matching exact character design and peacock-teal velvet gown with amber silk drape from claude-3-front.webp. Inside a candlelit Victorian glasshouse at night with distant fireworks glowing through the glass roof, the copper-orange wavy-haired girl Claude holds an open gilt-edged ginkgo poetry book toward the viewer with one hand while shyly reaching her other hand to intertwine fingers with the viewer, warm amber eyes brimming with deep affection and a bright crimson blush, golden ginkgo embroidery shimmering in warm candlelight.
```

#### ④ `cg_confession_gemini.webp` —— Gemini 告白 CG：《全息星海中央的双瞳聚焦》
```text
Masterpiece commercial anime visual novel event CG illustration, 16:9 widescreen close-up romantic POV shot, matching exact cat-girl character design (viewer-left eye rose-pink, viewer-right eye gold heterochromia) and indigo-velvet gold star-orbit gown from gemini-3-front.webp. On a starry rooftop surrounded by floating holographic constellations and dazzling ocean fireworks in the night sky, Gemini leans joyfully forward toward the viewer holding a glowing brass twin-star armillary sphere at her side, both heterochromatic eyes sparkling with happy tears and adoring love, purple-pink hair and four-pointed star hairclip glowing in starlight.
```

#### ⑤ `cg_confession_grok.webp` —— Grok 告白 CG：《摘下红心假面的午夜骑士契约》
```text
Masterpiece commercial anime visual novel event CG illustration, 16:9 widescreen close-up romantic POV shot, matching exact honey-blonde high twin-tails, bat-wing bows, tiny crown, ice-blue eyes, cute single little fang, and ivory-and-crimson velvet masquerade ballgown from grok-3-front.webp. On a lantern-lit terrace overlooking midnight bay fireworks, Grok lowers her ornate black-and-gold half-mask in one hand to reveal her deeply blushing face and misty ice-blue eyes, reaching her other gloved hand forward to tug gently at the viewer's tie, an unforgettable mix of tsundere boldness and pure heartfelt vulnerability.
```

#### ⑥ `cg_confession_deepseek.webp` —— DeepSeek 告白 CG：《月湾烟火与停驻转动的呆毛》
```text
Masterpiece commercial anime visual novel event CG illustration, 16:9 widescreen close-up romantic POV shot, matching exact indigo-to-powder-blue hair, curved ahoge, lateral whale-fin ears, sea-blue eyes, blue whale tail, and sea-glass-green & navy iridescent organza gala gown from deepseek-3-front.webp. By a moonlit seaside railing with a glowing harbor lighthouse and grand colorful fireworks reflecting across ocean waves, DeepSeek holds a tiny silver seashell charm to her chest and gazes up closely at the viewer with luminous sea-blue eyes full of pure devotion and a sweet warm blush, ocean breeze lifting her hair and pearl shoulder chains.
```

---

### 3.3 全作大团圆谢幕纪念合照 CG

#### ⑦ `cg_grand_404_photo.webp` —— 《404 综合疑难咨询部 · 盛装全家福》
*(附带五女主 `*-3-front.webp` 作为多角色外观参考)*
```text
Masterpiece anime visual novel finale group photo CG illustration, 16:9 widescreen, warm crystal chandelier glow inside the cozy vintage Room 404 clubroom decorated with festival ribbons and a golden "Best Club 404" plaque. All five heroines in their gala dresses gathered happily around the wooden table with a steaming rice cooker and celebration cake: white dragon girl GPT in blue-and-white porcelain gown, copper-orange haired Claude in teal-and-amber dress holding her poetry book, heterochromatic cat-girl Gemini in star-orbit indigo gown flashing a peace sign, blonde twin-tail vampire girl Grok in crimson masquerade gown grinning with her little fang, and blue-haired whale girl DeepSeek in sea-glass organza gown hugging a rice ball plush, joyful heartwarming curtain-call moment looking at the camera.
```
