(function (root) {
  /* The phone remote, host side. When the game runs from its own server (npm start), this window
     publishes the controls it is showing (buttons and selects, grouped by panel) and presses the
     ones the phone asks for. The laptop stays the only thing that runs the night: sound, the TV,
     lights and timers all happen here, whichever device pressed the button. */
  /* Left off the phone: buttons that ask for confirmation on the laptop, open windows or print. The full
     story's TV button asks first (it shows the solution), so only the intro's goes to the phone. */
  const SKIP = /^(Reset everything|New night|Open TV screen|Print|Trust the bridge)|Print pack|print/;
  const SKIP_STORY = /^(Show on TV|Stop showing on TV)/;
  let on = false, last = '', lastAt = 0, since = 0, primed = false, info = null;
  const hostId = Math.random().toString(36).slice(2, 10);

  function rootNode() {
    const ov = document.getElementById('overlay');
    if (ov && !ov.classList.contains('hidden') && ov.childElementCount) return { node: ov, where: 'overlay' };
    for (const id of ['intro-layer', 'story-layer']) {
      const l = document.getElementById(id);
      if (l && !l.classList.contains('hidden')) return { node: l, where: id === 'intro-layer' ? 'intro' : 'story' };
    }
    return { node: document.querySelector('.screen.active'), where: 'screen' };
  }
  function groupOf(c) {
    const d = c.closest('details');
    if (d) { const s = d.querySelector('summary'); return s ? s.textContent.trim() : 'More'; }
    const p = c.closest('.panel, .story-controls');
    if (p && p.classList.contains('story-controls')) return 'Slides';
    const h = p && p.querySelector('h2, h3');
    return h ? ([...h.childNodes].find((n) => n.nodeType === 3 && n.textContent.trim()) || h).textContent.trim() : 'Controls';
  }
  function labelOf(c) {
    if (c.tagName === 'BUTTON') return c.textContent.trim().replace(/\s+/g, ' ');
    const voter = c.closest('.voter');
    if (voter) { const both = [...voter.querySelectorAll('select')]; return `${voter.querySelector('strong').textContent.trim()} accuses (${both.indexOf(c) + 1})`; }
    if (c.closest('.story-controls')) return 'Chapter';
    const l = c.closest('label');
    return l ? l.textContent.trim().split('\n')[0] : 'Choice';
  }
  /* Every control the host could press now, in page order. */
  function controls() {
    const { node, where } = rootNode();
    if (!node) return { where, list: [] };
    const list = [...node.querySelectorAll('button, select')]
      .filter((c) => !c.disabled && !c.closest('.hidden') && !c.closest('.lights-panel'))
      .map((c) => ({ c, label: labelOf(c) }))
      .filter((x) => x.label && !SKIP.test(x.label) && !(where === 'story' && SKIP_STORY.test(x.label)));
    return { where, list };
  }

  function snapshot() {
    let st = {};
    try { st = JSON.parse(root.localStorage.getItem('blackwood-manor-state-v1')) || {}; } catch (e) { /* empty */ }
    const data = root.BM.data;
    const stage = data.stages[st.stageIndex || 0];
    const { where, list } = controls();
    const groups = [];
    list.forEach((x, id) => {
      const g = groupOf(x.c);
      let grp = groups.find((y) => y.title === g);
      if (!grp) { grp = { title: g, items: [] }; groups.push(grp); }
      grp.items.push(x.c.tagName === 'SELECT'
        ? { id, type: 'select', label: x.label, value: x.c.value, options: [...x.c.options].map((o) => ({ value: o.value, text: o.textContent })) }
        : { id, type: 'button', label: x.label, primary: x.c.classList.contains('primary') });
    });
    const timer = document.querySelector('.screen.active #timer');
    const ov = document.getElementById('overlay');
    const heading = where === 'overlay' ? ((ov.querySelector('h1') || {}).textContent || 'Set piece')
      : where === 'intro' ? 'Introducing the game' : where === 'story' ? 'The full story'
      : st.screen === 'game' ? `${stage.id} ${stage.title}` : ({ title: 'Title', setup: 'Setup', print: 'Print', vote: 'The accusation', result: 'The result' })[st.screen] || '';
    const where2 = where === 'intro' || where === 'story' ? (document.querySelector(`#${where === 'intro' ? 'intro' : 'story'}-layer .story-where`) || {}).textContent || '' : '';
    return { heading, lights: root.BM.lights.connected(), notes: notes(st), screen: st.screen, phase: st.phase || '', scene: st.screen === 'game' ? stage.scene : null,
      timer: timer ? timer.textContent : '', detail: where2, tally: st.screen === 'vote' || st.screen === 'result' ? ((document.querySelector('.screen.active .tally') || {}).innerText || '').replace(/\n+/g, ' · ') : '', groups };
  }

  /* The host instructions on screen, as plain text blocks: the run sheet, the host-only answer key
     (with its nested lists), the stage narration, and any cue shown in an interlude. */
  function textOf(n) {
    const c = n.cloneNode(true);
    c.querySelectorAll('button, select, summary, details').forEach((x) => x.remove());
    const strong = c.querySelector('strong');
    const b = strong ? strong.textContent.trim() : '';
    if (strong) strong.remove();
    return { b, t: c.textContent.replace(/\s+/g, ' ').trim() };
  }
  function serialize(det) {
    const sum = det.querySelector(':scope > summary');
    const out = { title: sum ? sum.textContent.trim() : '', blocks: [] };
    for (const ch of det.children) {
      if (ch.tagName === 'SUMMARY') continue;
      if (ch.tagName === 'DETAILS') out.blocks.push({ k: 'sub', section: serialize(ch) });
      else if (/^H[2-4]$/.test(ch.tagName)) out.blocks.push({ k: 'h', t: ch.textContent.trim() });
      else if (ch.tagName === 'UL' || ch.tagName === 'OL') out.blocks.push({ k: 'list', ordered: ch.tagName === 'OL', items: [...ch.children].map(textOf).filter((x) => x.b || x.t) });
      else { const x = textOf(ch); if (x.b || x.t) out.blocks.push({ k: 'p', b: x.b, t: x.t }); }
    }
    return out;
  }
  function notes(st) {
    const out = [];
    const ov = document.getElementById('overlay');
    if (ov && !ov.classList.contains('hidden')) ov.querySelectorAll('.interlude-cue').forEach((c) => out.push({ title: 'Cue now', open: true, blocks: [{ k: 'p', b: '', t: c.textContent.trim() }] }));
    const scr = document.querySelector('.screen.active');
    if (st.screen === 'game' && scr) {
      const run = scr.querySelector('details.run');
      if (run) out.push(Object.assign(serialize(run), { open: true }));
      const stage = root.BM.data.stages[st.stageIndex || 0];
      if ((stage.narration || []).length) out.push({ title: 'Narration', blocks: stage.narration.map((l) => ({ k: 'p', b: `${l.speaker}: `, t: l.text })).concat(stage.clue ? [{ k: 'p', b: 'Clue on screen: ', t: stage.clue }] : []) });
      const host = scr.querySelector('details.host');
      if (host) out.push(serialize(host));
    } else if (scr) {
      const intro = [...scr.querySelectorAll(':scope > p.dim')].map((p) => ({ k: 'p', b: '', t: p.textContent.trim() })).filter((x) => x.t);
      if (intro.length) out.push({ title: 'On the laptop', open: true, blocks: intro });
    }
    return out;
  }

  async function publish() {
    const snap = snapshot();
    const body = JSON.stringify(snap);
    if (body === last && Date.now() - lastAt < 2000) return;   // unchanged: a heartbeat every 2s
    last = body; lastAt = Date.now();
    try { await root.fetch(`/remote/state?host=${hostId}`, { method: 'POST', body }); } catch (e) { last = ''; }
  }
  /* Presses with a negative id are the phone's own buttons, available on every screen. */
  const SPECIAL = { 'lights:off': () => root.BM.lights.cue('off', true), 'lights:house': () => root.BM.lights.cue('house', true) };
  function press(cmd) {
    if (cmd.id < 0) { if (SPECIAL[cmd.label]) SPECIAL[cmd.label](); return; }
    const { list } = controls();
    const x = (list[cmd.id] && list[cmd.id].label === cmd.label) ? list[cmd.id] : list.find((y) => y.label === cmd.label);
    if (!x) return;
    if (x.c.tagName === 'SELECT') { x.c.value = cmd.value == null ? '' : cmd.value; x.c.dispatchEvent(new Event('change', { bubbles: true })); }
    else x.c.click();
  }
  async function poll() {
    try {
      const r = await (await root.fetch(`/remote/cmd?since=${since}&host=${hostId}`, { cache: 'no-store' })).json();
      if (!primed) { primed = true; since = r.seq; return; }   // never replay presses from before this page loaded
      for (const c of r.cmds) { since = Math.max(since, c.seq); if (Date.now() - c.at < 10000) press(c); }
      if (r.cmds.length) { last = ''; setTimeout(publish, 150); }
    } catch (e) { /* server gone: try again */ }
  }

  async function start() {
    try { info = await (await root.fetch('/remote/info', { cache: 'no-store' })).json(); } catch (e) { info = null; }
    if (!info || !info.url) return;
    on = true;
    setInterval(publish, 500);
    setInterval(poll, 350);
    poll();
  }

  /* A setup-screen panel with the phone link and its QR code. */
  function panel() {
    const { el } = root.BM.ui;
    const node = el('div', { class: 'panel remote-panel' }, el('h3', {}, 'Phone remote'));
    const fill = () => {
      if (!info || !info.url) { node.append(el('p', { class: 'dim' }, 'Start the game with "Start Blackwood Manor" (or npm start) to control it from your phone too.')); return; }
      const qr = el('div', { class: 'remote-qr' });
      node.append(el('p', { class: 'dim' }, 'Scan with your phone (on the same Wi-Fi) to press the same buttons from your hand; the laptop still runs the sound, the TV and the lights. Anyone with this link can control the game, so keep it to yourself.'),
        qr, el('p', {}, el('code', {}, info.url)));
      if (root.QRCode) { try { new root.QRCode(qr, { text: info.url, width: 180, height: 180, colorDark: '#000000', colorLight: '#ffffff' }); } catch (e) { /* the link is enough */ } }
    };
    if (info) fill(); else setTimeout(() => { fill(); }, 900);
    return node;
  }

  root.BM = root.BM || {};
  root.BM.remote = { start, panel, isOn: () => on };
})(window);
