#!/bin/bash
# Extracts frames from an MP4 video and converts to WebP for optimal web performance
# Usage: ./video-to-webp-frames.sh input.mp4 output_dir [fps] [quality]
#
# Args:
#   input.mp4   - Source video file
#   output_dir  - Where to save frames (e.g., public/frames)
#   fps         - Frames per second to extract (default: 30)
#   quality     - WebP quality 0-100 (default: 75)
#
# Example:
#   ./video-to-webp-frames.sh cinematic.mp4 public/frames 30 75

set -e

INPUT="${1:?Usage: $0 input.mp4 output_dir [fps] [quality]}"
OUTPUT_DIR="${2:?Usage: $0 input.mp4 output_dir [fps] [quality]}"
FPS="${3:-30}"
QUALITY="${4:-75}"

# Check ffmpeg
if ! command -v ffmpeg &> /dev/null; then
    echo "ERROR: ffmpeg not found. Install with: brew install ffmpeg"
    exit 1
fi

# Check cwebp (for WebP conversion)
if ! command -v cwebp &> /dev/null; then
    echo "WARNING: cwebp not found. Install with: brew install webp"
    echo "Falling back to ffmpeg WebP output..."
    USE_CWEBP=false
else
    USE_CWEBP=true
fi

mkdir -p "$OUTPUT_DIR"

echo "============================================"
echo "VIDEO TO WEBP FRAMES"
echo "============================================"
echo "Input:   $INPUT"
echo "Output:  $OUTPUT_DIR"
echo "FPS:     $FPS"
echo "Quality: $QUALITY"
echo "============================================"

# Get video duration
DURATION=$(ffmpeg -i "$INPUT" 2>&1 | grep Duration | sed 's/.*Duration: \([^,]*\).*/\1/' | awk -F: '{print ($1*3600)+($2*60)+$3}')
EXPECTED_FRAMES=$(echo "$DURATION * $FPS" | bc | cut -d. -f1)
echo "Duration: ${DURATION}s → ~${EXPECTED_FRAMES} frames expected"

if $USE_CWEBP; then
    # Step 1: Extract as temporary JPEGs
    echo ""
    echo "Step 1/2: Extracting frames as JPEG..."
    TEMP_DIR=$(mktemp -d)
    ffmpeg -i "$INPUT" -vf "fps=$FPS,scale=1280:720" -q:v 2 "$TEMP_DIR/frame_%04d.jpg" -y 2>/dev/null

    # Step 2: Convert to WebP
    echo "Step 2/2: Converting to WebP (quality=$QUALITY)..."
    COUNT=0
    for f in "$TEMP_DIR"/frame_*.jpg; do
        COUNT=$((COUNT + 1))
        BASENAME=$(basename "$f" .jpg)
        cwebp -q "$QUALITY" "$f" -o "$OUTPUT_DIR/${BASENAME}.webp" 2>/dev/null
        if [ $((COUNT % 50)) -eq 0 ]; then
            echo "  Converted $COUNT frames..."
        fi
    done

    # Cleanup temp
    rm -rf "$TEMP_DIR"
else
    # Direct WebP output via ffmpeg (slightly lower quality but no cwebp needed)
    echo "Extracting frames directly as WebP..."
    ffmpeg -i "$INPUT" -vf "fps=$FPS,scale=1280:720" -c:v libwebp -quality "$QUALITY" "$OUTPUT_DIR/frame_%04d.webp" -y 2>/dev/null
    COUNT=$(ls "$OUTPUT_DIR"/frame_*.webp 2>/dev/null | wc -l)
fi

# Also save the first frame as a hero still image (for mobile fallback)
FIRST_FRAME="$OUTPUT_DIR/frame_0001"
if [ -f "${FIRST_FRAME}.webp" ]; then
    cp "${FIRST_FRAME}.webp" "$OUTPUT_DIR/hero-still.webp"
    echo "Mobile hero still: $OUTPUT_DIR/hero-still.webp"
fi

# Calculate size savings
TOTAL_SIZE=$(du -sh "$OUTPUT_DIR" | cut -f1)
echo ""
echo "============================================"
echo "DONE"
echo "Frames:     $COUNT"
echo "Format:     WebP (quality $QUALITY)"
echo "Total size: $TOTAL_SIZE"
echo "============================================"
echo ""
echo "Update client.ts with:"
echo "  frameCount: $COUNT,"
echo "  frameExtension: \".webp\","
echo "  heroStillImage: \"/frames/hero-still.webp\","
