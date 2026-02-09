/**
 * Application entry point
 */

import {Game} from './game/game.js';

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

  const game = new Game(canvas, ctx);

  try {
    await game.init();
    console.log('Game initialized successfully');
    game.start();
    console.log('Game started');
  } catch (error) {
    console.error('Failed to initialize game:', error);
    throw error;
  }

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    game.destroy();
  });
}

// Start the game
main().catch(error => {
  console.error('Fatal error:', error);
  document.body.innerHTML = `
    <div style="color: red; padding: 20px; font-family: monospace;">
      <h1>Error loading game</h1>
      <pre>${error instanceof Error ? error.message : String(error)}</pre>
    </div>
  `;
});
