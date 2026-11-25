# 标准化视觉小说剧本语法与 JSON 编译规范

> **文档定位**：本文件定义 `docs/scripts/` 下 `.md` 剧本文档的控制指令语法，方便 Codex 编写轻量级解析器（Parser）直接将 Markdown 剧本编译为运行时 JSON 数组，或直接驱动状态机渲染。

---

## 1. 剧本行级语法规则

### 1.1 场景与音乐控制指令
- **切换背景**：`[bg: <bg_id> | trans: fade/slide]`
  - 示例：`[bg: bg_room_404_day | trans: fade]`（对应 `assets/bg/bg_room_404_day.webp`）
- **背景音乐与音效**：
  - `[bgm: <bgm_id> | action: play/stop/fade]`
  - `[se: <se_id>]`（单次音效，如推门声 `se_door_open`、电饭煲提示音 `se_rice_ding`、盖章声 `se_stamp`）

### 1.2 立绘站位与动作指令
- **显示/更新立绘**：`[char: <sprite_key> | pos: left/center/right | exp: <exp_id> | tween: <tween_id>]`
  - `<sprite_key>`：如 `gpt-1`, `claude-1`, `gemini-1`, `grok-1`, `deepseek-1`, `glm-1`, `qwen-1`, `kimi-1`。
  - `<exp_id>`：`normal` | `happy` | `blush` | `shock` | `smug` | `panicked` | `thinking` | `gentle` | `strict`（若目标表情图片尚未生成，前端应优雅回退至 `normal` 母版立绘并叠加轻量 CSS 情绪角标如 `💧`/`💢`/`✨`，确保开发早期即可跑通全流程！）。
  - `<tween_id>`：
    - `fade_in`：淡入登场
    - `jump`：向上轻快弹跳 18px（开心/登场）
    - `shake`：左右快速微颤（慌张/吐槽/咆哮）
    - `sink`：向下微沉 20px（滑跪吃瘪/委屈）
    - `zoom`：放大至 1.08x 近景特写
- **隐藏立绘**：`[char: <sprite_key> | tween: hide]` 或清空全场 `[char_clear]`

### 1.3 台词、旁白与内心草稿（OS）
- **角色台词**：
  ```markdown
  **【显示名称】** `[speaker: <char_id> | exp: <exp_id> | tween: <tween_id>]`
  「台词正文内容，支持 {player_name} / {last_name} / {first_name} 变量插值。」
  ```
  *(注：行内 `[exp]` 与 `[tween]` 为快捷语法糖，等价于发言同时更新当前说话人立绘状态；若正在场上的角色发言，其立绘自动高亮 `brightness(100%)`，其余非发言角色微暗 `brightness(82%)`。)*
- **主角独白 / 旁白**：无 `**【...】**` 前缀的普通自然段即为旁白叙述（对话框隐藏姓名牌或显示淡色旁白态）。
- **脑内草稿 OS / 深度思考块**：紧跟在对应台词下方的引用块：
  ```markdown
  > 💡 **【脑内草稿 OS · GPT】**
  > `~~划掉的真实想法~~ → 表面修饰后的心理活动`
  ```
  解析器提取后挂载至上一句台词对象的 `innerOs` 属性中（将 `~~...~~` 转为 `<del>` 删除线标签）。

### 1.4 特殊喜剧 UI 演出指令
- `[input_player_name]`：挂起对话推进，弹出空白的《社团责任人登记卡》，支持手填和随机取名。旧剧本中的 `default_last`、`default_first` 属性仅保留用于格式兼容。
- `[tag: char_intro_card | id: <char_id> | title: "..." | skill: "..." | flaw: "..."]`：播放角色初登场斜切介绍铭牌。
- `[tag: suspended_card]`：触发 Claude 的烫金停权黄牌盖章动效。
- `[tag: cot_spinning | sec: <number>]`：触发 DeepSeek 的「已深度思考（用时 N 秒）」旋转呆毛加载条。
- `[tag: delete_panic]`：触发 Gemini 的「破防碎纸机删稿警报」趣味拦截弹窗。
- `[dispatch_board]`：弹出序章第三幕「校园奇葩委托双人派单板」，根据玩家点击的组合跳转至对应标签段落（`[label: route_claude_grok]` / `[label: route_gpt_deepseek]` / `[label: route_gemini_gpt]`），完成后统一汇合至 `[label: act3_reunion]`。

---

## 2. 编译后运行时 JSON 节点结构参考

```json
{
  "type": "dialogue",
  "speakerId": "gpt",
  "speakerLabel": "GPT",
  "text": "欢迎来到 404 室，{player_name} 部长！这不仅是一次推门——更是命运的重构！",
  "spriteUpdate": { "key": "gpt-1", "pos": "center", "exp": "happy", "tween": "jump" },
  "innerOs": {
    "title": "脑内草稿 OS · GPT",
    "html": "<del>天哪终于抓到替死鬼部长了！</del> → 先用满分夸夸话术稳住他！"
  },
  "specialTag": null
}
```


---

## 3. 第一章新增高互动指令语法补充（供 `tools/compile.mjs` 扩展）

1. **手机群聊容器**：
   - 开始：`[phone_chat: <群聊标题>]`
   - 结束：`[phone_chat_end]`
   - 容器内部的 `dialogue` 与 `choice_start ... choice_end` 节点照常解析，前端处于 `phoneChat` 状态时将对话流渲染在竖屏手机气泡面板中。
2. **课间自由串门面板（N 选 M 循环探索）**：
   - 面板头：`[free_roam_hub | picks: 2 | exit: <结束跳转label> | title: "..."]`
   - 选项行：`- **串门目标.+?：【(.+?)】(.+?)（指派 (\w+)）** → 跳转 \`[label: (\w+)\]\``
   - 单人串门结束回跳：`[free_roam_return]`（若已完成 `picks` 次则跳转 `exit`，否则返回当前 `free_roam_hub` 面板并置灰已访问项）。
3. **话术温度滑块调谐器**：
   - 面板头：`[temp_tuner | actor: <char_id> | task: "..."]`
   - 刻度行：`- **刻度.+?：【(.+?)】** → 跳转 \`[label: (\w+)\]\``
4. **分支选项直接跳转标签支持**：
   - 在 `choice_start ... choice_end` 内，若选项行形如 `- **(.+?)** → 跳转 \`[label: (\w+)\]\``（如第一章末尾五女主私服约会邀约），该选项无需缩进子对话行，选中后直接 `jump_to` 对应 `label`。
