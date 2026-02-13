import {describe, expect, it, vi} from 'vitest';
import {GameServer} from '../game-server.js';
import {GameSession} from '../game-session.js';
import {
  applyStartupBots,
  parseBotPolicyFromEnv,
  resolveStartupBotProfiles,
} from '../bot-startup.js';

function createMockWss() {
  return {
    on: vi.fn(),
    close: vi.fn(),
  };
}

describe('bot startup config helpers', () => {
  it('parses bot policy overrides from env', () => {
    const parsed = parseBotPolicyFromEnv({
      ALLOW_BOTS: 'false',
      MAX_BOTS: '7',
      BOT_ALLIANCE_MODE: 'none',
    });

    expect(parsed).toEqual({
      allowBots: false,
      maxBots: 7,
      botAllianceMode: 'none',
    });
  });

  it('ignores invalid policy env values', () => {
    const parsed = parseBotPolicyFromEnv({
      MAX_BOTS: '-1',
      BOT_ALLIANCE_MODE: 'invalid',
    });

    expect(parsed).toEqual({});
  });

  it('resolves startup bots from BOT_COUNT and default tactical profile', () => {
    const profiles = resolveStartupBotProfiles(
      ['idle', 'patrol', 'tactical'],
      {BOT_COUNT: '3'}
    );

    expect(profiles).toEqual(['tactical', 'tactical', 'tactical']);
  });

  it('falls back to tactical when BOT_PROFILE is unknown', () => {
    const profiles = resolveStartupBotProfiles(
      ['idle', 'patrol', 'tactical'],
      {BOT_COUNT: '2', BOT_PROFILE: 'unknown'}
    );

    expect(profiles).toEqual(['tactical', 'tactical']);
  });

  it('returns no startup bots when BOT_COUNT is unset or invalid', () => {
    expect(resolveStartupBotProfiles(['idle', 'patrol'], {})).toEqual([]);
    expect(resolveStartupBotProfiles(['idle', 'patrol'], {BOT_COUNT: '0'})).toEqual([]);
    expect(resolveStartupBotProfiles(['idle', 'patrol'], {BOT_COUNT: 'x'})).toEqual([]);
  });

  it('smoke: applies startup bots without starting simulation by default', () => {
    const session = new GameSession();
    const startSpy = vi.spyOn(session, 'start');
    const server = new GameServer(0, {
      session,
      createWebSocketServer: () => createMockWss() as any,
      allowBotOnlySimulation: false,
    });

    const result = applyStartupBots(server, {BOT_COUNT: '2', BOT_PROFILE: 'tactical'}, () => {}, () => {});

    expect(result).toEqual({requested: 2, added: 2});
    expect(server.listBots()).toHaveLength(2);
    expect(server.listBots().every(bot => bot.profile === 'tactical')).toBe(true);
    expect(startSpy).toHaveBeenCalledTimes(0);
  });

  it('smoke: starts bot-only simulation when enabled', () => {
    const session = new GameSession();
    const startSpy = vi.spyOn(session, 'start');
    const server = new GameServer(0, {
      session,
      createWebSocketServer: () => createMockWss() as any,
      allowBotOnlySimulation: true,
    });

    const result = applyStartupBots(server, {BOT_COUNT: '3'}, () => {}, () => {});

    expect(result).toEqual({requested: 3, added: 3});
    expect(startSpy).toHaveBeenCalledTimes(1);
  });
});
