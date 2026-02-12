import type {BotPolicyOptions} from './game-session.js';

/**
 * Parse startup bot policy from environment variables.
 *
 * Only explicitly provided values override session defaults.
 */
export function parseBotPolicyFromEnv(
  env: NodeJS.ProcessEnv = process.env
): Partial<BotPolicyOptions> {
  const parsed: Partial<BotPolicyOptions> = {};

  if (env['ALLOW_BOTS'] !== undefined) {
    parsed.allowBots = env['ALLOW_BOTS'] !== 'false';
  }

  if (env['MAX_BOTS'] !== undefined) {
    const maxBots = Number.parseInt(env['MAX_BOTS'], 10);
    if (Number.isInteger(maxBots) && maxBots >= 0) {
      parsed.maxBots = maxBots;
    }
  }

  if (env['BOT_ALLIANCE_MODE'] === 'all-bots') {
    parsed.botAllianceMode = 'all-bots';
  } else if (env['BOT_ALLIANCE_MODE'] === 'none') {
    parsed.botAllianceMode = 'none';
  }

  return parsed;
}

/**
 * Build a list of startup bot profiles to spawn at server boot.
 *
 * Supported env:
 * - BOT_COUNT: integer >= 0
 * - BOT_PROFILE: one profile name used for all startup bots (default: patrol)
 */
export function resolveStartupBotProfiles(
  availableProfiles: readonly string[],
  env: NodeJS.ProcessEnv = process.env
): string[] {
  const botCountRaw = env['BOT_COUNT'];
  if (botCountRaw === undefined) {
    return [];
  }

  const botCount = Number.parseInt(botCountRaw, 10);
  if (!Number.isInteger(botCount) || botCount <= 0) {
    return [];
  }

  const requestedProfile = env['BOT_PROFILE'] ?? 'patrol';
  const profile = availableProfiles.includes(requestedProfile)
    ? requestedProfile
    : availableProfiles[0];
  if (!profile) {
    return [];
  }

  return Array.from({length: botCount}, () => profile);
}
