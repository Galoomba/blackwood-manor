(function (root) {
  const data = root.BM.data;
  const logic = root.BM.logic;
  const audio = root.BM.audio;
  const { el, clear, typewrite, narrationNode, linesNode, candles, flashLightning } = root.BM.ui;
  const game = root.BM.createGame(data, logic, root.localStorage);

  const $ = (sel) => document.querySelector(sel);
  function charById(id) { return data.characters.find((c) => c.id === id); }
  function displayName(c) { const n = game.get().names[c.id]; return n ? `${c.short} (${n})` : c.name; }
  function teamLabel(team) { return team === 'delilah' ? 'Team Delilah' : 'Team Victor'; }

  /* Sound plays here only when no TV window is open; the TV window plays it otherwise. */
  function localSoundOn() { return game.get().sound && !game.tvConnected(); }
  function sfx(name) { if (localSoundOn()) audio.play(name); }

  /* ---------- navigation ---------- */
  function show(screen) { game.set({ screen }); render(); }

  function render() {
    const s = game.get();
    document.querySelectorAll('.screen').forEach((x) => x.classList.remove('active'));
    $('#screen-' + s.screen).classList.add('active');
    const sceneNum = s.screen === 'game' ? game.stage().scene : (s.screen === 'vote' || s.screen === 'result') ? 3 : 0;
    document.body.dataset.scene = sceneNum;
    if (localSoundOn() && sceneNum) audio.startAmbience(sceneNum); else audio.stopAmbience();
    ({ title: renderTitle, setup: renderSetup, print: renderPrint, game: renderGame, vote: renderVote, result: renderResult })[s.screen]();
    window.scrollTo(0, 0);
  }

  function tvBar() {
    const connected = game.tvConnected();
    return el('div', { class: 'tvbar' },
      el('span', { class: 'tvdot' + (connected ? ' on' : '') }),
      el('span', { class: 'dim' }, connected ? 'TV screen connected. Sound plays on the TV window.' : 'No TV screen open. Sound plays here.'),
      el('button', { class: 'small', onclick: () => root.open('tv.html', 'blackwood-tv') }, 'Open TV screen')
    );
  }

  /* ---------- title ---------- */
  function renderTitle() {
    const s = game.get();
    const node = clear($('#screen-title'));
    node.append(
      el('div', { class: 'manor' }, "All Hallows' Eve"),
      el('h1', {}, 'Blackwood Manor'),
      el('p', { class: 'dim' }, 'A murder night in three scenes'),
      candles(),
      el('div', { class: 'row', style: 'justify-content:center' },
        el('button', { class: 'primary', onclick: () => { audio.init(); show('setup'); } }, 'Enter the manor'),
        (s.prologueDone || s.stageIndex > 0) && el('button', { class: 'ghostly', onclick: () => { audio.init(); show('game'); } }, 'Resume the night')
      )
    );
  }

  /* ---------- setup ---------- */
  function renderSetup() {
    const s = game.get();
    const roster = game.roster();
    const node = clear($('#screen-setup'));
    const grid = el('div', { class: 'roster' });
    for (const c of data.characters) {
      const on = s.presentIds.includes(c.id);
      const locked = data.requiredIds.includes(c.id);
      const toggle = () => { if (!locked) { game.togglePresent(c.id); renderSetup(); } };
      grid.append(el('div', { class: 'char-card' + (on ? ' on' : '') + (locked ? ' locked' : '') },
        el('span', { class: 'sym' }, c.symbol),
        el('img', { src: c.image, alt: c.name, onclick: toggle }),
        el('div', { class: 'cname', onclick: toggle }, c.name),
        el('input', { type: 'text', placeholder: 'Played by…', value: s.names[c.id] || '',
          oninput: (e) => { const names = Object.assign({}, game.get().names, { [c.id]: e.target.value }); game.set({ names }); } })
      ));
    }
    node.append(
      el('h2', {}, 'Who is in the house tonight?'),
      el('p', { class: 'dim' }, 'Tap a portrait to add or remove a guest. Madame Zora and Dr. Krank must be present; the story needs them. Type the real name of the player under each portrait if you want it on the vote screen.'),
      el('div', { class: 'panel' }, grid),
      el('div', { class: 'panel' },
        el('h3', {}, 'Timers, sound and the TV'),
        el('div', { class: 'row' },
          el('label', { class: 'grow' }, 'Search minutes', el('input', { type: 'number', min: 1, max: 30, value: s.searchMin, onchange: (e) => game.set({ searchMin: Number(e.target.value) || 5 }) })),
          el('label', { class: 'grow' }, 'Discussion minutes', el('input', { type: 'number', min: 1, max: 30, value: s.discussMin, onchange: (e) => game.set({ discussMin: Number(e.target.value) || 7 }) })),
          el('label', {}, el('input', { type: 'checkbox', checked: s.sound ? 'checked' : null, onchange: (e) => { game.set({ sound: e.target.checked }); audio.setEnabled(e.target.checked); } }), ' Sound on')
        ),
        el('p', { class: 'dim', style: 'margin-top:12px' }, 'Two screens: press "Open TV screen", drag that window onto the TV and press F for fullscreen. It shows only what the room may see and follows this window automatically.'),
        tvBar()
      ),
      roster.errors.length ? el('p', { class: 'error' }, roster.errors.join(' ')) : null,
      roster.present.length < 6 ? el('p', { class: 'error' }, 'Fewer than six guests: the mystery will be thin. Consider adding characters.') : null,
      el('div', { class: 'row' },
        el('button', { onclick: () => show('print') }, 'Print pack'),
        el('button', { class: 'primary', disabled: roster.errors.length ? 'disabled' : null, onclick: () => beginNight() }, s.prologueDone ? 'Return to the game' : 'Begin the night'),
        el('button', { class: 'small', onclick: () => { if (confirm('Forget this night and start over?')) { game.reset(); show('title'); } } }, 'Reset everything')
      )
    );
  }

  function beginNight() {
    audio.init();
    if (!game.get().prologueDone) {
      showSetPiece('prologue', () => showSetPiece('sheIsDead', () => { game.set({ prologueDone: true }); show('game'); }));
    } else show('game');
  }

  /* ---------- print ---------- */
  function renderPrint() {
    const node = clear($('#screen-print'));
    const list = el('div', { class: 'row' });
    for (const c of data.characters) list.append(el('button', { class: 'small', onclick: () => root.BM.print.open('character', c.id) }, `${c.symbol} ${c.short}`));
    node.append(
      el('h2', {}, 'Print pack'),
      el('p', { class: 'dim' }, 'Each button opens the browser print dialog. Choose "Save as PDF" or print directly. Use A4, portrait, default margins, background graphics off.'),
      el('div', { class: 'panel' },
        el('div', { class: 'row' },
          el('button', { class: 'primary', onclick: () => root.BM.print.open('all') }, 'All character packs'),
          el('button', { onclick: () => root.BM.print.open('stations') }, 'Station labels'),
          el('button', { onclick: () => root.BM.print.open('envelopes') }, 'Team envelopes and witness cards'),
          el('button', { onclick: () => root.BM.print.open('ledger') }, 'Ledger strips'),
          el('button', { onclick: () => root.BM.print.open('guide', null, game.roster()) }, 'Host guide')
        )
      ),
      el('div', { class: 'panel' }, el('h3', {}, 'One character'), list),
      el('button', { onclick: () => show('setup') }, 'Back')
    );
  }

  /* ---------- game ---------- */
  let typedKey = null;

  function renderGame() {
    const s = game.get();
    const stage = game.stage();
    const scene = data.scenes[stage.scene - 1];
    const roster = game.roster();
    const node = clear($('#screen-game'));

    const progress = el('div', { class: 'progress' });
    data.stages.forEach((st, i) => progress.append(el('div', {
      class: 'step' + (i < s.stageIndex ? ' done' : i === s.stageIndex ? ' current' : ''), title: `${st.id} ${st.title}`,
      onclick: () => { stopTimer(); game.set({ stageIndex: i, phase: 'narration', timerEnd: null, timerKind: null }); render(); }
    })));

    const narr = narrationNode(stage.narration);
    const header = el('div', { class: 'panel' },
      tvBar(),
      el('div', { class: 'scene-label' }, `Scene ${scene.number}: ${scene.title}`),
      el('h2', {}, `${stage.id} ${stage.title}`, el('span', { class: 'kind' }, stage.kind === 'team' ? 'Team' : stage.kind === 'group' ? 'Find alone, solve together' : 'Individual')),
      stage.setPieceBefore ? el('div', { class: 'row', style: 'margin-bottom:12px' }, el('button', { class: 'ghostly', onclick: () => showSetPiece(stage.setPieceBefore, () => render()) }, '▶ Play: Victor returns')) : null,
      narr,
      el('div', { class: 'clue' }, stage.clue)
    );

    const phasePanel = el('div', { class: 'panel' });
    buildPhasePanel(phasePanel, stage, s);

    node.append(progress, header, phasePanel, buildHostPanel(stage, s, roster), buildSoundboard(),
      el('div', { class: 'row' },
        el('button', { class: 'small', onclick: () => { stopTimer(); game.prevStage(); render(); } }, '◀ Previous stage'),
        el('button', { class: 'small', onclick: () => show('setup') }, 'Setup'),
        el('button', { class: 'small', onclick: () => show('vote') }, 'Go to vote')
      )
    );

    if (typedKey !== stage.id) { typedKey = stage.id; typewrite(narr); }
    else narr.querySelectorAll('.typed').forEach((p) => p.classList.add('finished'));
    resumeTimerIfRunning();
  }

  function buildPhasePanel(panel, stage, s) {
    clear(panel);
    const timerEl = el('div', { class: 'timer', id: 'timer' }, '--:--');
    const label = el('div', { class: 'timer-label', id: 'timer-label' }, '');
    const bar = el('div', { class: 'phase-bar' });

    if (s.phase === 'narration') {
      label.textContent = 'Read the narration aloud, then send them searching';
      bar.append(el('button', { class: 'primary', onclick: () => startPhase('search') }, `Start search (${s.searchMin} min)`));
    } else if (s.phase === 'search') {
      label.textContent = 'Searching';
      bar.append(
        el('button', { class: 'primary', onclick: () => startPhase('discussion') }, `Start discussion (${s.discussMin} min)`),
        el('button', { class: 'small', onclick: () => addMinute() }, '+1 min')
      );
    } else if (s.phase === 'discussion') {
      label.textContent = 'Discussion';
      bar.append(
        el('button', { class: 'primary', onclick: () => { stopTimer(); game.set({ phase: 'done', timerEnd: null, timerKind: null }); render(); } }, 'End discussion'),
        el('button', { class: 'small', onclick: () => addMinute() }, '+1 min')
      );
    } else {
      label.textContent = 'Stage complete';
      if (stage.announcement) panel.append(narrationNode([stage.announcement], { instant: true }));
      if (stage.setPieceAfter) {
        bar.append(el('button', { class: 'primary', onclick: () => showSetPiece(stage.setPieceAfter, () => { game.nextStage(); render(); }) }, '▶ The lights go out'));
      } else if (game.get().stageIndex === data.stages.length - 1) {
        bar.append(el('button', { class: 'primary', onclick: () => show('vote') }, 'Open the vote'));
      } else {
        bar.append(el('button', { class: 'primary', onclick: () => { game.nextStage(); render(); } }, 'Next stage ▶'));
      }
    }
    panel.append(timerEl, label, bar);
  }

  /* ---------- timers ---------- */
  let timerHandle = null;
  let lastSecond = null;

  function startPhase(kind) {
    const s = game.get();
    const minutes = kind === 'search' ? s.searchMin : s.discussMin;
    game.set({ phase: kind, timerKind: kind, timerEnd: Date.now() + minutes * 60000 });
    render();
  }
  function addMinute() { const s = game.get(); if (s.timerEnd) game.set({ timerEnd: s.timerEnd + 60000 }); }
  function stopTimer() { if (timerHandle) clearInterval(timerHandle); timerHandle = null; lastSecond = null; }
  function resumeTimerIfRunning() {
    stopTimer();
    const s = game.get();
    if (!s.timerEnd) return;
    const tick = () => {
      const t = $('#timer'); if (!t) return stopTimer();
      const remaining = Math.ceil((game.get().timerEnd - Date.now()) / 1000);
      const f = logic.formatRemaining(remaining);
      t.textContent = f.text;
      t.classList.toggle('urgent', f.urgent);
      t.classList.toggle('over', f.over);
      if (remaining !== lastSecond) {
        if (f.urgent) sfx('tick');
        if (remaining === 0) sfx('toll');
        lastSecond = remaining;
      }
    };
    tick();
    timerHandle = setInterval(tick, 250);
  }

  /* ---------- host panel ---------- */
  function buildHostPanel(stage, s, roster) {
    const idx = s.stageIndex;
    const details = el('details', { class: 'host' }, el('summary', {}, 'Host only: answer key for this stage'));
    details.append(el('p', {}, stage.hostNotes));

    const table = el('table', {}, el('tr', {}, el('th', {}, 'Station'), el('th', {}, 'Cards here this stage')));
    for (const st of data.STATIONS) {
      const cards = logic.cardsAtStation(data, st, idx).map((c) => `${c.symbol} ${c.short}${roster.present.some((p) => p.id === c.id) ? '' : ' (absent)'}`);
      const extras = [];
      for (const team of ['delilah', 'victor']) {
        const env = data.teamEnvelopes[team][stage.id];
        if (env && env.station === st) extras.push(`${teamLabel(team).toUpperCase()} envelope: ${env.title}`);
      }
      table.append(el('tr', {}, el('td', {}, st), el('td', {}, [...cards, ...extras].join(' · '))));
    }
    details.append(el('h3', {}, 'Where the cards are'), table);

    if (stage.id === '3.1' || stage.id === '3.2') {
      for (const team of ['delilah', 'victor']) {
        const ts = logic.teamSentence(data, roster, team, stage.id);
        details.append(el('p', {}, el('strong', {}, `${teamLabel(team)}: `), `${ts.sentence} → ${ts.station}`,
          ts.missing.length ? el('span', { class: 'dim' }, ` (ghost whispers: ${ts.missing.map((w) => `#${w.index} ${w.text}`).join(', ')})`) : null));
      }
      if (stage.id === '3.1') details.append(el('p', { class: 'dim' }, "Killers' wrong words: Zora says TALKS for WALKS; Krank says DRINKS for BLINKS."));
    }
    if (stage.id === '3.2') {
      for (const team of ['delilah', 'victor']) {
        const w = data.witnessCards[team];
        details.append(el('p', {}, el('strong', {}, `Witness card, ${teamLabel(team)} (read by ${charById(w.reader).short}): `), w.text));
      }
    }
    if (stage.id === '2.3') {
      const ol = el('ol', {});
      data.ledger.forEach((strip) => ol.append(el('li', {}, el('strong', {}, `${charById(strip.holder).short}: `), strip.text)));
      details.append(el('h3', {}, 'The ledger in order'), ol);
    }
    if (stage.id === '3.3') {
      const ul = el('ul', {});
      roster.present.forEach((c) => ul.append(el('li', {}, el('strong', {}, c.short + ': '), c.cards['3.3'].alibi, c.cards['3.3'].lie ? el('em', { class: 'error' }, ` LIE: ${c.cards['3.3'].lie}`) : null)));
      details.append(el('h3', {}, 'Alibis'), ul);
    }

    const orphans = logic.orphanedClues(data, roster, stage.id);
    if (orphans.length) {
      details.append(el('h3', {}, 'Absent guests: the ghost delivers these'));
      orphans.forEach((o) => details.append(el('div', { class: 'orphan' }, el('strong', {}, `${o.symbol} ${o.name} (${o.kind}${o.number ? ' ' + o.number : ''}${o.index ? ' word #' + o.index : ''}): `), o.text)));
    }
    return el('div', { class: 'panel' }, details);
  }

  function buildSoundboard() {
    const board = el('div', { class: 'soundboard' });
    for (const name of audio.names) board.append(el('button', { class: 'small', onclick: () => triggerSound(name) }, name));
    board.append(el('button', { class: 'small', onclick: () => triggerSound('lightning') }, 'lightning'));
    return el('div', { class: 'panel' }, el('details', { class: 'host' }, el('summary', {}, 'Soundboard (plays on the TV window when it is open)'), board));
  }

  /* A soundboard press is broadcast through state so the TV window plays it; locally only if no TV. */
  function triggerSound(name) {
    game.set({ sfx: { name, at: Date.now() } });
    if (name === 'lightning') { flashLightning(); sfx('thunder'); }
    else sfx(name);
  }

  /* ---------- set pieces (mirrored on the TV through state.setPiece) ---------- */
  function showSetPiece(key, onDone) {
    const sp = data.setPieces[key];
    const ov = $('#overlay');
    clear(ov);
    ov.className = 'overlay';
    game.set({ setPiece: { key, at: Date.now() } });
    const lines = linesNode(sp.lines);
    const done = () => { ov.classList.add('hidden'); clear(ov); game.set({ setPiece: null }); if (onDone) onDone(); };
    const continueBtn = (label) => el('button', { class: 'primary', style: 'margin-top:24px', onclick: done }, label || 'Continue');

    if (key === 'lightsOut') {
      ov.classList.add('blackout', 'flicker');
      sfx('death');
      flashLightning();
      setTimeout(() => ov.append(el('h1', {}, 'Scene 2'), el('h2', {}, 'The Master Falls'), lines, continueBtn('The ghost speaks')), 3000);
    } else if (key === 'victorReturns') {
      ov.classList.add('ghostly');
      sfx('ghost');
      ov.append(el('div', {}, el('div', { class: 'ghost-shape' }), el('div', { class: 'ghost-shape violet' })), el('h1', {}, 'Scene 3'), el('h2', {}, 'Two Ghosts'), lines, continueBtn('Form the teams'));
    } else if (key === 'sheIsDead') {
      ov.classList.add('blackout');
      sfx('toll');
      ov.append(el('h1', {}, 'She is dead'), el('h2', {}, 'Scene 1: The Toast'), lines, continueBtn('Begin Scene 1'));
    } else {
      ov.classList.add('ghostly');
      ov.append(el('h1', {}, sp.title), lines, continueBtn(key === 'prologue' ? 'She is dead' : 'Continue'));
    }
  }

  /* ---------- vote ---------- */
  function renderVote() {
    const s = game.get();
    const roster = game.roster();
    const node = clear($('#screen-vote'));
    const grid = el('div', { class: 'vote-grid' });
    const options = (sel) => {
      const sl = el('select', {}, el('option', { value: '' }, '— choose —'));
      roster.present.forEach((c) => sl.append(el('option', { value: c.id, selected: sel === c.id ? 'selected' : null }, `${c.symbol} ${displayName(c)}`)));
      return sl;
    };
    roster.present.forEach((v) => {
      const picks = s.votes[v.id] || ['', ''];
      const s1 = options(picks[0]); const s2 = options(picks[1]);
      const save = () => { const votes = Object.assign({}, game.get().votes, { [v.id]: [s1.value, s2.value] }); game.set({ votes }); renderTally(); };
      s1.addEventListener('change', save); s2.addEventListener('change', save);
      grid.append(el('div', { class: 'voter' }, el('strong', {}, `${v.symbol} ${displayName(v)}`), el('div', { class: 'dim' }, 'accuses'), s1, s2));
    });
    node.append(
      tvBar(),
      el('h2', {}, 'The accusation'),
      el('p', { class: 'dim' }, 'Every guest names two suspects. The house wins only if both killers are the two most accused. The TV shows the tally as you enter it.'),
      el('div', { class: 'panel' }, grid),
      el('div', { class: 'panel' }, el('h3', {}, 'Tally'), el('div', { class: 'tally', id: 'tally' })),
      el('div', { class: 'row' },
        el('button', { class: 'primary', onclick: () => playReveal() }, '▶ Reveal the killers'),
        el('button', { class: 'small', onclick: () => show('game') }, 'Back to the game')
      )
    );
    renderTally();
  }

  function renderTally() {
    const t = $('#tally'); if (!t) return;
    clear(t);
    const result = logic.tally(game.get().votes, data.killerIds);
    const max = Math.max(1, ...Object.values(result.counts));
    result.ranked.forEach(([id, n]) => {
      const c = charById(id);
      t.append(el('div', { class: 'bar' }, el('span', {}, `${c.symbol} ${c.short}`), el('div', { class: 'fill', style: `width:${(n / max) * 100}%` }), el('span', {}, n)));
    });
    if (!result.ranked.length) t.append(el('p', { class: 'dim' }, 'No accusations yet.'));
  }

  function playReveal() {
    const result = logic.tally(game.get().votes, data.killerIds);
    game.set({ revealAt: Date.now() });
    const ov = $('#overlay');
    clear(ov);
    ov.className = 'overlay blackout';
    const c = candles();
    ov.append(c);
    [0, 1, 2].forEach((i) => setTimeout(() => { c.children[i].style.visibility = 'hidden'; sfx('puff'); }, 1200 + i * 1100));
    setTimeout(() => sfx('heartbeat'), 4600);
    setTimeout(() => {
      clear(ov);
      const portraits = el('div', { class: 'reveal-portraits' });
      data.killerIds.forEach((id) => portraits.append(el('img', { src: charById(id).image, alt: charById(id).name })));
      ov.append(el('h1', {}, data.killerIds.map((id) => charById(id).name).join(' & ')), portraits, linesNode(data.reveal.lines),
        el('button', { class: 'primary', style: 'margin-top:24px', onclick: () => { ov.classList.add('hidden'); clear(ov); game.set({ revealAt: null }); show('result'); } }, result.houseWins ? 'The house wins' : 'The killers walk free'));
      sfx('ghost');
    }, 8600);
  }

  function renderResult() {
    const result = logic.tally(game.get().votes, data.killerIds);
    const node = clear($('#screen-result'));
    node.append(
      el('h1', { class: 'result-title center' }, result.houseWins ? data.reveal.houseWins : data.reveal.killersWin),
      el('div', { class: 'panel' }, el('h3', {}, 'Final tally'), el('div', { class: 'tally', id: 'tally' })),
      el('p', { class: 'center dim' }, data.reveal.farewell),
      el('div', { class: 'row', style: 'justify-content:center' },
        el('button', { onclick: () => show('vote') }, 'Back to the vote'),
        el('button', { class: 'primary', onclick: () => { if (confirm('Start a brand new night? This clears the roster and votes.')) { game.reset(); show('title'); } } }, 'New night')
      )
    );
    renderTally();
  }

  /* ---------- boot ---------- */
  audio.setEnabled(game.get().sound);
  document.addEventListener('pointerdown', () => audio.init(), { once: true });
  /* Keep the TV indicator fresh and hand ambience over when a TV window appears or disappears. */
  let tvWas = game.tvConnected();
  setInterval(() => {
    const now = game.tvConnected();
    if (now !== tvWas) { tvWas = now; render(); }
  }, 2000);
  render();
})(window);
