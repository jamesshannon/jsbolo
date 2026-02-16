import {describe, expect, it, vi, afterEach} from 'vitest';
import {MultiplayerGame} from '../game/multiplayer-game.js';
import {NetworkClient} from '../network/network-client.js';
import {Renderer} from '../renderer/renderer.js';
import type {Tank} from '@shared';

function mountHudChatDom(): HTMLCanvasElement {
  document.body.innerHTML = `
    <span id="hud-ticker-text">Ready.</span>
    <form id="hud-chat-form">
      <input id="hud-chat-alliance" type="checkbox" />
      <select id="hud-chat-recipients" multiple size="1">
        <option value="2">P2</option>
      </select>
      <input id="hud-filter-newswire" type="checkbox" checked />
      <input id="hud-filter-assistant" type="checkbox" checked />
      <input id="hud-filter-ai-brain" type="checkbox" checked />
      <input id="hud-colorblind-mode" type="checkbox" />
      <input id="hud-chat-input" type="text" />
      <button id="hud-chat-send" type="submit">Send</button>
    </form>
    <span id="hud-armor"></span>
    <div id="hud-armor-bar"></div>
    <span id="hud-shells"></span>
    <span id="hud-mines"></span>
    <span id="hud-trees"></span>
    <span id="hud-player-kills"></span>
    <span id="hud-player-deaths"></span>
    <span id="hud-builder-mode"></span>
    <span id="hud-builder-mode-side"></span>
    <span id="hud-range"></span>
    <span id="hud-player-shield"></span>
    <div id="hud-pillbox-list"></div>
    <div id="hud-base-list"></div>
    <span id="hud-nearest-base-owner"></span>
    <span id="hud-nearest-base-armor"></span>
    <span id="hud-nearest-base-shells"></span>
    <span id="hud-nearest-base-mines"></span>
    <div id="hud-tank-list"></div>
    <span id="hud-tank-summary"></span>
  `;

  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 480;
  return canvas;
}

function makeTank(id: number, team: number, overrides: Partial<Tank> = {}): Tank {
  return {
    id,
    x: 256 * 20,
    y: 256 * 20,
    direction: 0,
    speed: 0,
    armor: 40,
    shells: 40,
    mines: 0,
    trees: 0,
    team,
    onBoat: false,
    reload: 0,
    firingRange: 7,
    ...overrides,
  };
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

    expect(sendChatSpy).toHaveBeenCalledWith('attack now', {allianceOnly: true});
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

  it('sends selected recipient ids from HUD player selector', () => {
    const sendChatSpy = vi
      .spyOn(NetworkClient.prototype, 'sendChat')
      .mockImplementation(() => {});

    const canvas = mountHudChatDom();
    const game = new MultiplayerGame(canvas, {} as CanvasRenderingContext2D);

    const input = document.getElementById('hud-chat-input') as HTMLInputElement;
    const recipients = document.getElementById('hud-chat-recipients') as HTMLSelectElement;
    const form = document.getElementById('hud-chat-form') as HTMLFormElement;

    recipients.options[0]!.selected = true;
    input.value = 'defend north';
    form.dispatchEvent(new Event('submit', {bubbles: true, cancelable: true}));

    expect(sendChatSpy).toHaveBeenCalledWith('defend north', {
      allianceOnly: false,
      recipientPlayerIds: [2],
    });
    game.destroy();
  });

  it('applies renderer color mode when the HUD colorblind toggle changes', () => {
    const setColorModeSpy = vi
      .spyOn(Renderer.prototype, 'setColorMode')
      .mockImplementation(() => {});

    const canvas = mountHudChatDom();
    const game = new MultiplayerGame(canvas, {} as CanvasRenderingContext2D);
    const checkbox = document.getElementById('hud-colorblind-mode') as HTMLInputElement;

    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change', {bubbles: true}));

    expect(setColorModeSpy).toHaveBeenCalledWith('colorblind');
    game.destroy();
  });

  it('updates HUD stock bars and tank relation chips', () => {
    const canvas = mountHudChatDom();
    const game = new MultiplayerGame(canvas, {} as CanvasRenderingContext2D);

    const selfTank = makeTank(1, 2, {
      armor: 31,
      shells: 12,
      mines: 7,
      trees: 9,
      firingRange: 6.5,
    });

    (game as any).playerId = 1;
    (game as any).tanks = new Map([
      [1, selfTank],
      [2, makeTank(2, 2)],
      [3, makeTank(3, 9)],
    ]);

    (game as any).updateHUD(selfTank);

    expect((document.getElementById('hud-armor') as HTMLElement).textContent).toBe('31/40');
    expect((document.getElementById('hud-shells') as HTMLElement).textContent).toBe('12/40');
    expect((document.getElementById('hud-mines') as HTMLElement).textContent).toBe('7/40');
    expect((document.getElementById('hud-trees') as HTMLElement).textContent).toBe('9/40');
    expect((document.getElementById('hud-player-shield') as HTMLElement).textContent).toBe('31/40');
    expect((document.getElementById('hud-range') as HTMLElement).textContent).toBe('6.5 tiles');
    expect((document.getElementById('hud-armor-bar') as HTMLElement).style.width).toBe('77.5%');

    const tankListHtml = (document.getElementById('hud-tank-list') as HTMLElement).innerHTML;
    expect(tankListHtml).toContain('hud-chip self');
    expect(tankListHtml).toContain('hud-chip-self-hollow');
    expect(tankListHtml).toContain('hud-chip friendly');
    expect(tankListHtml).toContain('hud-chip hostile');
    expect((document.getElementById('hud-tank-summary') as HTMLElement).textContent).toBe(
      '1 friendly / 1 hostile'
    );

    game.destroy();
  });
});
