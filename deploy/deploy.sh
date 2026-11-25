#!/usr/bin/env bash
# Déploie worker.js sur le projet Cloudflare Pages "shiurim" (envoi direct).
# Prérequis : CLOUDFLARE_API_TOKEN et CLOUDFLARE_ACCOUNT_ID définis, Node installé.
set -euo pipefail
cd "$(dirname "$0")/.."
node --check worker.js
rm -rf dist && mkdir dist
cp worker.js dist/_worker.js
npx --yes wrangler@3 pages deploy dist --project-name shiurim --branch main
