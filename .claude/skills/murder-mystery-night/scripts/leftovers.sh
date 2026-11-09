#!/usr/bin/env bash
# List every place a new game still carries Blackwood Manor's story: names, props, clues, places.
# Run from anywhere: leftovers.sh <game-dir>. Exit code 1 while anything is left.
# A hit inside a comment still counts: the next person to read the code will be misled.
set -uo pipefail
DIR=${1:?usage: leftovers.sh <game-dir>}
WORDS='Blackwood|Ezekiel|Ashgrove|Hallows|Finch|Rosalind|Vane\b|Selene|Nocturne|Krank|Wilhelmina|Malachi|Silas|Thorne|Corvus|Khamun|Theban|Morgana|Edgar|Mills\b|Zora|Lucien|Graves|Luna\b|finch|vane|selene|krank|malachi|silas|corvus|khamun|morgana|edgar|zora|graves|luna|jasmine|nightshade|K-7|rabbit hat|conjuring|Crimson|crimson|candles burn low|wax remembers|mummy|sarcophagus|Wellington|cellar|Order of the|1916|Lyla|Lance|red book|handkerchief|Enter the manor'
hits=$(cd "$DIR" && grep -rnE "$WORDS" --include='*.js' --include='*.html' --include='*.css' --include='*.md' --include='*.json' --include='*.command' . \
  | grep -v '^./node_modules/' | grep -v '^./js/voice-manifest.js' | grep -v '^./js/sfx-manifest.js')
ledger=$(cd "$DIR" && grep -rnE "['\"\`][^'\"\`]*[Ll]edger[^'\"\`]*['\"\`]" --include='*.js' --include='*.html' . | grep -v '^./node_modules/')
if [ -n "$hits" ]; then echo "== Blackwood story still present ($(echo "$hits" | wc -l | tr -d ' ') lines):"; echo "$hits" | cut -c1-200; fi
if [ -n "$ledger" ]; then echo; echo "== Visible text that says 'ledger' (fine only if the new story's torn document is a ledger):"; echo "$ledger" | cut -c1-200; fi
missing=$(cd "$DIR" && node -e '
  const d=require("./js/data.js"); const fs=require("fs");
  for (const c of d.characters) if (!fs.existsSync(c.image)) console.log("portrait missing: "+c.image);
  const src=fs.readFileSync("scripts/generate-voice.js","utf8");
  for (const c of d.characters) if (!c.killer && !new RegExp("^\\s+"+c.id+":","m").test(src)) console.log("no ElevenLabs voice for absent guest "+c.id+" in scripts/generate-voice.js VOICES");
' 2>&1)
motifs=$(cd "$DIR" && grep -rnoiE "candle[a-z]*|manor|hallowe'?en|s[ée]ance|\bcrypts?\b|coffin|raven|\bbats?\b|cobweb" --include='*.js' --include='*.html' --include='*.css' . \
  | grep -v '^./node_modules/' | grep -vE '^./js/(voice|sfx)-manifest.js' | awk -F: '{print $1": "tolower($3)}' | sort | uniq -c)
if [ -n "$motifs" ]; then echo; echo "== Blackwood's gothic motifs (not a failure: keep only what fits the new theme; see code-hooks.md):"; echo "$motifs"; fi
if [ -n "$missing" ]; then echo; echo "== Missing pieces:"; echo "$missing"; fi
[ -z "$hits$missing" ] && { echo "Clean: no Blackwood story left, every portrait and voice present."; exit 0; }
exit 1
