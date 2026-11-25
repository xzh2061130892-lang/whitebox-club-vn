(() => {
  'use strict';
  const { heroes, member } = window.Whitebox;
  const actors = [...heroes, 'glm', 'qwen', 'kimi', 'mistral'];
  const outfits = { '1': '学园原装', date: '周末私服', camp: '合宿睡衣', sport: '春日运动装', summer: '六月夏服', '3': '盛典礼服' };
  const clothesFor = id => heroes.includes(id) ? ['1', 'date', 'camp', 'sport', 'summer', '3'] : ['1', '3'];
  const expressions = {
    normal: '自然', happy: '开心', blush: '脸红', shock: '惊讶', smug: '得意',
    panicked: '慌张', thinking: '思考', gentle: '温柔', strict: '严肃', cot: '深度思考',
  };
  const scenes = {
    bg_room_404_day: '404 活动室 · 晴昼', bg_room_404_sunset: '404 活动室 · 夕照',
    bg_campus_street_day: '春日海风坡道', bg_corridor_404_day: '旧校舍四楼走廊',
    bg_wisteria_tea_day: '东庭紫藤茶寮', bg_prism_music_day: '西馆棱镜琴房',
    bg_cafeteria_day: '学园食堂', bg_greenhouse_lib_day: '温室图书馆',
    bg_tide_cafe_sunset: '海湾水族馆 · 灯塔露台', bg_camp_lodge_day: '海景木屋 · 白昼',
    bg_camp_lodge_night: '海景木屋 · 停电夜', bg_sports_field_day: '春季运动场',
    bg_hydrangea_rain_walk: '紫阳花雨坡', bg_white_tower_day: '白玉钟楼',
    bg_twinstar_roof_sunset: '双星天台 · 日落', bg_clock_attic_night: '钟表阁楼',
    bg_festival_plaza_night: '星海文化祭广场',
  };
  const positions = ['左', '中', '右'];
  const font = ' "Microsoft YaHei", "PingFang SC", sans-serif';

  // Lay out each line before painting its strike so the ink follows wrapped Chinese text.
  function lettering(ctx, text, x, y, width, lineHeight, strikeMarkup = false) {
    const parts = strikeMarkup ? text.split(/(~~[^~]+~~)/g) : [text];
    let offset = 0;
    for (const part of parts) {
      const strike = strikeMarkup && /^~~[^~]+~~$/.test(part);
      for (const char of strike ? part.slice(2, -2) : part) {
        const advance = ctx.measureText(char).width;
        if (offset + advance > width) { offset = 0; y += lineHeight; }
        ctx.fillText(char, x + offset, y);
        if (strike) ctx.fillRect(x + offset, y - lineHeight * 0.26, advance + 0.3, 2.5);
        offset += advance;
      }
    }
  }
  function compose(canvas, images, slots, caption) {
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    ctx.save();
    ctx.filter = caption.filter;
    ctx.drawImage(images[0], 0, 0, width, height);
    slots.forEach((slot, index) => {
      const image = images[index + 1];
      if (!image) return;
      const h = 935 * slot.scale / 100;
      const w = h * image.naturalWidth / image.naturalHeight;
      ctx.save();
      ctx.translate([405, 960, 1515][index], Math.max(10, 1032 - h));
      ctx.scale(slot.flip ? -1 : 1, 1);
      ctx.drawImage(image, -w / 2, 0, w, h);
      ctx.restore();
    });
    ctx.restore();
    if (caption.frame) {
      ctx.strokeStyle = '#fcf4df';
      ctx.lineWidth = 36;
      ctx.strokeRect(0, 0, width, height);
      ctx.strokeStyle = '#9f7e4a';
      ctx.lineWidth = 3;
      ctx.strokeRect(20, 20, width - 40, height - 40);
    }
    if (caption.line.trim() || caption.speaker.trim()) {
      ctx.fillStyle = '#fffaeefa';
      ctx.fillRect(86, 840, 1748, 176);
      ctx.fillStyle = '#20463e';
      ctx.fillRect(86, 840, 9, 176);
      ctx.font = 'bold 33px' + font;
      ctx.fillText(caption.speaker, 130, 888);
      ctx.font = '34px' + font;
      lettering(ctx, caption.line, 130, 940, 1650, 44);
    }
    if (caption.noteOn && caption.note.trim()) {
      ctx.save();
      ctx.font = '28px' + font;
      const ink = caption.note.replace(/~~([^~]+)~~/g, '$1');
      const lines = Math.max(1, Math.ceil(ctx.measureText(ink).width / 468));
      const noteHeight = 78 + lines * 37;
      const bottom = caption.speaker.trim() || caption.line.trim() ? 802 : 978;
      ctx.translate(1280, bottom - noteHeight);
      ctx.rotate(0.025);
      ctx.fillStyle = '#e4c570';
      ctx.fillRect(4, 7, 550, noteHeight);
      ctx.fillStyle = '#fff0a8';
      ctx.fillRect(0, 0, 550, noteHeight);
      ctx.fillStyle = '#e1c373';
      ctx.fillRect(185, -9, 180, 22);
      ctx.fillStyle = '#765932';
      ctx.font = 'bold 26px' + font;
      ctx.fillText('脑内草稿 OS', 28, 50);
      ctx.font = '28px' + font;
      lettering(ctx, caption.note, 28, 94, 494, 37, true);
      ctx.restore();
    }
    if (caption.decor.size) arcadeDecor(ctx, width, height, caption.decor);
  }
  function arcadeDecor(ctx, width, height, chosen) {
    ctx.save();
    if (chosen.has('instant')) {
      ctx.fillStyle = '#fff9e5';
      ctx.fillRect(0, 0, width, 22); ctx.fillRect(0, 0, 22, height);
      ctx.fillRect(width - 22, 0, 22, height); ctx.fillRect(0, height - 56, width, 56);
      ctx.fillStyle = '#524c42'; ctx.font = 'italic 28px Georgia';
      ctx.fillText('Whitebox Academy  /  Club 404', 68, height - 20);
    }
    if (chosen.has('seal')) {
      ctx.save(); ctx.translate(width - 322, 63); ctx.rotate(0.07);
      ctx.fillStyle = '#f3dfad'; ctx.fillRect(0, 0, 276, 64);
      ctx.strokeStyle = '#9f3d35'; ctx.lineWidth = 3; ctx.strokeRect(5, 5, 266, 54);
      ctx.fillStyle = '#9f3d35'; ctx.font = 'bold 30px' + font; ctx.fillText('404 室 · 封存', 33, 43); ctx.restore();
    }
    if (chosen.has('friends')) {
      ctx.font = '56px "Segoe UI Emoji", sans-serif'; ctx.fillText('🐳 🦀 ✦', 75, height - 85);
    }
    if (chosen.has('yellow')) {
      ctx.save(); ctx.translate(62, 95); ctx.rotate(-0.12);
      const gold = ctx.createLinearGradient(0,0,190,65);
      gold.addColorStop(0,'#edbd4e'); gold.addColorStop(0.55,'#fff0a0'); gold.addColorStop(1,'#c49337');
      ctx.fillStyle = gold; ctx.fillRect(0, 0, 196, 78); ctx.strokeStyle = '#846324'; ctx.strokeRect(5, 5, 186, 68);
      ctx.fillStyle = '#725026'; ctx.font = 'bold 27px Georgia'; ctx.fillText('SUSPENDED', 13, 48); ctx.restore();
    }
    ctx.restore();
  }

  // file: images can be displayed but some browsers restrict reading their pixels.
  // A user-selected assets folder supplies origin-clean Blob images for local exports.
  let localFiles;
  function mount(body, { el, button, onExport, arcadeItems = [] }) {
    const slots = positions.map((_, i) => ({
      id: i === 1 ? 'gpt' : '', outfit: '1', exp: 'normal', flip: false, scale: 100,
    }));
    const caption = { speaker: '', line: '', noteOn: false, note: '', frame: true, filter: 'none', decor: new Set() };
    let selected = 1, scene = 'bg_room_404_day', version = 0, needsFolder = false;
    const cache = new Map();
    const canvas = el('canvas');
    canvas.width = 1920;
    canvas.height = 1080;
    canvas.setAttribute('aria-label', '1920 × 1080 剧照预览');
    const layout = el('div', 'studio-layout'), preview = el('div', 'studio-preview');
    const controls = el('section', 'activity-stack studio-controls');
    const status = el('p', 'hint');
    status.setAttribute('role', 'status');
    const folder = el('input');
    folder.type = 'file';
    folder.setAttribute('webkitdirectory', '');
    folder.hidden = true;
    const shoot = button(' 导出纪念照 (.png)', download, 'system-action primary');
    shoot.prepend(window.WhiteboxIcon('camera'));
    const copy = el('div', 'studio-captions');
    const cast = el('div', 'studio-cast');
    preview.append(canvas, shoot, status, folder);
    layout.append(preview, controls);
    body.append(layout);

    function load(path) {
      if (!path) return null;
      if (!cache.has(path)) {
        if (cache.size >= 10) cache.delete(cache.keys().next().value);
        const pending = new Promise((resolve, reject) => {
          const img = new Image();
          const file = localFiles?.get(path);
          if (localFiles && !file) return reject(Error('素材目录缺少 ' + path));
          const url = file && URL.createObjectURL(file);
          img.onload = () => { if (url) URL.revokeObjectURL(url); resolve(img); };
          img.onerror = () => { if (url) URL.revokeObjectURL(url); reject(Error('无法读取 ' + path)); };
          img.src = url || path;
        });
        cache.set(path, pending);
        pending.catch(() => { if (cache.get(path) === pending) cache.delete(path); });
      }
      return cache.get(path);
    }
    async function render() {
      const ticket = ++version;
      shoot.disabled = true;
      try {
        const images = await Promise.all([load('assets/bg/' + scene + '.webp'), ...slots.map(s => {
          const base = 'assets/sprites/' + s.id + '-' + s.outfit;
          return s.id ? load(base + (s.exp === 'normal' ? '-front' : '/' + s.exp) + '.webp') : null;
        })]);
        if (ticket !== version) return false;
        compose(canvas, images, slots, caption);
        if (location.protocol === 'file:' && !localFiles) {
          try { canvas.getContext('2d').getImageData(0, 0, 1, 1); }
          catch { needsFolder = true; }
        }
        status.textContent = needsFolder ? '本地文件模式首次导出，请在弹窗中选择游戏的 assets 文件夹。' : '1920 × 1080 · PNG';
        shoot.disabled = !slots.some(s => s.id);
        if (shoot.disabled) status.textContent = '至少放入一位角色即可拍摄。';
        return !shoot.disabled;
      } catch (error) {
        if (ticket === version) {
          status.textContent = error.message;
          if (localFiles) {
            needsFolder = true;
            shoot.disabled = false;
            status.textContent += '。请点击导出，重新选择本游戏的 assets 文件夹。';
          }
        }
        return false;
      }
    }
    async function download() {
      if (needsFolder) { folder.click(); return; }
      const ticket = version;
      shoot.disabled = true;
      try {
        const blob = await new Promise((resolve, reject) => canvas.toBlob(
          result => result ? resolve(result) : reject(Error('无法生成纪念照，请重试。')), 'image/png'));
        if (ticket !== version || !canvas.isConnected) return;
        const link = el('a');
        link.href = URL.createObjectURL(blob);
        link.download = '404纪念照-' + scenes[scene] + '-' + Date.now() + '.png';
        preview.append(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(link.href), 30000);
        status.textContent = '纪念照已生成 · 1920 × 1080 PNG';
        onExport(slots.filter(slot => slot.id).length);
      } catch (error) {
        status.textContent = error.message;
      } finally {
        if (ticket === version) shoot.disabled = false;
      }
    }
    folder.onchange = async () => {
      const files = new Map();
      for (const file of folder.files) {
        const match = file.webkitRelativePath.match(/(?:^|\/)(assets\/(?:bg|sprites)\/.+\.webp)$/);
        if (match) files.set(match[1], file);
      }
      folder.value = '';
      if (!files.has('assets/bg/' + scene + '.webp')) {
        status.textContent = '请选择包含 bg 和 sprites 的游戏 assets 文件夹。';
        return;
      }
      localFiles = files;
      needsFolder = false;
      cache.clear();
      canvas.width = 1920; // Reset the previous file-origin bitmap before drawing the Blob images.
      if (await render()) await download();
    };
    function field(name, input) {
      const label = el('label', 'activity-field');
      input.setAttribute('aria-label', name);
      label.append(el('span', '', name), input);
      return label;
    }
    function select(entries, value, changed) {
      const input = el('select');
      for (const [key, label] of entries) input.add(new Option(label, key));
      input.value = value;
      input.onchange = () => changed(input.value);
      return input;
    }
    function toggle(label, value, changed) {
      const input = el('input');
      input.type = 'checkbox';
      input.checked = value;
      input.onchange = () => { changed(input.checked); render(); };
      return field(label, input);
    }
    function editCast() {
      const s = slots[selected], tabs = el('div', 'gallery-tabs slot-tabs');
      positions.forEach((pos, i) => {
        const b = button(pos + ' · ' + (member[slots[i].id]?.[0] || '空位'), () => {
          selected = i; editCast(); cast.querySelectorAll('.slot-tabs button')[i].focus();
        });
        b.setAttribute('aria-pressed', String(selected === i));
        tabs.append(b);
      });
      const actorSelect = select([['', '无'], ...actors.map(id => [id, member[id][0]])], s.id, id => {
        s.id = id;
        if (!clothesFor(id).includes(s.outfit)) s.outfit = '1';
        s.exp = 'normal'; editCast(); cast.querySelector('select').focus(); render();
      });
      cast.replaceChildren(tabs, field(positions[selected] + '槽角色', actorSelect));
      if (!s.id) return;
      const keys = clothesFor(s.id);
      const poses = () => ['normal', ...window.StudioPoses[s.id + '-' + s.outfit]];
      const outfit = select(keys.map(k => [k, outfits[k]]), s.outfit, key => {
        s.outfit = key;
        if (!poses().includes(s.exp)) s.exp = 'normal';
        editCast(); cast.querySelectorAll('select')[1].focus(); render();
      });
      const exp = select(poses().map(k => [k, expressions[k] || k]), s.exp, key => { s.exp = key; render(); });
      const scale = el('input');
      scale.type = 'range'; scale.min = 80; scale.max = 120; scale.value = s.scale;
      const scaleLabel = field('缩放 ' + s.scale + '%', scale);
      scale.setAttribute('aria-label', '缩放');
      scale.setAttribute('aria-valuetext', s.scale + '%');
      scale.oninput = () => {
        s.scale = Number(scale.value);
        scale.setAttribute('aria-valuetext', s.scale + '%');
        scaleLabel.firstChild.textContent = '缩放 ' + s.scale + '%'; render();
      };
      cast.append(field('衣装', outfit), field('表情', exp), scaleLabel, toggle('水平翻转', s.flip, v => s.flip = v));
    }
    function writing(key, name, max, placeholder) {
      const input = el('input');
      input.type = 'text'; input.maxLength = max; input.placeholder = placeholder;
      input.oninput = () => { caption[key] = input.value; render(); };
      return field(name, input);
    }
    const note = writing('note', '草稿内容', 54, '用 ~~删除线~~ 藏一句真心话');
    note.hidden = true;
    const finish = el('div', 'studio-finish');
    finish.append(field('滤镜', select([['none', '原色'], ['sepia(.45)', '暖调'], ['grayscale(1)', '黑白']], caption.filter,
      key => { caption.filter = key; render(); })), toggle('复古相框', true, v => caption.frame = v));
    copy.append(writing('speaker', '发言人', 24, '如：部长'), writing('line', '对白', 86, '写一句台词，留空可拍纯剧照'),
      toggle('附带脑内草稿', false, v => { caption.noteOn = v; note.hidden = !v; }), note, finish);
    const decor = el('div', 'studio-decor');
    for (const item of arcadeItems) {
      if (!item.startsWith('decor.')) continue;
      const id = item.slice(6), title = window.WhiteboxArcade.decorations[id];
      if (title) decor.append(toggle(title, false, v => {
        if (v) caption.decor.add(id); else caption.decor.delete(id);
      }));
    }
    if (decor.childElementCount) copy.append(decor);
    controls.append(field('场景背景', select(Object.entries(scenes), scene, key => { scene = key; render(); })), cast, copy);
    editCast();
    render();
  }
  window.WhiteboxStudio = { actors, outfits, clothesFor, scenes, mount };
})();
