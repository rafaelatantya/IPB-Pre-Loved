#!/bin/bash
# Version: 1.1.0
set -e

echo "🚀 Starting IPB Pre-Loved Development Environment..."

# 1. Pastikan dependencies terinstall
if [ ! -d "node_modules" ]; then
  echo "📦 node_modules not found, installing..."
  npm install --legacy-peer-deps
fi

# 2. INTERACTIVE RESET OPTION
echo ""
echo "❓ Do you want to RESET database and dummy data? (y/N)"
echo "   (Auto-skipping in 10 seconds...)"
read -t 10 -n 1 -p "   Your choice: " user_choice || user_choice="n"
echo ""

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
