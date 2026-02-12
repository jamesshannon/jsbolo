import {describe, expect, it} from 'vitest';
import {parseBotPolicyFromEnv, resolveStartupBotProfiles} from '../bot-startup.js';

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
});
