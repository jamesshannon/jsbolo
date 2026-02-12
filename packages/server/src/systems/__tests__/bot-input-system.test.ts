import {RangeAdjustment, type BuildAction} from '@jsbolo/shared';
import {describe, expect, it, vi} from 'vitest';
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
    const players = new Map<number, SessionPlayer>([
      [1, botPlayer],
      [2, enemyPlayer],
    ]);

    system.enableBotForPlayer(botPlayer, 'patrol');
    system.injectBotInputs({
      tick: 42,
      players,
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
    const players = new Map<number, SessionPlayer>([
      [1, botPlayer],
      [2, allyPlayer],
      [3, enemyPlayer],
    ]);

    system.enableBotForPlayer(botPlayer, 'idle');
    system.injectBotInputs({
      tick: 7,
      players,
      areTeamsAllied: (a, b) => (a === 0 && b === 1) || (a === 1 && b === 0),
    });

    const observation = tickBot.mock.calls[0]?.[1];
    expect(observation?.enemies).toHaveLength(1);
    expect(observation?.enemies[0]?.id).toBe(3);
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
      areTeamsAllied: () => false,
    });

    expect(botPlayer.pendingBuildOrder).toEqual({
      action: 2,
      targetX: 10,
      targetY: 20,
    });
    expect(botPlayer.lastInput.tick).toBe(12);
  });
});
