import {SOUND_BUBBLES} from '@jsbolo/shared';
import type {PlayerInput} from '@jsbolo/shared';
import type {ServerBase} from '../simulation/base.js';
import type {ServerPillbox} from '../simulation/pillbox.js';
import type {ServerShell} from '../simulation/shell.js';
import type {ServerTank} from '../simulation/tank.js';
import type {ServerWorld} from '../simulation/world.js';
import {BuilderSystem} from './builder-system.js';
import {CombatSystem} from './combat-system.js';
import {MatchStateSystem} from './match-state-system.js';
import {PlayerSimulationSystem} from './player-simulation-system.js';
import {StructureSimulationSystem} from './structure-simulation-system.js';
import {TerrainEffectsSystem} from './terrain-effects-system.js';

interface SessionPlayer {
  id: number;
  tank: ServerTank;
  lastInput: PlayerInput;
  pendingBuildOrder?: NonNullable<PlayerInput['buildOrder']>;
}

export interface SessionUpdateContext {
  tick: number;
  world: ServerWorld;
  players: Map<number, SessionPlayer>;
  shells: Map<number, ServerShell>;
  pillboxes: Map<number, ServerPillbox>;
  bases: Map<number, ServerBase>;
  terrainChanges: Set<string>;
}

export interface SessionUpdateCallbacks {
  tryRespawnTank(player: SessionPlayer): void;
  emitSound(soundId: number, x: number, y: number): void;
  scheduleTankRespawn(tankId: number): void;
  placeMineForTeam(team: number, tileX: number, tileY: number): boolean;
  clearMineVisibilityAt(tileX: number, tileY: number): void;
  areTeamsAllied(teamA: number, teamB: number): boolean;
  spawnShell(tank: ServerTank): void;
  spawnShellFromPillbox(
    pillboxId: number,
    x: number,
    y: number,
    direction: number
  ): void;
  onMatchEnded(): void;
  onBaseCaptured?(event: {
    baseId: number;
    previousOwnerTeam: number;
    newOwnerTeam: number;
    capturingTankId: number;
  }): void;
  onPillboxPickedUp?(event: {
    pillboxId: number;
    previousOwnerTeam: number;
    newOwnerTeam: number;
    byTankId: number;
  }): void;
  onBuilderActionRejected?(event: {tankId: number; text: string}): void;
}

/**
 * Runs one authoritative simulation tick for a session.
 *
 * WHY THIS PIPELINE EXISTS:
 * - Preserves the exact tick order in one place.
 * - Keeps `GameSession` focused on networking/lifecycle orchestration.
 * - Makes multi-system determinism easier to test and maintain.
 */
export class SessionUpdatePipeline {
  private readonly playerSimulation = new PlayerSimulationSystem();
  private readonly builderSystem = new BuilderSystem();
  private readonly combatSystem = new CombatSystem();
  private readonly structureSimulation = new StructureSimulationSystem();
  private readonly terrainEffects = new TerrainEffectsSystem();
  private readonly matchState = new MatchStateSystem();

  /**
   * Expose match-state operations so `GameSession` API remains unchanged.
   */
  getMatchState(): MatchStateSystem {
    return this.matchState;
  }

  /**
   * Seed forest-regrowth tracking for integration tests that simulate out-of-band
   * terrain damage without going through full combat/player pipelines.
   */
  trackForestRegrowth(tileKey: string): void {
    this.terrainEffects.trackForestRegrowth(tileKey);
  }

  runTick(context: SessionUpdateContext, callbacks: SessionUpdateCallbacks): void {
    this.playerSimulation.updatePlayers(
      context.tick,
      {
        world: context.world,
        players: context.players.values(),
        pillboxes: context.pillboxes.values(),
      },
      {
        tryRespawn: player => callbacks.tryRespawnTank(player),
        emitSound: (soundId, x, y) => callbacks.emitSound(soundId, x, y),
        onTerrainChanged: (tileX, tileY) => context.terrainChanges.add(`${tileX},${tileY}`),
        onForestDestroyed: (tileX, tileY) =>
          this.terrainEffects.trackForestRegrowth(`${tileX},${tileY}`),
        scheduleTankRespawn: tankId => callbacks.scheduleTankRespawn(tankId),
        onMineExploded: (tileX, tileY) =>
          callbacks.clearMineVisibilityAt(tileX, tileY),
        spawnShell: tank => callbacks.spawnShell(tank),
        updateBuilder: (tank, tick) =>
          this.builderSystem.update(
            tank,
            tick,
            {
              world: context.world,
              pillboxes: context.pillboxes.values(),
            },
            {
              emitSound: (soundId, x, y) => callbacks.emitSound(soundId, x, y),
              onTerrainChanged: (tileX, tileY) =>
                context.terrainChanges.add(`${tileX},${tileY}`),
              onTrackForestRegrowth: (tileX, tileY) =>
                this.terrainEffects.trackForestRegrowth(`${tileX},${tileY}`),
              onPlaceMine: (team, tileX, tileY) =>
                callbacks.placeMineForTeam(team, tileX, tileY),
              onCreatePillbox: pillbox => context.pillboxes.set(pillbox.id, pillbox),
              onActionRejected: event =>
                callbacks.onBuilderActionRejected?.(event),
            }
          ),
        onPillboxPickedUp: event => callbacks.onPillboxPickedUp?.(event),
      }
    );

    this.combatSystem.updateShells(
      context.shells,
      {
        world: context.world,
        players: context.players.values(),
        getPlayerByTankId: tankId => context.players.get(tankId),
        pillboxes: context.pillboxes.values(),
        bases: context.bases.values(),
      },
      {
        areTeamsAllied: (teamA, teamB) => callbacks.areTeamsAllied(teamA, teamB),
        emitSound: (soundId, x, y) => callbacks.emitSound(soundId, x, y),
        scheduleTankRespawn: tankId => callbacks.scheduleTankRespawn(tankId),
        onTerrainChanged: (tileX, tileY) => context.terrainChanges.add(`${tileX},${tileY}`),
        onForestDestroyed: (tileX, tileY) =>
          this.terrainEffects.trackForestRegrowth(`${tileX},${tileY}`),
      }
    );

    this.structureSimulation.updateStructures(
      {
        world: context.world,
        players: context.players.values(),
        pillboxes: context.pillboxes.values(),
        bases: context.bases.values(),
      },
      {
        areTeamsAllied: (teamA, teamB) => callbacks.areTeamsAllied(teamA, teamB),
        spawnShellFromPillbox: (pillboxId, x, y, direction) =>
          callbacks.spawnShellFromPillbox(pillboxId, x, y, direction),
        onBaseCaptured: event => callbacks.onBaseCaptured?.(event),
      }
    );

    if (!this.matchState.isMatchEnded()) {
      const didEnd = this.matchState.evaluateWinCondition(context.bases.values());
      if (didEnd) {
        callbacks.onMatchEnded();
      }
    }

    const terrainEffects = this.terrainEffects.update(context.tick, context.world);
    for (const tileKey of terrainEffects.terrainChanges) {
      context.terrainChanges.add(tileKey);
    }
    for (const pos of terrainEffects.bubbleSoundPositions) {
      callbacks.emitSound(SOUND_BUBBLES, pos.x, pos.y);
    }
  }
}
