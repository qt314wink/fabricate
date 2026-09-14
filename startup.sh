#!/bin/sh
# Revive contract: preview must listen on 0.0.0.0:8080 via npm run dev.
set -eu
cd /workspace
if curl -sf -o /dev/null --max-time 2 http://127.0.0.1:8080/; then
  exit 0
fi
npm run dev >/tmp/fabricate-dev.log 2>&1 &
for i in 1 2 3 4 5 6 7 8 9 10 11 12; do
  if curl -sf -o /dev/null --max-time 2 http://127.0.0.1:8080/; then
    exit 0
  fi
  sleep 0.5
done
exit 0
