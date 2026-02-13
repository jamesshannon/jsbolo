/**
 * Server entry point
 */

import * as path from 'node:path';
import express, {type Request, type Response} from 'express';
import type {Server as HttpServer} from 'node:http';
import {fileURLToPath} from 'node:url';
import {GameSession} from './game-session.js';
import {applyStartupBots, parseBotPolicyFromEnv} from './bot-startup.js';
import {GameServer} from './game-server.js';

const PORT = process.env['PORT'] ? parseInt(process.env['PORT'], 10) : 8080;
const CONTROL_PORT = process.env['CONTROL_PORT'] ? parseInt(process.env['CONTROL_PORT'], 10) : 8081;
const ENABLE_BOT_CONTROL =
  process.env['ENABLE_BOT_CONTROL'] !== 'false' && process.env['NODE_ENV'] !== 'production';
const ALLOW_BOT_ONLY_SIM = process.env['ALLOW_BOT_ONLY_SIM'] === 'true';

// Get directory of current module (for resolving map path)
const moduleFileName = fileURLToPath(import.meta.url);
const moduleDirName = path.dirname(moduleFileName);

// Default map path (Everard Island)
// To use procedural map instead, comment out this line
const DEFAULT_MAP = path.join(moduleDirName, '../maps/everard_island.map');

function main(): void {
  console.log('Starting JSBolo server...');

  const session = new GameSession(DEFAULT_MAP, {
    botPolicy: parseBotPolicyFromEnv(),
  });
  const server = new GameServer(PORT, {
    session,
    allowBotOnlySimulation: ALLOW_BOT_ONLY_SIM,
  });
  applyStartupBots(server);
  let controlServer: HttpServer | null = null;

  if (ENABLE_BOT_CONTROL) {
    const app = express();

    /**
     * Health endpoint for local tooling.
     */
    app.get('/health', (_req: Request, res: Response): void => {
      res.status(200).json({ok: true});
    });

    /**
     * List supported built-in bot profiles.
     */
    app.get('/bots/profiles', (_req: Request, res: Response): void => {
      res.status(200).json({profiles: server.listAvailableBotProfiles()});
    });

    /**
     * List active bot-controlled players.
     */
    app.get('/bots', (_req: Request, res: Response): void => {
      res.status(200).json({bots: server.listBots()});
    });

    controlServer = app.listen(CONTROL_PORT, () => {
      console.log(`Bot status API running on http://localhost:${CONTROL_PORT}`);
    });
  }

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\nShutting down server...');
    controlServer?.close();
    server.close();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\nShutting down server...');
    controlServer?.close();
    server.close();
    process.exit(0);
  });

  console.log(`Server running on ws://localhost:${PORT}`);
  if (ENABLE_BOT_CONTROL) {
    console.log(`Bot status API: http://localhost:${CONTROL_PORT}`);
  }
  console.log('Press Ctrl+C to stop');
}

main();
