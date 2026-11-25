# 《私立白箱学园：今天社团也没对齐！》现有 UI/UX 审查报告与精修优化方案

> **审查范围**：基于最新实装版本（含序章～第五章、`404 放学后游乐角`、`404 无限委托`、`Kimi 的娱乐室`、`404 下午茶闲聊室`、`换装摄影棚`、剧情互动小游戏）对 `index.html`、`src/game.css`、`src/activities.css`、`src/story-games.css`、`src/arcade.css`、`src/game.js` 的全量代码审阅，并结合 **桌面端 `1440×810`** 与 **手机竖屏 `390×844`** 实机渲染巡检结果整理。

---

## 一、现状总评

### 已经非常出色的基础
1. **核心视觉识别极其成功**：奶油信纸底 (`#faf6e9`) + 学园墨绿 (`#183e38`) + 复古黄铜 (`#a48651`) + 砖红点缀 (`#a44f37`) 搭配中文字体宋体排印，形成了辨识度极高的“复古日系学园刊物 / 轻小说精装书”质感。
2. **标题页手风琴五人立绘墙 (`#accordion`) 表现惊艳**：斜切分栏 + 悬停展开 + 吐槽条 (`.quip`) + 戳一戳互动气泡 (`#poke-bubble`) 一气呵成，第一眼就有商业视觉小说水准。
3. **剧情互动组件创意与完成度高**：手机聊天 (`phone_chat`)、示波器调温 (`temp_tuner`)、碎纸机拉锯、R1 思维链修剪、游乐角 6 列 Bento 卡片布局、下午茶半身茶桌构图等都已有扎实雏形。

### 当前的核心 UI 痛点（随功能叠加产生）
随着后期陆续加入 5 大拓展系统与 7 个系统弹窗，早期为“纯阅读器 + 4 个基础菜单”设计的容器骨架已明显超载，集中暴露出三类问题：
1. **标题页入口膨胀、不对称与图标语言割裂**（1 主 + 9 二级按钮铺满左栏，最后一项落单、双列无列间距、彩色 Emoji 破坏复古烫金美学）。
2. **万能模态框 `#system` 承载过重且缺少固定顶栏/防抖滚动**（向下滚动时标题栏与关闭按钮滚出视野；原生灰粗滚动条破坏纸张质感，出现时引发页面水平抖动）。
3. **部分页面存在孤儿元素、折叠线截断与移动端裁切**（衣橱 9 人折行 `Mistral` 落单、摄影棚底部复选框被截断、娱乐室 7 音效垫 6+1 落单、自由巡礼 5 卡片留空位、竖屏 `390px` 立绘左右被裁与 `DeepSeek` 名字截成 `DeepSee`）。

---

## 二、P0 级优化：信息架构重构与全局弹窗基础体验（强烈建议优先落地）

### P0-1. 标题页左侧导航信息架构收束 & 图标风格统一
- **涉及文件**：`index.html` (L52–83)、`src/game.css` (L178–219, L1318–1331)、`src/arcade.css` (L99–103)
- **实测问题**：
  1. 桌面端 `1440×810` 下，`.cover nav` 塞入 10 个按钮（1 主按钮 + 9 个二级按钮）。改为双列后第 9 项 `☼ 学园环境设置` 单独挂在左下角形成**孤儿空洞**；
  2. 双列之间未设置 `column-gap`，且字号被压到 `0.93cqw`、`letter-spacing: 0`，导致左列末尾的 `↗` 箭头几乎紧贴右列图标，视觉粘连；
  3. `🕹️ 404 放学后游乐角`、`☕ 404 下午茶闲聊室`、`🔒` 使用了操作系统彩色立体 Emoji，与其余 7 项古典单色线框符号（`◇ ▤ ❖ ✧ ✎ ♫ ☼`）风格冲突且宽度不一，导致文字起始线不齐；
  4. 缺少 **“继续上次进度 / 快速续玩”** 入口，每次打开必须进二级读档页。

