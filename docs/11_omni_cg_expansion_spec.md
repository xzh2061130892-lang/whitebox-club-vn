# Omni 事件 CG 接入规范

相册按剧情顺序收录十五张 CG。序章至第三章各有一张，第四章五条个人线各有一张，终章有五张告白与一张全家福。十五段 Gemini Omni 视频均为横屏、24 fps、五秒、静音循环。

## Banana 服装修订试看

从 `outputs/Banana动态CG试看.html` 打开游戏的修订相册。它展示这批十个分镜，预览不写入剧情解锁记录。序章、食堂和第二章壁炉夜谈使用 `*-1-front.webp` 常服，第四章五条个人线分别使用 `*-summer-front.webp`。运动祭的金色信封、橙边运动外套与秒表保留赛前选择；终章 Grok 的黑金半面具、歌剧手套和绯红礼服布料保留海湾露台的告白场景。两处均沿用原剧情台词与选项。

十段新版均以各自的 Nano Banana 2.1 服装修订原画为首帧，由 Google Flow 的 Gemini Omni 生成。灯塔白粥使用 DeepSeek 的六月水手服，画面保留蓝鲸钢笔、白粥热气和海湾晚霞。每段 1280 × 720 源片与对应原画核对后，使用 Real-ESRGAN 逐帧四倍超分为 5120 × 2880 H.264 MP4，并在片尾渐变回首帧以便循环。剧情与相册读取同一套 5K 视频和 WebP 静帧。另五段终章视频为 1280 × 720，可在 `outputs/动态CG试看.html` 与新版一同查看。终章 GPT 使用青花礼服白龙，Claude 和 Gemini 的视频已按实际画面归入对应剧情。

## 素材交付与编译

由 Google Flow 的 Gemini Omni 按《Omni CG 制作可行性评估、插入位置规划与提示词手册》制作视频。使用每条指定的原始立绘、场景与画风参考。终章六条直接用对应成品 CG 作为首帧。修订版十张 WebP 与视频尺寸一致，另外五张终章 WebP 为 1920 × 1080。

把静帧存为 `assets/bg/<CG ID>.webp`。同目录可放同名 `.webm`、`.mp4` 中的一种或两种。使用小写扩展名。阅读器和相册按 WebM、MP4 的顺序选源。视频解码失败、关闭演出动效或系统要求减少动态时，显示同名静帧。衣橱使用其原有立绘。

在仓库根目录执行以下命令。第一条会接入已有静帧的条目，写入对应 Markdown 剧本并重新生成离线数据。重复执行可继续补齐其余素材。只添加视频时直接执行普通编译 `node tools/compile.mjs`。

```sh
node tools/compile.mjs --integrate-cgs
node tools/compile.mjs --check
node --test
```

相册标题来自编译后剧本中的事件 CG。打包或发布时一并携带剧本产物、`src/studio-poses.js` 与实际媒体文件。剧本发生变化的章节沿用原有的存档版本校验。

## 已接入静帧与剧本定位

表中锚点为现有段落开头。每个 CG 在对应旁白出现前入场，通用插入片段如下。替换 `<CG ID>` 为该行的完整文件名主干。

```markdown
`[char_clear]`
`[bg: <CG ID> | trans: fade]`
```

| 章 / 路线 | CG ID 与相册标题 | 现有旁白锚点 |
| --- | --- | --- |
| 序章 | `cg_prologue_404_chaos` · 推开 404 大门：今天也没对齐！ | 面对这间没有哪怕一个人处在正常人类频道上的 404 活动室 |
| 第一章 | `cg_ch1_cafeteria_crisis` · 仰望星空蓝莓麻婆派：全员石化！ | 眼看王大叔感动得抄起一把大铁勺 |
| 第二章 | `cg_ch2_lodge_candlelight` · 暴雨停电夜：壁炉烛火与心跳怪谈 | 我将壁炉里的松木拨旺 |
| 第三章 | `cg_ch3_scavenger_hand` · 终极借物卡：夕阳跑道边的五道目光 | 漫天夕阳与欢呼声仿佛在这一刻化作了温柔的慢镜头 |
| 第四章 GPT | `cg_ch4_gpt_umbrella` · 伞下初晴与 100 分的完美手册 | 雨势渐小，云缝间漏下一束清澈的初夏阳光 |
| 第四章 Claude | `cg_ch4_claude_fingers` · 紫阳花伞下：十指相扣脱敏训练 | 锁好温室大门走入漫山紫阳花的雨中石阶 |
| 第四章 Gemini | `cg_ch4_gemini_starlight` · 双星天台：雨霁星辉与透明伞 | 雨后的天台亮起第一颗夜星 |
| 第四章 Grok | `cg_ch4_grok_clocktower` · 午夜钟表铺：撞进怀中的红眼眶 | Grok 呆呆地看着屏幕上的表彰令 |
| 第四章 DeepSeek | `cg_ch4_deepseek_porridge` · 灯塔晚霞：退烧白米粥与蓝鲸钢笔 | 喝着暖融融的白米热粥 |

### 序章第二幕与第一章食堂恢复立绘

序章第二幕敲门声响起，保留原有音效、BGM 与清场，在 Grok 上台前补回 404 日景。以下为接入后的相邻指令。

```markdown
`[bg: bg_room_404_day | trans: fade]`
`[char: grok-1 | pos: left | exp: panicked | tween: shake]`
```

第一章试吃选项结束，保留原有清场，在 DeepSeek 抱饭盆冲出前补回食堂日景。

```markdown
`[bg: bg_cafeteria_day | trans: fade]`
`[char: deepseek-1 | pos: center | exp: shock | tween: jump]`
```

### 第二章壁炉、回房与第三章天台

在 `ch2_grok_gold` 保留标签、BGM、原清场。用 CG 指令替换紧接的 Grok 和 Claude 两条上台指令。复原后的首段为：

```markdown
`[label: ch2_grok_gold]`
`[bgm: bgm_sunset_warmth | action: play]`
`[char_clear]`
`[bg: cg_ch2_lodge_candlelight | trans: fade]`
```

在“十一点整，备用电路仍未恢复”前插入下一条背景指令。回房旁白和手机群聊显示旅舍夜景，敲门分支按原指令展示睡衣立绘。

```markdown
`[bg: bg_camp_lodge_night | trans: fade]`
```

第三章终极借物选项期间保持事件 CG。五个 `ch3_lock_*` 标签各自已有 `[bg: bg_twinstar_roof_sunset | trans: fade]` 和个人运动装上台指令。

### 第四章五条个人线

按表中锚点分别在 `ch4_gpt_gold`、`ch4_claude_gold`、`ch4_gem_gold`、`ch4_grok_gold`、`ch4_ds_gold` 接入。Claude 线用以下两行替换温室告别后原有的绣球花雨景和脸红的夏服上台指令。五条线均保持该 CG 穿过最后的二选一，直至 `ch4_ending_card` 结算。

```markdown
`[char_clear]`
`[bg: cg_ch4_claude_fingers | trans: fade]`
```

终章继续使用 `cg_confession_gpt`、`cg_confession_claude`、`cg_confession_gemini`、`cg_confession_grok`、`cg_confession_deepseek`、`cg_grand_404_photo`，对应视频同样按文件名自动识别。
