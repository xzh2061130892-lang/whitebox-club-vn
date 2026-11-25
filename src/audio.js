/* Short original arrangements, scheduled against the audio clock and synthesized offline
   by the browser. No external samples or permission prompts are needed. */
(() => {
  const arrangements = {
    bgm_clockwork_tease: [
      152,
      'triangle',
      [55, 62, 69, 67, 0, 66, 62, 0, 55, 0, 58, 62, 67, 66, 0, 62],
      [43, 46, 48, 50],
    ],
    bgm_spring_slope: [
      112,
      'sine',
      [71, 74, 78, 0, 76, 74, 71, 69, 67, 69, 71, 0, 66, 69, 74, 0],
      [43, 47, 48, 50],
    ],
    bgm_sunny_mischief: [
      136,
      'triangle',
      [76, 0, 79, 76, 74, 71, 0, 67, 69, 73, 76, 0, 74, 71, 69, 0],
      [48, 47, 45, 43],
    ],
    bgm_tension_comedy: [
      123,
      'triangle',
      [62, 0, 63, 62, 0, 69, 65, 0, 62, 65, 0, 68, 67, 63, 0, 60],
      [38, 41, 44, 43],
    ],
    bgm_oriental_breeze: [
      90,
      'sine',
      [74, 76, 79, 0, 81, 79, 76, 0, 74, 71, 69, 0, 67, 69, 71, 0],
      [43, 45, 48, 43],
    ],
    bgm_sunset_warmth: [
      82,
      'sine',
      [72, 0, 71, 67, 69, 0, 64, 0, 65, 69, 72, 0, 71, 67, 64, 0],
      [48, 45, 41, 43],
    ],
  };
  let ctx,
    master,
    bus,
    interval,
    current = '',
    volume = 0.55,
    generation = 0;
  function unlock() {
    try {
      ctx ||= new (window.AudioContext || window.webkitAudioContext)();
      if (!master) {
        master = ctx.createGain();
        master.gain.value = volume;
        master.connect(ctx.destination);
      }
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    } catch {
      /* Text and visuals also work on devices with no audio output. */
    }
  }
  function tone(hz, at, length, gain, type = 'sine', to = hz, dest = master) {
    if (!ctx || !dest) return;
    const osc = ctx.createOscillator(),
      env = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(hz, at);
    osc.frequency.exponentialRampToValueAtTime(to, at + length);
    env.gain.setValueAtTime(0.0001, at);
    env.gain.exponentialRampToValueAtTime(gain, at + 0.013);
    env.gain.exponentialRampToValueAtTime(0.0001, at + length);
    osc.connect(env);
    env.connect(dest);
    osc.start(at);
    osc.stop(at + length + 0.01);
    osc.onended = () => {
      osc.disconnect();
      env.disconnect();
    };
  }
  const hz = (note) => 440 * 2 ** ((note - 69) / 12);
  function music(id) {
    if (id === current || !ctx) return;
    clearInterval(interval);
    generation++;
    current = id;
    if (bus) {
      const old = bus;
      old.gain.setTargetAtTime(0.001, ctx.currentTime, 0.09);
      setTimeout(() => old.disconnect(), 700);
      bus = null;
    }
    if (!id || !arrangements[id]) return;
    bus = ctx.createGain();
    bus.gain.value = 0.65;
    bus.connect(master);
    const [bpm, wave, lead, bass] = arrangements[id],
      step = 30 / bpm,
      token = generation;
    let tick = 0,
      time = ctx.currentTime + 0.025;
    const pump = () => {
      if (token !== generation) return;
      if (time < ctx.currentTime) time = ctx.currentTime + 0.015;
      while (time < ctx.currentTime + 0.25) {
        const note = lead[tick % lead.length],
          root = bass[Math.floor(tick / 8) % 4];
        if (note) tone(hz(note), time, step * 1.55, 0.12, wave, hz(note), bus);
        if (tick % 4 === 0) tone(hz(root), time, step * 3, 0.15, 'sine', hz(root), bus);
        if (tick % 4 === 2)
          tone(hz(root + 7), time, step * 0.85, 0.055, 'triangle', hz(root + 7), bus);
        if (id === 'bgm_clockwork_tease' && tick % 2 === 0)
          tone(650, time, 0.045, 0.04, 'square', 150, bus);
        tick++;
        time += step;
      }
    };
    pump();
    interval = setInterval(pump, 120);
  }
  const sfx = {
    se_shutter: [[760, 0.035, 'square', 100], [410, 0.045, 'triangle', 80]],
    se_bubble_pop: [[580, 0.085, 'sine', 1250]],
    se_drum: [[150, 0.075, 'triangle', 55]],
    se_whistle: [[1420, 0.09, 'sine', 1760]],
    se_firework: [[260, 0.11, 'triangle', 1200], [920, 0.19, 'sine', 220]],
    se_firework_final: [[220, 0.21, 'triangle', 1600], [880, 0.4, 'sine', 440], [1320, 0.5, 'sine', 660]],
    se_poke: [[740, 0.075, 'sine', 990]],
    se_bell_chime: [
      [1318, 0.45, 'sine', 1318],
      [1976, 0.6, 'sine', 1976],
    ],
    se_stamp: [
      [140, 0.13, 'triangle', 40],
      [650, 0.045, 'square', 160],
    ],
    se_door_open: [
      [165, 0.19, 'sawtooth', 110],
      [95, 0.13, 'triangle', 48],
    ],
    se_rice_ding: [
      [1120, 0.28, 'sine', 1120],
      [1660, 0.4, 'sine', 1660],
    ],
    se_shredder_jam: [
      [106, 0.16, 'sawtooth', 56],
      [130, 0.21, 'sawtooth', 61],
      [850, 0.1, 'triangle', 250],
    ],
    se_rollerskates_crash: [
      [480, 0.25, 'sawtooth', 150],
      [180, 0.13, 'square', 45],
    ],
    se_chips_crunch: [
      [720, 0.045, 'sawtooth', 160],
      [530, 0.055, 'square', 100],
    ],
    se_knock_strict: [
      [170, 0.09, 'triangle', 45],
      [170, 0.09, 'triangle', 45],
      [170, 0.09, 'triangle', 45],
    ],
  };
  function effect(id) {
    if (!ctx) return;
    (sfx[id] || []).forEach(([f, len, w, end], i) =>
      tone(f, ctx.currentTime + i * (id === 'se_knock_strict' ? 0.5 : 0.085), len, 0.16, w, end),
    );
  }
  function setVolume(v) {
    volume = v;
    if (master) master.gain.setTargetAtTime(v, ctx.currentTime, 0.03);
  }
  window.AcademyAudio = { unlock, music, effect, setVolume };
})();
