(function (root) {
  let ctx = null;
  let master = null;
  let enabled = true;
  let ambience = null;
  let noiseBuffer = null;

  function init() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    const AC = root.AudioContext || root.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = enabled ? 0.8 : 0;
    master.connect(ctx.destination);
    noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = noiseBuffer.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }

  function setEnabled(on) {
    enabled = on;
    if (master) master.gain.setTargetAtTime(on ? 0.8 : 0, ctx.currentTime, 0.05);
  }

  function noise() { const s = ctx.createBufferSource(); s.buffer = noiseBuffer; s.loop = true; return s; }
  function env(node, t0, attack, hold, release, peak) {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(peak, t0 + attack);
    g.gain.setValueAtTime(peak, t0 + attack + hold);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + attack + hold + release);
    node.connect(g); g.connect(master);
    return g;
  }

  function bell(t = ctx.currentTime, base = 220) {
    [1, 1.5, 2.4, 3.6].forEach((m, i) => {
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = base * m;
      env(o, t, 0.01, 0, 3.5 - i * 0.5, 0.5 / (i + 1));
      o.start(t); o.stop(t + 4);
    });
  }

  function thunder(t = ctx.currentTime) {
    const n = noise();
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.setValueAtTime(400, t); f.frequency.exponentialRampToValueAtTime(60, t + 2.5);
    n.connect(f);
    env(f, t, 0.05, 0.3, 2.5, 1.0);
    n.start(t); n.stop(t + 3);
  }

  function thump(t, freq = 50) {
    const o = ctx.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(freq, t); o.frequency.exponentialRampToValueAtTime(30, t + 0.15);
    env(o, t, 0.005, 0.05, 0.2, 0.9);
    o.start(t); o.stop(t + 0.3);
  }
  function heartbeat(beats = 4, t = ctx.currentTime) {
    for (let i = 0; i < beats; i++) { thump(t + i * 0.9); thump(t + i * 0.9 + 0.25, 45); }
  }

  function tick(t = ctx.currentTime) {
    const o = ctx.createOscillator(); o.type = 'square'; o.frequency.value = 1800;
    env(o, t, 0.001, 0.005, 0.03, 0.15);
    o.start(t); o.stop(t + 0.05);
  }

  function whisper(t = ctx.currentTime, dur = 1.8) {
    const n = noise();
    const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1400; f.Q.value = 2;
    const lfo = ctx.createOscillator(); lfo.frequency.value = 7;
    const lg = ctx.createGain(); lg.gain.value = 600;
    lfo.connect(lg); lg.connect(f.frequency);
    n.connect(f);
    env(f, t, 0.3, dur - 0.8, 0.5, 0.25);
    n.start(t); n.stop(t + dur); lfo.start(t); lfo.stop(t + dur);
  }

  function scream(t = ctx.currentTime) {
    const o = ctx.createOscillator(); o.type = 'sawtooth';
    o.frequency.setValueAtTime(500, t);
    o.frequency.exponentialRampToValueAtTime(1500, t + 0.3);
    o.frequency.exponentialRampToValueAtTime(300, t + 1.2);
    const vib = ctx.createOscillator(); vib.frequency.value = 30;
    const vg = ctx.createGain(); vg.gain.value = 80; vib.connect(vg); vg.connect(o.frequency);
    const shaper = ctx.createWaveShaper();
    const curve = new Float32Array(256);
    for (let i = 0; i < 256; i++) { const x = (i / 128) - 1; curve[i] = Math.tanh(x * 4); }
    shaper.curve = curve;
    o.connect(shaper);
    env(shaper, t, 0.05, 0.6, 0.6, 0.5);
    o.start(t); o.stop(t + 1.4); vib.start(t); vib.stop(t + 1.4);
  }

  function puff(t = ctx.currentTime) {
    const n = noise();
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 900;
    n.connect(f);
    env(f, t, 0.01, 0.05, 0.25, 0.4);
    n.start(t); n.stop(t + 0.4);
  }

  const sounds = {
    bell: () => bell(),
    thunder: () => thunder(),
    heartbeat: () => heartbeat(4),
    tick: () => tick(),
    whisper: () => whisper(),
    scream: () => scream(),
    puff: () => puff(),
    death: () => { const t = ctx.currentTime; thunder(t); scream(t + 0.4); thunder(t + 1.2); },
    ghost: () => { const t = ctx.currentTime; whisper(t, 2.5); bell(t + 0.5, 110); },
    toll: () => { const t = ctx.currentTime; bell(t, 110); bell(t + 1.6, 110); bell(t + 3.2, 110); }
  };

  function play(name) {
    init();
    if (!ctx || !sounds[name]) return;
    sounds[name]();
  }

  function startAmbience(scene) {
    init();
    if (!ctx) return;
    if (ambience && ambience.scene === scene) return;
    stopAmbience();
    const presets = {
      1: { wind: 500, drone: 55, gain: 0.12 },
      2: { wind: 900, drone: 41, gain: 0.15 },
      3: { wind: 700, drone: 49, gain: 0.15 }
    };
    const p = presets[scene] || presets[1];
    const g = ctx.createGain(); g.gain.value = 0; g.connect(master);
    const n = noise();
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = p.wind; f.Q.value = 0.7;
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.08;
    const lg = ctx.createGain(); lg.gain.value = p.wind * 0.6;
    lfo.connect(lg); lg.connect(f.frequency);
    n.connect(f); f.connect(g);
    const d1 = ctx.createOscillator(); d1.type = 'sine'; d1.frequency.value = p.drone;
    const d2 = ctx.createOscillator(); d2.type = 'sine'; d2.frequency.value = p.drone * 1.005;
    const dg = ctx.createGain(); dg.gain.value = 0.5;
    d1.connect(dg); d2.connect(dg); dg.connect(g);
    n.start(); lfo.start(); d1.start(); d2.start();
    g.gain.setTargetAtTime(p.gain, ctx.currentTime, 1.5);
    ambience = { scene, g, nodes: [n, lfo, d1, d2] };
  }

  function stopAmbience() {
    if (!ambience) return;
    const a = ambience; ambience = null;
    a.g.gain.setTargetAtTime(0, ctx.currentTime, 0.8);
    setTimeout(() => a.nodes.forEach((n) => { try { n.stop(); } catch (e) { /* already stopped */ } }), 3000);
  }

  root.BM = root.BM || {};
  root.BM.audio = { init, play, setEnabled, startAmbience, stopAmbience, names: Object.keys(sounds) };
})(window);