- **优化方案（推荐方案 A：枢纽化收束，彻底解决菜单膨胀）**：
  1. **将 10 个平铺按钮重构为“1 主按钮 + 1 快捷续玩（有进度时） + 4~6 项对称入口”**：
     - **主按钮**（墨绿烫金全宽）：`推开 404 大门`（若检测到本地最新存档/自动存档，右侧副标显示 `从头开始`，并在其下方或上方提供同等醒目的 **`继续调律 · 第X章`** 按钮）。
     - **整齐 2×3（6 项零孤儿，列间距 `column-gap: 1.25cqw`）** 或 **2×2（4 项 + 设置放右上角顶栏）**：
       - `章节与世界线`（`chapters`：章节目录 / 世界线流程图）
       - `读取调律记录`（`load`：6 存档槽 + 1 自动存档槽）
       - `白箱档案室`（合并原 `gallery` 与 `achievements`，弹窗顶栏 4 Tab：`原画衣橱` / `纪念 CG` / `换装摄影棚` / `荣誉成就墙`）
       - `404 社团活动室`（合并课后拓展玩法，弹窗顶栏 4 Tab：`无限委托` / `放学后游乐角` / `Kimi 娱乐室` / `下午茶闲聊室`——未通关时下午茶 Tab 带小锁徽标与解锁提示）
       - 若希望首页仍直达某高频玩法，可将 `学园环境设置` 移至顶部 `.mast` 右侧作为精致按钮（`⚙ 设置`），左侧保留 **6 项（2×3）或 8 项（2×4）严格偶数网格**，彻底杜绝孤儿行！
  2. **全站图标统一为轻量内联单色 SVG（`16×16` 细线 `stroke="currentColor" stroke-width="1.6"`）**：
     - 替换 `index.html`、`src/game.js`、`src/recreation.js`、`src/arcade-room.js` 中的 `🕹️`、`☕`、`🔒`、`📷`、`🏆` 等彩色系统 Emoji，保证跨 Windows / macOS / iOS / Android 完全一致的古典黄铜线框美学。
  3. **修复双列间距与字号**：
     - `.cover nav` 显式增加 `column-gap: 1.2cqw; row-gap: 0.15cqw;`；收束为 4~6 项后，按钮字号可恢复至舒适的 `1.05cqw`、高度 `3.1cqw`、`letter-spacing: 0.06em`，呼吸感大幅提升。

---

### P0-2. 全局 `#system` 弹窗结构升级：固定顶栏 + 内部滚动 + 消除页面抖动
- **涉及文件**：`index.html` (L108–114)、`src/game.css` (L1025–1049)
- **实测问题**：
  1. 目前滚动条挂在 `<dialog id="system">` 本体上，浏览长内容（流程图、成就墙、衣橱、摄影棚、下午茶）向下滚动时，`.dialog-head`（标题 + `×` 关闭按钮）直接滚出屏幕；
  2. 浏览器原生灰粗滚动条破坏奶油纸质感；且在下午茶点击抽签时，滚动条从无到有导致 `.tea-table` 宽度由 `674px` 骤缩至 `659px`，画面产生肉眼可见的跳动。

- **优化方案**：
  1. **Flex 纵向分离顶栏与滚动体**：
     ```css
     #system[open] {
       display: flex;
       flex-direction: column;
       overflow: hidden;
       padding: 0; /* 改由头部和正文各自管理内边距 */
     }
     #system .dialog-head {
       flex: none;
       padding: clamp(16px, 2.2vw, 26px) clamp(18px, 3vw, 36px) 0.75em;
       margin-bottom: 0;
       background: var(--paper);
       z-index: 2;
     }
     #system-body {
       flex: 1;
       min-height: 0;
       overflow-y: auto;
       scrollbar-gutter: stable;
       padding: 1em clamp(18px, 3vw, 36px) clamp(18px, 3vw, 34px);
     }
     ```
  2. **全站统一细黄铜自定义滚动条**（同步应用于 `#system-body`、`#speech`、`#note`、`.phone-stream`、`.paper`）：
     ```css
     :is(#system-body, #speech, #note, .phone-stream, .paper) {
       scrollbar-width: thin;
       scrollbar-color: color-mix(in srgb, var(--brass) 65%, transparent) transparent;
     }
     :is(#system-body, #speech, #note, .phone-stream, .paper)::-webkit-scrollbar {
       width: 6px;
       height: 6px;
     }
     :is(#system-body, #speech, #note, .phone-stream, .paper)::-webkit-scrollbar-thumb {
       background: color-mix(in srgb, var(--brass) 60%, transparent);
       border-radius: 999px;
     }
     :is(#system-body, #speech, #note, .phone-stream, .paper)::-webkit-scrollbar-track {
       background: transparent;
     }
     ```
  3. **支持点击背景遮罩 (`::backdrop`) 关闭**（在 `game.js` 监听 `#system` 点击且 `e.target === $('system')` 时调用 `closeSystem()`，同时保留内容区操作不误触）并增加轻量淡入缩放动效（尊重 `.still` 与 `prefers-reduced-motion`）。

