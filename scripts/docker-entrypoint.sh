#!/bin/bash
# Version: 1.1.0
set -e

echo "🚀 Starting IPB Pre-Loved Development Environment..."

# 1. Pastikan dependencies terinstall
if [ ! -d "node_modules" ]; then
  echo "📦 node_modules not found, installing..."
  npm install --legacy-peer-deps
fi

# 2. AUTOMATIC DATABASE SYNC (The Future-Proof Way)
# Kita nge-cek apakah seed.sql berubah. Kalau berubah, auto-reset biar data temen lu sinkron.
SEED_FILE="drizzle/seed.sql"
HASH_FILE="local-db-info/seed.hash"

# Gunakan 'md5sum' atau 'md5' (tergantung sistem, di slim-node biasanya md5sum)
CURRENT_HASH=$(md5sum $SEED_FILE | awk '{ print $1 }')
LAST_HASH=""

if [ -f "$HASH_FILE" ]; then
  LAST_HASH=$(cat $HASH_FILE)
fi

if [ "$DB_RESET" = "true" ] || [ -f "RESET_DB" ] || [ "$CURRENT_HASH" != "$LAST_HASH" ]; then
  if [ "$CURRENT_HASH" != "$LAST_HASH" ] && [ -n "$LAST_HASH" ]; then
    echo "📢 Seed data change detected! Automatically syncing your database..."
  fi
  
  echo "🗑️  Resetting/Syncing database and seeding fresh data..."
  npm run db:wipe
  
  # Simpan hash baru
  echo "$CURRENT_HASH" > $HASH_FILE
  
  # Bersihkan file trigger kalau ada
  if [ -f "RESET_DB" ]; then rm RESET_DB; fi
else
  echo "✅ Database is up-to-date with seed.sql."
  echo "📦 Checking for new migrations..."
  # Gunakan echo "y" untuk auto-confirm migration apply
  npm run db:push:local || { echo "❌ Migration failed! Please check your schema or migration files."; exit 1; }
  echo "🚀 All migrations applied successfully."
fi

# 3. Build Project (Generate .vercel/output/static)
echo "🏗️  Building project for Cloudflare Pages..."
npm run pages:build

# 4. Jalankan Server
echo "⚡ Starting Cloudflare Pages dev server..."
npx wrangler pages dev .vercel/output/static --d1 DB=777ac36d-0a4f-4996-9c38-201fed833d73 --r2 bucket --persist-to ./local-db-info --ip 0.0.0.0 --port 8788
