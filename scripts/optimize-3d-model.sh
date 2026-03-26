#!/bin/bash
# Optimize a 3D model (GLB/GLTF) using gltf-transform CLI
# Applies Draco compression + mesh simplification for web performance
#
# Usage: ./optimize-3d-model.sh input.glb output.glb [target-ratio]
#
# Args:
#   input.glb    - Source 3D model
#   output.glb   - Optimized output
#   target-ratio - Simplification ratio 0.0-1.0 (default: 0.5 = 50% of original polygons)
#
# Prerequisites: npm install -g @gltf-transform/cli

set -e

INPUT="${1:?Usage: $0 input.glb output.glb [target-ratio]}"
OUTPUT="${2:?Usage: $0 input.glb output.glb [target-ratio]}"
RATIO="${3:-0.5}"

# Check gltf-transform
if ! command -v gltf-transform &> /dev/null; then
    echo "Installing @gltf-transform/cli globally..."
    npm install -g @gltf-transform/cli
fi

echo "============================================"
echo "3D MODEL OPTIMIZER"
echo "============================================"
echo "Input:  $INPUT"
echo "Output: $OUTPUT"
echo "Simplification ratio: $RATIO"

# Get original size
ORIG_SIZE=$(du -h "$INPUT" | cut -f1)
echo "Original size: $ORIG_SIZE"

echo ""
echo "Step 1: Draco compression..."
gltf-transform draco "$INPUT" "$OUTPUT" 2>/dev/null

echo "Step 2: Mesh simplification (${RATIO})..."
gltf-transform simplify "$OUTPUT" "$OUTPUT" --ratio "$RATIO" 2>/dev/null

echo "Step 3: Deduplicating accessors..."
gltf-transform dedup "$OUTPUT" "$OUTPUT" 2>/dev/null

echo "Step 4: Pruning unused data..."
gltf-transform prune "$OUTPUT" "$OUTPUT" 2>/dev/null

# Get final size
FINAL_SIZE=$(du -h "$OUTPUT" | cut -f1)
echo ""
echo "============================================"
echo "DONE"
echo "Original: $ORIG_SIZE"
echo "Optimized: $FINAL_SIZE"
echo "============================================"