---

## 三、P1 级优化：核心阅读器 HUD、立绘舞台与各业务弹窗精修

### P1-1. 阅读器舞台 HUD 防碰撞 & 名牌质感升级
- **涉及文件**：`src/game.css` (L539–639, L1481–1483)、`src/game.js`
- **实测问题**：
  1. 在较窄桌面视口（实测 `878px` 宽）下，`#quick` 快捷条 (`bottom: 1.2%`) 会向上顶撞 `#textbox` (`bottom: 6.5%`) 右下角发生重叠；
  2. 弹出 `#event` 遮罩 (`z-index: 5`, `backdrop-filter: blur(3px)`) 时，左上角 `#chapter` (`z-index: 2`) 被模糊压暗，但右上角 `#menu-key` (`z-index: 6`) 仍锐利浮在最上层，视觉分层不统一；
  3. `#speaker` 仅以纯文字浮于框内，未复用 5 位部员的专属符号徽记（`✦ / ☼ / ✧ / ◇ / ≈`），缺乏视觉小说标志性的“角色名牌”仪式感。

- **优化方案**：
  1. **彻底消除 `#textbox` 与 `#quick` 碰撞**：
     - 将 `#textbox` 底部上抬留足安全区（或把 `#quick` 整合进一个包裹 `#textbox` + `#quick` 的底部流式容器 `.reader-dock`，`position: absolute; left: 5.2%; right: 5.2%; bottom: 1.6%; display: flex; flex-direction: column; gap: 0.55cqw;`），保证在任何纵横比与文字行数下 `#quick` 永远紧贴 `#textbox` 下方右对齐、**绝对零重叠**！
     - 为 `#quick` 添加柔和圆角（`border-radius: 4px`）与按钮快捷键 `title` 提示（`回退 (←)`、`隐藏 (H)`、`菜单 (Esc)`）。
  2. **升级角色名牌样式**：
     - 在 `#speaker` 左侧渲染对应角色专属徽记（`member[id][3]`），并将 `#speaker` 做成带主题色左饰条/淡底色胶囊标签（旁白无说话人时自动隐藏名牌不占多余空高，让旁白文字更紧凑居中）。
  3. **统一顶栏 HUD 遮罩层级**：
     - 当 `#event:not([hidden])` 激活时，让 `#reader:has(#event:not([hidden])) #chapter` 与 `#menu-key` 保持一致视觉策略（例如 `#menu-key` 保持可点但适当降饱和度，或统一置于 `#event` 下方并在弹窗右上角按需提供操作，避免一边模糊一边锐利的割裂感）。
  4. **纯享隐藏模式 (`hidden-ui`) 轻引导**：
     - 首次按 `隐藏` 或 `H` 键隐藏 UI 时，用 `#toast` 轻量提示 1.8 秒：`已隐藏界面，点击屏幕或按 H 恢复`。

---

### P1-2. 手机竖屏 (`390×844`) 立绘裁切与标题页名字截断修复
- **涉及文件**：`src/game.css` (L1285–1371, L1669–1684)
- **实测问题**：
  1. 标题页竖屏 `#accordion` 中，5 个斜切分栏挤在 `357px` 内，`DeepSeek` 右侧被裁切成 `DeepSee`；
  2. 标题页竖屏底部第 9 个按钮与 `.cover-foot` 间距 `0px` 紧贴；
  3. 阅读器竖屏单人立绘 `.actor` (`height: 115%; width: 80%`) 内 `img` 实际宽达 `509.55px`，超出 `390px` 屏幕导致角色双马尾与手部被左右裁切。

- **优化方案**：
  1. 竖屏 `@media (max-aspect-ratio: 4/5)` 中，将 `.member-caption strong` 调整为 `font-size: clamp(10px, 2.5cqw, 14px); letter-spacing: -0.02em;`，确保 `DeepSeek`、`Gemini` 完整不裁切；
  2. 结合 P0-1 标题页入口收束后，给 `.cover-copy` 增加 `padding-bottom: 2.5cqw;`，使按钮与 `.cover-foot` 始终保留清晰留白；
  3. 竖屏阅读器将单人 `.actor` 调为 `height: 92%; top: 10%; width: 92%;`，并对 `.actor img` 设定 `max-width: 118vw; object-fit: contain; object-position: bottom center;`，让单人立绘在手机竖屏上既饱满又不切发梢与手臂（双人同屏时维持合适错位）。

