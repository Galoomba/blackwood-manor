(function (root) {
  /* Room lights through a Philips Hue bridge on the home network (Hue API v1, one room or zone).
     The host window calls cue(name) at the big moments; a cue is a short timeline of looks.
     A step is { at, state } for the whole room, or { at, each } sent to every bulb on its own.
     The bridge takes about one room command a second but about ten bulb commands a second, so room
     steps are at least 1s apart and the fast effects (lightning, flicker) are bulb steps 250ms apart.
     Settings (bridge address, app key, room) live only in this browser's localStorage. */
  const KEY = 'blackwood-manor-lights-v1';

  /* Colours as Hue xy; warm whites as ct (mireds: 153 cold … 500 candle). bri 1–254, tt in 1/10 s. */
  const RED = [0.675, 0.322], MOON = [0.225, 0.235], VIOLET = [0.255, 0.115], DEEP = [0.19, 0.11];
  const look = (o) => Object.assign({ on: true }, o);
  const WHITE = look({ ct: 153, bri: 254, transitiontime: 0 });
  const DARK = look({ bri: 1, transitiontime: 0 });
  /* The screen's dark-red flicker (css flickerbg) with a lightning flash in front of it, from `at`. */
  const flicker = (at) => [
    { at, each: WHITE }, { at: at + 250, each: look({ xy: RED, bri: 60, transitiontime: 0 }) }, { at: at + 500, each: DARK },
    { at: at + 750, each: look({ xy: RED, bri: 90, transitiontime: 0 }) }, { at: at + 1000, each: DARK },
    { at: at + 1300, each: look({ xy: RED, bri: 50, transitiontime: 0 }) }, { at: at + 1550, each: { on: false, transitiontime: 0 } }];
  const CUES = {
    toast:     { label: 'The toast (prologue)',        steps: [{ at: 0, state: look({ ct: 454, bri: 170, transitiontime: 30 }) }] },
    dead:      { label: 'She is dead',                 steps: [{ at: 0, state: look({ xy: RED, bri: 254, transitiontime: 0 }) }, { at: 1500, state: look({ xy: RED, bri: 60, transitiontime: 40 }) }] },
    scene1:    { label: 'Scene 1 (warm, low)',         steps: [{ at: 0, state: look({ ct: 454, bri: 110, transitiontime: 40 }) }] },
    lightsOut: { label: 'Victor falls: candles out, flicker, dark, then moonlight', steps: [{ at: 700, state: look({ bri: 90, transitiontime: 9 }) }, { at: 1700, state: look({ bri: 35, transitiontime: 6 }) }, ...flicker(2600), { at: 6800, state: look({ xy: MOON, bri: 80, transitiontime: 30 }) }] },
    scene2:    { label: 'Scene 2 (cold moonlight)',    steps: [{ at: 0, state: look({ xy: MOON, bri: 80, transitiontime: 40 }) }] },
    twoGhosts: { label: 'Victor rises: lightning, then violet', steps: [{ at: 0, state: look({ xy: MOON, bri: 25, transitiontime: 15 }) }, { at: 2400, each: WHITE }, { at: 2700, each: look({ xy: MOON, bri: 25, transitiontime: 3 }) }, { at: 3400, state: look({ xy: VIOLET, bri: 110, transitiontime: 15 }) }] },
    scene3:    { label: 'Scene 3 (dark violet)',       steps: [{ at: 0, state: look({ xy: DEEP, bri: 70, transitiontime: 40 }) }] },
    box:       { label: 'The box: hunt by candlelight', steps: [{ at: 0, state: look({ ct: 500, bri: 90, transitiontime: 30 }) }] },
    lastLetter:{ label: "Delilah's last letter",       steps: [{ at: 0, state: look({ ct: 500, bri: 60, transitiontime: 30 }) }] },
    vote:      { label: 'The vote (low red)',          steps: [{ at: 0, state: look({ xy: RED, bri: 70, transitiontime: 30 }) }] },
    reveal:    { label: 'The reveal: candles out, then red', steps: [{ at: 1200, state: look({ bri: 120, transitiontime: 5 }) }, { at: 2300, state: look({ bri: 45, transitiontime: 5 }) }, { at: 3400, state: { on: false, transitiontime: 5 } }, { at: 8600, state: look({ xy: RED, bri: 254, transitiontime: 0 }) }] },
    house:     { label: 'House lights (normal)',       steps: [{ at: 0, state: look({ ct: 366, bri: 254, transitiontime: 40 }) }] },
    /* The full story's slide effects (story.js: flash, flicker, ghost). */
    storyFlicker: { story: true, steps: [...flicker(0), { at: 2600, state: look({ xy: MOON, bri: 40, transitiontime: 20 }) }] },
    storyGhost:   { story: true, steps: [{ at: 0, state: look({ xy: MOON, bri: 150, transitiontime: 15 }) }] }
  };
  const SCENE_CUE = { 1: 'scene1', 2: 'scene2', 3: 'scene3' };

  /* The look that belongs to a stage, so leaving it and coming back restores the room. */
  function cueForStage(stageId) {
    if (stageId === '3.4') return 'box';
    return { 1: 'scene1', 2: 'scene2', 3: 'scene3' }[String(stageId).charAt(0)] || null;
  }

  function load() { try { return JSON.parse(root.localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function save(patch) {
    const next = Object.assign(load(), patch);
    try { root.localStorage.setItem(KEY, JSON.stringify(next)); } catch (e) { /* lights simply stay manual */ }
    return next;
  }
  function base(s) {
    const host = String(s.bridge || '').trim().replace(/\/+$/, '');
    return /^https?:\/\//.test(host) ? host : `https://${host}`;
  }
  function ready(s) { return Boolean(s.bridge && s.user && s.group != null && s.group !== ''); }

  let status = '';
  let onStatus = null;
  function setStatus(text) { status = text; if (onStatus) onStatus(text); }

  async function call(method, path, body) {
    const s = load();
    const res = await root.fetch(`${base(s)}${path}`, { method, body: body ? JSON.stringify(body) : undefined });
    return res.json();
  }
  const unreachable = 'Cannot reach the bridge. Open "Trust the bridge" and accept the warning, and check this laptop is on the home Wi-Fi.';

  async function send(state, each) {
    const s = load();
    if (!ready(s)) return;
    try {
      const ids = each && Array.isArray(s.lightIds) && s.lightIds.length ? s.lightIds : null;
      const outs = ids
        ? await Promise.all(ids.map((id) => call('PUT', `/api/${s.user}/lights/${id}/state`, state)))
        : [await call('PUT', `/api/${s.user}/groups/${s.group}/action`, state)];
      const out = [].concat(...outs);
      const err = Array.isArray(out) && out.find((r) => r.error);
      setStatus(err ? `Bridge said: ${err.error.description}` : '');
    } catch (e) { setStatus(unreachable); }
  }

  let timers = [];
  let last = null;      // the cue now showing, so a lightning flash can return to it
  function play(steps) {
    timers.forEach(clearTimeout); timers = [];
    steps.forEach((st) => timers.push(setTimeout(() => (st.each ? send(st.each, true) : send(st.state)), st.at)));
  }
  function on(force) { const s = load(); return ready(s) && (s.enabled || force); }
  function cue(name, force) {
    if (!CUES[name] || !on(force)) return;
    last = name;
    play(CUES[name].steps);
  }
  /* The look a cue settles on (its last room step), to come back to after a flash. */
  function settled(name) {
    const room = (CUES[name] ? CUES[name].steps : []).filter((st) => st.state);
    return room.length ? room[room.length - 1].state : null;
  }
  /* Lightning: two white flashes on every bulb, then back to the look that was showing. */
  function lightningSteps() {
    const back = Object.assign({}, settled(last) || CUES.house.steps[0].state);
    return [{ at: 0, each: WHITE }, { at: 250, each: Object.assign({}, back, { transitiontime: 0 }) },
      { at: 500, each: WHITE }, { at: 800, each: Object.assign({}, back, { transitiontime: 4 }) }];
  }
  function flash(force) { if (on(force)) play(lightningSteps()); }
  /* A slide of the full story: its effect, or else its scene's look. */
  function storySlide(slide) {
    if (!on() || !slide) return;
    if (slide.effect === 'flash') { const n = SCENE_CUE[slide.scene]; if (n) last = n; play(lightningSteps()); }
    else if (slide.effect === 'flicker') cue('storyFlicker');
    else if (slide.effect === 'ghost') cue('storyGhost');
    else if (SCENE_CUE[slide.scene] && SCENE_CUE[slide.scene] !== last) cue(SCENE_CUE[slide.scene]);
  }
  function stageCue(stageId) { const n = cueForStage(stageId); if (n && n !== last) cue(n); }
  function screenCue(screen) { if (CUES[screen] && screen !== last) cue(screen); }

  async function connect() {
    try {
      const out = await call('POST', '/api', { devicetype: 'blackwood_manor#host' });
      const ok = out.find((r) => r.success);
      if (ok) { save({ user: ok.success.username }); return { ok: true }; }
      const err = out.find((r) => r.error);
      return { ok: false, text: err && err.error.type === 101 ? 'Press the round button on top of the bridge first, then Connect within 30 seconds.' : `Bridge said: ${err ? err.error.description : 'no answer'}` };
    } catch (e) { return { ok: false, text: unreachable }; }
  }
  async function rooms() {
    const s = load();
    const out = await call('GET', `/api/${s.user}/groups`);
    if (Array.isArray(out)) throw new Error(out[0] && out[0].error ? out[0].error.description : 'unexpected answer');
    return Object.entries(out).filter(([, g]) => (g.type === 'Room' || g.type === 'Zone') && g.lights.length)
      .map(([id, g]) => ({ id, lights: g.lights, name: `${g.name} (${g.lights.length} light${g.lights.length === 1 ? '' : 's'})` }));
  }

  /* The settings panel on the setup screen. */
  function panel() {
    const { el, clear, append } = root.BM.ui;
    const node = el('div', { class: 'panel lights-panel' });
    const draw = async () => {
      const s = load();
      clear(node);
      const msg = el('p', { class: 'dim lights-status' }, status);
      onStatus = (t) => { msg.textContent = t; };
      const say = setStatus;
      const local = /^(localhost|127\.0\.0\.1)$/.test(root.location.hostname);
      append(node,
        el('h3', {}, 'Room lights (Philips Hue)'),
        el('p', { class: 'dim' }, 'The game can set your Hue lights at the big moments: the toast, the deaths, the ghosts, the box and the reveal. Optional: without it, nothing changes.'),
        local ? null : el('p', { class: 'error' }, 'Lights need the game opened from this laptop: http://localhost:8801. The public link cannot talk to devices at home.'),
        el('div', { class: 'row' },
          el('label', { class: 'grow' }, '1. Bridge address (in the Hue app: Settings › Bridges › ⓘ › IP address)',
            el('input', { type: 'text', placeholder: '192.168.x.x', value: s.bridge || '', onchange: (e) => { save({ bridge: e.target.value.trim(), user: null, group: null }); setStatus(''); draw(); } })),
          el('button', { class: 'small', disabled: s.bridge ? null : 'disabled', title: 'Opens the bridge once, so this browser trusts its certificate',
            onclick: () => root.open(`${base(s)}/api/config`, '_blank') }, '2. Trust the bridge')
        ),
        el('p', { class: 'dim' }, '2. Trust the bridge opens a tab. If the browser warns that the connection is not private, choose Advanced › Proceed (or Show details › visit this website). A line starting {"name":"Hue Bridge" means it worked: close that tab.'),
        el('div', { class: 'row' },
          el('button', { disabled: s.bridge ? null : 'disabled', onclick: async () => { say('Connecting…'); const r = await connect(); say(r.ok ? 'Connected.' : r.text); if (r.ok) draw(); } },
            s.user ? '3. Connected ✓ (connect again)' : '3. Press the bridge button, then Connect')
        )
      );
      if (s.user) {
        let found = [];
        const select = el('select', { onchange: (e) => { const r = found.find((x) => x.id === e.target.value); save({ group: e.target.value, lightIds: r ? r.lights : [] }); draw(); } }, el('option', { value: '' }, 'Choose the party room…'));
        try {
          found = await rooms();
          found.forEach((r) => select.append(el('option', { value: r.id, selected: String(s.group) === r.id ? 'selected' : null }, r.name)));
          const mine = found.find((r) => r.id === String(s.group));
          if (mine) save({ lightIds: mine.lights });
        } catch (e) { say(e instanceof TypeError ? unreachable : `Bridge said: ${e.message}. Connect again.`); }
        append(node, el('div', { class: 'row' },
          el('label', { class: 'grow' }, '4. Room or zone the game controls', select),
          el('label', {}, el('input', { type: 'checkbox', checked: s.enabled ? 'checked' : null, disabled: ready(s) ? null : 'disabled', onchange: (e) => { save({ enabled: e.target.checked }); draw(); } }), ' 5. Game controls the lights')
        ));
        if (ready(s)) {
          const tests = el('div', { class: 'row lights-tests' });
          Object.entries(CUES).filter(([, c]) => !c.story).forEach(([name, c]) => tests.append(el('button', { class: 'small', title: 'Try this look now', onclick: () => cue(name, true) }, c.label)));
          tests.append(el('button', { class: 'small', title: 'Lightning flash, then back', onclick: () => flash(true) }, 'Lightning'));
          append(node, el('p', { class: 'dim' }, 'Try each look (works even with 5 unticked):'), tests);
        }
      }
      append(node, msg);
    };
    draw();
    return node;
  }

  function configured() { const s = load(); return ready(s) && Boolean(s.enabled); }

  const api = { CUES, cueForStage, cue, stageCue, screenCue, flash, storySlide, panel, configured, KEY };
  root.BM = root.BM || {};
  root.BM.lights = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
