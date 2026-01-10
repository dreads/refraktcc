#!/bin/bash
#
# Generate 200px WebP thumbnails for all images in images/gems/
# Usage: ./scripts/generate-thumbnails.sh [--force]
#
# Options:
#   --force    Regenerate all thumbnails, even if they exist

set -e

FORCE=false
if [ "$1" = "--force" ]; then
    FORCE=true
fi

# Check for ImageMagick
if ! command -v convert &> /dev/null; then
    echo "Error: ImageMagick is required but not installed."
    echo "Install with: brew install imagemagick"
    exit 1
fi

# Navigate to project root
cd "$(dirname "$0")/.."

count=0
skipped=0

# Find all source images (exclude existing thumbnails)
find images/gems -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) ! -name "*-thumb.*" | while read -r file; do
    dir=$(dirname "$file")
    basename=$(basename "$file")
    name="${basename%.*}"
    thumb_path="${dir}/${name}-thumb.webp"

    # Skip if thumbnail exists and not forcing
    if [ "$FORCE" = false ] && [ -f "$thumb_path" ]; then
        echo "Skipping (exists): $thumb_path"
        ((skipped++)) || true
        continue
    fi

    echo "Generating: $thumb_path"
    convert "$file" -resize 200x -quality 80 "$thumb_path"
    ((count++)) || true
done

echo ""
echo "Done. Generated thumbnails for new images."
echo "Run with --force to regenerate all thumbnails."