---

### P1-3. 角色衣橱图鉴 & 换装摄影棚（两栏重构 + 一屏零滚动）
- **涉及文件**：`src/game.css` (L1099–1152)、`src/activities.css` (L1–23)、`src/game.js` (L1197–1269)、`src/studio.js`
- **实测问题**：
  1. **原画设定集**：9 个角色按钮换行后 `Mistral` 单独落单在第 2 行；`.plate`（`297×421px`）在宽屏弹窗里显得孤单细长、左右大量留白，同时底部被折页裁切必须滚动才能看全全身；
  2. **纪念 CG 相册**：锁定槽 `尚未解锁` 灰字对比度偏弱，卡片标题有单字孤儿换行；
  3. **换装摄影棚**：在 `1440×810` 下右侧控制栏（`507.8px`）略高于弹窗可见区，导致底部 `复古相框` 复选框被折页拦腰截断。

- **优化方案**：
  1. **原画设定集改为“左选单 + 右展示”双栏布局**（桌面端 `grid-template-columns: 240px 1fr`）：
     - 左侧分为 **“404 核心部员 (5)”** 与 **“学园特别嘉宾 (4)”** 两组紧凑角色切换按钮（彻底消灭 `Mistral` 孤儿！），下方紧跟该角色服装切换胶囊与简短设定说明；
     - 右侧在奶油画框底纹中完整居中展示 `.plate`（`max-height: min(62svh, 520px); object-fit: contain;`），一屏完整看清全身，并附清晰的 `点击放大鉴赏 🔍` 提示角标。
  2. **纪念 CG 相册精修**：
     - 卡片标题增加 `text-wrap: balance;`；未解锁卡片改用复古胶片暗格纹理 + 清晰解锁章节提示（如 `第四/五章 · GPT 线解锁`），提高可读性与收集欲。
  3. **换装摄影棚“一屏零滚动”优化**：
     - `#system.studio-open` 提升最大高度至 `max-height: 92svh`，内部 `.studio-layout` 调整为 `align-items: stretch`；
     - 精简右侧控件行距（`.studio-cast, .studio-captions { gap: 0.38em; padding-top: 0.55em; }`，并将“滤镜”与“复古相框”并排放入同一行），让 `1440×810` 下画布与全部控件**一屏完整可见、无截断**。

---

### P1-4. 其余拓展模块弹窗细节修复（成就墙 / 娱乐室 / 下午茶 / 设置）
- **涉及文件**：`src/game.css` (L487–512, L1054–1072)、`src/activities.css` (L48–110)、`src/recreation.js`、`src/tea-room.js`
- **逐项精修**：
  1. **404 荣誉成就墙**：
     - 顶部增加**可视化收集进度条**（黄铜填充条 + `已获荣誉 X / 18`）与轻量筛选胶囊（`全部` / `已达成` / `未解锁`）；
     - 未解锁成就的 `.medal-seal` 取消模糊的 `filter: grayscale(1)` Emoji，改为简洁单色轮廓封蜡图标（如未启封的 `?` 或锁纹 SVG），与已解锁的暖金流光徽章形成鲜明对比。
  2. **Kimi 的娱乐室**：
     - `.sound-board` 当前 7 个音效垫在桌面排成 6+1（`🔔 温室风铃` 孤儿），改为 `grid-template-columns: repeat(4, minmax(0, 1fr))` 并可补齐第 8 个彩蛋音效（如 `⚡ 停电跳闸` 或 `📷 快门咔嚓`）达成完美 `4×2`；
     - BGM 曲目播放中时，在 `.play-mark` 旁加轻量化动态三柱声波（纯 CSS `@keyframes`，尊重 `.still`）和显眼的 `■ 停止试听` 按钮。
  3. **404 下午茶闲聊室**：
     - 修复 `.tea-compose` 对齐偏差：将 `.tea-compose` 改为 `align-items: stretch;`，统一输入框与 `发送` 按钮高度及圆角（消除实测 `5.39px` 的高度错位）；
     - 将底部的 `下午茶模型连接设置` 折叠块收拢为顶部的紧凑状态条（如 `当前模式：离线闲聊（无需 API）` + 右侧小按钮 `连接外部模型 ⚙`），避免抽完运势签后主内容区被压出滚动条。
  4. **学园环境设置**：
     - 将 `.setting` 从 2 列（`7em 1fr`，导致 `文字速度 54 字/秒` 折成 2 行）改为 **3 列**（`grid-template-columns: 5.5em minmax(0, 1fr) 4.6em;`）：左列固定放中文项名（单行不换行），中列放滑块，右列用 `text-align: right; font-variant-numeric: tabular-nums;` 整齐显示实时数值（`55%`、`54 字/秒`、`3.0 秒`）。

