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

  private readonly keyMap = {
    // Acceleration/Braking (Bolo classic: Q/A)
    KeyQ: 'accelerating',
    KeyA: 'braking',

    // Turning (Bolo classic: numpad / and *)
    NumpadDivide: 'turningLeft',
    NumpadMultiply: 'turningRight',

    // Alternative arrow keys
    ArrowLeft: 'turningLeft',
    ArrowRight: 'turningRight',

    // Shooting (Bolo classic: numpad 0 or space)
    Numpad0: 'shooting',
    Space: 'shooting',

    // Range adjustment
    Equal: 'increaseRange',
    Minus: 'decreaseRange',
  } as const;

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  private handleKeyDown(event: KeyboardEvent): void {
    const action = this.keyMap[event.code as keyof typeof this.keyMap];
    if (action) {
      event.preventDefault();
      this.state[action] = true;
    }
  }

  private handleKeyUp(event: KeyboardEvent): void {
    const action = this.keyMap[event.code as keyof typeof this.keyMap];
    if (action) {
      event.preventDefault();
      this.state[action] = false;
    }
  }

  getState(): Readonly<InputState> {
    return this.state;
  }

  destroy(): void {
    window.removeEventListener('keydown', this.handleKeyDown.bind(this));
    window.removeEventListener('keyup', this.handleKeyUp.bind(this));
  }
}
