import type {HudMessage, HudMessageClass} from '@shared';

export interface HudMessageVisibility {
  showGlobalNotifications: boolean;
  showAllianceNotifications: boolean;
  showPersonalNotifications: boolean;
  showChatGlobal: boolean;
  showChatAlliance: boolean;
  showSystemStatus: boolean;
}

/**
 * v1 defaults follow the HUD message policy:
 * gameplay/chat visible, system-status hidden unless explicitly enabled.
 */
export const DEFAULT_HUD_MESSAGE_VISIBILITY: HudMessageVisibility = {
  showGlobalNotifications: true,
  showAllianceNotifications: true,
  showPersonalNotifications: true,
  showChatGlobal: true,
  showChatAlliance: true,
  showSystemStatus: false,
};

export function isHudMessageVisible(
  messageClass: HudMessageClass,
  visibility: HudMessageVisibility = DEFAULT_HUD_MESSAGE_VISIBILITY
): boolean {
  switch (messageClass) {
    case 'global_notification':
      return visibility.showGlobalNotifications;
    case 'alliance_notification':
      return visibility.showAllianceNotifications;
    case 'personal_notification':
      return visibility.showPersonalNotifications;
    case 'chat_global':
      return visibility.showChatGlobal;
    case 'chat_alliance':
      return visibility.showChatAlliance;
    case 'system_status':
      return visibility.showSystemStatus;
    default:
      return false;
  }
}

export function deriveTickerMessagesFromServerHud(
  hudMessages: HudMessage[] | undefined,
  visibility: HudMessageVisibility = DEFAULT_HUD_MESSAGE_VISIBILITY
): string[] {
  if (!hudMessages || hudMessages.length === 0) {
    return [];
  }

  return hudMessages
    .filter(message => isHudMessageVisible(message.class, visibility))
    .map(message => message.text.trim())
    .filter(text => text.length > 0);
}
