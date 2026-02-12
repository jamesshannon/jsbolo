import {describe, expect, it, vi} from 'vitest';
import {GameSession} from '../game-session.js';

describe('GameSession bot lifecycle', () => {
  it('adds a bot player when policy allows it', () => {
    const session = new GameSession(undefined, {
      botPolicy: {
        allowBots: true,
        maxBots: 2,
      },
    });

    const botPlayerId = session.addBot('idle');

    expect(botPlayerId).not.toBeNull();
    expect(session.getBotCount()).toBe(1);
    expect(session.getPlayerCount()).toBe(1);

    const players = (session as any).players;
    const botPlayer = players.get(botPlayerId!);
    expect(botPlayer.controlType).toBe('bot');
    expect(botPlayer.botProfile).toBe('idle');
  });

  it('rejects adding bots when allowBots is disabled', () => {
    const session = new GameSession(undefined, {
      botPolicy: {
        allowBots: false,
        maxBots: 2,
      },
    });

    expect(session.addBot('idle')).toBeNull();
    expect(session.getBotCount()).toBe(0);
    expect(session.getPlayerCount()).toBe(0);
  });

  it('enforces maxBots limit', () => {
    const session = new GameSession(undefined, {
      botPolicy: {
        allowBots: true,
        maxBots: 1,
      },
    });

    const firstBot = session.addBot('idle');
    const secondBot = session.addBot('patrol');

    expect(firstBot).not.toBeNull();
    expect(secondBot).toBeNull();
    expect(session.getBotCount()).toBe(1);
    expect(session.getPlayerCount()).toBe(1);
  });

  it('disables bot runtime before removing a bot player', () => {
    const session = new GameSession(undefined, {
      botPolicy: {
        allowBots: true,
        maxBots: 2,
      },
    });

    const botPlayerId = session.addBot('idle');
    expect(botPlayerId).not.toBeNull();

    const disableSpy = vi.spyOn((session as any).botInputSystem, 'disableBotForPlayer');

    session.removePlayer(botPlayerId!);

    expect(disableSpy).toHaveBeenCalledTimes(1);
    expect(session.getBotCount()).toBe(0);
  });
});
