#!/usr/bin/env bash
# Déploiement du site sur Cloudflare Pages (projet « shiurim ») via l'API.
# Variables requises : CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN
set -euo pipefail
cd "$(dirname "$0")/.."
node --check worker.js
rm -rf dist && mkdir dist && cp worker.js dist/_worker.js
curl -sf -X POST "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/shiurim/deployments" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -F 'manifest={}' -F 'branch=main' \
  -F '_worker.js=@dist/_worker.js;type=application/javascript+module'
echo
echo "Déploiement envoyé."
