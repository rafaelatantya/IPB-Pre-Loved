#!/bin/bash
# Version: 1.1.0
set -e

echo "🚀 Starting IPB Pre-Loved Development Environment..."

# 1. Pastikan dependencies terinstall
if [ ! -d "node_modules" ]; then
  echo "📦 node_modules not found, installing..."
  npm install --legacy-peer-deps
fi

# 2. RESET OPTION (Environment Variable or Interactive)
if [ "$DB_RESET" = "true" ]; then
  user_choice="y"
  echo "♻️  DB_RESET=true detected, proceeding with reset..."
else
  echo ""
  echo "❓ Do you want to RESET database and dummy data? (y/N)"
  echo "   (Type 'y' and press Enter to reset, or just press Enter to skip)"
  echo "   (Auto-skipping in 15 seconds...)"
  read -t 15 -p "   Your choice: " user_choice || user_choice="n"
  echo ""
fi

if [[ $user_choice =~ ^[Yy]$ ]]; then
  echo "🗑️  Resetting database and seeding fresh data..."
  npm run db:wipe
else
  echo "⏭️  Skipping reset, using existing data."
  # Tetep jalankan push biar schema sync
  npm run db:push:local || echo "⚠️ Migration failed, but continuing..."
fi

# 3. Build Project (Generate .vercel/output/static)
echo "🏗️  Building project for Cloudflare Pages..."
npm run pages:build

# 4. Jalankan Server
echo "⚡ Starting Cloudflare Pages dev server..."
npx wrangler pages dev .vercel/output/static --d1 DB=777ac36d-0a4f-4996-9c38-201fed833d73 --r2 bucket --persist-to ./local-db-info --ip 0.0.0.0 --port 8788
