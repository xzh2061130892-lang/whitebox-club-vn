// Prologue through chapter three have one CG each. Chapter four has one per route.
export const omniCgs = [
  ['prologue', 'cg_prologue_404_chaos', '推开 404 大门：今天也没对齐！', '面对这间没有哪怕一个人处在正常人类频道上的 404 活动室'],
  ['chapter1', 'cg_ch1_cafeteria_crisis', '仰望星空蓝莓麻婆派：全员石化！', '眼看王大叔感动得抄起一把大铁勺'],
  ['chapter2', 'cg_ch2_lodge_candlelight', '暴雨停电夜：壁炉烛火与心跳怪谈', '我将壁炉里的松木拨旺'],
  ['chapter3', 'cg_ch3_scavenger_hand', '终极借物卡：夕阳跑道边的五道目光', '漫天夕阳与欢呼声仿佛在这一刻化作了温柔的慢镜头。'],
  ['chapter4', 'cg_ch4_gpt_umbrella', '伞下初晴与 100 分的完美手册', '雨势渐小，云缝间漏下一束清澈的初夏阳光'],
  ['chapter4', 'cg_ch4_claude_fingers', '紫阳花伞下：十指相扣脱敏训练', '锁好温室大门走入漫山紫阳花的雨中石阶'],
  ['chapter4', 'cg_ch4_gemini_starlight', '双星天台：雨霁星辉与透明伞', '雨后的天台亮起第一颗夜星'],
  ['chapter4', 'cg_ch4_grok_clocktower', '午夜钟表铺：撞进怀中的红眼眶', 'Grok 呆呆地看着屏幕上的表彰令'],
  ['chapter4', 'cg_ch4_deepseek_porridge', '灯塔晚霞：退烧白米粥与蓝鲸钢笔', '喝着暖融融的白米热粥'],
].map(([chapter, id, title, anchor]) => ({ chapter, id, title, anchor }));

const command = text => '`[' + text + ']`';
const bg = id => command('bg: ' + id + ' | trans: fade');

export function insertCg(source, { id, anchor }) {
  const newline = source.includes('\r\n') ? '\r\n' : '\n';
  const lines = source.split(newline);
  if (lines.some(line => line.trim() === bg(id))) return source;

  function position(prefix) {
    const start = lines.findIndex(line => line.startsWith(prefix));
    if (start < 0 || lines.some((line, i) => i > start && line.startsWith(prefix)))
      throw Error(id + ' 的剧本定位不唯一或缺失：' + prefix);
    return start;
  }
  const at = position(anchor);
  // These two scenes replace the immediately preceding stage directions.
  if (id === 'cg_ch2_lodge_candlelight' || id === 'cg_ch4_claude_fingers') {
    const old = id === 'cg_ch2_lodge_candlelight'
      ? [command('char: grok-1 | pos: left | exp: blush | tween: fade_in'),
         command('char: claude-1 | pos: right | exp: gentle | tween: fade_in')]
      : [bg('bg_hydrangea_rain_walk'), command('char: claude-summer | pos: center | exp: blush | tween: fade_in')];
    if (lines[at - 1]?.trim() !== '' || old.some((line, i) => lines[at - 3 + i]?.trim() !== line))
      throw Error(id + ' 的原舞台指令已改变');
    const replacement = id === 'cg_ch2_lodge_candlelight' ? [bg(id)] : [command('char_clear'), bg(id)];
    lines.splice(at - 3, 2, ...replacement);
  } else {
    lines.splice(at, 0, command('char_clear'), bg(id), '');
  }

  // Restore the non-CG before the first sprite (chapter two returns before the phone chat).
  const restore = {
    cg_prologue_404_chaos: [command('char: grok-1 | pos: left | exp: panicked | tween: shake'), 'bg_room_404_day'],
    cg_ch1_cafeteria_crisis: [command('char: deepseek-1 | pos: center | exp: shock | tween: jump'), 'bg_cafeteria_day'],
    cg_ch2_lodge_candlelight: ['十一点整，备用电路仍未恢复', 'bg_camp_lodge_night'],
  }[id];
  if (restore) {
    const after = lines.findIndex((line, i) => i >= at && line.startsWith(restore[0]));
    if (after < 0) throw Error(id + ' 缺少立绘恢复点');
    lines.splice(after, 0, bg(restore[1]));
  }
  return lines.join(newline);
}
