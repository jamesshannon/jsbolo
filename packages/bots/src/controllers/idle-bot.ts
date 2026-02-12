import {cloneBotCommand, createNeutralBotCommand, type BotCommand, type BotController, type BotObservation} from '../types.js';

/**
 * Deterministic no-op bot used for smoke tests and baseline infrastructure.
 */
export class IdleBot implements BotController {
  readonly profile = 'idle';

  think(_observation: BotObservation): BotCommand {
    return cloneBotCommand(createNeutralBotCommand());
  }
}
