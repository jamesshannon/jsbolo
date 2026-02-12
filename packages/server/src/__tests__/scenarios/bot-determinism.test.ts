import {describe, expect, it} from 'vitest';
import {TerrainType} from '@jsbolo/shared';
import {GameSession} from '../../game-session.js';
import {createMockWebSocket, getPlayer, getWorld, placeTankAtTile, tickSession} from '../bolo-spec/helpers.js';

function runPatrolBotScenario(): string[] {
  const session = new GameSession(undefined, {
    botPolicy: {
      allowBots: true,
      maxBots: 4,
    },
  });

  const humanId = session.addPlayer(createMockWebSocket());
  const botId = session.addBot('patrol');
  if (botId === null) {
    throw new Error('Expected patrol bot to be added for determinism scenario');
  }

  const world = getWorld(session);
  for (let y = 40; y < 100; y++) {
    for (let x = 40; x < 100; x++) {
      world.setTerrainAt(x, y, TerrainType.GRASS);
    }
  }

  const human = getPlayer(session, humanId);
  const bot = getPlayer(session, botId);

  placeTankAtTile(human.tank, 70, 70);
  placeTankAtTile(bot.tank, 55, 70);
  bot.tank.direction = 0;
  human.tank.direction = 0;

  const signature: string[] = [];
  for (let tick = 1; tick <= 220; tick++) {
    tickSession(session, 1);
    signature.push([
      tick,
      Math.round(bot.tank.x),
      Math.round(bot.tank.y),
      bot.tank.direction,
      bot.tank.speed,
      bot.tank.reload,
      bot.tank.shells,
    ].join('|'));
  }

  return signature;
}

describe('Bot determinism scenarios', () => {
  it('produces identical patrol-bot tick history across repeated runs', () => {
    const runA = runPatrolBotScenario();
    const runB = runPatrolBotScenario();
    expect(runA).toEqual(runB);
  });
});
