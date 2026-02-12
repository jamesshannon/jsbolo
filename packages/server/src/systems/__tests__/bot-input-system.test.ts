import {RangeAdjustment, type BuildAction} from '@jsbolo/shared';
import {describe, expect, it, vi} from 'vitest';
import {ServerBase} from '../../simulation/base.js';
import {ServerPillbox} from '../../simulation/pillbox.js';
import {ServerShell} from '../../simulation/shell.js';
import {ServerTank} from '../../simulation/tank.js';
import {BotInputSystem} from '../bot-input-system.js';
import type {BotRuntimeAdapter} from '../bot-runtime-adapter.js';
import type {SessionPlayer} from '../session-player-manager.js';

function createBaseInput() {
  return {
    sequence: 0,
    tick: 0,
    accelerating: false,
    braking: false,
    turningClockwise: false,
    turningCounterClockwise: false,
    shooting: false,
    rangeAdjustment: RangeAdjustment.NONE,
  };
}

function createPlayer(id: number, team: number): SessionPlayer {
  return {
    id,
    ws: {
      send: vi.fn(),
      readyState: 1,
    } as any,
    tank: new ServerTank(id, team, 100 + (id * 10), 100 + (id * 10)),
    lastInput: createBaseInput(),
    controlType: 'human',
  };
}

