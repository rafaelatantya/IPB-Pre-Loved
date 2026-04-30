#!/bin/bash

# SAFE-TURBO SEED MEDIA PIPELINE V3 (Reverted)
# Download PARALEL (Ngebut), Upload SEQUENTIAL (Aman dari SQLITE_BUSY).

set -e

BUCKET_NAME="ipb-preloved-images"
TEMP_DIR="./scripts/seed-assets"
mkdir -p $TEMP_DIR

echo "🚀 Starting SAFE-TURBO Seed Media Pipeline..."

# Fungsi download gambar dengan timeout
download_image() {
    local i=$1
    if [ ! -f "$TEMP_DIR/prod_$i.jpg" ]; then
        curl -s -L --connect-timeout 5 --max-time 20 "https://picsum.photos/seed/ipb_prod_$i/800/800" -o "$TEMP_DIR/prod_$i.jpg" || echo "   [IMG] Warning: Failed to download $i"
        echo "   [IMG] Finished Download $i/45"
    fi
}

# 1. DOWNLOAD IMAGES IN PARALLEL (Max 15 batch)
echo "📥 Downloading 45 images in parallel..."
for i in {1..45}
do
    download_image $i &
    if (( $i % 15 == 0 )); then wait; fi
done
wait

# 2. DOWNLOAD VIDEOS IN PARALLEL
echo "📥 Downloading 3 videos in parallel (Stable Sources)..."
VIDEO_URLS=(
    "https://www.w3schools.com/html/mov_bbb.mp4"
    "https://vjs.zencdn.net/v/oceans.mp4"
    "https://media.w3.org/2010/05/sintel/trailer.mp4"
)

for i in "${!VIDEO_URLS[@]}"; do
    idx=$((i+1))
    (
        if [ ! -f "$TEMP_DIR/video_$idx.mp4" ]; then
            curl -s -L --connect-timeout 5 --max-time 30 "${VIDEO_URLS[$i]}" -o "$TEMP_DIR/video_$idx.mp4" || echo "   [VID] Warning: Failed to download video $idx"
            echo "   [VID] Finished Download $idx/3"
        fi
    ) &
done
wait

# 3. UPLOAD TO R2 SEQUENTIALLY
WRANGLER_FLAGS="--local --persist-to ./local-db-info"
if [ "$1" == "--remote" ]; then
    WRANGLER_FLAGS=""
    echo "📤 Uploading to REMOTE R2 (Production)..."
else
    echo "📤 Uploading to local R2 (Development)..."
fi

for i in {1..45}
do
    if [ -f "$TEMP_DIR/prod_$i.jpg" ]; then
        npx wrangler r2 object put "$BUCKET_NAME/products/prod_$i.jpg" --file="$TEMP_DIR/prod_$i.jpg" $WRANGLER_FLAGS --remote > /dev/null
        echo "   [UPLOAD] Img $i/45 done"
    fi
done

for i in {1..3}
do
    if [ -f "$TEMP_DIR/video_$i.mp4" ]; then
        npx wrangler r2 object put "$BUCKET_NAME/products/video_$i.mp4" --file="$TEMP_DIR/video_$i.mp4" $WRANGLER_FLAGS --remote > /dev/null
        echo "   [UPLOAD] Vid $i/3 done"
    fi
done

echo "✨ SEED MEDIA COMPLETE! All assets are ready in R2."
