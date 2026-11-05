(function (root) {
  function buildRoster(data, selection) {
    const presentIds = new Set(selection.presentIds || []);
    const present = data.characters.filter((c) => presentIds.has(c.id));
    const missing = data.characters.filter((c) => !presentIds.has(c.id));
    const errors = (data.requiredIds || []).filter((id) => !presentIds.has(id)).map((id) => {
      const c = data.characters.find((x) => x.id === id);
      return `${c ? c.name : id} is essential to the story and must be present.`;
    });
    return {
      present, missing, errors,
      teams: {
        delilah: present.filter((c) => c.team === 'delilah'),
        victor: present.filter((c) => c.team === 'victor')
      }
    };
  }

  function orphanedClues(data, roster, stageId) {
    const out = [];
    for (const c of roster.missing) {
      const card = c.cards[stageId];
      if (!card) continue;
      const base = { characterId: c.id, name: c.name, symbol: c.symbol };
      if (stageId === '1.3') out.push({ ...base, kind: 'observation', text: card.text });
      if (stageId === '2.3') {
        const strip = data.ledger.find((s) => s.holder === c.id);
        if (strip) out.push({ ...base, kind: 'ledger', number: strip.number, text: strip.text });
      }
      if ((stageId === '3.1' || stageId === '3.2') && card.word) {
        out.push({ ...base, kind: 'word', index: card.word.index, text: card.word.text, team: c.team });
      }
      if ((stageId === '3.1' || stageId === '3.2') && card.ghostClue) {
        out.push({ ...base, kind: 'team clue', team: c.team, reader: c.team === 'delilah' ? "Delilah's ghost" : "Victor's ghost", text: card.ghostClue });
      }
      if (stageId === '3.2' && c.witness) {
        const w = data.witnessCards[c.team];
        out.push({ ...base, kind: 'witness', reader: w.ghost, text: w.ghostIntro ? `${w.ghostIntro} ${w.text}` : w.text });
      }
      if (stageId === '3.3') out.push({ ...base, kind: 'alibi', text: card.alibi });
      if (stageId === '3.4' && !c.killer) out.push({ ...base, kind: 'key hint', text: card.text });
    }
    return out;
  }

  function teamSentence(data, roster, team, stageId) {
    const presentIds = new Set(roster.present.map((c) => c.id));
    const words = data.characters
      .filter((c) => c.team === team && c.cards[stageId] && c.cards[stageId].word)
      .map((c) => ({ index: c.cards[stageId].word.index, text: c.cards[stageId].word.text, holder: c.id, holderName: c.short, present: presentIds.has(c.id) }))
      .sort((a, b) => a.index - b.index);
    const env = data.teamEnvelopes[team][stageId];
    return { words, sentence: words.map((w) => w.text).join(' '), picture: env.picture, missing: words.filter((w) => !w.present) };
  }

  function tally(votes, killerIds) {
    const counts = {};
    for (const picks of Object.values(votes)) {
      for (const s of picks || []) if (s) counts[s] = (counts[s] || 0) + 1;
    }
    const ranked = Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    const third = ranked[2] ? ranked[2][1] : -1;
    const topTwo = ranked.slice(0, 2);
    const houseWins = topTwo.length === 2 &&
      killerIds.every((k) => topTwo.some((e) => e[0] === k)) &&
      topTwo.every((e) => e[1] > third);
    return { counts, ranked, houseWins };
  }

  function formatRemaining(remaining) {
    const abs = Math.abs(remaining);
    const text = (remaining < 0 ? '-' : '') + String(Math.floor(abs / 60)).padStart(2, '0') + ':' + String(abs % 60).padStart(2, '0');
    return { text, urgent: remaining > 0 && remaining <= 30, over: remaining <= 0 };
  }

  /* The first table-talk entry on a card whose subject is present (or has no subject); null if none. */
  function talkFor(card, presentIds) {
    const present = new Set(presentIds || []);
    const list = (card && card.talk) || [];
    return list.find((t) => !t.about || present.has(t.about)) || null;
  }

  /* The rumour at the foot of a card, unless its (unnamed) subject is absent tonight. */
  function rumourFor(card, presentIds) {
    const r = card && card.rumour;
    if (!r) return null;
    return !r.about || (presentIds || []).includes(r.about) ? r : null;
  }

  /* Which recorded voice reads a line: the ghosts, the narrator and living Victor (the host can mute
     the voice and say his lines in person); stage directions are not. 'both' is the two ghosts together. */
  function voiceForSpeaker(speaker) {
    if (/^Stage direction/.test(speaker)) return null;
    if (/^Both/.test(speaker)) return 'both';
    /* Scene 1: only Victor hears his sister, so he speaks her words. */
    if (/\(Victor reads\)/.test(speaker)) return 'victor';
    if (/^Delilah's ghost/.test(speaker)) return 'delilah';
    if (/^Victor's ghost/.test(speaker)) return 'victor';
    if (/^Narrator/.test(speaker)) return 'narrator';
    if (/^Victor \(/.test(speaker)) return 'victor';
    return null;
  }

  /* Every game line that has a voice-over, grouped by when it plays: 'stage-<id>' with the stage
     narration, 'announce-<id>' with Victor's announcement at the end of a stage, 'quote-<id>' with
     the closing quote (read by the narrator even when the ghost voice-over is muted), 'set-<key>'
     with a set piece, 'reveal' with the final reveal. */
  function voiceLines(data) {
    const out = [];
    const add = (group, lines) => lines.forEach((line, i) => {
      const voice = voiceForSpeaker(line.speaker);
      if (voice) out.push({ id: `${group}-${i}`, group, voice, speaker: line.speaker, text: line.text });
    });
    data.stages.forEach((st) => add(`stage-${st.id.replace('.', '-')}`, st.narration));
    data.stages.forEach((st) => { if (st.announcement) add(`announce-${st.id.replace('.', '-')}`, [st.announcement]); });
    data.stages.forEach((st) => { if (st.quote) add(`quote-${st.id.replace('.', '-')}`, [{ speaker: 'Narrator', text: st.quote.text }]); });
    Object.keys(data.setPieces).forEach((key) => add(`set-${key}`, data.setPieces[key].lines));
    add('reveal', data.reveal.lines);
    return out;
  }

  function voiceGroup(data, group) { return voiceLines(data).filter((l) => l.group === group); }

  const logic = { buildRoster, orphanedClues, teamSentence, tally, formatRemaining, talkFor, rumourFor, voiceLines, voiceGroup };

  root.BM = root.BM || {};
  root.BM.logic = logic;
  if (typeof module !== 'undefined' && module.exports) module.exports = logic;
})(typeof window !== 'undefined' ? window : globalThis);
