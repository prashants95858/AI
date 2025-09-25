#!/bin/sh
# Toggle Babel config for Jest/Next.js

BABEL_CONFIG="babel.config.json"
DISABLED_CONFIG=".babel.config.json.disabled"

if [ "$1" = "jest" ]; then
  if [ -f "$DISABLED_CONFIG" ]; then
    mv "$DISABLED_CONFIG" "$BABEL_CONFIG"
    echo "Babel config enabled for Jest."
  else
    echo "No disabled Babel config found."
  fi
elif [ "$1" = "next" ]; then
  if [ -f "$BABEL_CONFIG" ]; then
    mv "$BABEL_CONFIG" "$DISABLED_CONFIG"
    echo "Babel config disabled for Next.js/Turbopack."
  else
    echo "No Babel config to disable."
  fi
else
  echo "Usage: ./toggle-babel.sh [jest|next]"
fi