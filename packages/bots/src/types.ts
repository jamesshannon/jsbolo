import {RangeAdjustment, type BuildOrder, type PlayerInput} from '@jsbolo/shared';

/**
 * Read-only tank snapshot provided to bot controllers each tick.
 */
export interface BotTankState {
  id: number;
  team: number;
  x: number;
  y: number;
  direction: number;
  speed: number;
  armor: number;
  shells: number;
  mines: number;
  trees: number;
  onBoat: boolean;
  reload: number;
  firingRange: number;
}

/**
 * Authoritative per-tick world view passed into a bot.
 */
export interface BotObservation {
  tick: number;
  self: BotTankState;
  enemies: readonly BotTankState[];
}

/**
 * Bot command payload for one simulation tick.
 *
 * Sequence and tick are server-owned and injected by the server adapter.
 */
export type BotCommand = Omit<PlayerInput, 'sequence' | 'tick'>;

/**
 * Initialization context provided exactly once when a bot is registered.
 */
export interface BotInitContext {
  runtimeId: string;
  team: number;
}

/**
 * Runtime-neutral bot controller contract.
 */
export interface BotController {
  readonly profile: string;
  init?(context: BotInitContext): void;
  think(observation: BotObservation): BotCommand;
  shutdown?(): void;
}

/**
 * Shared neutral command baseline used when a bot is idle or in fallback mode.
 */
export function createNeutralBotCommand(): BotCommand {
  return {
    accelerating: false,
    braking: false,
    turningClockwise: false,
    turningCounterClockwise: false,
    shooting: false,
    rangeAdjustment: RangeAdjustment.NONE,
  };
}

/**
 * Helper to clone command objects so callers can safely mutate their own copies.
 */
export function cloneBotCommand(command: BotCommand): BotCommand {
  const buildOrder: BuildOrder | undefined = command.buildOrder
    ? {
      action: command.buildOrder.action,
      targetX: command.buildOrder.targetX,
      targetY: command.buildOrder.targetY,
    }
    : undefined;

  return {
    accelerating: command.accelerating,
    braking: command.braking,
    turningClockwise: command.turningClockwise,
    turningCounterClockwise: command.turningCounterClockwise,
    shooting: command.shooting,
    rangeAdjustment: command.rangeAdjustment,
    ...(buildOrder !== undefined && {buildOrder}),
  };
}