---

### P1-5. 剧情互动界面精修（自由巡礼 / 校园通手机 / 章节结算页）
- **涉及文件**：`src/game.css` (L1019–1024, L1515–1618)
- **实测问题与修复**：
  1. **`free_roam_hub`（自由巡礼）**：当前 5 张地点卡放在 3 列网格中右下角空 1 格，且单字换行导致第 2 行（`80px`）比第 1 行（`67px`）高。
     - **修复**：复刻 `arcade.css` 中非常成功的 **6 列 Bento 网格**（前 3 张 `grid-column: span 2`，后 2 张 `grid-column: span 3`），加上 `align-items: stretch` 与 `text-wrap: balance;`，5 张卡严丝合缝铺满两行！
  2. **`phone_chat`（白箱校园通）**：
     - `.phone-stream` 套用细黄铜/浅绿隐形滚动条；
     - `.phone-foot button` 加 `text-wrap: pretty;`，避免末句标点（如 `——！`）单独掉到第二行；
     - 在 `.phone-head` 顶部加一行极窄的装饰状态栏（`12:04  ·  WHITEBOX 5G  ·  88%`），强化校园手机氛围。
  3. **`END CARD`（章节结算页）**：
     - 当前 5 个按钮排成 `4 + 1`（`回到标题` 落单第二行）。改为**主次分层**：推进下一章的主按钮 `.primary` 独占顶行加宽居中，其余辅助操作（换线重看 / 自由巡礼 / 存档 / 回标题）以紧凑次级按钮横向居中排在下一行。

---

## 四、P2 级优化：设计系统收口、首屏防闪烁与微交互抛光

1. **统一 Design Tokens（消除散落硬编码）**：
   - 在 `src/game.css` `:root` 中抽取公共语义变量，供 `game.css`、`activities.css`、`story-games.css`、`arcade.css` 共同引用：
     - 表面色：`--surface-card: #fffaf0;`、`--surface-muted: #f1ead6;`、`--surface-tint: #e7eddf;`
     - 圆角体系：`--radius-xs: 3px;`、`--radius-sm: 6px;`、`--radius-md: 12px;`、`--radius-pill: 999px;`
     - 阴影层级：`--shadow-soft: 0 4px 16px #183e3818;`、`--shadow-modal: 0 18px 48px #10241f40;`
     - 动效曲线：`--ease-out: cubic-bezier(0.22, 1, 0.36, 1);`
2. **标题页首屏图像防白帧**：
   - 在 `index.html` `<head>` 为 5 张首页立绘切片（`assets/holo-cards/{gpt,claude,gemini,grok,deepseek}-face.webp`）添加 `<link rel="preload" as="image" ...>`，并为 `.portrait` 添加加载后淡入（避免首次打开时个别面板短暂闪出空白渐变）。
3. **世界线流程图阅读增强**：
   - 为已探索章节汇总增加小型进度条；已解锁的 `空降` 按钮悬停时微高亮对应路径，底部增加适当 `padding-bottom: 1.5em` 避免最后一条 `第五章` 贴边被折页切半。
4. **游乐角 (`arcade.css`) 视觉统一微调**：
   - `.arc-wallet` 中的“社团币 / 称号 / 商店切换”与 `.arc-round-head` 的“得分 / 倒计时 / 连击”改用清晰的数字徽章胶囊（`background: #fffaf0; border: 1px solid var(--rule); border-radius: var(--radius-pill); padding: .2em .7em;`），提升快节奏小游戏时的余光可读性。

---

## 五、可直接复制给 Codex 的 UI 精修实施指令

> 你可以直接把下面这段提示词复制发给 Codex，按 P0 → P1 → P2 顺序一次性完成本轮 UI 精修：

