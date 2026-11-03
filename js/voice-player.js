(function (root) {
  /* Plays the recorded ghost voice-over in the game: the stage narration, Victor's return and the
     reveal (groups from BM.logic.voiceGroup). Lines spoken by "Both ghosts" play Delilah's and
     Victor's recordings at the same moment. Clips come from js/voice-manifest.js. */
  const data = root.BM.data;
  const logic = root.BM.logic;
  const GAP = 0.6;  // seconds of silence between two lines of the same group

  const clips = () => (root.BM.voice && root.BM.voice.clips) || {};
  const els = typeof root.Audio === 'function' ? [new root.Audio(), new root.Audio()] : [];
  els.forEach((e) => { e.preload = 'auto'; });
  let token = 0;
  let unlocked = false;
  let current = null;

  function partsFor(line) {
    const c = clips();
    if (line.voice === 'both') return [c[`${line.id}.delilah`], c[`${line.id}.victor`]].filter(Boolean);
    return c[line.id] ? [c[line.id]] : [];
  }
  function linesOf(group) { return logic.voiceGroup(data, group).filter((l) => partsFor(l).length); }

  /* Seconds the group takes to play, 0 when nothing is recorded for it. */
  function duration(group) {
    const lines = linesOf(group);
    if (!lines.length) return 0;
    return lines.reduce((t, l) => t + Math.max(...partsFor(l).map((c) => c.duration)), 0) + GAP * (lines.length - 1);
  }

  function stop() {
    token++;
    current = null;
    els.forEach((e) => { e.onended = null; e.onerror = null; if (!e.unlocking && !e.paused) e.pause(); });
  }

  function play(group, onDone) {
    stop();
    const my = token;
    const lines = linesOf(group);
    if (!lines.length || !els.length) return false;
    current = group;
    let i = 0;
    const next = () => {
      if (my !== token) return;
      if (i >= lines.length) { current = null; if (onDone) onDone(); return; }
      const parts = partsFor(lines[i++]);
      let left = parts.length;
      let moved = false;
      const one = () => { if (my !== token || moved) return; if (--left <= 0) { moved = true; setTimeout(next, GAP * 1000); } };
      /* Safety net: carry on even if a clip never reports its end. */
      const longest = Math.max(...parts.map((c) => c.duration));
      setTimeout(() => { if (my === token && !moved) { left = 0; one(); } }, (longest + 4) * 1000);
      parts.forEach((c, k) => {
        const e = els[k];
        e.unlocking = false;
        e.muted = false;
        e.volume = k ? 0.8 : 1;   // in a chorus, Victor sits just under Delilah
        e.onended = one;
        e.onerror = one;
        e.src = c.src;
        const p = e.play();
        if (p && p.catch) p.catch(one);
      });
    };
    next();
    return true;
  }

  /* Phones only start audio from a tap: play muted once during the first tap so that later
     lines may start on their own. */
  function unlock() {
    if (unlocked || !els.length) return;
    const first = Object.values(clips())[0];
    if (!first) return;
    unlocked = true;
    els.forEach((e) => {
      e.unlocking = true;
      e.muted = true;
      e.src = first.src;
      const p = e.play();
      const done = () => { if (e.unlocking) e.pause(); e.unlocking = false; e.muted = false; };
      if (p && p.then) p.then(done, () => { unlocked = false; done(); }); else done();
    });
  }

  /* Typewriter speed (ms per character) that finishes the narration when the voice does. */
  function typingSpeed(container, seconds) {
    const units = Array.from(container.querySelectorAll('.typed')).reduce((a, p) => a + p.textContent.length + 12, 0);
    return units ? Math.min(90, Math.max(12, (seconds * 1000) / units)) : 28;
  }

  function stageGroup(stageId) { return `stage-${stageId.replace('.', '-')}`; }

  root.BM = root.BM || {};
  root.BM.voicePlayer = { play, stop, duration, unlock, typingSpeed, stageGroup, playing: () => current };
})(window);
