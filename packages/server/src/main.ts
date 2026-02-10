/**
 * Server entry point
 */

import * as path from 'node:path';
import {fileURLToPath} from 'node:url';
import {GameServer} from './game-server.js';

const PORT = process.env['PORT'] ? parseInt(process.env['PORT'], 10) : 8080;

// Get directory of current module (for resolving map path)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Default map path (Everard Island)
// To use procedural map instead, comment out this line
const DEFAULT_MAP = path.join(__dirname, '../maps/everard_island.map');

function main(): void {
  console.log('Starting JSBolo server...');

  const server = new GameServer(PORT, DEFAULT_MAP);

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
