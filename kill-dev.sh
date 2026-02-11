#!/bin/bash
# Kill all development servers

echo "🛑 Stopping all dev servers..."

# Kill processes on specific ports
echo "   Killing processes on ports 3000-3009 (client)..."
lsof -ti:3000,3001,3002,3003,3004,3005,3006,3007,3008,3009 2>/dev/null | xargs kill -9 2>/dev/null || true

echo "   Killing processes on port 3001 (server)..."
lsof -ti:3001 2>/dev/null | xargs kill -9 2>/dev/null || true

# Kill any node processes in this project directory
echo "   Killing any remaining node processes from this project..."
ps aux | grep node | grep jsbolo | grep -v grep | awk '{print $2}' | xargs kill -9 2>/dev/null || true

# Extra thorough cleanup
echo "   Killing vite and tsx processes..."
pkill -9 -f "vite.*jsbolo" 2>/dev/null || true
pkill -9 -f "tsx.*jsbolo" 2>/dev/null || true

echo "   Waiting for processes to terminate..."
sleep 1

# Verify ports are free
echo ""
echo "📋 Port status:"
if lsof -ti:3000 >/dev/null 2>&1; then
    echo "   ⚠️  Port 3000 still in use by PID: $(lsof -ti:3000)"
else
    echo "   ✅ Port 3000 is free"
fi

if lsof -ti:3001 >/dev/null 2>&1; then
    echo "   ⚠️  Port 3001 still in use by PID: $(lsof -ti:3001)"
else
    echo "   ✅ Port 3001 is free"
fi

echo ""
echo "✅ All dev servers stopped!"
