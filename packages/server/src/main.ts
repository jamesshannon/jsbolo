/**
 * Server entry point
 */

import {GameServer} from './game-server.js';

const PORT = process.env['PORT'] ? parseInt(process.env['PORT'], 10) : 8080;

function main(): void {
  console.log('Starting JSBolo server...');

  const server = new GameServer(PORT);

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\nShutting down server...');
    server.close();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\nShutting down server...');
    server.close();
    process.exit(0);
  });

  console.log(`Server running on ws://localhost:${PORT}`);
  console.log('Press Ctrl+C to stop');
}

main();
