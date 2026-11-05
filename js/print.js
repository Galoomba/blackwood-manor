(function (root) {
  const data = root.BM.data;
  const logic = root.BM.logic;

  function esc(s) { return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
  /* Every character symbol prints at one or two fixed sizes. Chrome fails to build a large PDF when the same
     colour emoji is drawn at many different sizes, which the width-scaled card sheets would otherwise cause. */
  const sym = (x) => `<span class="sym">${x}</span>`;
  function charById(id) { return data.characters.find((c) => c.id === id); }
  function stageTitle(i) { return `${data.STAGE_IDS[i]} ${data.stages[i].title}`; }
  function teamLabel(team) { return team === 'delilah' ? 'TEAM DELILAH' : 'TEAM VICTOR'; }

  function introSheet(c) {
    return `<div class="sheet intro">
      <img class="portrait" src="${c.image}" alt="">
      <h1>${sym(c.symbol)} ${esc(c.name)}</h1>
      <p><em>${esc(c.costume)} · Blackwood Manor, All Hallows' Eve</em></p>
      <h2>Who you are</h2><p>${esc(c.intro.text)}</p>
      <h2>How to act</h2><p>${esc(c.intro.act)}</p>
      <h2>Your quirk, all night</h2><p>${esc(c.intro.quirk)}</p>
      <h2>Your public line (say it to everyone)</h2><div class="boxed">“${esc(c.intro.publicLine)}”</div>
      <div class="intro-rules"><h2>How the night works</h2>
      <p>Every guest has an envelope on the table with their own picture on it. At each stage, take only the top card from <strong>your</strong> envelope (${sym(c.symbol)} ${esc(c.short)}) and check its stage number. Never look further down the pile, and never open anyone else's envelope. Read your cards privately unless the card says otherwise. Keep your cards; you will need them.</p>
      <p>The foot of every card carries a whisper: something true about another guest, who is never named. Work out who it is about, and use it. Most cards also carry <strong>table talk</strong>: a question to raise aloud in the discussion. Raise it.</p>
      <p>At the end, everyone names two suspects in secret. The house wins only if both killers are clearly the top two.</p></div>
    </div>`;
  }

  function allPresent() { return data.characters.map((x) => x.id); }

  function cardHtml(c, i, presentIds) {
    const sid = data.STAGE_IDS[i];
    const card = c.cards[sid];
    const parts = [];
    parts.push(`<div class="head"><span>${sym(c.symbol)} ${esc(c.short)}</span><span>Stage ${esc(stageTitle(i))}</span></div>`);
    if (card.word) parts.push(`<div>Your team word is number <strong>${card.word.index}</strong>:</div><div class="word">${esc(card.word.text)}</div>`);
    if (card.alibi) parts.push(`<p>Read aloud, exactly:</p><p>“${esc(card.alibi)}”</p>`);
    else parts.push(`<p>${esc(card.text)}</p>`);
    if (card.ledger) parts.push(`<p><strong>Ledger strip ${card.ledger} lies under this card in your envelope.</strong></p>`);
    if (card.secretSign) parts.push(`<div class="sab">${esc(data.SIGN)}</div>`);
    if (card.sabotage) parts.push(`<div class="sab">${esc(card.sabotage)}</div>`);
    if (card.lie) parts.push(`<div class="sab">${esc(card.lie)}</div>`);
    const talk = logic.talkFor(card, presentIds || allPresent());
    if (talk) parts.push(`<div class="talk">${esc(talk.text)}</div>`);
    const rumour = logic.rumourFor(card, presentIds || allPresent());
    if (rumour) parts.push(`<div class="whisper">${esc(rumour.text)}</div>`);
    return `<div class="card">${parts.join('')}</div>`;
  }

  function cardPages(c, presentIds) {
    const cards = data.STAGE_IDS.map((_, i) => cardHtml(c, i, presentIds));
    const pages = [];
    for (let p = 0; p < cards.length; p += 4) {
      const chunk = cards.slice(p, p + 4);
      while (chunk.length < 4) chunk.push('<div class="card"></div>');
      pages.push(`<div class="sheet"><div class="card-grid">${chunk.join('')}</div></div>`);
    }
    return pages.join('');
  }

  function characterPack(c, presentIds) { return introSheet(c) + cardPages(c, presentIds); }

  /* Envelope covers: one per guest with their portrait (their cards go inside, top card first),
     and the six picture envelopes for the team stages (two of them empty decoys). */
  function covers() {
    const guests = data.characters.map((c) => `<div class="cover"><img src="${c.image}" alt=""><div class="cv-name">${sym(c.symbol)} ${esc(c.short)}</div><div class="cv-note">${esc(c.costume)}</div><div class="cv-note">Blackwood Manor · All Hallows' Eve<br>Take only the top card, one stage at a time</div></div>`);
    const pictures = data.PICTURES.map((p) => `<div class="cover picture">${root.BM.art[p]}<div class="cv-note">Blackwood Manor · only the host opens this, when a team names it</div></div>`);
    const all = [...guests, ...pictures];
    const pages = [];
    for (let i = 0; i < all.length; i += 2) pages.push(`<div class="sheet"><div class="cover-grid">${all.slice(i, i + 2).join('')}</div></div>`);
    return pages.join('');
  }

  /* What the host puts in each guest's envelope, top to bottom. */
  function stocking() {
    return data.characters.map((c) => {
      const strip = data.ledger.find((x) => x.holder === c.id);
      return `<li><strong>${sym(c.symbol)} ${esc(c.short)}:</strong> cards ${data.STAGE_IDS[0]} to ${data.STAGE_IDS[data.STAGE_IDS.length - 1]}, 1.1 on top${strip ? `, ledger strip ${strip.number} under the 2.3 card` : ''}</li>`;
    }).join('');
  }

  function envelopes() {
    const out = [];
    for (const team of ['delilah', 'victor']) {
      for (const sid of ['3.1', '3.2']) {
        const env = data.teamEnvelopes[team][sid];
        out.push(`<div class="sheet"><h1>${teamLabel(team)} · Stage ${sid}</h1><p><em>Put this in the ${esc(env.picture)} envelope on the table. The team sentence is: ${esc(env.sentence)}.</em></p><h2>${esc(env.title)}</h2><div class="boxed"><p>${esc(env.text)}</p></div></div>`);
      }
      const w = data.witnessCards[team];
      out.push(`<div class="sheet"><h1>${teamLabel(team)} · The witness</h1><p><em>Put this in the ${esc(data.teamEnvelopes[team]['3.2'].picture)} envelope on the table, for stage 3.2. To be read aloud by ${esc(charById(w.reader).name)}, or by ${esc(w.ghost)} if absent.</em></p><div class="boxed"><p>${esc(w.text)}</p></div></div>`);
    }
    return out.join('');
  }

  function ledger() {
    const strips = data.ledger.map((s) => {
      const h = Math.max(2, 15 - s.number);
      const holder = charById(s.holder);
      return `<div class="strip"><div class="margin"><div class="candle-ink" style="height:${h}mm"></div></div><div class="body">${esc(s.text)}<br><small>holder: ${sym(holder.symbol)} ${esc(holder.short)} (put in their envelope, under the 2.3 card)</small></div></div>`;
    });
    /* Two deliberate pages of strips, each with its own heading, so no page starts with stray strips. */
    const half = Math.ceil(strips.length / 2);
    const pages = [strips.slice(0, half), strips.slice(half)].filter((x) => x.length);
    return pages.map((list, i) => `<div class="sheet"><h1>The Crimson Ledger${pages.length > 1 ? ` <small>· page ${i + 1} of ${pages.length}</small>` : ''}</h1><p><em>Cut along the dashed lines. Each strip goes into its holder's envelope, under their 2.3 card. The candle in the margin orders the page: tallest first.</em></p>${list.join('')}</div>`).join('');
  }

  /* Stage 3.4: the letter to lock in the box, and the host's setup notes. */
  function box() {
    const b = data.box;
    return `<div class="sheet letter"><p class="lt-outside">${esc(b.letter.outside)}</p><h1>${esc(b.letter.title)}</h1><p>${esc(b.letter.text)}</p></div>
    <div class="sheet"><h1>The box · stage 3.4</h1>
      <ol>
        <li>Fold the letter, seal it, and lock it in the box.</li>
        <li>Put the true key inside ${esc(b.hidingPlace)}, and hide the hat behind a small door at about waist height: a cupboard, cabinet or sideboard. Not high, not low, not under cushions: the guests' clues say so, and the killers will send people high and low.</li>
        <li>Hide the fake keys anywhere you like around the room.</li>
        <li>House rule, read out at the start of 3.4: ${esc(b.rule)}</li>
        <li>If the box opens, press "The box is open" and Delilah reads the letter. If time runs out, press "The box stays shut" and go to the vote.</li>
      </ol>
    </div>`;
  }

  /* Things to find before the night: nothing here is printed. */
  const PROPS = [
    'Nineteen envelopes: thirteen guests and six pictures.',
    "Wine glasses on a tray for the toast, one of them Delilah's.",
    "A small red book with every page torn out, in Delilah's bag at the toast: Selene steals it and shows the empty cover at 2.3.",
    "A handkerchief dabbed with jasmine, one corner stained purple: in Selene's envelope, under her 3.2 card.",
    'Optional evidence for the picture envelopes: a small brown vial (Plant) and a syringe marked K-7 (Television).',
    'A small box that locks, its true key, three to five fake keys, and a black conjuring hat (not the undertaker\'s top hat) behind a small door at waist height.',
    'Pens for the ballot slips.'
  ];

  /* Ballot slips for the vote: each guest names two different suspects. */
  function ballots(roster) {
    const slip = '<div class="slip"><strong>Blackwood Manor · The accusation</strong><p>My name: ______________________</p><p>I accuse:</p><p>1. ___________________________</p><p>2. ___________________________</p><small>Two different names. The house wins only if both killers are the two most accused.</small></div>';
    const pages = Math.max(1, Math.ceil(((roster && roster.present.length) || 8) / 8));
    return Array.from({ length: pages }, () => `<div class="sheet ballots"><h1>Ballot slips</h1><p><em>Cut along the dashed lines. One per guest, handed out at the vote.</em></p><div class="slips">${Array(8).fill(slip).join('')}</div></div>`).join('');
  }

  /* The host's run sheet: headlines and what has to happen, in order, on two pages. */
  function runSheet() {
    const row = (head, sub, items) => `<tr><th>${head}${sub ? `<br><small>${esc(sub)}</small>` : ''}</th><td><ul>${items.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></td></tr>`;
    const kind = { individual: 'On your own', group: 'Find alone, solve together', team: 'Teams' };
    const before = row('Before', 'the guests arrive', [
      'Set who is present on the setup screen, then print. Props: see the host guide.',
      'Lay the guests\' envelopes on the table, 1.1 on top, and the six picture envelopes beside them, untouchable (Clock and Mirror stay empty).',
      'The box: letter locked inside. Put the true key in the rabbit hat, and the hat behind a small door at waist height. Hide the fake keys around the room.',
      'Laptop: open the site. TV: press "Open TV screen", click it once, press F.',
      'Hand out the intro sheets at the door. Optional: "Introduce the game".'
    ]);
    const prologue = row('Prologue', 'The Toast', [
      'Press "Begin the night". Victor gives the toast from the screen.',
      'Delilah drinks and falls. Corvus pronounces her dead (Victor does, if Corvus is absent).',
      'Press "She is dead". Victor sends everyone to their envelopes.'
    ]);
    const loop = '<p class="rs-loop"><strong>Every stage:</strong> the ghost speaks → <strong>Cards out</strong> (everyone takes the top card) → <strong>Start discussion</strong> → <strong>End discussion</strong> → <strong>Next stage</strong>. The host panel shows absent guests\' lines and the answers.</p>';
    const rows = data.stages.map((st) => row(`${esc(st.id)} ${esc(st.title)}`, `${kind[st.kind]}${st.minutes ? ` · ${st.minutes.cards} + ${st.minutes.discuss} min` : ''}`, st.run || []));
    const end = row('Vote', 'and reveal', [
      'Two different suspects per ballot slip. Enter them with the laptop turned away. A tie for second: 30 seconds of defence each, then vote again between them.',
      'Press "Reveal". The ghosts name the killers.',
      'Optional: "Tell the whole story".'
    ]);
    const scene = (n) => `<tr class="rs-scene"><td colspan="2">Scene ${n}: ${esc(data.scenes[n - 1].title)}</td></tr>`;
    const body = [before, prologue, scene(1), ...rows.slice(0, 3), scene(2), ...rows.slice(3, 6), scene(3), ...rows.slice(6), end].join('');
    return `<div class="sheet runsheet"><h1>Host run sheet</h1><p><em>Blackwood Manor · what happens, in order. Answers and details are in the host guide and on the laptop.</em></p>${loop}<table>${body}</table></div>`;
  }

  /* The host guide's stage-by-stage section: how the two hosts split the night, then every stage with
     what happens, the buttons, the notes and the answers, all drawn from the game data. */
  const KIND = { individual: 'On your own', group: 'Whole room', team: 'Teams' };
  const HOST_SPLIT = [
    "Delilah's host dies at the toast and plays her ghost from then on. She runs the laptop all night: the buttons, the timers and the host panel. In Scene 1 her ghost is silent: only Victor hears her, and he reads her words. From Scene 2 everyone hears her.",
    "The blackout after 1.3: when the screen goes dark, Delilah's host switches off the room lights for about four seconds while Victor falls, and switches them on again when the memorial appears.",
    'Victor\'s host performs the toast, "She is dead" and the midnight announcement (or lets the recordings speak them), falls in the blackout after 1.3, and stays down as the body through Scene 2.',
    'At "The second ghost rises" (after 2.3) Victor\'s host rises as his ghost. In Scene 3 each ghost stands with their own team and answers for it.',
    'The recorded voices speak for the ghosts and the narrator; the hosts act, point, sigh and react. Mute "Ghost voice-over" to speak the lines yourselves.'
  ];
  const TEAM_STEPS = [
    'Cards out: everyone takes their card. It shows their team word and its number, plus a personal clue to say aloud.',
    "Each team says its words aloud in number order. The team's ghost says the words of absent teammates (host panel).",
    "All six picture envelopes lie on the table, untouchable. The team names one to its own ghost; each ghost answers only for their own team. Right: hand over that envelope. Wrong (a decoy, or the other team's picture): shake your head, and the team waits one minute.",
    'Stuck for 3 minutes? The ghost whispers the next wrong or missing word. Still stuck at 6 minutes? The whole sentence, which also exposes the killer\'s wrong word.',
    'Press +1 min as needed, then "Start discussion" once both teams have their evidence. Each team shows the room what it found.',
    'Rules: everyone must say the word on their card; the killers may say it wrong. Nobody reads anyone else\'s card.'
  ];

  function teamTable(sid) {
    const rows = ['delilah', 'victor'].map((team) => {
      const env = data.teamEnvelopes[team][sid];
      const words = data.characters.filter((c) => c.team === team && c.cards[sid].word)
        .sort((a, b) => a.cards[sid].word.index - b.cards[sid].word.index)
        .map((c) => `${c.cards[sid].word.index} ${esc(c.cards[sid].word.text)} (${esc(c.short)}${c.optional ? '*' : ''}${c.killer ? ', killer' : ''})`).join(' · ');
      const killer = data.characters.find((c) => c.team === team && c.killer);
      const trap = killer && killer.cards[sid].sabotage ? esc(killer.cards[sid].sabotage.split('. ')[0]) + '.' : '';
      return `<tr><th>${teamLabel(team)}</th><td><strong>${esc(env.sentence)}</strong> → <strong>${esc(env.picture)}</strong><br><small>${words}</small><br>Inside: <strong>${esc(env.title)}</strong>. ${esc(env.text)}${trap ? `<br><em>${esc(killer.short)}'s trap:</em> ${trap}` : ''}</td></tr>`;
    });
    return `<table>${rows.join('')}</table><p><small>* optional guest. Decoys: ${data.DECOYS.map(esc).join(' and ')} (empty).</small></p>`;
  }

  function stageByStage() {
    const li = (items) => `<ul>${items.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>`;
    const parts = [`<div class="gs-block"><h2>How the hosts split the night</h2>${li(HOST_SPLIT)}</div>`,
      `<h2>Stage by stage</h2>`,
      `<div class="gs-stage"><h3>Prologue · The Toast</h3>${li(['Press "Begin the night". Victor gives the toast.', 'Delilah drinks and falls. Corvus pronounces her dead (Victor does, if Corvus is absent).', 'Press "She is dead". Victor sends everyone to their envelopes.'])}</div>`];
    data.stages.forEach((st) => {
      let extra = '';
      if (st.id === '2.3') extra = `<p><strong>The ledger, in order:</strong> ${data.ledger.map((x) => `${x.number} ${esc(charById(x.holder).short)}`).join(' · ')}</p>`;
      if (st.id === '3.1') extra = `<p><strong>How a team round runs (3.1 and 3.2):</strong></p><ol>${TEAM_STEPS.map((t) => `<li>${esc(t)}</li>`).join('')}</ol>${teamTable('3.1')}`;
      if (st.id === '3.2') extra = teamTable('3.2') + `<p>Witness readers: ${['delilah', 'victor'].map((t) => `${esc(charById(data.witnessCards[t].reader).short)} (${teamLabel(t)}), or ${esc(data.witnessCards[t].ghost)}`).join('; ')}.</p>`;
      if (st.id === '3.4') extra = `<p><strong>Answer:</strong> the true key is in ${esc(data.box.hidingPlace)}, behind a small door at waist height. ${esc(data.box.rule)} ${data.killerIds.map((id) => `${esc(charById(id).short)}: ${esc(charById(id).cards['3.4'].sabotage.split('. ')[0])}.`).join(' ')}</p>`;
      parts.push(`<div class="gs-stage"><h3>${esc(st.id)} ${esc(st.title)} · ${esc(KIND[st.kind] || st.kind)}${st.minutes ? ` · ${st.minutes.cards} + ${st.minutes.discuss} min` : ''}</h3>${li(st.run || [])}<p><em>Notes:</em> ${esc(st.hostNotes)}</p>${extra}</div>`);
    });
    parts.push(`<div class="gs-stage"><h3>Vote and reveal</h3>${li(['Everyone writes two different suspects on a ballot slip. Enter the votes with the laptop turned away.', 'Tie for second place? The tied guests get 30 seconds each to defend themselves, then everyone votes again between them.', 'Press "Reveal". The ghosts name the killers.', 'Optional: "Tell the whole story".'])}</div>`);
    return parts.join('');
  }

  function guide(roster) {
    roster = roster || logic.buildRoster(data, { presentIds: data.characters.map((c) => c.id) });
    const killers = data.killerIds.map((id) => charById(id)).map((c) => `<div class="gs-block"><h3>${sym(c.symbol)} ${esc(c.name)}</h3><ul>${data.STAGE_IDS.filter((sid) => c.cards[sid].sabotage || c.cards[sid].lie).map((sid) => `<li><strong>${sid}:</strong> ${esc(c.cards[sid].sabotage || c.cards[sid].lie)}</li>`).join('')}</ul></div>`).join('');
    const sentences = ['3.1', '3.2'].map((sid) => ['delilah', 'victor'].map((team) => { const ts = logic.teamSentence(data, roster, team, sid); return `<li><strong>${sid} ${teamLabel(team)}:</strong> ${esc(ts.sentence)} → the ${esc(ts.picture)} envelope</li>`; }).join('')).join('');
    const alibis = data.characters.map((c) => `<li><strong>${sym(c.symbol)} ${esc(c.short)}:</strong> “${esc(c.cards['3.3'].alibi)}”${c.cards['3.3'].lie ? ` <strong>LIE.</strong> ${esc(c.cards['3.3'].lie)}` : ''}</li>`).join('');
    /* One block per stage, so a page only ever breaks between stages, never inside one. */
    const orphans = data.STAGE_IDS.map((sid) => {
      const items = logic.orphanedClues(data, roster, sid);
      const by = items.length && items.every((o) => o.reader === items[0].reader) ? ` · ${esc(items[0].reader)} reads` : '';
      return items.length ? `<div class="gs-block"><h3>Stage ${sid}${by}</h3><ul>${items.map((o) => `<li><strong>${sym(o.symbol)} ${esc(o.name)} (${o.kind}${o.number ? ` ${o.number}` : ''}${o.index ? ` #${o.index}, ${teamLabel(o.team)}` : ''}${by ? '' : `, ${esc(o.reader)}`}${o.group ? ', voiced on the TV' : ''}):</strong> ${esc(o.text)}</li>`).join('')}</ul></div>` : '';
    }).join('');
    return `<div class="sheet guide">
      <h1>Host guide</h1>
      <div class="gs-block"><h2>Night-of checklist</h2>
      <ol>
        <li>Print all packs. Cut the cards. Glue a cover on each of the nineteen envelopes: thirteen guests and six pictures. The Clock and Mirror envelopes are decoys and stay empty.</li>
        <li>Fill each guest's envelope with their own cards, face down, 1.1 on top and 3.4 at the bottom, and their ledger strip under the 2.3 card (list below).</li>
        <li>Put the team evidence and the witness cards in the picture envelopes (team sentences below). Lay the thirteen guest envelopes on the table; lay the six picture envelopes on the table where nobody may touch them (Clock and Mirror are empty decoys). In Scene 3 each ghost answers for their own team and hands over an envelope only when that team names its right picture. A wrong picture costs a minute.</li>
        <li>Set up the box: the letter locked inside, the true key in ${esc(data.box.hidingPlace)}, the hat behind a small door at waist height, fake keys hidden around the room.</li>
        <li>Set who is present on the setup screen before printing. Stuff all thirteen guest envelopes, but lay only the present guests' envelopes on the table. Delilah's host keeps the absent guests' envelopes, for their ledger strips at 2.3 and for anyone who arrives late (give a latecomer their envelope and let them read the cards they missed).</li>
        <li>Hand each guest their intro sheet at the door. Nobody opens anything else.</li>
        <li>Open the website, set the roster, test the sound.</li>
        <li>Victor gives the toast. Delilah dies. Play.</li>
      </ol></div>
      <div class="gs-block"><h2>Props</h2><ul>${PROPS.map((t) => `<li>${esc(t)}</li>`).join("")}</ul></div>
      ${stageByStage()}
      <div class="gs-block"><h2>What goes in each guest's envelope</h2><ul>${stocking()}</ul></div>
      <div class="gs-block"><h2>The box</h2><p>True key: ${esc(data.box.hidingPlace)}. ${esc(data.box.rule)}</p></div>
      <div class="gs-block"><h2>Team sentences</h2><ul>${sentences}</ul></div>
      <h2>The killers and their orders</h2>${killers}
      <div class="gs-block"><h2>Alibis</h2><ul>${alibis}</ul></div>
      <div class="gs-absent"><h2>Absent guests (current roster): what to say for them, stage by stage</h2>${orphans || '<ul><li>None. Everyone is present.</li></ul>'}</div>
    </div>`;
  }

  /* "Print everything": the whole pack in one job, host material first, the players' packs last. */
  const EVERYTHING = ['runsheet', 'guide', 'box', 'envelopes', 'ledger', 'ballots', 'covers', 'all'];

  function build(kind, id, roster) {
    const presentIds = roster && roster.present ? roster.present.map((c) => c.id) : allPresent();
    if (kind === 'everything') return EVERYTHING.map((k) => build(k, id, roster)).join('');
    if (kind === 'all') return data.characters.map((c) => characterPack(c, presentIds)).join('');
    if (kind === 'character') return characterPack(charById(id), presentIds);
    if (kind === 'covers') return covers();
    if (kind === 'box') return box();
    if (kind === 'envelopes') return envelopes();
    if (kind === 'ledger') return ledger();
    if (kind === 'guide') return guide(roster);
    if (kind === 'runsheet') return runSheet();
    if (kind === 'ballots') return ballots(roster);
    return '';
  }

  function open(kind, id, roster) {
    const rootNode = document.getElementById('print-root');
    rootNode.innerHTML = build(kind, id, roster);
    const cleanup = () => { rootNode.innerHTML = ''; window.removeEventListener('afterprint', cleanup); };
    window.addEventListener('afterprint', cleanup);
    setTimeout(() => window.print(), 50);
  }

  root.BM = root.BM || {};
  root.BM.print = { open, build, characterPack, covers, envelopes, box, ledger, guide, runSheet };
})(window);
