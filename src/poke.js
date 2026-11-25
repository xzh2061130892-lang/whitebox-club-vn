(() => {
  'use strict';
  const { pokes } = window.WhiteboxReplayData;
  function streak() {
    let actor, taps = [];
    return (id, now) => {
      taps = actor === id ? taps.filter(t => now - t <= 5000) : [];
      actor = id;
      taps.push(now);
      if (taps.length < 5) return false;
      taps = [];
      return true;
    };
  }
  function create({ bubble, playerNames, onOverload }) {
    const { interpolate, member } = window.Whitebox;
    let tap = streak(), timer, clearImage;
    function clear(reset = true) {
      clearTimeout(timer);
      clearImage?.();
      clearImage = null;
      bubble.hidden = true;
      if (reset) tap = streak();
    }
    function react(e, id, zone, figure, sprite, cover = false) {
      clear(false);
      const overload = tap(id, performance.now());
      const [exp, line] = pokes[id][overload ? 3 : zone];
      const original = figure.querySelector('img');
      const reaction = document.createElement('img');
      reaction.alt = '';
      reaction.className = cover ? 'portrait cover-reaction' : 'reaction';
      const motion = ['panicked', 'shock'].includes(exp) || overload ? 'poke-shake' : 'poke-jump';
      figure.classList.add(motion);
      figure.append(reaction);
      // Some costumes have fewer expressions. Keep the costume and show its nearest expression.
      const nearest = { thinking: 'gentle', smug: 'happy', shock: 'panicked', panicked: 'blush', blush: 'gentle' };
      const expressions = window.StudioPoses?.[sprite];
      const sources = [...new Set([exp, nearest[exp], 'happy'].filter(key => key && (!expressions || expressions.includes(key))))]
        .map(key => 'assets/sprites/' + sprite + '/' + key + '.webp');
      sources.push('assets/sprites/' + sprite + '-front.webp');
      const symbols = { thinking: '…', smug: '✧', shock: '！', panicked: '💦', blush: '♡', happy: '✦' };
      bubble.dataset.emotion = expressions && !expressions.includes(exp) ? symbols[exp] : '';
      let index = 0;
      reaction.onload = () => original.classList.add('poke-hidden');
      reaction.onerror = () => {
        bubble.dataset.emotion = symbols[exp];
        if (++index < sources.length) reaction.src = sources[index];
        else reaction.hidden = true;
      };
      clearImage = () => {
        reaction.onload = reaction.onerror = null;
        reaction.remove();
        figure.classList.remove(motion);
        original.classList.remove('poke-hidden');
      };
      reaction.src = sources[0];
      window.AcademyAudio.unlock();
      window.AcademyAudio.effect('se_poke');
      bubble.style.setProperty('--tone', member[id][2]);
      bubble.textContent = (overload && id === 'claude' ? '🟨 ' : '') + interpolate(line, { names: playerNames() });
      bubble.hidden = false;
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = e.detail ? e.clientX : bounds.left + bounds.width / 2;
      const y = e.detail ? e.clientY : bounds.top + bounds.height / 2;
      bubble.style.left = Math.max(8, Math.min(innerWidth - bubble.offsetWidth - 8, x - bubble.offsetWidth / 2)) + 'px';
      bubble.style.top = Math.max(8, y - bubble.offsetHeight - 14) + 'px';
      if (overload) onOverload();
      timer = setTimeout(() => clear(false), 2200);
    }
    return { clear, react };
  }
  window.WhiteboxPoke = { create, streak };
})();
