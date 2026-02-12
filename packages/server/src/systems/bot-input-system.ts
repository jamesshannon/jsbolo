import {
  createNeutralBotCommand,
  type BotBaseState,
  type BotCommand,
  type BotObservation,
  type BotPillboxState,
  type BotShellState,
  type BotTankState,
} from '@jsbolo/bots';
import {TILE_SIZE_WORLD, type PlayerInput} from '@jsbolo/shared';
import type {ServerBase} from '../simulation/base.js';
import type {ServerPillbox} from '../simulation/pillbox.js';
import type {ServerShell} from '../simulation/shell.js';
import type {ServerTank} from '../simulation/tank.js';
import type {SessionPlayer} from './session-player-manager.js';
import type {BotRuntimeAdapter} from './bot-runtime-adapter.js';

interface BotInputContext {
  tick: number;
  players: Map<number, SessionPlayer>;
  shells: Map<number, ServerShell>;
  pillboxes: Map<number, ServerPillbox>;
  bases: Map<number, ServerBase>;
  areTeamsAllied: (teamA: number, teamB: number) => boolean;
}

// ASSUMPTION: bot perception is limited to a local "map window" centered on the bot.
// We mirror the classic default playfield footprint (about 20x15 tiles at 640x480).
const BOT_VIEW_HALF_WIDTH_WORLD = TILE_SIZE_WORLD * 10;
const BOT_VIEW_HALF_HEIGHT_WORLD = TILE_SIZE_WORLD * 7.5;

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
          this.isInBotView(self, candidate) &&
          !context.areTeamsAllied(self.team, candidate.team)
        )
        .sort((a, b) => a.id - b.id);

      const observation: BotObservation = {
        tick: context.tick,
        self,
        enemies,
        visibleBases: this.collectVisibleBases(self, context.bases),
        visiblePillboxes: this.collectVisiblePillboxes(self, context.pillboxes),
        visibleShells: this.collectVisibleShells(
          self,
          context.shells,
          tankStates,
          context.pillboxes
        ),
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

  private isInBotView(self: BotTankState, candidate: BotTankState): boolean {
    return this.isWorldPointInView(self, candidate.x, candidate.y);
  }

  private collectVisibleBases(
    self: BotTankState,
    bases: Map<number, ServerBase>
  ): BotBaseState[] {
    const visibleBases: BotBaseState[] = [];
    for (const base of bases.values()) {
      const position = base.getWorldPosition();
      if (!this.isWorldPointInView(self, position.x, position.y)) {
        continue;
      }
      visibleBases.push({
        id: base.id,
        x: position.x,
        y: position.y,
        ownerTeam: base.ownerTeam,
        armor: base.armor,
        shells: base.shells,
        mines: base.mines,
      });
    }
    return visibleBases;
  }

  private collectVisiblePillboxes(
    self: BotTankState,
    pillboxes: Map<number, ServerPillbox>
  ): BotPillboxState[] {
    const visiblePillboxes: BotPillboxState[] = [];
    for (const pillbox of pillboxes.values()) {
      if (pillbox.inTank || pillbox.isDead()) {
        continue;
      }
      const position = pillbox.getWorldPosition();
      if (!this.isWorldPointInView(self, position.x, position.y)) {
        continue;
      }
      visiblePillboxes.push({
        id: pillbox.id,
        x: position.x,
        y: position.y,
        ownerTeam: pillbox.ownerTeam,
        armor: pillbox.armor,
      });
    }
    return visiblePillboxes;
  }

  private collectVisibleShells(
    self: BotTankState,
    shells: Map<number, ServerShell>,
    tankStates: Map<number, BotTankState>,
    pillboxes: Map<number, ServerPillbox>
  ): BotShellState[] {
    const visibleShells: BotShellState[] = [];
    for (const shell of shells.values()) {
      if (!shell.alive) {
        continue;
      }
      if (!this.isWorldPointInView(self, shell.x, shell.y)) {
        continue;
      }
      visibleShells.push({
        id: shell.id,
        x: shell.x,
        y: shell.y,
        direction: shell.direction,
        ownerTeam: this.resolveShellOwnerTeam(shell, tankStates, pillboxes),
      });
    }
    return visibleShells;
  }

  private resolveShellOwnerTeam(
    shell: ServerShell,
    tankStates: Map<number, BotTankState>,
    pillboxes: Map<number, ServerPillbox>
  ): number | null {
    if (shell.ownerTankId >= 0) {
      return tankStates.get(shell.ownerTankId)?.team ?? null;
    }

    const pillboxId = -shell.ownerTankId;
    const ownerTeam = pillboxes.get(pillboxId)?.ownerTeam;
    return ownerTeam === undefined ? null : ownerTeam;
  }

  private isWorldPointInView(self: BotTankState, pointX: number, pointY: number): boolean {
    return Math.abs(pointX - self.x) <= BOT_VIEW_HALF_WIDTH_WORLD &&
      Math.abs(pointY - self.y) <= BOT_VIEW_HALF_HEIGHT_WORLD;
  }
}
