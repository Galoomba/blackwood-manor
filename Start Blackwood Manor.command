#!/bin/zsh -l
# Double-click to run Blackwood Manor on this laptop (with the Hue lights relay). Keep this window open.
cd "$(dirname "$0")"
if curl -s --max-time 1 http://localhost:8801/hue/ping | grep -q blackwood-hue-relay; then
  echo "Blackwood Manor is already running."; open http://localhost:8801; exit 0
fi
(sleep 1; open http://localhost:8801) &
exec node scripts/serve.js
