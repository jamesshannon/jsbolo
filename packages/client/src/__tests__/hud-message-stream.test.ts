import type {HudMessage} from '@shared';
import {describe, expect, it} from 'vitest';
import {
  DEFAULT_HUD_MESSAGE_VISIBILITY,
  deriveTickerMessagesFromServerHud,
} from '../game/hud-message-stream.js';

function hudMessage(
  id: number,
  messageClass: HudMessage['class'],
  text: string
): HudMessage {
  return {
    id,
    tick: 100,
    class: messageClass,
    text,
  };
}

describe('hud-message-stream', () => {
  it('includes global/alliance/personal/chat by default and hides system status', () => {
    const messages = deriveTickerMessagesFromServerHud([
      hudMessage(1, 'global_notification', 'player joined'),
      hudMessage(2, 'alliance_notification', 'alliance accepted'),
      hudMessage(3, 'personal_notification', 'builder lost'),
      hudMessage(4, 'chat_global', 'hello world'),
      hudMessage(5, 'chat_alliance', 'group up'),
      hudMessage(6, 'system_status', 'net jitter'),
    ]);

    expect(messages).toEqual([
      'player joined',
      'alliance accepted',
      'builder lost',
      'hello world',
      'group up',
    ]);
  });

  it('can enable system status messages', () => {
    const messages = deriveTickerMessagesFromServerHud(
      [hudMessage(1, 'system_status', 'server in maintenance mode')],
      {
        ...DEFAULT_HUD_MESSAGE_VISIBILITY,
        showSystemStatus: true,
      }
    );

    expect(messages).toEqual(['server in maintenance mode']);
  });

  it('removes empty/whitespace-only strings after trimming', () => {
    const messages = deriveTickerMessagesFromServerHud([
      hudMessage(1, 'global_notification', '  Alpha captured a Neutral Base  '),
      hudMessage(2, 'global_notification', '   '),
      hudMessage(3, 'global_notification', ''),
    ]);

    expect(messages).toEqual(['Alpha captured a Neutral Base']);
  });
});
