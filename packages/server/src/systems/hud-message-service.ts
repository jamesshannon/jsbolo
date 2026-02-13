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
}

interface PublishAllianceArgs {
  tick: number;
  text: string;
  sourceTeam: number;
  players: Iterable<HudRecipient>;
  areTeamsAllied: (teamA: number, teamB: number) => boolean;
  class?: HudMessageClass;
}

interface PublishPersonalArgs {
  tick: number;
  text: string;
  playerId: number;
  class?: HudMessageClass;
}

const MAX_QUEUE_PER_PLAYER = 64;

/**
 * Server-authoritative HUD message queueing and recipient routing.
 *
 * WHY THIS EXISTS:
 * - Prevents sensitive/team-scoped notifications leaking to unauthorized clients.
 * - Keeps delivery logic centralized so gameplay systems publish typed events only.
 */
export class HudMessageService {
  private nextId = 1;
  private readonly queues = new Map<number, HudMessage[]>();

  publishGlobal(args: PublishGlobalArgs): void {
    for (const player of args.players) {
      this.enqueue(player.id, {
        id: this.nextId++,
        tick: args.tick,
        class: args.class ?? 'global_notification',
        text: args.text,
      });
    }
  }

  publishAlliance(args: PublishAllianceArgs): void {
    for (const player of args.players) {
      if (
        player.tank.team === args.sourceTeam ||
        args.areTeamsAllied(args.sourceTeam, player.tank.team)
      ) {
        this.enqueue(player.id, {
          id: this.nextId++,
          tick: args.tick,
          class: args.class ?? 'alliance_notification',
          text: args.text,
        });
      }
    }
  }

  publishPersonal(args: PublishPersonalArgs): void {
    this.enqueue(args.playerId, {
      id: this.nextId++,
      tick: args.tick,
      class: args.class ?? 'personal_notification',
      text: args.text,
    });
  }

  drainForPlayer(playerId: number): HudMessage[] {
    const queued = this.queues.get(playerId);
    if (!queued || queued.length === 0) {
      return [];
    }

    this.queues.set(playerId, []);
    return queued;
  }

  private enqueue(playerId: number, message: HudMessage): void {
    const queue = this.queues.get(playerId) ?? [];
    queue.push(message);
    if (queue.length > MAX_QUEUE_PER_PLAYER) {
      queue.shift();
    }
    this.queues.set(playerId, queue);
  }
}

