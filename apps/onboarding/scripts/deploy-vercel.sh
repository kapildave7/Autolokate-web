#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

vercel pull --yes --environment=production
vercel build --prod --yes
vercel deploy --prebuilt --prod --yes
