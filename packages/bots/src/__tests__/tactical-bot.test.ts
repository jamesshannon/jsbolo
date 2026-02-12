import {RangeAdjustment} from '@jsbolo/shared';
import {describe, expect, it} from 'vitest';
import {TacticalBot} from '../controllers/tactical-bot.js';
import type {BotObservation} from '../types.js';

function createObservation(overrides?: Partial<BotObservation>): BotObservation {
  return {
    tick: 1,
    self: {
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
    },
    enemies: [],
    visibleBases: [],
    visiblePillboxes: [],
    visibleShells: [],
    ...overrides,
  };
}

describe('TacticalBot', () => {
  it('evades when a shell is very close', () => {
    const bot = new TacticalBot();
    const command = bot.think(createObservation({
      tick: 2,
      visibleShells: [{
        id: 1,
        x: 1000 + 128,
        y: 1000 + 64,
        direction: 0,
        ownerTeam: 1,
      }],
    }));

    expect(command.accelerating).toBe(true);
    expect(command.shooting).toBe(false);
    expect(command.turningClockwise || command.turningCounterClockwise).toBe(true);
  });

  it('does not treat friendly shells as immediate threats', () => {
    const bot = new TacticalBot();
    const command = bot.think(createObservation({
      visibleShells: [{
        id: 1,
        x: 1000 + 128,
        y: 1000 + 64,
        direction: 0,
        ownerTeam: 0,
      }],
      enemies: [{
        id: 2,
        team: 1,
        x: 1000 + (4 * 256),
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
    }));

    expect(command.shooting).toBe(true);
  });

  it('retreats to nearest allied or neutral base when low on resources', () => {
    const bot = new TacticalBot();
    const command = bot.think(createObservation({
      self: {
        ...createObservation().self,
        armor: 10,
        shells: 3,
      },
      visibleBases: [
        {id: 1, x: 1300, y: 1000, ownerTeam: 0, armor: 80, shells: 30, mines: 10},
        {id: 2, x: 1700, y: 1000, ownerTeam: 1, armor: 80, shells: 30, mines: 10},
      ],
    }));

    expect(command.accelerating).toBe(true);
    expect(command.shooting).toBe(false);
    expect(command.rangeAdjustment).toBe(RangeAdjustment.NONE);
  });

  it('engages a nearby enemy when aligned and weapon ready', () => {
    const bot = new TacticalBot();
    const command = bot.think(createObservation({
      enemies: [{
        id: 2,
        team: 1,
        x: 1000 + (4 * 256),
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
    }));

    expect(command.accelerating).toBe(true);
    expect(command.shooting).toBe(true);
  });

  it('moves toward capturable objectives when no enemies are visible', () => {
    const bot = new TacticalBot();
    const command = bot.think(createObservation({
      visibleBases: [{id: 1, x: 1300, y: 1000, ownerTeam: 255, armor: 90, shells: 40, mines: 40}],
    }));

    expect(command.accelerating).toBe(true);
    expect(command.shooting).toBe(false);
  });
});
