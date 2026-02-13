import type {HudMessage, HudMessageClass} from '@jsbolo/shared';

interface HudRecipient {
  id: number;
  tank: {
    team: number;
  };
}

interface PublishGlobalArgs {
  tick: number;
  text: string;
  players: Iterable<HudRecipient>;
  class?: HudMessageClass;
  priority?: HudMessagePriority;
}

interface PublishAllianceArgs {
  tick: number;
  text: string;
  sourceTeam: number;
  players: Iterable<HudRecipient>;
  areTeamsAllied: (teamA: number, teamB: number) => boolean;
  class?: HudMessageClass;
  priority?: HudMessagePriority;
}

interface PublishPersonalArgs {
  tick: number;
  text: string;
  playerId: number;
  class?: HudMessageClass;
  priority?: HudMessagePriority;
}

type HudMessagePriority = 'high' | 'normal' | 'low';

interface QueueEntry {
  message: HudMessage;
  priority: HudMessagePriority;
}

const MAX_QUEUE_PER_PLAYER = 64;
const MAX_GLOBAL_HISTORY = 24;
const MESSAGE_TTL_TICKS = 600; // 12 seconds at 50 TPS
const COALESCE_WINDOW_TICKS = 100; // 2 seconds at 50 TPS

/**
 * Server-authoritative HUD message queueing and recipient routing.
 *
 * WHY THIS EXISTS:
 * - Prevents sensitive/team-scoped notifications leaking to unauthorized clients.
 * - Keeps delivery logic centralized so gameplay systems publish typed events only.
 */
export class HudMessageService {
  private nextId = 1;
  private readonly queues = new Map<number, QueueEntry[]>();
  private readonly globalHistory: HudMessage[] = [];

  publishGlobal(args: PublishGlobalArgs): void {
    const message = this.createMessage({
      tick: args.tick,
      class: args.class ?? 'global_notification',
      text: args.text,
    });
    const priority = args.priority ?? this.getDefaultPriority(message.class);
    this.pushToGlobalHistory(message);
    for (const player of args.players) {
      this.enqueue(player.id, message, priority);
    }
  }

  publishAlliance(args: PublishAllianceArgs): void {
    for (const player of args.players) {
      if (
        player.tank.team === args.sourceTeam ||
        args.areTeamsAllied(args.sourceTeam, player.tank.team)
      ) {
        const message = this.createMessage({
          tick: args.tick,
          class: args.class ?? 'alliance_notification',
          text: args.text,
        });
        const priority = args.priority ?? this.getDefaultPriority(message.class);
        this.enqueue(player.id, message, priority);
      }
    }
  }

  publishPersonal(args: PublishPersonalArgs): void {
    const message = this.createMessage({
      tick: args.tick,
      class: args.class ?? 'personal_notification',
      text: args.text,
    });
    const priority = args.priority ?? this.getDefaultPriority(message.class);
    this.enqueue(args.playerId, message, priority);
  }

  /**
   * Seed reconnecting/new players with recent global context (join/quit/capture/chat).
   */
  seedPlayerFromRecentGlobal(playerId: number, currentTick: number): void {
    this.pruneGlobalHistory(currentTick);
    for (const message of this.globalHistory) {
      this.enqueue(
        playerId,
        this.createMessage({
          tick: message.tick,
          class: message.class,
          text: message.text,
        }),
        this.getDefaultPriority(message.class)
      );
    }
  }

  drainForPlayer(playerId: number): HudMessage[] {
    const queued = this.queues.get(playerId);
    if (!queued || queued.length === 0) {
      return [];
    }

    this.queues.set(playerId, []);
    return queued.map(entry => entry.message);
  }

  private createMessage(args: {
    tick: number;
    class: HudMessageClass;
    text: string;
  }): HudMessage {
    return {
      id: this.nextId++,
      tick: args.tick,
      class: args.class,
      text: args.text,
    };
  }

  private enqueue(
    playerId: number,
    message: HudMessage,
    priority: HudMessagePriority
  ): void {
    const queue = this.queues.get(playerId) ?? [];
    this.pruneExpired(queue, message.tick);

    const last = queue[queue.length - 1]?.message;
    if (last && this.canCoalesce(last, message)) {
      const lastEntry = queue[queue.length - 1]!;
      queue[queue.length - 1] = {
        ...lastEntry,
        message: {
          ...lastEntry.message,
          text: this.bumpCoalescedText(lastEntry.message.text),
        },
      };
      this.queues.set(playerId, queue);
      return;
    }

    queue.push({message, priority});
    this.trimOverflow(queue);
    this.queues.set(playerId, queue);
  }

  private pruneExpired(queue: QueueEntry[], currentTick: number): void {
    const minTick = currentTick - MESSAGE_TTL_TICKS;
    while (queue.length > 0 && queue[0]!.message.tick < minTick) {
      queue.shift();
    }
  }

  private canCoalesce(previous: HudMessage, incoming: HudMessage): boolean {
    return (
      previous.class === incoming.class &&
      previous.text === incoming.text &&
      incoming.tick - previous.tick <= COALESCE_WINDOW_TICKS
    );
  }

  private bumpCoalescedText(text: string): string {
    const match = text.match(/^(.*)\s\(x(\d+)\)$/);
    if (!match) {
      return `${text} (x2)`;
    }
    const base = match[1] ?? text;
    const count = Number(match[2] ?? '1');
    return `${base} (x${count + 1})`;
  }

  private pushToGlobalHistory(message: HudMessage): void {
    this.pruneGlobalHistory(message.tick);
    this.globalHistory.push(message);
    while (this.globalHistory.length > MAX_GLOBAL_HISTORY) {
      this.globalHistory.shift();
    }
  }

  private pruneGlobalHistory(currentTick: number): void {
    const minTick = currentTick - MESSAGE_TTL_TICKS;
    while (this.globalHistory.length > 0 && this.globalHistory[0]!.tick < minTick) {
      this.globalHistory.shift();
    }
  }

  /**
   * Enforce bounded queues while preserving high-signal events under pressure.
   * Drops oldest low-priority entries first, then normal, then high.
   */
  private trimOverflow(queue: QueueEntry[]): void {
    while (queue.length > MAX_QUEUE_PER_PLAYER) {
      const lowIndex = queue.findIndex(entry => entry.priority === 'low');
      if (lowIndex >= 0) {
        queue.splice(lowIndex, 1);
        continue;
      }

      const normalIndex = queue.findIndex(entry => entry.priority === 'normal');
      if (normalIndex >= 0) {
        queue.splice(normalIndex, 1);
        continue;
      }

      queue.shift();
    }
  }

  private getDefaultPriority(messageClass: HudMessageClass): HudMessagePriority {
    switch (messageClass) {
      case 'system_status':
      case 'personal_notification':
        return 'low';
      case 'global_notification':
      case 'alliance_notification':
      case 'chat_global':
      case 'chat_alliance':
      default:
        return 'normal';
    }
  }
}
