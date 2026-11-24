# 《私立白箱学园：今天社团也没对齐！》项目企划与剧本交接库（Codex 开发入口）

本目录为轻校园恋爱喜剧视觉小说（Galgame）**《私立白箱学园：今天社团也没对齐！》**（*Misaligned Club! ~Five Problematic AI Girls in Room 404~*）的首期垂直切片（**开场演出 + 自定义起名 + 序章全三幕**）完整创作与规格文档库。

## 开始游戏

**[在线试玩《私立白箱学园》](https://2008ccy.github.io/whitebox-club-vn/)**

下载或克隆整个仓库，用现代浏览器打开根目录的 [index.html](./index.html)，点击 **推开 404 大门**。游戏资源和剧本均已随仓库提供，可离线游玩。若需通过本地服务器运行，在仓库根目录执行 `python3 -m http.server 8000 --bind 127.0.0.1`，然后访问 `http://127.0.0.1:8000`。

- **阅读**　点击对白或按空格、回车、→ 继续。开场五声蒙太奇默认约 45 秒，可点击加速。左箭头回退，H 隐藏界面，Esc 打开游戏菜单。对白上的便利贴可点击展开。
- **登记与存档**　姓和名各限四字，单栏可作昵称。六个本地记录槽保存姓名、当前场景、选择、好感度与回退记录。读档请使用同一浏览器和相同游戏地址。
- **派单**　选定两位搭档并盖章，进入该组专属调查。通关后可从结算页直接回到派单板重选，重新计算该路线的好感度。
- **立绘与背景**　当前发行版以随附的九人高清设定册还原角色，包含八位登场角色的透明母版、头像与局部脸部差分，图鉴收录九人。六张 1920 × 1080 WebP 背景随包提供，404 活动室的夕照图以昼景为底图重绘。音乐与音效由 Web Audio 在本地合成。

### 修改剧本后

[Markdown 剧本](./docs/scripts/00_prologue_full_script.md) 是正文来源。使用 Node.js 20 或更高版本从仓库根目录执行以下命令。编译产物随仓库提交，直接游玩时无需 Node.js。

```sh
node tools/compile.mjs
node tools/compile.mjs --check
node --test tests/prologue.test.mjs
```

编译器保留选择、派单目标、内心草稿和舞台指令，遇到未知指令或无效跳转会报错。剧本内容改变后会使用新的版本标记；旧版存档在槽位中标为版本不匹配。

---

## 📂 目录结构与必读索引

请 **Codex** 在开始编写前端引擎、UI 组件及生图/立绘差分脚本前，按以下顺序阅读文档：

1. **[docs/01_master_design_bible.md](./docs/01_master_design_bible.md)**  
   - **总企划与角色圣经**：包含世界观、五位 AI 娘女主（GPT、Claude、Gemini、Grok、DeepSeek）与三位序章配角（GLM、Qwen、Kimi）的性格设定、代表主题色、自定义姓名变量（`{player_name}` / `{last_name}` / `{first_name}`）称呼映射表，以及指向 `../ai-wardrobe/assets/` 现有高清立绘/头像的精确路径表。
2. **[docs/02_opening_and_ui_ux_spec.md](./docs/02_opening_and_ui_ux_spec.md)**  
   - **开场流程与特色喜剧 UI 规范**：定义五竖屏手风琴标题页（Title Screen）、开场 45 秒冷启动蒙太奇、拟物化《社团责任人登记卡》起名弹窗、动态主题色对话框，以及四大核心喜剧组件（`脑内草稿 OS / DeepSeek 呆毛旋转深度思考条`、`Claude 停权黄牌印章`、`Gemini 破防碎纸机拦截弹窗`、`双人委托派单板`）。
3. **[docs/03_art_bg_and_expression_prompts.md](./docs/03_art_bg_and_expression_prompts.md)**  
   - **序章美术生图与立绘差分提示词单**：包含序章所需的全部 **6 张 16:9 场景背景图（BG）** 详细英文 Prompt，以及基于 `../ai-wardrobe/assets/sprites/<id>-1-front.webp` 母版立绘保持姿态不变进行面部局部重绘的表情差分矩阵（注意严格遵守 Gemini 左粉右金异瞳、Grok 单颗小尖牙等视觉铁律）。
4. **[docs/scripts/script_schema_spec.md](./docs/scripts/script_schema_spec.md)**  
   - **剧本解析语法规范**：定义 `.md` 剧本中 `[bg]`、`[char]`、`[tween]`、`> 💡【脑内草稿 OS】`、分支选项与派单跳转标签的解析规则及目标 JSON 数据结构。
5. **[docs/scripts/00_prologue_full_script.md](./docs/scripts/00_prologue_full_script.md)**  
   - **开场与序章全三幕定稿剧本**：可直接编译运行的完整试玩版剧本文案（涵盖楔子、起名登记、第一幕五女主集结、第二幕风纪突检与紫藤茶寮谈判、第三幕三路双人搭档破案分支及夕阳尾声互动）。

---

## 🚀 推荐 Codex 开发执行顺序（MVP 路线）

1. **阶段 A · 资源挂载与工程初始化**
   - 直接引用或映射同级目录 `../ai-wardrobe/assets/` 下的 `sprites/*-1-front.webp`、`avatars/*-1.webp` 与 `holo-cards/*-face.webp`。
   - 实现立绘加载器的平滑回退机制：当 `assets/sprites/<id>-1/<exp>.webp` 尚未生成时，自动回退显示母版 `*-1-front.webp` 并叠加轻量 CSS 情绪动态（`jump` / `shake` / `sink`）与角标，保证代码层面先行跑通。
2. **阶段 B · 剧本编译器与核心阅读器搭建**
   - 根据 `script_schema_spec.md` 编写解析器加载 `00_prologue_full_script.md`。
   - 实装标题界面、学生证自由起名器（支持 `{player_name}` 全局插值与存档持久化）、对话历史回看（Backlog）、快进/自动播放与本地存档槽。
3. **阶段 C · 四大轻喜剧特色演出组件实装**
   - 实装 `inner_os` 涂改便利贴与 `[tag: cot_spinning]` DeepSeek 深度思考折叠框、`[tag: suspended_card]` 黄牌动效、`[tag: delete_panic]` 护稿交互按钮，以及序章第三幕 `[dispatch_board]` 双人派单面板。
4. **阶段 D · 序章 6 张背景与角色表情差分补齐**
   - 按 `03_art_bg_and_expression_prompts.md` 生成 6 张高清 `.webp` 场景图与各角色面部差分图，替换占位背景完成最终视觉打磨。
