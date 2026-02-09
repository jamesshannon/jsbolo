#!/bin/bash
# Compile Protocol Buffer definitions to TypeScript

set -e

PROTO_DIR="src"
OUT_DIR="src/generated"

echo "Compiling Protocol Buffers..."

# Create output directory
mkdir -p "$OUT_DIR"

# Compile using protobufjs-cli - ES6 static module
./node_modules/.bin/pbjs -t static-module -w es6 -o "$OUT_DIR/protocol.js" "$PROTO_DIR/protocol.proto"
./node_modules/.bin/pbts -o "$OUT_DIR/protocol.d.ts" "$OUT_DIR/protocol.js"

echo "✓ Protocol Buffers compiled successfully"
