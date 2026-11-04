(function (root) {
  const data = root.BM.data;
  const logic = root.BM.logic;

  function esc(s) { return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
  function charById(id) { return data.characters.find((c) => c.id === id); }
  function stageTitle(i) { return `${data.STAGE_IDS[i]} ${data.stages[i].title}`; }
  function teamLabel(team) { return team === 'delilah' ? 'TEAM DELILAH' : 'TEAM VICTOR'; }

  function introSheet(c) {
    return `<div class="sheet">
      <img class="portrait" src="${c.image}" alt="">
      <h1>${c.symbol} ${esc(c.name)}</h1>
      <p><em>${esc(c.costume)} · Blackwood Manor, All Hallows' Eve</em></p>
      <h2>Who you are</h2><p>${esc(c.intro.text)}</p>
      <h2>How to act</h2><p>${esc(c.intro.act)}</p>
      <h2>Your quirk, all night</h2><p>${esc(c.intro.quirk)}</p>
      <h2>Your public line (say it to everyone)</h2><div class="boxed">“${esc(c.intro.publicLine)}”</div>
      <h2>How the night works</h2>
      <p>Every guest has an envelope on the table with their own picture on it. At each stage, take only the top card from <strong>your</strong> envelope (${c.symbol} ${esc(c.short)}) and check its stage number. Never look further down the pile, and never open anyone else's envelope. Read your cards privately unless the card says otherwise. Keep your cards; you will need them.</p>
      <p>The foot of every card carries a whisper: something true about another guest, who is never named. Work out who it is about, and use it.</p>
    </div>`;
  }

  function allPresent() { return data.characters.map((x) => x.id); }

  function cardHtml(c, i, presentIds) {
    const sid = data.STAGE_IDS[i];
    const card = c.cards[sid];
    const parts = [];
    parts.push(`<div class="head"><span>${c.symbol} ${esc(c.short)}</span><span>Stage ${esc(stageTitle(i))}</span></div>`);
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
     and the four picture envelopes for the team stages. */
  function covers() {
    const guests = data.characters.map((c) => `<div class="cover"><img src="${c.image}" alt=""><div class="cv-name">${c.symbol} ${esc(c.name)}</div><div class="cv-note">Blackwood Manor · All Hallows' Eve<br>Take only the top card, one stage at a time</div></div>`);
    const pictures = data.PICTURES.map((p) => `<div class="cover picture">${root.BM.art[p]}<div class="cv-note">Blackwood Manor · open only when your team's sentence names this</div></div>`);
    const all = [...guests, ...pictures];
    const pages = [];
    for (let i = 0; i < all.length; i += 2) pages.push(`<div class="sheet"><div class="cover-grid">${all.slice(i, i + 2).join('')}</div></div>`);
    return pages.join('');
  }

  /* What the host puts in each guest's envelope, top to bottom. */
  function stocking() {
    return data.characters.map((c) => {
      const strip = data.ledger.find((x) => x.holder === c.id);
      return `<li><strong>${c.symbol} ${esc(c.short)}:</strong> cards ${data.STAGE_IDS[0]} to ${data.STAGE_IDS[data.STAGE_IDS.length - 1]}, 1.1 on top${strip ? `, ledger strip ${strip.number} under the 2.3 card` : ''}</li>`;
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
      const h = Math.max(2, 14 - s.number);
      const holder = charById(s.holder);
      return `<div class="strip"><div class="margin"><div class="candle-ink" style="height:${h}mm"></div></div><div class="body">${esc(s.text)}<br><small>holder: ${holder.symbol} ${esc(holder.short)} (put in their envelope, under the 2.3 card)</small></div></div>`;
    });
    return `<div class="sheet"><h1>The Crimson Ledger</h1><p><em>Cut along the dashed lines. Each strip goes into its holder's envelope, under their 2.3 card. The candle in the margin orders the page: tallest first.</em></p>${strips.join('')}</div>`;
  }

  /* Stage 3.4: the letter to lock in the box, and the host's setup notes. */
  function box() {
    const b = data.box;
    return `<div class="sheet letter"><p class="lt-outside">${esc(b.letter.outside)}</p><h1>${esc(b.letter.title)}</h1><p>${esc(b.letter.text)}</p></div>
    <div class="sheet"><h1>The box · stage 3.4</h1>
      <ol>
        <li>Fold the letter, seal it, and lock it in the box.</li>
        <li>Put the true key inside ${esc(b.hidingPlace)}.</li>
        <li>Hide the fake keys anywhere you like around the room.</li>
        <li>House rule, read out at the start of 3.4: ${esc(b.rule)}</li>
        <li>If the box opens, press "The box is open" and Delilah reads the letter. If time runs out, press "The box stays shut" and go to the vote.</li>
      </ol>
    </div>`;
  }

  function guide(roster) {
    roster = roster || logic.buildRoster(data, { presentIds: data.characters.map((c) => c.id) });
    const killers = data.killerIds.map((id) => charById(id)).map((c) => `<h2>${c.symbol} ${esc(c.name)}</h2><ul>${data.STAGE_IDS.filter((sid) => c.cards[sid].sabotage || c.cards[sid].lie).map((sid) => `<li><strong>${sid}:</strong> ${esc(c.cards[sid].sabotage || c.cards[sid].lie)}</li>`).join('')}</ul>`).join('');
    const sentences = ['3.1', '3.2'].map((sid) => ['delilah', 'victor'].map((team) => { const ts = logic.teamSentence(data, roster, team, sid); return `<li><strong>${sid} ${teamLabel(team)}:</strong> ${esc(ts.sentence)} → the ${esc(ts.picture)} envelope</li>`; }).join('')).join('');
    const alibis = data.characters.map((c) => `<li><strong>${c.symbol} ${esc(c.short)}:</strong> “${esc(c.cards['3.3'].alibi)}”${c.cards['3.3'].lie ? ` <strong>LIE.</strong> ${esc(c.cards['3.3'].lie)}` : ''}</li>`).join('');
    const orphans = data.STAGE_IDS.map((sid) => logic.orphanedClues(data, roster, sid).map((o) => `<li><strong>${sid} · ${o.symbol} ${esc(o.name)} (${o.kind}):</strong> ${esc(o.text)}</li>`).join('')).join('');
    return `<div class="sheet guide">
      <h1>Host guide</h1>
      <h2>Night-of checklist</h2>
      <ol>
        <li>Print all packs. Cut the cards. Glue a cover on each of the seventeen envelopes: thirteen guests and four pictures.</li>
        <li>Fill each guest's envelope with their own cards, face down, 1.1 on top and 3.4 at the bottom, and their ledger strip under the 2.3 card (list below).</li>
        <li>Put the team evidence and the witness cards in the picture envelopes (team sentences below). Lay all seventeen envelopes on the table.</li>
        <li>Set up the box: the letter locked inside, the true key in ${esc(data.box.hidingPlace)}, fake keys hidden around the room.</li>
        <li>Hand each guest their intro sheet at the door. Nobody opens anything else.</li>
        <li>Open the website, set the roster, test the sound.</li>
        <li>Victor gives the toast. Delilah dies. Play.</li>
      </ol>
      <h2>What goes in each guest's envelope</h2><ul>${stocking()}</ul>
      <h2>The box</h2><p>True key: ${esc(data.box.hidingPlace)}. ${esc(data.box.rule)}</p>
      <h2>Team sentences</h2><ul>${sentences}</ul>
      <h2>The killers and their orders</h2>${killers}
      <h2>Alibis</h2><ul>${alibis}</ul>
      <h2>Absent guests (current roster): the ghost delivers these</h2><ul>${orphans || '<li>None. Everyone is present.</li>'}</ul>
    </div>`;
  }

  function build(kind, id, roster) {
    const presentIds = roster && roster.present ? roster.present.map((c) => c.id) : allPresent();
    if (kind === 'all') return data.characters.map((c) => characterPack(c, presentIds)).join('');
    if (kind === 'character') return characterPack(charById(id), presentIds);
    if (kind === 'covers') return covers();
    if (kind === 'box') return box();
    if (kind === 'envelopes') return envelopes();
    if (kind === 'ledger') return ledger();
    if (kind === 'guide') return guide(roster);
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
  root.BM.print = { open, build, characterPack, covers, envelopes, box, ledger, guide };
})(window);
