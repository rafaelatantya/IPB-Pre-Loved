#!/bin/bash

# SEED MEDIA PIPELINE for IPB Pre-Loved
# Fungsinya: Download sample media dan masukkan ke Local R2 Storage

set -e

BUCKET_NAME="bucket"
STORAGE_PATH="./local-db-info"
ASSETS_DIR="./scripts/seed-assets"

echo "🚀 Starting Seed Media Pipeline..."

# 1. Buat folder assets jika belum ada
mkdir -p $ASSETS_DIR

# 2. Download sample images & video
echo "📥 Downloading sample assets..."

# MacBook Images
curl -L -s -o "$ASSETS_DIR/mac1.jpg" "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800"
curl -L -s -o "$ASSETS_DIR/mac2.jpg" "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=800"
curl -L -s -o "$ASSETS_DIR/mac3.jpg" "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=800"

# Book Images
curl -L -s -o "$ASSETS_DIR/book1.jpg" "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=800"
curl -L -s -o "$ASSETS_DIR/book2.jpg" "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800"
curl -L -s -o "$ASSETS_DIR/book3.jpg" "https://images.unsplash.com/photo-1532012197367-2806ff91717d?q=80&w=800"

# Table Image
curl -L -s -o "$ASSETS_DIR/table.jpg" "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=800"

# Video
curl -L -s -o "$ASSETS_DIR/demo-video.mp4" "https://www.w3schools.com/html/mov_bbb.mp4"

echo "✅ Download complete."

# 3. Upload ke Local R2 menggunakan Wrangler
echo "📤 Uploading to local R2 bucket ($BUCKET_NAME)..."

upload_to_r2() {
    local file_path=$1
    local key=$2
    npx wrangler r2 object put "$BUCKET_NAME/$key" --file="$file_path" --local --persist-to "$STORAGE_PATH" > /dev/null
    echo "   + Uploaded: $key"
}

upload_to_r2 "$ASSETS_DIR/mac1.jpg" "products/mac1.jpg"
upload_to_r2 "$ASSETS_DIR/mac2.jpg" "products/mac2.jpg"
upload_to_r2 "$ASSETS_DIR/mac3.jpg" "products/mac3.jpg"
upload_to_r2 "$ASSETS_DIR/book1.jpg" "products/book1.jpg"
upload_to_r2 "$ASSETS_DIR/book2.jpg" "products/book2.jpg"
upload_to_r2 "$ASSETS_DIR/book3.jpg" "products/book3.jpg"
upload_to_r2 "$ASSETS_DIR/table.jpg" "products/table.jpg"
upload_to_r2 "$ASSETS_DIR/demo-video.mp4" "products/demo-video.mp4"

echo "✨ All assets are now in local R2 storage."
echo "🔗 You can access them via /api/images/products/[filename]"
