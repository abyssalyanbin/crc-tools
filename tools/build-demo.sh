#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "⏳ install deps (ensure lock up-to-date)"
pnpm i

echo "🔨 build @crc/core"
pnpm -C "$ROOT_DIR/packages/crc-core" build

echo "🔨 build @crc/presets (will run validate)"
pnpm -C "$ROOT_DIR/packages/crc-presets" build

echo "📦 assemble _site"
rm -rf "$ROOT_DIR/_site"
mkdir -p "$ROOT_DIR/_site/crc-core" "$ROOT_DIR/_site/crc-presets"
cp "$ROOT_DIR/examples/web-min/index.html" "$ROOT_DIR/_site/index.html"
cp "$ROOT_DIR/packages/crc-core/dist/index.js" "$ROOT_DIR/_site/crc-core/index.js"
cp "$ROOT_DIR/packages/crc-presets/dist/index.json" "$ROOT_DIR/_site/crc-presets/index.json"

echo "🌐 serve http://localhost:5173"
npx http-server "$ROOT_DIR/_site" -p 5173
