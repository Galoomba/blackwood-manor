# Known faults in the Blackwood example

Blackwood was printed before these were caught, so the files keep them. Don't copy them.

1. **The sign's answer half.** The 2.2 `hostNotes` (data.js, stage 2.2) say "The printed card does not tell them to answer" and have the host hand the answer over on the night. Blackwood's printed cards lacked it. In a new game `SIGN` carries both halves and the instruction to answer, `check-content.js` enforces that, and the host notes must not mention a hand-off.
2. **A killer learns too early.** Zora's 1.2 card ends "Then you packed a small brown vial": a guest opening 1.2 learns they brought the poison, before 2.1. In a new game the killers' 1.1–1.3 cards read like any innocent's: a motive, a grudge, a reason to be there, never the weapon or the act.
3. **Zora's 1.2 table talk** says "it was you" about the envelope handed to the Inspector. That is a bribe, not the murder, so it is allowed, but it shows how close a line can come. Check every pre-2.1 line on a killer's card for anything that tells them what they did.
4. **Table talk with no fallback.** 83 Blackwood cards have only lines about guests who could be absent. The engine then prints no table talk on that card. Run `node scripts/check-content.js --warnings` and give each card a last line with no subject, or one about a killer.
5. **Missing `absentVoice`** at 1.3 and 3.3 for several guests: the host reads those clues instead of a recording. Give every non-killer an `absentVoice` at 1.3 and 3.1–3.4.
