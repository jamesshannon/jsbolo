/**
 * Keyboard input handling
 */

export interface InputState {
  accelerating: boolean;
  braking: boolean;
  turningLeft: boolean;
  turningRight: boolean;
  shooting: boolean;
  increaseRange: boolean;
  decreaseRange: boolean;
}

export class KeyboardInput {
  private readonly state: InputState = {
    accelerating: false,
    braking: false,
    turningLeft: false,
    turningRight: false,
    shooting: false,
    increaseRange: false,
    decreaseRange: false,
  };

  private readonly keyMap = new Map<string, keyof InputState>([
    // Forward/Back (classic Bolo: Q/A, modern: W/S, arrows: up/down)
    ['KeyQ', 'accelerating'],
    ['KeyW', 'accelerating'],
    ['ArrowUp', 'accelerating'],

    ['KeyZ', 'braking'], // Classic Bolo uses Z for brake
    ['KeyS', 'braking'],
    ['ArrowDown', 'braking'],

    // Turning (classic: numpad / and *, modern: A/D, arrows: left/right)
    ['NumpadDivide', 'turningLeft'],
    ['KeyA', 'turningLeft'],
    ['ArrowLeft', 'turningLeft'],

    ['NumpadMultiply', 'turningRight'],
    ['KeyD', 'turningRight'],
    ['ArrowRight', 'turningRight'],

    // Shooting (classic: numpad 0, modern: space)
    ['Numpad0', 'shooting'],
    ['Space', 'shooting'],

    // Range adjustment
    ['Equal', 'increaseRange'],
    ['Minus', 'decreaseRange'],
  ]);

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  private readonly handleKeyDown = (event: KeyboardEvent): void => {
    if (this.isEditableTarget(event.target)) {
      return;
    }

    const action = this.keyMap.get(event.code);
    if (action) {
      event.preventDefault();
      this.state[action] = true;
      console.log(`Key down: ${event.code} -> ${action} = true`);
    }
  };

  private readonly handleKeyUp = (event: KeyboardEvent): void => {
    if (this.isEditableTarget(event.target)) {
      return;
    }

    const action = this.keyMap.get(event.code);
    if (action) {
      event.preventDefault();
      this.state[action] = false;
    }
  };

  private isEditableTarget(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) {
      return false;
    }
    return (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target.isContentEditable
    );
  }

  getState(): Readonly<InputState> {
    return this.state;
  }

  destroy(): void {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }
}
