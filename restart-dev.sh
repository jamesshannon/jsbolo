#!/bin/bash
# Restart development servers (both client and server)

set -e

echo "🛑 Stopping all existing dev servers..."

# Kill processes on specific ports
echo "   Killing processes on ports 3000-3009 (client)..."
lsof -ti:3000,3001,3002,3003,3004,3005,3006,3007,3008,3009 2>/dev/null | xargs kill -9 2>/dev/null || true

echo "   Killing processes on ports 8080-8081 (server)..."
lsof -ti:8080,8081 2>/dev/null | xargs kill -9 2>/dev/null || true

# Kill any node processes in this project directory
echo "   Killing any remaining node processes from this project..."
ps aux | grep node | grep jsbolo | grep -v grep | awk '{print $2}' | xargs kill -9 2>/dev/null || true

# Extra thorough cleanup - kill any vite or tsx processes
echo "   Killing vite and tsx processes..."
pkill -9 -f "vite.*jsbolo" 2>/dev/null || true
pkill -9 -f "tsx.*jsbolo" 2>/dev/null || true

echo "   Waiting for processes to terminate..."
sleep 2

# Verify ports are free
echo "📋 Checking if ports are free..."
if lsof -ti:3000 >/dev/null 2>&1; then
    echo "   ⚠️  Port 3000 still in use!"
    lsof -ti:3000
else
    echo "   ✅ Port 3000 is free"
fi

if lsof -ti:8080 >/dev/null 2>&1; then
    echo "   ⚠️  Port 8080 still in use!"
    lsof -ti:8080
else
    echo "   ✅ Port 8080 is free"
fi

if lsof -ti:8081 >/dev/null 2>&1; then
    echo "   ⚠️  Port 8081 still in use!"
    lsof -ti:8081
else
    echo "   ✅ Port 8081 is free"
fi

echo ""
echo "🚀 Starting development servers..."
echo ""

# Start both servers using pnpm in the background
cd "$(dirname "$0")"

# Create logs directory if it doesn't exist
mkdir -p logs

# Optional bot startup defaults for local dev.
# Override by exporting env vars before running this script.
: "${ALLOW_BOTS:=true}"
: "${MAX_BOTS:=4}"
: "${BOT_ALLIANCE_MODE:=all-bots}"
: "${BOT_COUNT:=0}"
: "${BOT_PROFILE:=tactical}"
: "${ALLOW_BOT_ONLY_SIM:=false}"

# Start servers and capture logs
echo "   Starting server (port 8080)..."
cd packages/server
ALLOW_BOTS="$ALLOW_BOTS" \
MAX_BOTS="$MAX_BOTS" \
BOT_ALLIANCE_MODE="$BOT_ALLIANCE_MODE" \
BOT_COUNT="$BOT_COUNT" \
BOT_PROFILE="$BOT_PROFILE" \
ALLOW_BOT_ONLY_SIM="$ALLOW_BOT_ONLY_SIM" \
pnpm dev > ../../logs/server.log 2>&1 &
SERVER_PID=$!
cd ../..

sleep 1

echo "   Starting client (port 3000)..."
cd packages/client
pnpm dev > ../../logs/client.log 2>&1 &
CLIENT_PID=$!
cd ../..


echo ""
echo "✅ Servers started!"
echo "   Server PID: $SERVER_PID (ws://localhost:8080)"
echo "   Client PID: $CLIENT_PID (http://localhost:3000)"
echo ""
echo "📊 Watching logs (Ctrl+C to stop watching, servers will keep running)..."
echo "   Server log: logs/server.log"
echo "   Client log: logs/client.log"
echo ""

# Tail both logs with prefixes
tail -f logs/server.log logs/client.log 2>/dev/null | while read line; do
    if [[ $line == "==> logs/server.log <==" ]]; then
        echo ""
        echo "━━━━━━━━━ SERVER ━━━━━━━━━"
    elif [[ $line == "==> logs/client.log <==" ]]; then
        echo ""
        echo "━━━━━━━━━ CLIENT ━━━━━━━━━"
    else
        echo "$line"
    fi
done
