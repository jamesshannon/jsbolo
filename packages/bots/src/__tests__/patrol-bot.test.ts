import {describe, expect, it} from 'vitest';
import {PatrolBot} from '../controllers/patrol-bot.js';
import type {BotObservation} from '../types.js';

interface ObservationOverrides {
  self?: Partial<BotObservation['self']>;
  enemies?: BotObservation['enemies'];
}

function createObservation(
  tick: number,
  overrides?: ObservationOverrides
): BotObservation {
  const self = {
    id: 1,
    team: 0,
    x: 1000,
    y: 1000,
    direction: 0,
    speed: 0,
    armor: 40,
    shells: 40,
    mines: 0,
    trees: 0,
    onBoat: false,
    reload: 0,
    firingRange: 7,
    ...(overrides?.self ?? {}),
  };

  return {
    tick,
    self,
    enemies: overrides?.enemies ?? [],
  };
}

describe('PatrolBot', () => {
  it('fires only when target is in range and in front', () => {
    const bot = new PatrolBot();

    // Direction 0 maps to "east" in current world-angle conventions.
    const inFront = bot.think(
      createObservation(1, {
        enemies: [{
          id: 2,
          team: 1,
          x: 1300,
          y: 1000,
          direction: 0,
          speed: 0,
          armor: 40,
          shells: 40,
          mines: 0,
          trees: 0,
          onBoat: false,
          reload: 0,
          firingRange: 7,
        }],
      })
    );

    const behind = bot.think(
      createObservation(2, {
        enemies: [{
          id: 2,
          team: 1,
          x: 700,
          y: 1000,
          direction: 0,
          speed: 0,
          armor: 40,
          shells: 40,
          mines: 0,
          trees: 0,
          onBoat: false,
          reload: 0,
          firingRange: 7,
        }],
      })
    );

    expect(inFront.shooting).toBe(true);
    expect(behind.shooting).toBe(false);
  });

  it('enters deterministic recovery mode when movement stalls', () => {
    const bot = new PatrolBot();
    let command = bot.think(createObservation(1));

    for (let tick = 2; tick <= 35; tick++) {
      command = bot.think(createObservation(tick));
    }

    expect(command.braking).toBe(true);
    expect(command.accelerating).toBe(false);
    expect(command.turningClockwise || command.turningCounterClockwise).toBe(true);
  });

  it('is deterministic for identical observation streams', () => {
    const botA = new PatrolBot();
    const botB = new PatrolBot();
    const signatureA: string[] = [];
    const signatureB: string[] = [];

    for (let tick = 1; tick <= 120; tick++) {
      const observation = createObservation(tick, {
        self: {
          x: 1000 + (tick * 2),
          y: 1000,
          direction: tick % 256,
        },
        enemies: [{
          id: 2,
          team: 1,
          x: 1400,
          y: 1000,
          direction: 0,
          speed: 0,
          armor: 40,
          shells: 40,
          mines: 0,
          trees: 0,
          onBoat: false,
          reload: 0,
          firingRange: 7,
        }],
      });
      const commandA = botA.think(observation);
      const commandB = botB.think(observation);

      signatureA.push(JSON.stringify(commandA));
      signatureB.push(JSON.stringify(commandB));
    }

    expect(signatureA).toEqual(signatureB);
  });
});
