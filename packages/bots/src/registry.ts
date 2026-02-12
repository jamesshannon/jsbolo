import {IdleBot} from './controllers/idle-bot.js';
import {PatrolBot} from './controllers/patrol-bot.js';
import {TacticalBot} from './controllers/tactical-bot.js';
import type {BotController} from './types.js';

const BOT_FACTORIES: Record<string, () => BotController> = {
  idle: () => new IdleBot(),
  patrol: () => new PatrolBot(),
  tactical: () => new TacticalBot(),
};

/**
 * Return sorted profile ids to keep config UIs and tests deterministic.
 */
export function listBuiltInBotProfiles(): string[] {
  return Object.keys(BOT_FACTORIES).sort((a, b) => a.localeCompare(b));
}

/**
 * Build a new controller instance for the requested profile.
 */
export function createBotController(profile: string): BotController {
  const factory = BOT_FACTORIES[profile];
  if (!factory) {
    throw new Error(`Unknown bot profile: ${profile}`);
  }
  return factory();
}
