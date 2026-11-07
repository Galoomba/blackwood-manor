(function (root) {
  const data = root.BM.data;
  const logic = root.BM.logic;
  const audio = root.BM.audio;
  const { el, clear, append, typewrite, narrationNode, linesNode, candles, flashLightning, quoteNode } = root.BM.ui;
  const lights = root.BM.lights;
  const SET_PIECE_LIGHTS = { prologue: 'toast', sheIsDead: 'dead', lightsOut: 'lightsOut', twoGhosts: 'twoGhosts', lastLetter: 'lastLetter' };
  const game = root.BM.createGame(data, logic, root.localStorage);

  const $ = (sel) => document.querySelector(sel);
  function charById(id) { return data.characters.find((c) => c.id === id); }
  function displayName(c) { const n = game.get().names[c.id]; return n ? `${c.short} (${n})` : c.name; }
  function teamLabel(team) { return team === 'delilah' ? 'Team Delilah' : 'Team Victor'; }

  /* Sound plays here only when no TV window is open; the TV window plays it otherwise. */
  function localSoundOn() { return game.get().sound && !game.tvConnected(); }
  function sfx(name) { if (localSoundOn()) audio.play(name); }

  /* ---------- ghost voice-over (recorded; plays on the TV window when one is open) ---------- */
  const voice = root.BM.voicePlayer;
  function hostVoiceOn() { return localSoundOn() && game.get().voiceOver; }
  function toggleVoice() {
    const on = !game.get().voiceOver;
    game.set({ voiceOver: on });
    if (!on) voice.stop();
    render();
  }
  /* Replay is sent through the state so the TV plays it; here only when no TV is open. */
  function cueVoice(group) {
    voice.unlock();
    game.set({ voiceCue: { group, at: Date.now() } });
    if (hostVoiceOn()) voice.play(group);
  }
  function voiceControls(group) {
    const on = game.get().voiceOver;
    const recorded = voice.duration(group) > 0;
    const row = el('div', { class: 'row voice-row' },
      el('button', { class: 'small voice-toggle' + (on ? '' : ' muted'), title: 'Mute the recorded ghost voices to tell the story yourselves', onclick: () => { toggleVoice(); if (row.isConnected) row.replaceWith(voiceControls(group)); } },
        on ? '🔊 Ghost voice-over: on' : '🔇 Ghost voice-over: muted'),
      on && recorded ? el('button', { class: 'small', onclick: () => cueVoice(group) }, '↻ Replay voice-over') : null);
    return row;
  }

  /* ---------- the full story theatre ---------- */
  const story = root.BM.storyView.createPlayer({
    layer: document.getElementById('story-layer'),
    onSlide: (slide) => lights.storySlide(slide),
    controls: true,
    isSpeaker: (st) => !(st.onTv && game.tvConnected()),
    soundOn: () => game.get().sound,
    confirmTv: () => game.get().screen === 'result' || confirm('This shows the whole solution, both killers included, on the TV. Show it now?'),
    onHide: () => render()
  });
  function openStory() { audio.init(); story.open(); }

  /* ---------- introduce the game to the group (spoiler-free; goes to the TV when one is open) ---------- */
  const intro = root.BM.storyView.createPlayer({
    deck: root.BM.intro,
    key: 'blackwood-manor-intro-v1',
    presentIds: () => game.get().presentIds,
    narrateOnStep: true,
    layer: document.getElementById('intro-layer'),
    controls: true,
    isSpeaker: (st) => !(st.onTv && game.tvConnected()),
    soundOn: () => game.get().sound,
    onHide: () => render(),
    finalAction: { label: 'Go to the home screen', run: () => show('title') }
  });
  /* The TV screen gets its own window (not a tab), so it can be dragged to the TV and made full screen.
     A host tab that was once the TV tab keeps its name, and would load the TV over itself: clear it. */
  if (root.name === 'blackwood-tv') root.name = '';
  function openTvWindow() {
    /* Open by name only, so pressing the button again focuses a running TV instead of reloading it. */
    const w = root.open('', 'blackwood-tv', 'popup,width=1280,height=720');
    if (!w) return;
    try { if (!/tv\.html/.test(w.location.href)) w.location.href = new URL('tv.html', root.location.href).href; } catch (e) { /* not ours: leave it */ }
    w.focus();
  }
  function openIntro() { audio.init(); intro.open({ index: 0, playing: true, onTv: game.tvConnected() }); }
  function introButton(cls) { return el('button', { class: cls, onclick: openIntro, title: 'Play the group through how the night works on the TV; the slides move on by themselves (space pauses)' }, 'Introduce the game'); }
  function storyButton(cls, label) { return el('button', { class: cls, onclick: openStory, title: 'Every secret, told from the cellar to the reveal, with narration' }, label || 'The full story'); }

  /* Printing guest cards records who they were printed for, so the host panel lists only the printed lines
     that mention someone missing tonight. */
  function printCards(kind, id, roster) { game.set({ printedIds: game.get().presentIds.slice() }); root.BM.print.open(kind, id, roster); }

  /* ---------- navigation ---------- */
  function show(screen) { if (screen !== 'game') stopTimer(); game.set({ screen }); render(); }

  let lastPlace = null;
  function render() {
    const s = game.get();
    document.querySelectorAll('.screen').forEach((x) => x.classList.remove('active'));
    $('#screen-' + s.screen).classList.add('active');
    const sceneNum = s.screen === 'game' ? game.stage().scene : (s.screen === 'vote' || s.screen === 'result') ? 3 : 0;
    document.body.dataset.scene = sceneNum;
    /* Room lights follow the stage and screen, but never cut into a set piece, the reveal or last words. */
    if (!s.setPiece && !s.revealAt && !story.isShown()) {
      if (s.screen === 'game') { if (s.phase === 'lastwords') lights.screenCue('lastLetter'); else lights.stageCue(game.stage().id); }
      else if (s.screen === 'vote') lights.screenCue('vote');
      else if (s.screen === 'result') lights.screenCue('house');
    }
    if (!story.isShown() && !intro.isShown()) { if (localSoundOn() && sceneNum) audio.startAmbience(sceneNum); else audio.stopAmbience(); }
    const speaking = voice.playing();
    const allowed = /^quote-/.test(speaking || '') ? localSoundOn() : hostVoiceOn();
    if (speaking && (!allowed || (speaking.startsWith('stage-') && (s.screen !== 'game' || speaking !== voice.stageGroup(game.stage().id))))) voice.stop();
    ({ title: renderTitle, setup: renderSetup, print: renderPrint, game: renderGame, vote: renderVote, result: renderResult })[s.screen]();
    const place = `${s.screen}|${s.stageIndex}`;
    if (place !== lastPlace) { lastPlace = place; window.scrollTo(0, 0); }
  }

  function tvBar() {
    const connected = game.tvConnected();
    return el('div', { class: 'tvbar' },
      el('span', { class: 'tvdot' + (connected ? ' on' : '') }),
      el('span', { class: 'dim' }, connected ? 'TV screen connected. Sound plays on the TV window.' : 'No TV screen open. Sound plays here.'),
      el('button', { class: 'small', title: 'Opens in its own window: drag it to the TV and make it full screen', onclick: openTvWindow }, 'Open TV screen')
    );
  }

  /* ---------- title ---------- */
  function renderTitle() {
    const s = game.get();
    const node = clear($('#screen-title'));
    append(node, 
      el('div', { class: 'manor' }, "All Hallows' Eve"),
      el('h1', {}, 'Blackwood Manor'),
      el('p', { class: 'dim' }, 'A murder night in three scenes'),
      candles(),
      el('div', { class: 'row', style: 'justify-content:center' },
        el('button', { class: 'primary', onclick: () => { audio.init(); show('setup'); } }, 'Enter the manor'),
        introButton('ghostly'),
        (s.prologueDone || s.stageIndex > 0) && el('button', { class: 'ghostly', onclick: () => { audio.init(); show('game'); } }, 'Resume the night'),
        storyButton('ghostly', 'The full story (spoilers)')
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
      grid.append(el('div', { class: 'char-card' + (on ? ' on' : '') },
        el('span', { class: 'sym' }, c.symbol),
        el('img', { src: c.image, alt: c.name, onclick: toggle }),
        el('div', { class: 'cname', onclick: toggle }, c.name),
        el('input', { type: 'text', placeholder: 'Played by…', value: s.names[c.id] || '',
          oninput: (e) => { const names = Object.assign({}, game.get().names, { [c.id]: e.target.value }); game.set({ names }); } })
      ));
    }
    append(node, 
      el('h2', {}, 'Who is in the house tonight?'),
      el('p', { class: 'dim' }, 'Tap a portrait to add or remove a guest. A few characters are essential to the story and stay on. Type the real name of the player under each portrait if you want it on the vote screen.'),
      el('div', { class: 'panel' }, grid),
      el('div', { class: 'panel' },
        el('h3', {}, 'Timers, sound and the TV'),
        el('div', { class: 'row' },
          el('label', { class: 'grow' }, 'Card time, minutes', el('input', { type: 'number', min: 1, max: 30, value: s.searchMin, onchange: (e) => game.set({ searchMin: Number(e.target.value) || 3 }) })),
          el('label', { class: 'grow' }, 'Key hunt (3.4), minutes', el('input', { type: 'number', min: 1, max: 30, value: s.huntMin || 10, onchange: (e) => game.set({ huntMin: Number(e.target.value) || 10 }) })),
          el('label', { class: 'grow' }, 'Discussion minutes', el('input', { type: 'number', min: 1, max: 30, value: s.discussMin, onchange: (e) => game.set({ discussMin: Number(e.target.value) || 7 }) })),
          el('label', {}, el('input', { type: 'checkbox', checked: s.sound ? 'checked' : null, onchange: (e) => { game.set({ sound: e.target.checked }); audio.setEnabled(e.target.checked); } }), ' Sound on'),
          el('label', { title: 'Recorded ghost voices read the narration. Turn off to tell the story yourselves.' }, el('input', { type: 'checkbox', checked: s.voiceOver ? 'checked' : null, onchange: (e) => { game.set({ voiceOver: e.target.checked }); if (!e.target.checked) voice.stop(); } }), ' Ghost voice-over')
        ),
        el('p', { class: 'dim', style: 'margin-top:12px' }, 'Two screens: press "Open TV screen", drag that window onto the TV and press F for fullscreen. It shows only what the room may see and follows this window automatically.'),
        tvBar()
      ),
      lights.panel(),
      root.BM.remote.panel(),
      el('p', { class: 'dim' }, s.printedIds
        ? `Cards printed without: ${data.characters.filter((c) => !s.printedIds.includes(c.id)).map((c) => c.short).join(', ') || 'nobody'}. Untick anyone else who does not come; the host panel then tells you which printed lines mention them.`
        : 'Cards printed for: not recorded in this browser. Tick the guests the cards were printed for, then Print pack › Print everything (you can cancel the print), so the host panel knows which printed lines mention a missing guest.'),
      roster.errors.length ? el('p', { class: 'error' }, roster.errors.join(' ')) : null,
      roster.present.length < 6 ? el('p', { class: 'error' }, 'Fewer than six guests: the mystery will be thin. Consider adding characters.') : null,
      el('div', { class: 'row' },
        el('button', { onclick: () => show('print') }, 'Print pack'),
        introButton(''),
        storyButton('', 'The full story'),
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
    for (const c of data.characters) list.append(el('button', { class: 'small', onclick: () => printCards('character', c.id, game.roster()) }, `${c.symbol} ${c.short}`));
    append(node, 
      el('h2', {}, 'Print pack'),
      el('p', { class: 'dim' }, 'Each button opens the browser print dialog. Choose "Save as PDF" or print directly. Use A4, portrait, default margins, background graphics off. Tick everyone you expect first: the character packs leave out whispers and table talk about unticked guests. "Print everything" prints the whole pack in one go (about 92 pages): run sheet, host guide, a stand-in sheet for every guest who might not come, the box, team envelopes, ledger strips, covers, then the character packs. Envelope covers: one per guest with their portrait, plus six pictures for the team stages (two are empty decoys); glue each on a C5 envelope and lay them all on the table.'),
      el('div', { class: 'panel' },
        el('div', { class: 'row' },
          el('button', { class: 'primary', onclick: () => printCards('everything', null, game.roster()) }, 'Print everything'),
          el('button', { onclick: () => printCards('all', null, game.roster()) }, 'All character packs'),
          el('button', { onclick: () => root.BM.print.open('covers') }, 'Envelope covers'),
          el('button', { onclick: () => root.BM.print.open('envelopes') }, 'Team envelopes and witness cards'),
          el('button', { onclick: () => root.BM.print.open('ledger') }, 'Ledger strips'),
          el('button', { onclick: () => root.BM.print.open('box') }, "The box: Delilah's letter"),
          el('button', { onclick: () => root.BM.print.open('runsheet') }, 'Host run sheet'),
          el('button', { onclick: () => root.BM.print.open('standins', null, game.roster()) }, 'Stand-in sheets for absent guests'),
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
      voiceControls(voice.stageGroup(stage.id)),
      el('div', { class: 'scene-label' }, `Scene ${scene.number}: ${scene.title}`),
      el('h2', {}, `${stage.id} ${stage.title}`, el('span', { class: 'kind' }, stage.kind === 'team' ? 'Team' : stage.kind === 'group' ? 'Find alone, solve together' : 'Individual')),
      stage.setPieceBefore ? el('div', { class: 'row', style: 'margin-bottom:12px' }, el('button', { class: 'ghostly small', onclick: () => showSetPiece(stage.setPieceBefore, () => render()) }, '↻ Replay: Victor returns')) : null,
      narr,
      el('div', { class: 'clue' }, stage.clue)
    );

    const phasePanel = el('div', { class: 'panel' });
    buildPhasePanel(phasePanel, stage, s);

    append(node, progress, header, phasePanel, buildHostPanel(stage, s, roster), buildSoundboard(),
      el('div', { class: 'row' },
        el('button', { class: 'small', onclick: () => { stopTimer(); game.prevStage(); render(); } }, '◀ Previous stage'),
        el('button', { class: 'small', onclick: () => show('setup') }, 'Setup'),
        el('button', { class: 'small', onclick: () => show('vote') }, 'Go to vote'),
        storyButton('small', 'Full story')
      )
    );

    if (typedKey !== stage.id) {
      typedKey = stage.id;
      const group = voice.stageGroup(stage.id);
      const seconds = hostVoiceOn() ? voice.duration(group) : 0;
      typewrite(narr, seconds ? voice.typingSpeed(narr, seconds) : undefined);
      if (seconds) voice.play(group);
    }
    else narr.querySelectorAll('.typed').forEach((p) => p.classList.add('finished'));
    resumeTimerIfRunning();
  }

  /* Each stage carries its own card and discussion times; the setup screen's numbers are the fallback. */
  function searchMinutes(stage, s) { return stage.searchOnly ? (s.huntMin || 10) : ((stage.minutes && stage.minutes.cards) || s.searchMin); }
  function discussMinutes(stage, s) { return (stage.minutes && stage.minutes.discuss) || s.discussMin; }

  function buildPhasePanel(panel, stage, s) {
    clear(panel);
    const timerEl = el('div', { class: 'timer', id: 'timer' }, '--:--');
    const label = el('div', { class: 'timer-label', id: 'timer-label' }, '');
    const bar = el('div', { class: 'phase-bar' });

    if (s.phase === 'narration') {
      label.textContent = (s.voiceOver ? 'Let the ghost speak, then ' : 'Read the narration aloud, then ') + (stage.searchOnly ? 'start the key hunt' : 'send them to their envelopes');
      bar.append(el('button', { class: 'primary', onclick: () => startPhase('search') }, `${stage.searchOnly ? 'Start the key hunt' : 'Cards out'} (${searchMinutes(stage, s)} min)`));
    } else if (s.phase === 'search') {
      label.textContent = stage.searchOnly ? 'Hunting for the key' : 'Reading cards';
      bar.append(
        stage.searchOnly
          ? el('button', { class: 'primary', onclick: () => { stopTimer(); game.set({ phase: 'done', timerEnd: null, timerKind: null }); render(); if (localSoundOn()) playClosing(stage); } }, 'End the hunt')
          : el('button', { class: 'primary', onclick: () => startPhase('discussion') }, `Start discussion (${discussMinutes(stage, s)} min)`),
        el('button', { class: 'small', onclick: () => addMinute() }, '+1 min')
      );
      if (stage.searchOnly && stage.setPieceAfter) bar.append(el('button', { onclick: () => { stopTimer(); game.set({ phase: 'done', timerEnd: null, timerKind: null }); playInterlude(stage.setPieceAfter); } }, `▶ ${data.setPieces[stage.setPieceAfter].cue}`));
    } else if (s.phase === 'lastwords') {
      label.textContent = 'Last words, then the vote';
      bar.append(el('button', { class: 'primary', onclick: () => { stopTimer(); game.set({ timerEnd: null, timerKind: null }); show('vote'); } }, 'Open the vote'),
        el('button', { class: 'small', onclick: () => addMinute() }, '+1 min'));
    } else if (s.phase === 'discussion') {
      label.textContent = 'Discussion';
      bar.append(
        el('button', { class: 'primary', onclick: () => { stopTimer(); game.set({ phase: 'done', timerEnd: null, timerKind: null }); render(); if (localSoundOn()) playClosing(stage); } }, 'End discussion'),
        el('button', { class: 'small', onclick: () => addMinute() }, '+1 min')
      );
    } else {
      label.textContent = 'Stage complete';
      panel.append(quoteNode(stage.quote));
      if (stage.announcement) panel.append(narrationNode([stage.announcement], { instant: true }), voiceControls(`announce-${stage.id.replace('.', '-')}`));
      if (stage.setPieceAfter) {
        bar.append(el('button', { class: 'primary', onclick: () => playInterlude(stage.setPieceAfter) }, `▶ ${data.setPieces[stage.setPieceAfter].cue}`));
        if (stage.searchOnly) bar.append(el('button', { onclick: () => show('vote') }, 'The box stays shut: open the vote'));
      } else if (game.get().stageIndex === data.stages.length - 1) {
        bar.append(el('button', { class: 'primary', onclick: () => show('vote') }, 'Open the vote'));
      } else {
        bar.append(el('button', { class: 'primary', onclick: () => { game.nextStage(); render(); } }, 'Next stage ▶'));
      }
    }
    panel.append(timerEl, label, bar);
    if ((stage.run || []).length) panel.append(el('details', { class: 'run', open: 'open' }, el('summary', {}, 'Run sheet for this stage'), el('ul', {}, ...stage.run.map((r) => el('li', {}, r)))));
  }

  /* When a discussion ends: Victor's announcement (if the stage has one and the ghost voice is on),
     then the closing quote, which the narrator reads even with the ghost voice-over muted. The TV
     window does the same by itself when it is open. */
  function playClosing(stage) {
    const id = stage.id.replace('.', '-');
    voice.unlock();
    const quote = () => { if (voice.duration(`quote-${id}`)) voice.play(`quote-${id}`); };
    if (stage.announcement && hostVoiceOn() && voice.duration(`announce-${id}`)) voice.play(`announce-${id}`, quote);
    else quote();
  }

  /* ---------- timers ---------- */
  let timerHandle = null;
  let lastSecond = null;

  function startPhase(kind) {
    const s = game.get();
    const minutes = kind === 'lastwords' ? 2 : kind === 'search' ? searchMinutes(game.stage(), s) : discussMinutes(game.stage(), s);
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
  /* An absent guest's important clue, in their own voice: on the TV window when one is open,
     otherwise full screen here. */
  function callAbsent(o) {
    voice.unlock();
    const call = { characterId: o.characterId, group: o.group, text: o.spoken, at: Date.now() };
    game.set({ absentCall: call });
    if (!game.tvConnected()) showAbsentHere(call);
    else render();
  }
  function closeAbsent() {
    if ((voice.playing() || '').startsWith('absent-')) voice.stop();
    const ov = $('#overlay');
    if (ov.classList.contains('absent')) { ov.classList.add('hidden'); clear(ov); ov.className = 'overlay hidden'; }
    game.set({ absentCall: null });
    render();
  }
  function showAbsentHere(call) {
    const ov = $('#overlay');
    clear(ov);
    ov.className = 'overlay ghostly absent';
    ov.append(root.BM.ui.absentMessage(charById(call.characterId), call.text), el('button', { class: 'primary', style: 'margin-top:24px', onclick: () => closeAbsent() }, 'Close'));
    sfx('bell');
    setTimeout(() => { if (game.get().absentCall && game.get().absentCall.at === call.at && hostVoiceOn()) voice.play(call.group); }, 1400);
  }

  let hostPanelOpen = false;
  function buildHostPanel(stage, s, roster) {
    const idx = s.stageIndex;
    const details = el('details', { class: 'host', open: hostPanelOpen ? 'open' : null, ontoggle: (e) => { hostPanelOpen = e.target.open; } }, el('summary', {}, 'Host only: answer key for this stage'));
    details.append(el('p', {}, stage.hostNotes));

    if (stage.id === '3.1' || stage.id === '3.2') {
      for (const team of ['delilah', 'victor']) {
        const ts = logic.teamSentence(data, roster, team, stage.id);
        details.append(el('p', {}, el('strong', {}, `${teamLabel(team)}: `), `${ts.sentence} → the ${ts.picture} envelope (${data.teamEnvelopes[team][stage.id].title})`,
          ts.missing.length ? el('span', { class: 'dim' }, ` (ghost whispers: ${ts.missing.map((w) => `#${w.index} ${w.text}`).join(', ')})`) : null));
      }
      if (stage.id === '3.1') details.append(el('p', { class: 'dim' }, "Killers' wrong words: " + data.killerIds.map(charById).map((c) => { const w = c.cards['3.1'].word; const m = /say (\w+) instead of (\w+)/.exec(c.cards['3.1'].sabotage || ''); return `${c.short} (#${w.index}) says ${m ? m[1] : '?'} for ${w.text}`; }).join('; ') + '.'));
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

    if (stage.id === '3.4') {
      details.append(el('p', {}, el('strong', {}, 'True key: '), `${data.box.hidingPlace}. ${data.box.rule}`));
      const ul = el('ul', {});
      data.killerIds.map(charById).forEach((c) => ul.append(el('li', {}, el('strong', {}, c.short + ': '), c.cards['3.4'].sabotage)));
      details.append(el('h3', {}, "The killers' tricks"), ul);
    }

    const talkList = el('ul', {});
    roster.present.forEach((c) => {
      const t = logic.talkFor(c.cards[stage.id], roster.present.map((p) => p.id));
      if (t) talkList.append(el('li', {}, el('strong', {}, c.short + ': '), t.text));
    });
    details.append(el('details', {}, el('summary', {}, 'Table talk on the cards this stage (nudge anyone who stays quiet)'), talkList));

    const orphans = logic.orphanedClues(data, roster, stage.id);
    if (orphans.length) {
      const one = orphans.every((o) => o.reader === orphans[0].reader) ? orphans[0].reader : null;
      details.append(el('h3', {}, one ? `Absent guests: ${one} says this for them` : 'Absent guests: each team\'s ghost says this for them'));
      const call = s.absentCall;
      if (call && Date.now() - call.at < 120000) details.append(el('p', { class: 'row' }, el('span', { class: 'dim' }, `On screen: ${charById(call.characterId).short}'s message.`), el('button', { class: 'small', onclick: () => closeAbsent() }, 'Close it')));
      orphans.forEach((o) => details.append(el('div', { class: 'orphan' },
        o.group ? el('button', { class: 'small ghostly', style: 'margin-right:8px', title: 'Plays a bell, then shows this clue on the TV in their own words and voice', onclick: () => callAbsent(o) }, `\u25b6 ${o.kind === 'witness' ? 'Witness card' : 'Their voice'} on TV`) : null,
        el('strong', {}, `${o.symbol} ${o.name} (${o.kind}${o.number ? ' ' + o.number : ''}${o.index ? ` #${o.index}, ${teamLabel(o.team)}` : ''}${one ? '' : `, ${o.reader}`}): `), o.text)));
    }
    /* Printed table talk and whispers that point at a guest who did not come. */
    const fixes = logic.cardFixes(data, roster.present.map((p) => p.id), stage.id, game.get().printedIds || null);
    if (fixes.length) {
      details.append(el('h3', {}, 'Printed cards that mention absent guests'));
      const ul = el('ul', {});
      fixes.forEach((f) => ul.append(el('li', {}, el('strong', {}, `${f.holderName}: `), f.kind === 'talk'
        ? `if the table talk asks about ${f.aboutName}, ${f.instead ? `ask instead: "${f.instead}"` : 'skip it.'}`
        : `if the whisper reads "${f.printed}", it is about ${f.aboutName}, who is not here. If asked: it is about a guest who could not come.`)));
      details.append(ul);
    }
    return el('div', { class: 'panel' }, details);
  }

  function buildSoundboard() {
    const board = el('div', { class: 'soundboard' });
    for (const name of audio.names) board.append(el('button', { class: 'small', onclick: () => triggerSound(name) }, name));
    board.append(el('button', { class: 'small', onclick: () => triggerSound('lightning') }, 'lightning'));
    if (lights.connected()) board.append(el('button', { class: 'small', title: 'Hue lights back to normal', onclick: () => lights.cue('house', true) }, 'house lights'),
      el('button', { class: 'small', title: 'Switch the Hue lights off', onclick: () => lights.cue('off', true) }, 'lights off'));
    return el('div', { class: 'panel' }, el('details', { class: 'host' }, el('summary', {}, 'Soundboard (plays on the TV window when it is open)'), board));
  }

  /* A soundboard press is broadcast through state so the TV window plays it; locally only if no TV. */
  function triggerSound(name) {
    game.set({ sfx: { name, at: Date.now() } });
    if (name === 'lightning') { flashLightning(); sfx('thunder'); lights.flash(); }
    else sfx(name);
  }

  /* ---------- set pieces (mirrored on the TV through state.setPiece) ---------- */
  /* Between scenes: the set piece after a stage, then any it leads into, then the next stage. */
  function playInterlude(key) {
    showSetPiece(key, () => {
      const next = data.setPieces[key].then;
      if (next) playInterlude(next);
      else if (key === 'lastLetter') { game.set({ phase: 'lastwords', timerKind: 'lastwords', timerEnd: Date.now() + 2 * 60000 }); render(); }
      else if (game.get().stageIndex === data.stages.length - 1) show('vote');
      else { game.nextStage(); render(); }
    });
  }

  const INTERLUDE_BUTTON = { lightsOut: 'The ghost speaks', twoGhosts: 'Victor speaks' };
  const INTERLUDE_CUE = { lightsOut: 'Lights off now. Victor: fall.', twoGhosts: 'Victor: rise and stand beside Delilah' };

  function showSetPiece(key, onDone) {
    const sp = data.setPieces[key];
    const ov = $('#overlay');
    clear(ov);
    ov.className = 'overlay';
    const at = Date.now();
    game.set({ setPiece: { key, at } });
    if (SET_PIECE_LIGHTS[key]) lights.cue(SET_PIECE_LIGHTS[key]);
    const lines = linesNode(sp.lines);
    const done = () => { if ((voice.playing() || '').startsWith('set-')) voice.stop(); ov.classList.add('hidden'); clear(ov); game.set({ setPiece: null }); if (onDone) onDone(); };
    const continueBtn = (label) => el('button', { class: 'primary', style: 'margin-top:24px', onclick: done }, label || 'Continue');

    if (root.BM.interlude.has(key)) {
      root.BM.interlude.play(ov, key, {
        lines, sfx, cue: INTERLUDE_CUE[key],
        alive: () => (game.get().setPiece || {}).at === at,
        onReady: () => ov.append(voiceControls(`set-${key}`), continueBtn(INTERLUDE_BUTTON[key])),
        voice: () => { if (hostVoiceOn()) voice.play(`set-${key}`); }
      });
    } else if (key === 'victorReturns') {
      ov.classList.add('ghostly');
      sfx('ghost');
      ov.append(el('div', {}, el('div', { class: 'ghost-shape' }), el('div', { class: 'ghost-shape violet' })), el('h1', {}, 'Victor returns'), el('h2', {}, 'Two murders, two teams'), lines, el('div', { class: 'team-call' }, ...['delilah', 'victor'].map((t) => el('div', {}, el('h3', {}, t === 'delilah' ? 'Team Delilah' : 'Team Victor'), el('p', {}, game.roster().teams[t].map((c) => `${c.symbol} ${displayName(c)}`).join(' · '))))), voiceControls('set-victorReturns'), continueBtn('Form the teams'));
      setTimeout(() => { if ((game.get().setPiece || {}).at === at && hostVoiceOn()) voice.play('set-victorReturns'); }, 1500);
    } else if (key === 'lastLetter') {
      ov.classList.add('ghostly');
      sfx('whisper');
      ov.append(el('div', { class: 'ghost-shape' }), el('h1', {}, sp.title), el('h2', {}, 'To be opened if I die tonight'), lines, voiceControls('set-lastLetter'), continueBtn('Last words (2 min)'));
      setTimeout(() => { if ((game.get().setPiece || {}).at === at && hostVoiceOn()) voice.play('set-lastLetter'); }, 1500);
    } else if (key === 'sheIsDead') {
      ov.classList.add('blackout');
      sfx('toll');
      ov.append(el('h1', {}, 'She is dead'), el('h2', {}, 'Scene 1: The Toast'), lines, voiceControls('set-sheIsDead'), continueBtn('Begin Scene 1'));
      setTimeout(() => { if ((game.get().setPiece || {}).at === at && hostVoiceOn()) voice.play('set-sheIsDead'); }, 1500);
    } else {
      ov.classList.add('ghostly');
      ov.append(el('h1', {}, sp.title), lines, voice.duration(`set-${key}`) ? voiceControls(`set-${key}`) : null, continueBtn(key === 'prologue' ? 'She is dead' : 'Continue'));
      setTimeout(() => { if ((game.get().setPiece || {}).at === at && hostVoiceOn()) voice.play(`set-${key}`); }, 1500);
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
      const save = () => { if (s2.value && s2.value === s1.value) s2.value = ''; const votes = Object.assign({}, game.get().votes, { [v.id]: [s1.value, s2.value] }); game.set({ votes }); renderTally(); };
      s1.addEventListener('change', save); s2.addEventListener('change', save);
      grid.append(el('div', { class: 'voter' }, el('strong', {}, `${v.symbol} ${displayName(v)}`), el('div', { class: 'dim' }, 'accuses'), s1, s2));
    });
    append(node, 
      tvBar(),
      el('h2', {}, 'The accusation'),
      el('p', { class: 'dim' }, 'Go round the table: each guest stands and says "I accuse X and Y" (two different suspects, one reason). Enter each accusation as it is said; the TV tally grows with every one. The house wins only if both killers are the two most accused.'),
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
    /* The vote and result screens each have a tally; fill the one on the screen showing now. */
    const t = $(`#screen-${game.get().screen === 'result' ? 'result' : 'vote'} .tally`); if (!t) return;
    clear(t);
    const result = logic.tally(game.get().votes, data.killerIds, game.roster().present.map((c) => c.id));
    const max = Math.max(1, ...Object.values(result.counts));
    result.ranked.forEach(([id, n]) => {
      const c = charById(id);
      t.append(el('div', { class: 'bar' }, el('span', {}, `${c.symbol} ${c.short}`), el('div', { class: 'fill', style: `width:${(n / max) * 100}%` }), el('span', {}, n)));
    });
    if (!result.ranked.length) t.append(el('p', { class: 'dim' }, 'No accusations yet.'));
    if (result.tie.length) t.append(el('p', { class: 'error' }, `Tie for second place: ${result.tie.map((id) => charById(id).short).join(', ')}. Give each 30 seconds to defend themselves, then go round again, each guest naming one of them aloud (change the second picks above).`));
  }

  function playReveal() {
    const result = logic.tally(game.get().votes, data.killerIds, game.roster().present.map((c) => c.id));
    game.set({ revealAt: Date.now() });
    lights.cue('reveal');
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
      ov.append(el('h1', {}, data.killerIds.map((id) => charById(id).name).join(' & ')), portraits, linesNode(data.reveal.lines), voiceControls('reveal'),
        el('button', { class: 'primary', style: 'margin-top:24px', onclick: () => { voice.stop(); ov.classList.add('hidden'); clear(ov); game.set({ revealAt: null }); show('result'); } }, result.houseWins ? 'The house wins' : 'The killers walk free'));
      sfx('ghost');
      setTimeout(() => { if (!ov.classList.contains('hidden') && hostVoiceOn()) voice.play('reveal'); }, 1200);
    }, 8600);
  }

  function renderResult() {
    const result = logic.tally(game.get().votes, data.killerIds, game.roster().present.map((c) => c.id));
    const node = clear($('#screen-result'));
    append(node, 
      el('h1', { class: 'result-title center' }, result.houseWins ? data.reveal.houseWins : data.reveal.killersWin),
      el('div', { class: 'panel' }, el('h3', {}, 'Final tally'), el('div', { class: 'tally', id: 'tally' })),
      el('p', { class: 'center dim' }, data.reveal.farewell),
      el('div', { class: 'row', style: 'justify-content:center' },
        el('button', { onclick: () => show('vote') }, 'Back to the vote'),
        storyButton('primary', 'Tell the whole story'),
        el('button', { onclick: () => { if (confirm('Start a brand new night? This clears the roster and votes.')) { game.reset(); show('title'); } } }, 'New night')
      )
    );
    renderTally();
  }

  /* ---------- boot ---------- */
  /* A one-time setup link (only on this laptop): http://localhost:8801/#preset=<url-encoded JSON> with
     { game: {presentIds, printedIds, sound, …}, lights: {bridge, user, group, lightIds, enabled} }.
     It is applied once and removed from the address bar. */
  if (/^(localhost|127\.0\.0\.1)$/.test(root.location.hostname) && root.location.hash.startsWith('#preset=')) {
    try {
      const preset = JSON.parse(decodeURIComponent(root.location.hash.slice(8)));
      const allowed = ['presentIds', 'printedIds', 'names', 'sound', 'voiceOver', 'searchMin', 'discussMin', 'huntMin', 'screen'];
      const patch = {};
      allowed.forEach((k) => { if (preset.game && preset.game[k] !== undefined) patch[k] = preset.game[k]; });
      game.set(patch);
      if (preset.lights) lights.configure(preset.lights);
    } catch (e) { /* a broken link changes nothing */ }
    root.history.replaceState(null, '', root.location.pathname + root.location.search);
  }
  /* A reload in the middle of a set piece or the reveal loses its overlay here; clear it for the TV and lights too. */
  if (game.get().setPiece || game.get().revealAt) game.set({ setPiece: null, revealAt: null });
  root.BM.remote.start();
  audio.setEnabled(game.get().sound);
  document.addEventListener('pointerdown', () => { audio.init(); voice.unlock(); }, { once: true });
  /* Keep the TV indicator fresh and hand ambience over when a TV window appears or disappears. */
  let tvWas = game.tvConnected();
  setInterval(() => {
    const now = game.tvConnected();
    if (now !== tvWas) { tvWas = now; render(); }
  }, 2000);
  render();
})(window);
