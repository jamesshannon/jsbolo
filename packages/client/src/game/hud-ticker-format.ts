import type {Tank} from '@shared';

interface HudTickerFormatContext {
  myPlayerId: number | null;
  myTeam: number | null;
  tanks: ReadonlyMap<number, Tank>;
}

function escapeHtml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/**
 * Render ticker text with sender emphasis and team-relation color hints.
 * Non-chat/system messages remain plain escaped text.
 */
export function formatHudTickerHtml(
  text: string,
  context: HudTickerFormatContext
): string {
  const trimmed = text.trim();
  if (!trimmed) {
    return '';
  }

  const chatMatch = trimmed.match(/^Player\s+(\d+)(\s\((?:nearby|whisper)\))?:\s+(.+)$/);
  if (!chatMatch) {
    return escapeHtml(trimmed);
  }

  const senderPlayerId = Number(chatMatch[1]);
  const qualifier = chatMatch[2] ?? '';
  const body = chatMatch[3] ?? '';
  const senderLabel = `Player ${senderPlayerId}${qualifier}`;
  const relationClass = getSenderRelationClass(senderPlayerId, context);

  return `<span class="hud-sender ${relationClass}">${escapeHtml(senderLabel)}</span>: ${escapeHtml(body)}`;
}

function getSenderRelationClass(
  senderPlayerId: number,
  context: HudTickerFormatContext
): string {
  if (context.myPlayerId !== null && senderPlayerId === context.myPlayerId) {
    return 'hud-sender-self';
  }

  const senderTank = context.tanks.get(senderPlayerId);
  if (!senderTank || context.myTeam === null) {
    return 'hud-sender-neutral';
  }

  if (senderTank.team === context.myTeam) {
    return 'hud-sender-friendly';
  }
  return 'hud-sender-hostile';
}

