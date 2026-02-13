import type {BotPolicyOptions} from './game-session.js';

interface StartupBotHost {
  listAvailableBotProfiles(): string[];
  addBot(profile: string): {ok: true; playerId: number} | {ok: false; reason: string};
  listBots(): Array<{playerId: number; profile: string; team: number}>;
}

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
 * - BOT_PROFILE: one profile name used for all startup bots (default: tactical)
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

  const requestedProfile = env['BOT_PROFILE'] ?? 'tactical';
  const profile = availableProfiles.includes(requestedProfile)
    ? requestedProfile
    : (availableProfiles.includes('tactical') ? 'tactical' : availableProfiles[0]);
  if (!profile) {
    return [];
  }

  return Array.from({length: botCount}, () => profile);
}

/**
 * Spawn startup bots from env configuration using the server bot admin surface.
 */
export function applyStartupBots(
  host: StartupBotHost,
  env: NodeJS.ProcessEnv = process.env,
  log: (message: string) => void = console.log,
  warn: (message: string) => void = console.warn
): {requested: number; added: number} {
  const startupProfiles = resolveStartupBotProfiles(host.listAvailableBotProfiles(), env);

  for (const profile of startupProfiles) {
    const result = host.addBot(profile);
    if (!result.ok) {
      warn(`[BOT STARTUP] Failed to add '${profile}' bot: ${result.reason}`);
      return {requested: startupProfiles.length, added: host.listBots().length};
    }
  }

  if (startupProfiles.length > 0) {
    log(`[BOT STARTUP] Added ${host.listBots().length} bot(s) at startup`);
  }

  return {requested: startupProfiles.length, added: host.listBots().length};
}
