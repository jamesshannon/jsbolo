import {
  createNeutralBotCommand,
  type BotCommand,
  type BotObservation,
  type BotTankState,
} from '@jsbolo/bots';
import {type PlayerInput} from '@jsbolo/shared';
import type {ServerTank} from '../simulation/tank.js';
import type {SessionPlayer} from './session-player-manager.js';
import type {BotRuntimeAdapter} from './bot-runtime-adapter.js';

interface BotInputContext {
  tick: number;
  players: Map<number, SessionPlayer>;
  areTeamsAllied: (teamA: number, teamB: number) => boolean;
}

/**
 * Bridges authoritative session state to runtime-neutral bot controllers.
 */
export class BotInputSystem {
  constructor(
    private readonly runtimeAdapter: BotRuntimeAdapter,
    private readonly log: (message: string) => void = console.log
  ) {}

  /**
   * Attach a bot profile to an existing session player.
   */
  enableBotForPlayer(player: SessionPlayer, profile: string): void {
    const runtimeId = `player-${player.id}`;

    this.runtimeAdapter.registerBot(runtimeId, profile, {
      runtimeId,
      team: player.tank.team,
    });

    player.controlType = 'bot';
    player.botProfile = profile;
    player.botRuntimeId = runtimeId;

    this.log(`Bot enabled for player ${player.id} using profile '${profile}'`);
  }

  /**
   * Detach bot control from a session player.
   */
  disableBotForPlayer(player: SessionPlayer): void {
    if (!player.botRuntimeId) {
      return;
    }

    this.runtimeAdapter.unregisterBot(player.botRuntimeId);
    player.controlType = 'human';
    delete player.botProfile;
    delete player.botRuntimeId;

    this.log(`Bot disabled for player ${player.id}`);
  }

  /**
   * Generate and inject per-tick bot inputs into player state.
   */
  injectBotInputs(context: BotInputContext): void {
    const tankStates = new Map<number, BotTankState>();

    for (const player of context.players.values()) {
      tankStates.set(player.id, this.toBotTankState(player.tank));
    }

    for (const player of context.players.values()) {
      if (player.controlType !== 'bot' || !player.botRuntimeId) {
        continue;
      }

      const self = tankStates.get(player.id);
      if (!self) {
        continue;
      }

      const enemies = Array.from(tankStates.values())
        .filter(candidate =>
          candidate.id !== self.id &&
          !context.areTeamsAllied(self.team, candidate.team)
        )
        .sort((a, b) => a.id - b.id);

      const observation: BotObservation = {
        tick: context.tick,
        self,
        enemies,
      };

      const command = this.getCommandSafely(player.botRuntimeId, observation);
      this.applyCommand(player, context.tick, command);
    }
  }

  shutdown(): void {
    this.runtimeAdapter.shutdown();
  }

  private getCommandSafely(runtimeId: string, observation: BotObservation): BotCommand {
    try {
      return this.runtimeAdapter.tickBot(runtimeId, observation);
    } catch (error) {
      this.log(`Bot command generation failed for ${runtimeId}: ${String(error)}`);
      return createNeutralBotCommand();
    }
  }

  private applyCommand(player: SessionPlayer, tick: number, command: Omit<PlayerInput, 'sequence' | 'tick'>): void {
    if (command.buildOrder) {
      // Keep server behavior consistent with human command queue semantics.
      player.pendingBuildOrder = command.buildOrder;
    }

    const {buildOrder: _ignoredBuildOrder, ...movementInput} = command;

    player.lastInput = {
      sequence: player.lastInput.sequence + 1,
      tick,
      ...movementInput,
    };
  }

  private toBotTankState(tank: ServerTank): BotTankState {
    return {
      id: tank.id,
      team: tank.team,
      x: tank.x,
      y: tank.y,
      direction: tank.direction,
      speed: tank.speed,
      armor: tank.armor,
      shells: tank.shells,
      mines: tank.mines,
      trees: tank.trees,
      onBoat: tank.onBoat,
      reload: tank.reload,
      firingRange: tank.firingRange,
    };
  }
}
