/**
 * Application entry point
 */

import {Game} from './game/game.js';
import {MultiplayerGame} from './game/multiplayer-game.js';

const USE_MULTIPLAYER = true; // Set to false for single-player mode
const SERVER_URL = 'ws://localhost:8080';

declare global {
  interface Window {
    game?: Game | MultiplayerGame;
  }
}

async function main(): Promise<void> {
  const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  if (!canvas) {
    throw new Error('Canvas element not found');
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get 2D context');
  }

  console.log('Initializing JSBolo...');

  if (USE_MULTIPLAYER) {
    console.log('Starting in MULTIPLAYER mode');
    const game = new MultiplayerGame(canvas, ctx);

    // Expose game to window for debugging
    window.game = game;

    try {
      await game.init(SERVER_URL);
      console.log('Connected to server');
      game.start();
      console.log('Multiplayer game started');

      // Cleanup on page unload
      window.addEventListener('beforeunload', () => {
        game.destroy();
      });
    } catch (error) {
      console.error('Failed to connect to server:', error);
      throw error;
    }
  } else {
    console.log('Starting in SINGLE-PLAYER mode');
    const game = new Game(canvas, ctx);

    try {
      await game.init();
      console.log('Game initialized successfully');
      game.start();
      console.log('Single-player game started');

      // Cleanup on page unload
      window.addEventListener('beforeunload', () => {
        game.destroy();
      });
    } catch (error) {
      console.error('Failed to initialize game:', error);
      throw error;
    }
  }
}

// Start the game
main().catch(error => {
  console.error('Fatal error:', error);
  document.body.innerHTML = `
    <div style="color: red; padding: 20px; font-family: monospace;">
      <h1>Error loading game</h1>
      <pre>${error instanceof Error ? error.message : String(error)}</pre>
      <p>Make sure the server is running: <code>cd packages/server && pnpm dev</code></p>
    </div>
  `;
});
