#!/bin/sh
# Version: 1.0.2
set -e

echo "🚀 Starting IPB Pre-Loved Development Environment..."

# 1. Pastikan dependencies terinstall (kalau node_modules kosong)
if [ ! -d "node_modules" ]; then
  echo "📦 node_modules not found, installing..."
  npm install --legacy-peer-deps
fi

# 2. Update Database Schema (D1 Local)
echo "📦 Applying database migrations..."
npm run db:push:local || echo "⚠️ Migration failed, but continuing..."

# 3. Seed Data & Media (Mega Seed V4)
echo "🌱 Seeding initial data and internal media..."
npx wrangler d1 execute DB --local --file=seed.sql --persist-to ./local-db-info || echo "⚠️ Seeding failed, but continuing..."
bash scripts/seed-media.sh || echo "⚠️ Media seeding failed, but continuing..."

# 4. Build Project (Generate .vercel/output/static)
echo "🏗️ Building project for Cloudflare Pages..."
npm run pages:build

# 5. Jalankan Server
echo "⚡ Starting Cloudflare Pages dev server..."
# Menggunakan --ip 0.0.0.0 supaya bisa diakses dari luar container (Host OS)
# Menggunakan bucket (lowercase) sesuai standar project terkini
npx wrangler pages dev .vercel/output/static --d1 DB=777ac36d-0a4f-4996-9c38-201fed833d73 --r2 bucket --persist-to ./local-db-info --ip 0.0.0.0 --port 8788
