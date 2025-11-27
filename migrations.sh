#!/usr/bin/env bash
set -euo pipefail
if npm run | grep -q "^migrate"; then
  npm run migrate
else
  echo "No migrate script defined"
fi
