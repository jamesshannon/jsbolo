import {cloneBotCommand, createBotController, type BotController, type BotCommand, type BotInitContext, type BotObservation} from '@jsbolo/bots';
import type {BotRuntimeAdapter} from './bot-runtime-adapter.js';

interface RegisteredBot {
  profile: string;
  controller: BotController;
}

/**
 * Default runtime adapter: execute bot controllers in-process.
 */
export class InProcessBotRuntimeAdapter implements BotRuntimeAdapter {
  private readonly bots = new Map<string, RegisteredBot>();

  registerBot(runtimeId: string, profile: string, context: BotInitContext): void {
    const previous = this.bots.get(runtimeId);
    if (previous?.controller.shutdown) {
      previous.controller.shutdown();
    }

    const controller = createBotController(profile);
    controller.init?.(context);

    this.bots.set(runtimeId, {
      profile,
      controller,
    });
  }

  getRegisteredProfile(runtimeId: string): string | undefined {
    return this.bots.get(runtimeId)?.profile;
  }

  tickBot(runtimeId: string, observation: BotObservation): BotCommand {
    const bot = this.bots.get(runtimeId);
    if (!bot) {
      throw new Error(`Bot runtime id is not registered: ${runtimeId}`);
    }
    return cloneBotCommand(bot.controller.think(observation));
  }

  unregisterBot(runtimeId: string): void {
    const bot = this.bots.get(runtimeId);
    if (!bot) {
      return;
    }
    bot.controller.shutdown?.();
    this.bots.delete(runtimeId);
  }

  shutdown(): void {
    for (const runtimeId of this.bots.keys()) {
      this.unregisterBot(runtimeId);
    }
  }
}
