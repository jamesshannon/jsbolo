import {describe, expect, it} from 'vitest';
import {TerrainType} from '@jsbolo/shared';
import {GameSession} from '../../game-session.js';
import {
  createDefaultInput,
  createMockWebSocket,
  fillArea,
  getPlayer,
  getWorld,
  placeTankAtTile,
  tickSession,
} from '../bolo-spec/helpers.js';

interface BotSnapshot {
  id: number;
  x: number;
  y: number;
  direction: number;
  speed: number;
  shells: number;
  armor: number;
}

function setupV1BotScenario(): {
  session: GameSession;
  humanId: number;
  botIds: [number, number, number];
} {
  const session = new GameSession(undefined, {
    botPolicy: {
      allowBots: true,
      maxBots: 8,
      botAllianceMode: 'all-bots',
    },
  });

  const humanId = session.addPlayer(createMockWebSocket());
  const botA = session.addBot('tactical');
  const botB = session.addBot('tactical');
  const botC = session.addBot('tactical');
  if (botA === null || botB === null || botC === null) {
    throw new Error('Expected tactical bots to be added in v1 scenario setup');
  }

  const world = getWorld(session);
  fillArea(world, 40, 50, 80, 60, TerrainType.GRASS);

  const human = getPlayer(session, humanId);
  placeTankAtTile(human.tank, 70, 70);
  human.tank.direction = 0;
  human.lastInput = createDefaultInput();

  const botPlayerA = getPlayer(session, botA);
  const botPlayerB = getPlayer(session, botB);
  const botPlayerC = getPlayer(session, botC);

  placeTankAtTile(botPlayerA.tank, 55, 70);
  placeTankAtTile(botPlayerB.tank, 55, 66);
  placeTankAtTile(botPlayerC.tank, 55, 74);
  botPlayerA.tank.direction = 0;
  botPlayerB.tank.direction = 0;
  botPlayerC.tank.direction = 0;

  return {
    session,
    humanId,
    botIds: [botA, botB, botC],
  };
}

function collectBotSnapshots(session: GameSession, botIds: readonly number[]): BotSnapshot[] {
  return botIds.map(botId => {
    const bot = getPlayer(session, botId);
    return {
      id: botId,
      x: Math.round(bot.tank.x),
      y: Math.round(bot.tank.y),
      direction: bot.tank.direction,
      speed: bot.tank.speed,
      shells: bot.tank.shells,
      armor: bot.tank.armor,
    };
  });
}

function runDeterministicHistory(): string[] {
  const {session, humanId, botIds} = setupV1BotScenario();
  const history: string[] = [];

  for (let tick = 1; tick <= 260; tick++) {
    tickSession(session, 1);
    if (tick % 5 === 0) {
      const human = getPlayer(session, humanId);
      const bots = collectBotSnapshots(session, botIds);
      history.push([
        tick,
        human.tank.armor,
        ...bots.map(bot =>
          `${bot.id}:${bot.x}:${bot.y}:${bot.direction}:${bot.speed}:${bot.shells}:${bot.armor}`
        ),
      ].join('|'));
    }
  }

  return history;
}

describe('Bot v1 scenario coverage', () => {
  it('spawns tactical bots as one alliance team in all-bots mode', () => {
    const {session, botIds} = setupV1BotScenario();
    const [botA, botB, botC] = botIds.map(id => getPlayer(session, id));
    const team = botA.tank.team;

    expect(botB.tank.team).toBe(team);
    expect(botC.tank.team).toBe(team);
    expect(session.areTeamsAllied(botA.tank.team, botB.tank.team)).toBe(true);
    expect(session.areTeamsAllied(botA.tank.team, botC.tank.team)).toBe(true);
  });

  it('keeps tactical multi-bot outcomes deterministic across repeated runs', () => {
    const runA = runDeterministicHistory();
    const runB = runDeterministicHistory();
    expect(runA).toEqual(runB);
  });

  it('has tactical bots actively engage in a live combat lane', () => {
    const {session, botIds} = setupV1BotScenario();
    const initial = collectBotSnapshots(session, botIds);

    tickSession(session, 260);

    const final = collectBotSnapshots(session, botIds);

    const anyMoved = final.some((bot, index) => {
      const start = initial[index]!;
      const dx = bot.x - start.x;
      const dy = bot.y - start.y;
      return (dx * dx) + (dy * dy) > (64 * 64);
    });
    const anyTurned = final.some((bot, index) => bot.direction !== initial[index]!.direction);

    expect(anyMoved || anyTurned).toBe(true);
  });
});
