#!/usr/bin/env bash
# Scaffold a new murder-night project from the skill's template (the Blackwood Manor engine).
#
#   new-game.sh <target-dir> "<Title>" <slug> <ghostA-id>:<GhostA-Name> <ghostB-id>:<GhostB-Name>
#   e.g. new-game.sh ~/Public/gilded-cage "The Gilded Cage" gilded-cage rosa:Rosa max:Max
#
# Names are the ghosts' FIRST names (one word): they appear in speaker labels like "Rosa's ghost".
# The target may already hold docs/ (the story bible written in step 2); anything else must be empty.
# ghostA = the first victim (dies at the toast, speaks from beyond from the start).
# ghostB = the second victim (the other host: alive in Scene 1, killed at its end, rises for Scene 3).
# The ids become the team keys and the ghosts' voice ids; ids must be lowercase letters only.
# The story text in js/data.js, js/story.js and js/intro.js is still Blackwood's afterwards:
# rewrite it, then run leftovers.sh until it is clean.
set -euo pipefail
[ $# -eq 5 ] || { sed -n '2,13p' "$0"; exit 2; }
DIR=$1; TITLE=$2; SLUG=$3
A_ID=${4%%:*}; A_NAME=${4#*:}; B_ID=${5%%:*}; B_NAME=${5#*:}
for id in "$A_ID" "$B_ID"; do [[ $id =~ ^[a-z]+$ ]] || { echo "ghost id '$id' must be lowercase letters only"; exit 2; }; done
for n in "$A_NAME" "$B_NAME"; do [[ $n =~ ^[^[:space:]:\'\"]+$ ]] || { echo "ghost name '$n' must be one word (a first name)"; exit 2; }; done
[[ $SLUG =~ ^[a-z0-9-]+$ ]] || { echo "slug must be lowercase letters, digits and hyphens"; exit 2; }
HERE=$(cd "$(dirname "$0")/.." && pwd)
if [ -e "$DIR" ] && [ -n "$(ls -A "$DIR" 2>/dev/null | grep -vxE 'docs|\.DS_Store')" ]; then echo "$DIR holds more than docs/: scaffold into an empty folder"; exit 1; fi
mkdir -p "$DIR"
rsync -a "$HERE/template/" "$DIR/"
mkdir -p "$DIR/assets/voice" "$DIR/assets/characters"

export TITLE SLUG A_ID A_NAME B_ID B_NAME
SLUG_U=${SLUG//-/_}; export SLUG_U
find "$DIR" -path "$DIR/docs" -prune -o -type f \( -name '*.js' -o -name '*.html' -o -name '*.css' -o -name '*.md' -o -name '*.json' -o -name '*.command' -o -name 'Makefile' -o -name '.gitignore' \) -print0 |
  xargs -0 perl -pi -e '
    s/Blackwood Manor/$ENV{TITLE}/g; s/Blackwood(?= Remote)/$ENV{TITLE}/g;
    s/blackwood-manor/$ENV{SLUG}/g; s/blackwood_manor/$ENV{SLUG_U}/g; s/blackwood(?=[-_])/$ENV{SLUG}/g;
    s/DELILAH/\U$ENV{A_NAME}/g; s/Delilah/$ENV{A_NAME}/g; s/delilah/$ENV{A_ID}/g;
    s/VICTOR/\U$ENV{B_NAME}/g;  s/Victor(?!ian)/$ENV{B_NAME}/g; s/victor/$ENV{B_ID}/g;
  '
mv "$DIR/Start Blackwood Manor.command" "$DIR/Start $TITLE.command"
chmod +x "$DIR/Start $TITLE.command"
cd "$DIR"
git init -q 2>/dev/null || true
# The example portraits are not shipped, so the portrait test is expected to fail until you add yours.
if node --test --test-skip-pattern='portrait' 'test/*.test.js' >/dev/null 2>&1 && node scripts/check-content.js >/dev/null; then
  echo "Scaffolded $DIR: the engine's tests pass with the example story renamed (portraits not yet added)."
else echo "Scaffolded $DIR, but the tests fail: run npm test there to see why."; exit 1; fi
echo "Hybrid names such as \"$A_NAME Blackwood\" are expected until the story is rewritten; leftovers.sh lists them."
echo "Next: rewrite the story files, then run $HERE/scripts/leftovers.sh \"$DIR\"."
