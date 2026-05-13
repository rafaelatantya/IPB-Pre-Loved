#!/bin/bash
# Version: 1.1.0
set -e

echo "🚀 Starting IPB Pre-Loved Development Environment..."

# 1. Pastikan .dev.vars ada (Wajib buat local Cloudflare emulation)
if [ ! -f ".dev.vars" ]; then
  if [ -f ".dev.vars.example" ]; then
    echo "⚠️  .dev.vars not found! Cloning from .dev.vars.example..."
    cp .dev.vars.example .dev.vars
  else
    echo "❌ CRITICAL: .dev.vars and .dev.vars.example are both missing!"
    exit 1
  fi
fi

# 2. Pastikan dependencies terinstall
if [ ! -d "node_modules" ]; then
  echo "📦 node_modules not found, installing (this might take a while)..."
  npm install --legacy-peer-deps
fi

# 3. AUTOMATIC DATABASE SYNC (The Future-Proof Way)
# Kita nge-cek apakah seed.sql berubah. Kalau berubah, auto-reset biar data temen lu sinkron.
SEED_FILE="drizzle/seed.sql"
HASH_FILE="local-db-info/seed.hash"
mkdir -p local-db-info

# Gunakan 'md5sum' atau 'md5'
if [ -f "$SEED_FILE" ]; then
  CURRENT_HASH=$(md5sum $SEED_FILE | awk '{ print $1 }')
else
  CURRENT_HASH="no-seed"
fi

LAST_HASH=""
if [ -f "$HASH_FILE" ]; then
  LAST_HASH=$(cat $HASH_FILE)
fi

if [ "$DB_RESET" = "true" ] || [ -f "RESET_DB" ] || [ "$CURRENT_HASH" != "$LAST_HASH" ]; then
  echo "🧹 Database reset triggered (manual/seed change/new setup)..."
  npm run db:reset:local
  echo "$CURRENT_HASH" > $HASH_FILE
  [ -f "RESET_DB" ] && rm RESET_DB
else
  echo "✅ Database is up-to-date with seed.sql."
  echo "📦 Applying any new migrations..."
  npm run db:push:local || { echo "❌ Migration failed! Check your schema."; exit 1; }
fi

# 4. Build Project (Generate .vercel/output/static)
# Kita build cuma kalau outputnya belum ada ATAU kalau mau fresh build.
# Tapi biasanya di dev, build ini wajib buat Cloudflare Pages.
echo "🏗️  Building project for Cloudflare Pages..."
npm run pages:build || {
  echo "❌ BUILD FAILED!"
  echo "💡 TIP: If this is an 'Exit Code 137', please increase your Docker Memory to at least 4GB."
  exit 1
}

# 5. Jalankan Server
echo "⚡ Starting Cloudflare Pages dev server..."
# Bind ke 0.0.0.0 biar bisa diakses dari luar container
npx wrangler pages dev .vercel/output/static --d1 DB=777ac36d-0a4f-4996-9c38-201fed833d73 --r2 bucket --persist-to ./local-db-info --ip 0.0.0.0 --port 8788
