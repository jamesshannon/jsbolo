import type {BotCommand, BotInitContext, BotObservation} from '@jsbolo/bots';

/**
 * Runtime boundary for bot execution.
 *
 * This interface keeps the server-side integration stable while allowing future
 * runtime isolation (worker thread/process or external plugin host).
 */
export interface BotRuntimeAdapter {
  registerBot(runtimeId: string, profile: string, context: BotInitContext): void;
  getRegisteredProfile(runtimeId: string): string | undefined;
  tickBot(runtimeId: string, observation: BotObservation): BotCommand;
  unregisterBot(runtimeId: string): void;
  shutdown(): void;
}
