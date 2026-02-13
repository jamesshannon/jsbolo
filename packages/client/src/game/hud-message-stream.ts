import type {HudMessage, HudMessageClass} from '@shared';

export type HudMessageChannel = 'newswire' | 'assistant' | 'ai_brain';

export interface HudMessageVisibility {
  showNewswireMessages: boolean;
  showAssistantMessages: boolean;
  showAiBrainMessages: boolean;
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
  showNewswireMessages: true,
  showAssistantMessages: true,
  showAiBrainMessages: true,
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

export function classifyHudMessageChannel(message: HudMessage): HudMessageChannel {
  // AI channel detection is string-based until protocol-level channel metadata lands.
  if (
    /\[(ai|bot)\]/i.test(message.text) ||
    /^bot\b/i.test(message.text) ||
    /\bai brain\b/i.test(message.text)
  ) {
    return 'ai_brain';
  }

  if (message.class === 'personal_notification' || message.class === 'system_status') {
    return 'assistant';
  }

  return 'newswire';
}

function isChannelVisible(
  channel: HudMessageChannel,
  visibility: HudMessageVisibility
): boolean {
  switch (channel) {
    case 'assistant':
      return visibility.showAssistantMessages;
    case 'ai_brain':
      return visibility.showAiBrainMessages;
    case 'newswire':
    default:
      return visibility.showNewswireMessages;
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
    .filter(message => isChannelVisible(classifyHudMessageChannel(message), visibility))
    .map(message => message.text.trim())
    .filter(text => text.length > 0);
}
