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

# protobufjs-cli currently emits `protobufjs/minimal` (without extension),
# which fails under strict Node ESM resolution. Normalize to `.js`.
sed -i '' 's|"protobufjs/minimal"|"protobufjs/minimal.js"|g' "$OUT_DIR/protocol.js"
# protobufjs/minimal is CommonJS; Node ESM namespace import exposes only
# `default` in this environment. Normalize to default import for runtime safety.
sed -i '' 's|import \* as \$protobuf from "protobufjs/minimal.js";|import $protobuf from "protobufjs/minimal.js";|g' "$OUT_DIR/protocol.js"

./node_modules/.bin/pbts -o "$OUT_DIR/protocol.d.ts" "$OUT_DIR/protocol.js"

echo "✓ Protocol Buffers compiled successfully"
