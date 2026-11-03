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
      <p>There are six stations in the room: Sofa, Bookshelf, Television, Plant, Lamp, Cupboard. Each holds an envelope. Every riddle you receive points to one station; inside its envelope take only the card marked <strong>${c.symbol} ${esc(c.short)}</strong> with the current stage number. Read your cards privately unless the card says otherwise. Keep your cards; you will need them.</p>
      <h2>Your first riddle (stage 1.1)</h2><div class="boxed"><em>${esc(logic.riddleFor(data, c, 0))}</em></div>
    </div>`;
  }

  function cardHtml(c, i) {
    const sid = data.STAGE_IDS[i];
    const card = c.cards[sid];
    const parts = [];
    parts.push(`<div class="head"><span>${c.symbol} ${esc(c.short)}</span><span>Stage ${esc(stageTitle(i))}</span></div>`);
    if (card.word) parts.push(`<div>Your team word is number <strong>${card.word.index}</strong>:</div><div class="word">${esc(card.word.text)}</div>`);
    if (card.alibi) parts.push(`<p>Read aloud, exactly:</p><p>“${esc(card.alibi)}”</p>`);
    else parts.push(`<p>${esc(card.text)}</p>`);
    if (card.ledger) parts.push(`<p><strong>This envelope also holds ledger strip ${card.ledger}.</strong></p>`);
    if (card.secretSign) parts.push(`<div class="sab">${esc(data.SIGN)}</div>`);
    if (card.sabotage) parts.push(`<div class="sab">${esc(card.sabotage)}</div>`);
    if (card.lie) parts.push(`<div class="sab">${esc(card.lie)}</div>`);
    if (i < data.STAGE_IDS.length - 1) parts.push(`<div class="riddle">Your next card (stage ${data.STAGE_IDS[i + 1]}): ${esc(logic.riddleFor(data, c, i + 1))}</div>`);
    else parts.push(`<div class="riddle">This is your last card. The vote is next.</div>`);
    return `<div class="card">${parts.join('')}</div>`;
  }

  function cardPages(c) {
    const cards = data.STAGE_IDS.map((_, i) => cardHtml(c, i));
    const pages = [];
    for (let p = 0; p < cards.length; p += 4) {
      const chunk = cards.slice(p, p + 4);
      while (chunk.length < 4) chunk.push('<div class="card"></div>');
      pages.push(`<div class="sheet"><div class="card-grid">${chunk.join('')}</div></div>`);
    }
    return pages.join('');
  }

  function characterPack(c) { return introSheet(c) + cardPages(c); }

  function stations() {
    const labels = data.STATIONS.map((st) => `<div class="label"><div class="big">${esc(st)}</div><div class="sym">Blackwood Manor · station envelope</div></div>`);
    const pages = [];
    for (let i = 0; i < labels.length; i += 2) pages.push(`<div class="sheet">${labels.slice(i, i + 2).join('')}</div>`);
    return pages.join('');
  }

  function envelopes() {
    const out = [];
    for (const team of ['delilah', 'victor']) {
      for (const sid of ['3.1', '3.2']) {
        const env = data.teamEnvelopes[team][sid];
        out.push(`<div class="sheet"><h1>${teamLabel(team)} · Stage ${sid}</h1><p><em>Hide at the ${esc(env.station)}. The team sentence is: ${esc(env.sentence)}.</em></p><h2>${esc(env.title)}</h2><div class="boxed"><p>${esc(env.text)}</p></div></div>`);
      }
      const w = data.witnessCards[team];
      out.push(`<div class="sheet"><h1>${teamLabel(team)} · The witness</h1><p><em>Put this inside the ${esc(data.teamEnvelopes[team]['3.2'].station)} envelope for stage 3.2. To be read aloud by ${esc(charById(w.reader).name)}, or by ${esc(w.ghost)} if absent.</em></p><div class="boxed"><p>${esc(w.text)}</p></div></div>`);
    }
    return out.join('');
  }

  function ledger() {
    const strips = data.ledger.map((s) => {
      const h = Math.max(2, 14 - s.number);
      const holder = charById(s.holder);
      return `<div class="strip"><div class="margin"><div class="candle-ink" style="height:${h}mm"></div></div><div class="body">${esc(s.text)}<br><small>holder: ${holder.symbol} ${esc(holder.short)} (put in their 2.3 envelope)</small></div></div>`;
    });
    return `<div class="sheet"><h1>The Crimson Ledger</h1><p><em>Cut along the dashed lines. Each strip goes into its holder's stage 2.3 envelope. The candle in the margin orders the page: tallest first.</em></p>${strips.join('')}</div>`;
  }

  function guide(roster) {
    roster = roster || logic.buildRoster(data, { presentIds: data.characters.map((c) => c.id) });
    const rows = data.STAGE_IDS.map((sid, i) => {
      const cells = data.STATIONS.map((st) => {
        const cards = logic.cardsAtStation(data, st, i).map((c) => `${c.symbol} ${esc(c.short)}`);
        for (const team of ['delilah', 'victor']) {
          const env = data.teamEnvelopes[team][sid];
          if (env && env.station === st) cards.push(`<strong>${teamLabel(team)}</strong>`);
        }
        return `<td>${cards.join('<br>')}</td>`;
      });
      return `<tr><th>${sid}</th>${cells.join('')}</tr>`;
    });
    const killers = data.killerIds.map((id) => charById(id)).map((c) => `<h2>${c.symbol} ${esc(c.name)}</h2><ul>${data.STAGE_IDS.filter((sid) => c.cards[sid].sabotage || c.cards[sid].lie).map((sid) => `<li><strong>${sid}:</strong> ${esc(c.cards[sid].sabotage || c.cards[sid].lie)}</li>`).join('')}</ul>`).join('');
    const sentences = ['3.1', '3.2'].map((sid) => ['delilah', 'victor'].map((team) => { const ts = logic.teamSentence(data, roster, team, sid); return `<li><strong>${sid} ${teamLabel(team)}:</strong> ${esc(ts.sentence)} → ${esc(ts.station)}</li>`; }).join('')).join('');
    const alibis = data.characters.map((c) => `<li><strong>${c.symbol} ${esc(c.short)}:</strong> “${esc(c.cards['3.3'].alibi)}”${c.cards['3.3'].lie ? ` <strong>LIE.</strong> ${esc(c.cards['3.3'].lie)}` : ''}</li>`).join('');
    const orphans = data.STAGE_IDS.map((sid) => logic.orphanedClues(data, roster, sid).map((o) => `<li><strong>${sid} · ${o.symbol} ${esc(o.name)} (${o.kind}):</strong> ${esc(o.text)}</li>`).join('')).join('');
    return `<div class="sheet guide">
      <h1>Host guide</h1>
      <h2>Night-of checklist</h2>
      <ol>
        <li>Print all packs. Cut cards. Sort every card into its station envelope using the table below. Put the four team envelopes and the two witness cards at their stations. Put each ledger strip inside its holder's 2.3 envelope.</li>
        <li>Label the six stations. Hide envelopes behind or under the object, not in plain sight.</li>
        <li>Hand each guest their intro sheet at the door. Nobody opens anything else.</li>
        <li>Open the website, set the roster, test the sound.</li>
        <li>Victor gives the toast. Delilah dies. Play.</li>
      </ol>
      <h2>Which cards go where</h2>
      <table><tr><th>Stage</th>${data.STATIONS.map((s) => `<th>${s}</th>`).join('')}</tr>${rows.join('')}</table>
      <h2>Team sentences</h2><ul>${sentences}</ul>
      <h2>The killers and their orders</h2>${killers}
      <h2>Alibis</h2><ul>${alibis}</ul>
      <h2>Absent guests (current roster): the ghost delivers these</h2><ul>${orphans || '<li>None. Everyone is present.</li>'}</ul>
    </div>`;
  }

  function build(kind, id, roster) {
    if (kind === 'all') return data.characters.map(characterPack).join('');
    if (kind === 'character') return characterPack(charById(id));
    if (kind === 'stations') return stations();
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
  root.BM.print = { open, build, characterPack, stations, envelopes, ledger, guide };
})(window);
