/**
 * Network client - handles WebSocket communication with server
 */

import {
  encodeClientMessage,
  decodeServerMessage,
  type PlayerInput,
  type ServerMessage,
  type WelcomeMessage,
  type UpdateMessage,
  type Tank,
} from '@shared';

export interface NetworkState {
  connected: boolean;
  playerId: number | null;
  currentTick: number;
  tanks: Map<number, Tank>;
}

export class NetworkClient {
  private ws: WebSocket | null = null;
  private readonly state: NetworkState = {
    connected: false,
    playerId: null,
    currentTick: 0,
    tanks: new Map(),
  };

  private inputSequence = 0;
  private onWelcomeCallback?: (welcome: WelcomeMessage) => void;
  private onUpdateCallback?: (update: UpdateMessage) => void;

  async connect(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(url);
        this.ws.binaryType = 'arraybuffer';

        this.ws.onopen = (): void => {
          this.state.connected = true;
          console.log('Connected to server');
          resolve();
        };

        this.ws.onerror = (error): void => {
          console.error('WebSocket error:', error);
          reject(error);
        };

        this.ws.onclose = (): void => {
          this.state.connected = false;
          this.state.playerId = null;
          console.log('Disconnected from server');
        };

        this.ws.onmessage = (event: MessageEvent<string>): void => {
          this.handleMessage(event.data);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  sendInput(input: Omit<PlayerInput, 'sequence'>): void {
    if (!this.ws || !this.state.connected) {
      return;
    }

    const message = {
      type: 'input' as const,
      input: {
        ...input,
        sequence: this.inputSequence++,
      },
    };

    const data = encodeClientMessage(message);
    this.ws.send(data);
  }

  private handleMessage(data: string): void {
    try {
      const message: ServerMessage = decodeServerMessage(data);

      if (message.type === 'welcome') {
        this.handleWelcome(message);
      } else if (message.type === 'update') {
        this.handleUpdate(message);
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  }

  private handleWelcome(welcome: WelcomeMessage): void {
    this.state.playerId = welcome.playerId;
    this.state.currentTick = welcome.currentTick;

    console.log(`Welcome! Player ID: ${this.state.playerId}, Team: ${welcome.assignedTeam}`);

    if (this.onWelcomeCallback) {
      this.onWelcomeCallback(welcome);
    }
  }

  private handleUpdate(update: UpdateMessage): void {
    this.state.currentTick = update.tick;

    // Delta updates: merge changed entities instead of replacing all state
    // Only update tanks that are included in the message
    if (update.tanks) {
      for (const tank of update.tanks) {
        this.state.tanks.set(tank.id, tank);
      }
    }

    if (this.onUpdateCallback) {
      this.onUpdateCallback(update);
    }
  }

  getState(): Readonly<NetworkState> {
    return this.state;
  }

  onWelcome(callback: (welcome: WelcomeMessage) => void): void {
    this.onWelcomeCallback = callback;
  }

  onUpdate(callback: (update: UpdateMessage) => void): void {
    this.onUpdateCallback = callback;
  }

  isConnected(): boolean {
    return this.state.connected;
  }

  getPlayerId(): number | null {
    return this.state.playerId;
  }
}