```text
请严格按照 `docs/11_ui_ux_optimization_plan.md` 中的 UI/UX 优化规范，对现有游戏界面进行一轮系统化视觉与交互精修（保持现有全部剧情脚本、存档数据格式、玩法逻辑与无障碍键盘操作完全兼容）：

1. 【P0 标题页导航重构与图标统一】
   - 重构 `index.html` 与 `src/game.js` 中的标题页左栏导航：将平铺的 10 个按钮收束为干净对称的信息架构（推荐方案 A：主按钮「推开 404 大门」+ 有存档时显示快捷「继续调律」+ 2×2 整齐核心入口「章节与世界线 / 读取调律记录 / 白箱档案室 / 404 社团活动室」，将「学园环境设置」置于顶部 `.mast` 右侧或保留 2×3 偶数布局，彻底消除孤儿按钮与列粘连）。
   - 若将拓展玩法合并进「白箱档案室」（Tab：原画衣橱 / 纪念 CG / 换装摄影棚 / 荣誉成就墙）与「404 社团活动室」（Tab：无限委托 / 放学后游乐角 / Kimi 娱乐室 / 下午茶闲聊室），请确保各自原有的状态刷新、解锁判断（下午茶锁标）和 `leaveActivity` 清理回调完整保留。
   - 将标题页与弹窗入口中的彩色系统 Emoji（🕹️ / ☕ / 🔒 / 📷 / 🏆）统一替换为风格一致的单色细线内联 SVG（继承 `currentColor`）。
   - 在 `index.html` `<head>` 为 5 张首页 `assets/holo-cards/*-face.webp` 添加 preload 并加上轻量加载淡入，消除首帧空白。

2. 【P0 全局 `#system` 弹窗与滚动条体验升级】
   - 将 `#system[open]` 改为 flex 纵向布局，固定 `.dialog-head` 在顶部，只让 `#system-body` 内部滚动，并加上 `scrollbar-gutter: stable` 彻底消除切换内容或抽运势签时的水平宽度抖动。
   - 为 `#system-body`、`#speech`、`#note`、`.phone-stream`、`.paper` 统一配置细黄铜风格自定义滚动条；支持点击遮罩背景安全关闭 `#system`。

3. 【P1 阅读器 HUD 与移动端适配修复】
   - 重构 `#textbox` 与 `#quick` 的底部停靠容器（`.reader-dock`），确保任何视口宽度/文本高度下 `#quick` 永不与 `#textbox` 右下角重叠；为 `#speaker` 增加对应角色专属徽记符号与轻复古名牌视觉，旁白时自动隐藏名牌。
   - 统一 `#event` 遮罩弹出时 `#chapter` 与 `#menu-key` 的视觉层级，避免一边模糊一边锐利。
   - 修复手机竖屏（390×844）下：标题页 `#accordion` 中 `DeepSeek` 文字右侧裁切问题，以及阅读器单人立绘过宽导致发梢/手臂左右出框的问题。

4. 【P1 各功能弹窗与互动组件精修】
   - 衣橱「原画设定集」改为桌面端双栏布局（左侧分「404 核心部员 5 人 / 学园嘉宾 4 人」+ 服装切换，右侧一屏完整展示立绘不产生垂直滚动，彻底消除 Mistral 孤儿与左右大留白）。
   - 「换装摄影棚」微调右侧控件排布与间距，确保 `1440×810` 下一屏完整可见，底部「复古相框」不再被截断。
   - 「荣誉成就墙」顶部增加可视化收集进度条与筛选（全部/已达成/未解锁），未解锁徽章改用清晰单色轮廓封蜡风格。
   - 「Kimi 娱乐室」音效垫改为 4 列网格（可补齐至 8 个音效pad实现 4×2 完美对称），BGM 播放中增加轻量声波动画与停止按钮。
   - 「下午茶闲聊室」统一 `.tea-compose` 输入框与发送按钮高度（`align-items: stretch`）消除 5px 错位，将模型连接配置收拢为顶部状态条按钮。
   - 「学园环境设置」将 `.setting` 改为 3 列网格（标签 / 滑块 / 右对齐数值），修复 `文字速度 54 字/秒` 意外换行。
   - 「自由巡礼 (`free_roam_hub`)」改为 6 列 Bento 布局（上 3 下 2）消除 5 卡空洞与行高差；「校园通手机」增加极简顶部状态栏与 `text-wrap: pretty`；「章节结算页」将下一章主按钮独占顶行突出显示。

5. 【P2 统一 Design Tokens 与实机自检】
   - 在 `src/game.css` `:root` 整理统一的颜色/圆角/阴影变量并复用到各 CSS 模块。
   - 完成后请在桌面 `1440×810`、窄桌面 `900×700` 与手机竖屏 `390×844` 下自检所有弹窗与阅读器零重叠、零横向溢出、零孤儿截断，并确认 `prefers-reduced-motion` 和存档读写全部正常。
```
