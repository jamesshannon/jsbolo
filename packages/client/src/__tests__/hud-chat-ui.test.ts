import {describe, expect, it, vi, afterEach} from 'vitest';
import {MultiplayerGame} from '../game/multiplayer-game.js';
import {NetworkClient} from '../network/network-client.js';

function mountHudChatDom(): HTMLCanvasElement {
  document.body.innerHTML = `
    <span id="hud-ticker-text">Ready.</span>
    <form id="hud-chat-form">
      <input id="hud-chat-alliance" type="checkbox" />
      <input id="hud-chat-input" type="text" />
      <button id="hud-chat-send" type="submit">Send</button>
    </form>
  `;

  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 480;
  return canvas;
}

describe('HUD chat UI wiring', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('sends chat payload from HUD form submit', () => {
    const sendChatSpy = vi
      .spyOn(NetworkClient.prototype, 'sendChat')
      .mockImplementation(() => {});

    const canvas = mountHudChatDom();
    const game = new MultiplayerGame(canvas, {} as CanvasRenderingContext2D);

    const input = document.getElementById('hud-chat-input') as HTMLInputElement;
    const alliance = document.getElementById('hud-chat-alliance') as HTMLInputElement;
    const form = document.getElementById('hud-chat-form') as HTMLFormElement;

    input.value = '  attack now  ';
    alliance.checked = true;
    form.dispatchEvent(new Event('submit', {bubbles: true, cancelable: true}));

    expect(sendChatSpy).toHaveBeenCalledWith('attack now', true);
    expect(input.value).toBe('');
    game.destroy();
  });

  it('focuses chat input when pressing Enter outside editable elements', () => {
    const canvas = mountHudChatDom();
    const game = new MultiplayerGame(canvas, {} as CanvasRenderingContext2D);
    const input = document.getElementById('hud-chat-input') as HTMLInputElement;

    window.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter', bubbles: true}));
    expect(document.activeElement).toBe(input);
    game.destroy();
  });
});