describe('BotInputSystem', () => {
  it('enables bot control and injects commands each tick', () => {
    const registerBot = vi.fn();
    const tickBot = vi.fn().mockReturnValue({
      accelerating: true,
      braking: false,
      turningClockwise: true,
      turningCounterClockwise: false,
      shooting: false,
      rangeAdjustment: RangeAdjustment.NONE,
    });

    const runtime: BotRuntimeAdapter = {
      registerBot,
      getRegisteredProfile: () => 'patrol',
      tickBot,
      unregisterBot: vi.fn(),
      shutdown: vi.fn(),
    };

    const system = new BotInputSystem(runtime, () => {});
    const botPlayer = createPlayer(1, 0);
    const enemyPlayer = createPlayer(2, 1);
    enemyPlayer.tank.x = botPlayer.tank.x + 512;
    enemyPlayer.tank.y = botPlayer.tank.y + 512;
    const players = new Map<number, SessionPlayer>([
      [1, botPlayer],
      [2, enemyPlayer],
    ]);

    system.enableBotForPlayer(botPlayer, 'patrol');
    system.injectBotInputs({
      tick: 42,
      players,
      shells: new Map(),
      pillboxes: new Map(),
      bases: new Map(),
      areTeamsAllied: () => false,
    });

    expect(registerBot).toHaveBeenCalledWith('player-1', 'patrol', {
      runtimeId: 'player-1',
      team: 0,
    });
    expect(botPlayer.controlType).toBe('bot');
    expect(botPlayer.lastInput.tick).toBe(42);
    expect(botPlayer.lastInput.sequence).toBe(1);
    expect(botPlayer.lastInput.accelerating).toBe(true);

    expect(tickBot).toHaveBeenCalledTimes(1);
    const observation = tickBot.mock.calls[0]?.[1];
    expect(observation?.self.id).toBe(1);
    expect(observation?.enemies).toHaveLength(1);
    expect(observation?.enemies[0]?.id).toBe(2);
    expect(observation?.visibleBases).toEqual([]);
    expect(observation?.visiblePillboxes).toEqual([]);
    expect(observation?.visibleShells).toEqual([]);
  });

  it('filters allied tanks from enemy observations', () => {
    const tickBot = vi.fn().mockReturnValue({
      accelerating: false,
      braking: false,
      turningClockwise: false,
      turningCounterClockwise: false,
      shooting: false,
      rangeAdjustment: RangeAdjustment.NONE,
    });

    const runtime: BotRuntimeAdapter = {
      registerBot: vi.fn(),
      getRegisteredProfile: () => 'idle',
      tickBot,
      unregisterBot: vi.fn(),
      shutdown: vi.fn(),
    };

    const system = new BotInputSystem(runtime, () => {});
    const botPlayer = createPlayer(1, 0);
    const allyPlayer = createPlayer(2, 1);
    const enemyPlayer = createPlayer(3, 2);
    allyPlayer.tank.x = botPlayer.tank.x + 512;
    allyPlayer.tank.y = botPlayer.tank.y;
    enemyPlayer.tank.x = botPlayer.tank.x;
    enemyPlayer.tank.y = botPlayer.tank.y + 512;
    const players = new Map<number, SessionPlayer>([
      [1, botPlayer],
      [2, allyPlayer],
      [3, enemyPlayer],
    ]);

    system.enableBotForPlayer(botPlayer, 'idle');
    system.injectBotInputs({
      tick: 7,
      players,
      shells: new Map(),
      pillboxes: new Map(),
      bases: new Map(),
      areTeamsAllied: (a, b) => (a === 0 && b === 1) || (a === 1 && b === 0),
    });

    const observation = tickBot.mock.calls[0]?.[1];
    expect(observation?.enemies).toHaveLength(1);
    expect(observation?.enemies[0]?.id).toBe(3);
  });

  it('filters enemies outside the bot map-view window', () => {
    const tickBot = vi.fn().mockReturnValue({
      accelerating: false,
      braking: false,
      turningClockwise: false,
      turningCounterClockwise: false,
      shooting: false,
      rangeAdjustment: RangeAdjustment.NONE,
    });

    const runtime: BotRuntimeAdapter = {
      registerBot: vi.fn(),
      getRegisteredProfile: () => 'idle',
      tickBot,
      unregisterBot: vi.fn(),
      shutdown: vi.fn(),
    };

    const system = new BotInputSystem(runtime, () => {});
    const botPlayer = createPlayer(1, 0);
    const nearbyEnemy = createPlayer(2, 1);
    const farEnemy = createPlayer(3, 2);

    botPlayer.tank.x = 1000;
    botPlayer.tank.y = 1000;
    nearbyEnemy.tank.x = 1000 + (8 * 256);
    nearbyEnemy.tank.y = 1000 + (3 * 256);
    farEnemy.tank.x = 1000 + (15 * 256);
    farEnemy.tank.y = 1000;

    system.enableBotForPlayer(botPlayer, 'idle');
    system.injectBotInputs({
      tick: 9,
      players: new Map([
        [1, botPlayer],
        [2, nearbyEnemy],
        [3, farEnemy],
      ]),
      shells: new Map(),
      pillboxes: new Map(),
      bases: new Map(),
      areTeamsAllied: () => false,
    });

    const observation = tickBot.mock.calls[0]?.[1];
    expect(observation?.enemies).toHaveLength(1);
    expect(observation?.enemies[0]?.id).toBe(2);
  });

  it('queues build orders when bot emits one-shot build commands', () => {
    const tickBot = vi.fn().mockReturnValue({
      accelerating: false,
      braking: false,
      turningClockwise: false,
      turningCounterClockwise: false,
      shooting: false,
      rangeAdjustment: RangeAdjustment.NONE,
      buildOrder: {
        action: 2 as BuildAction,
        targetX: 10,
        targetY: 20,
      },
    });

    const runtime: BotRuntimeAdapter = {
      registerBot: vi.fn(),
      getRegisteredProfile: () => 'idle',
      tickBot,
      unregisterBot: vi.fn(),
      shutdown: vi.fn(),
    };

    const system = new BotInputSystem(runtime, () => {});
    const botPlayer = createPlayer(1, 0);

    system.enableBotForPlayer(botPlayer, 'idle');
    system.injectBotInputs({
      tick: 12,
      players: new Map([[1, botPlayer]]),
      shells: new Map(),
      pillboxes: new Map(),
      bases: new Map(),
      areTeamsAllied: () => false,
    });

    expect(botPlayer.pendingBuildOrder).toEqual({
      action: 2,
      targetX: 10,
      targetY: 20,
    });
    expect(botPlayer.lastInput.tick).toBe(12);
  });

  it('includes nearby bases, pillboxes, and shells in observation', () => {
    const tickBot = vi.fn().mockReturnValue({
      accelerating: false,
      braking: false,
      turningClockwise: false,
      turningCounterClockwise: false,
      shooting: false,
      rangeAdjustment: RangeAdjustment.NONE,
    });

    const runtime: BotRuntimeAdapter = {
      registerBot: vi.fn(),
      getRegisteredProfile: () => 'idle',
      tickBot,
      unregisterBot: vi.fn(),
      shutdown: vi.fn(),
    };

    const system = new BotInputSystem(runtime, () => {});
    const botPlayer = createPlayer(1, 0);
    botPlayer.tank.x = 1000;
    botPlayer.tank.y = 1000;
    system.enableBotForPlayer(botPlayer, 'idle');

    const nearBase = new ServerBase(4, 4, 255);
    nearBase.id = 100;
    const farBase = new ServerBase(90, 90, 1);
    farBase.id = 101;

    const nearPillbox = new ServerPillbox(5, 5, 1);
    nearPillbox.id = 200;
    const farPillbox = new ServerPillbox(120, 120, 1);
    farPillbox.id = 201;

    const nearShell = new ServerShell(1, 1000 + 128, 1000 + 128, 0, 7);
    const farShell = new ServerShell(1, 1000 + (20 * 256), 1000, 0, 7);

    system.injectBotInputs({
      tick: 21,
      players: new Map([[1, botPlayer]]),
      shells: new Map([
        [nearShell.id, nearShell],
        [farShell.id, farShell],
      ]),
      pillboxes: new Map([
        [nearPillbox.id, nearPillbox],
        [farPillbox.id, farPillbox],
      ]),
      bases: new Map([
        [nearBase.id, nearBase],
        [farBase.id, farBase],
      ]),
      areTeamsAllied: () => false,
    });

    const observation = tickBot.mock.calls[0]?.[1];
    expect(observation?.visibleBases).toHaveLength(1);
    expect(observation?.visibleBases[0]?.id).toBe(100);
    expect(observation?.visiblePillboxes).toHaveLength(1);
    expect(observation?.visiblePillboxes[0]?.id).toBe(200);
    expect(observation?.visibleShells).toHaveLength(1);
    expect(observation?.visibleShells[0]?.id).toBe(nearShell.id);
  });
});
