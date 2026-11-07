(function (root) {
  /* The phone remote, host side. When the game runs from its own server (npm start), this window
     publishes the controls it is showing (buttons and selects, grouped by panel) and presses the
     ones the phone asks for. The laptop stays the only thing that runs the night: sound, the TV,
     lights and timers all happen here, whichever device pressed the button. */
  const SKIP = /^(Reset everything|New night|Open TV screen|Print|Trust the bridge|✕ Close|Show on TV|Stop showing on TV)|Print pack|print/;
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
      .filter((x) => x.label && !SKIP.test(x.label));
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
    return { heading, screen: st.screen, phase: st.phase || '', scene: st.screen === 'game' ? stage.scene : null,
      timer: timer ? timer.textContent : '', detail: where2, tally: st.screen === 'vote' || st.screen === 'result' ? ((document.querySelector('.screen.active .tally') || {}).innerText || '').replace(/\n+/g, ' · ') : '', groups };
  }

  async function publish() {
    const snap = snapshot();
    const body = JSON.stringify(snap);
    if (body === last && Date.now() - lastAt < 2000) return;   // unchanged: a heartbeat every 2s
    last = body; lastAt = Date.now();
    try { await root.fetch(`/remote/state?host=${hostId}`, { method: 'POST', body }); } catch (e) { last = ''; }
  }
  function press(cmd) {
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
