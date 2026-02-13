/**
 * Binary network protocol using Protocol Buffers.
 */

import type {BuildOrder, PlayerInput, Tank, Builder, Pillbox, Base} from './types.js';
import * as proto from './generated/protocol.js';

// Client -> Server Messages

export interface ClientInputMessage {
  type: 'input';
  input: PlayerInput;
}

export interface ClientChatMessage {
  type: 'chat';
  chat: {
    text: string;
    allianceOnly: boolean;
    recipientPlayerIds?: number[];
  };
}

export type ClientMessage = ClientInputMessage | ClientChatMessage;

// Server -> Client Messages

export type ServerMessage = WelcomeMessage | UpdateMessage;

export interface WelcomeMessage {
  type: 'welcome';
  playerId: number;
  assignedTeam: number;
  currentTick: number;
  mapName: string;
  map: {
    width: number;
    height: number;
    terrain: number[];
    terrainLife: number[];
  };
  tanks: Tank[];
  pillboxes: Pillbox[];
  bases: Base[];
  matchEnded?: boolean;
  winningTeams?: number[];
}

export interface Shell {
  id: number;
  x: number;
  y: number;
  direction: number;
  ownerTankId: number;
}

export interface TerrainUpdate {
  x: number;
  y: number;
  terrain: number;
  terrainLife: number;
  direction?: number;
}

export interface SoundEvent {
  soundId: number;
  x: number;
  y: number;
}

export type HudMessageClass =
  | 'global_notification'
  | 'alliance_notification'
  | 'personal_notification'
  | 'chat_global'
  | 'chat_alliance'
  | 'system_status';

export interface HudMessage {
  id: number;
  tick: number;
  class: HudMessageClass;
  text: string;
}

export interface UpdateMessage {
  type: 'update';
  tick: number;
  tanks?: Tank[];
  shells?: Shell[];
  builders?: Builder[];
  pillboxes?: Pillbox[];
  bases?: Base[];
  removedTankIds?: number[];
  removedBuilderIds?: number[];
  removedPillboxIds?: number[];
  removedBaseIds?: number[];
  terrainUpdates?: TerrainUpdate[];
  soundEvents?: SoundEvent[];
  hudMessages?: HudMessage[];
  matchEnded?: boolean;
  winningTeams?: number[];
}

type BinaryData = Uint8Array | ArrayBuffer;

function toUint8Array(data: BinaryData): Uint8Array {
  if (data instanceof Uint8Array) {
    return data;
  }
  return new Uint8Array(data);
}

function toProtoBuildOrder(buildOrder: BuildOrder | undefined): proto.jsbolo.IBuildOrder | undefined {
  if (!buildOrder) {
    return undefined;
  }
  return {
    action: buildOrder.action as unknown as proto.jsbolo.BuildAction,
    targetX: buildOrder.targetX,
    targetY: buildOrder.targetY,
  };
}

function fromProtoBuildOrder(buildOrder: proto.jsbolo.IBuildOrder | null | undefined): BuildOrder | undefined {
  if (!buildOrder) {
    return undefined;
  }
  return {
    action: (buildOrder.action ?? 0) as unknown as BuildOrder['action'],
    targetX: buildOrder.targetX ?? 0,
    targetY: buildOrder.targetY ?? 0,
  };
}

function toProtoPlayerInput(input: PlayerInput): proto.jsbolo.IPlayerInput {
  const buildOrder = toProtoBuildOrder(input.buildOrder);
  return {
    sequence: input.sequence,
    tick: input.tick,
    accelerating: input.accelerating,
    braking: input.braking,
    turningClockwise: input.turningClockwise,
    turningCounterClockwise: input.turningCounterClockwise,
    shooting: input.shooting,
    ...(buildOrder !== undefined && {buildOrder}),
    rangeAdjustment: input.rangeAdjustment as unknown as proto.jsbolo.RangeAdjustment,
  };
}

function fromProtoPlayerInput(input: proto.jsbolo.IPlayerInput): PlayerInput {
  const buildOrder = fromProtoBuildOrder(input.buildOrder);
  return {
    sequence: input.sequence ?? 0,
    tick: input.tick ?? 0,
    accelerating: input.accelerating ?? false,
    braking: input.braking ?? false,
    turningClockwise: input.turningClockwise ?? false,
    turningCounterClockwise: input.turningCounterClockwise ?? false,
    shooting: input.shooting ?? false,
    ...(buildOrder !== undefined && {buildOrder}),
    rangeAdjustment: (input.rangeAdjustment ?? 0) as unknown as PlayerInput['rangeAdjustment'],
  };
}

function toProtoTank(tank: Tank): proto.jsbolo.ITank {
  return {
    id: tank.id,
    x: tank.x,
    y: tank.y,
    direction: tank.direction,
    speed: tank.speed,
    armor: tank.armor,
    shells: tank.shells,
    mines: tank.mines,
    trees: tank.trees,
    team: tank.team,
    onBoat: tank.onBoat,
    reload: tank.reload,
    firingRange: tank.firingRange,
    ...(tank.carriedPillbox !== undefined &&
      tank.carriedPillbox !== null && {carriedPillbox: tank.carriedPillbox}),
  };
}

function fromProtoTank(tank: proto.jsbolo.ITank): Tank {
  return {
    id: tank.id ?? 0,
    x: tank.x ?? 0,
    y: tank.y ?? 0,
    direction: tank.direction ?? 0,
    speed: tank.speed ?? 0,
    armor: tank.armor ?? 0,
    shells: tank.shells ?? 0,
    mines: tank.mines ?? 0,
    trees: tank.trees ?? 0,
    team: tank.team ?? 0,
    onBoat: tank.onBoat ?? false,
    reload: tank.reload ?? 0,
    firingRange: tank.firingRange ?? 0,
    ...(tank.carriedPillbox !== null &&
      tank.carriedPillbox !== undefined && {carriedPillbox: tank.carriedPillbox}),
  };
}

function toProtoBuilder(builder: Builder): proto.jsbolo.IBuilder {
  return {
    id: builder.id,
    ownerTankId: builder.ownerTankId,
    x: builder.x,
    y: builder.y,
    targetX: builder.targetX,
    targetY: builder.targetY,
    order: builder.order as unknown as proto.jsbolo.BuilderOrder,
    trees: builder.trees,
    hasMine: builder.hasMine,
    ...(builder.hasPillbox !== undefined && {hasPillbox: builder.hasPillbox}),
    team: builder.team,
    ...(builder.respawnCounter !== undefined && {respawnCounter: builder.respawnCounter}),
  };
}

function fromProtoBuilder(builder: proto.jsbolo.IBuilder): Builder {
  return {
    id: builder.id ?? 0,
    ownerTankId: builder.ownerTankId ?? 0,
    x: builder.x ?? 0,
    y: builder.y ?? 0,
    targetX: builder.targetX ?? 0,
    targetY: builder.targetY ?? 0,
    order: (builder.order ?? 0) as unknown as Builder['order'],
    trees: builder.trees ?? 0,
    hasMine: builder.hasMine ?? false,
    ...(builder.hasPillbox !== null &&
      builder.hasPillbox !== undefined && {hasPillbox: builder.hasPillbox}),
    team: builder.team ?? 0,
    ...(builder.respawnCounter !== null &&
      builder.respawnCounter !== undefined && {respawnCounter: builder.respawnCounter}),
  };
}

// Encoding/Decoding helpers

export function encodeClientMessage(message: ClientMessage): Uint8Array {
  if (message.type === 'input') {
    return proto.jsbolo.ClientMessage.encode({
      input: toProtoPlayerInput(message.input),
    }).finish();
  }

  if (message.type === 'chat') {
    return proto.jsbolo.ClientMessage.encode({
      chat: {
        text: message.chat.text,
        allianceOnly: message.chat.allianceOnly,
        recipientPlayerIds: message.chat.recipientPlayerIds ?? [],
      },
    }).finish();
  }

  throw new Error(`Unsupported client message type: ${(message as {type?: string}).type}`);
}

export function decodeClientMessage(data: BinaryData): ClientMessage {
  const decoded = proto.jsbolo.ClientMessage.decode(toUint8Array(data));
  if (decoded.input) {
    return {
      type: 'input',
      input: fromProtoPlayerInput(decoded.input),
    };
  }

  if (decoded.chat) {
    return {
      type: 'chat',
      chat: {
        text: decoded.chat.text ?? '',
        allianceOnly: decoded.chat.allianceOnly ?? false,
        ...((decoded.chat.recipientPlayerIds?.length ?? 0) > 0
          && {recipientPlayerIds: decoded.chat.recipientPlayerIds?.map(id => Number(id)) ?? []}),
      },
    };
  }

  throw new Error('Invalid client message: missing payload');
}

function toProtoWelcome(message: WelcomeMessage): proto.jsbolo.IWelcomeMessage {
  return {
    playerId: message.playerId,
    assignedTeam: message.assignedTeam,
    currentTick: message.currentTick,
    mapName: message.mapName,
    map: {
      width: message.map.width,
      height: message.map.height,
      terrain: message.map.terrain,
      terrainLife: message.map.terrainLife,
    },
    tanks: message.tanks.map(tank => toProtoTank(tank)),
    pillboxes: message.pillboxes,
    bases: message.bases,
    ...(message.matchEnded !== undefined && {matchEnded: message.matchEnded}),
    ...(message.winningTeams !== undefined && {winningTeams: message.winningTeams}),
  };
}

function toProtoHudMessageClass(value: HudMessageClass): proto.jsbolo.HudMessageClass {
  switch (value) {
    case 'alliance_notification':
      return proto.jsbolo.HudMessageClass.HUD_MESSAGE_CLASS_ALLIANCE_NOTIFICATION;
    case 'personal_notification':
      return proto.jsbolo.HudMessageClass.HUD_MESSAGE_CLASS_PERSONAL_NOTIFICATION;
    case 'chat_global':
      return proto.jsbolo.HudMessageClass.HUD_MESSAGE_CLASS_CHAT_GLOBAL;
    case 'chat_alliance':
      return proto.jsbolo.HudMessageClass.HUD_MESSAGE_CLASS_CHAT_ALLIANCE;
    case 'system_status':
      return proto.jsbolo.HudMessageClass.HUD_MESSAGE_CLASS_SYSTEM_STATUS;
    case 'global_notification':
    default:
      return proto.jsbolo.HudMessageClass.HUD_MESSAGE_CLASS_GLOBAL_NOTIFICATION;
  }
}

function fromProtoHudMessageClass(
  value: proto.jsbolo.HudMessageClass | null | undefined
): HudMessageClass {
  switch (value) {
    case proto.jsbolo.HudMessageClass.HUD_MESSAGE_CLASS_ALLIANCE_NOTIFICATION:
      return 'alliance_notification';
    case proto.jsbolo.HudMessageClass.HUD_MESSAGE_CLASS_PERSONAL_NOTIFICATION:
      return 'personal_notification';
    case proto.jsbolo.HudMessageClass.HUD_MESSAGE_CLASS_CHAT_GLOBAL:
      return 'chat_global';
    case proto.jsbolo.HudMessageClass.HUD_MESSAGE_CLASS_CHAT_ALLIANCE:
      return 'chat_alliance';
    case proto.jsbolo.HudMessageClass.HUD_MESSAGE_CLASS_SYSTEM_STATUS:
      return 'system_status';
    case proto.jsbolo.HudMessageClass.HUD_MESSAGE_CLASS_GLOBAL_NOTIFICATION:
    default:
      return 'global_notification';
  }
}

function toProtoUpdate(message: UpdateMessage): proto.jsbolo.IUpdateMessage {
  return {
    tick: message.tick,
    ...(message.tanks !== undefined && {
      tanks: message.tanks.map(tank => toProtoTank(tank)),
    }),
    ...(message.shells !== undefined && {shells: message.shells}),
    ...(message.builders !== undefined && {
      builders: message.builders.map(builder => toProtoBuilder(builder)),
    }),
    ...(message.pillboxes !== undefined && {pillboxes: message.pillboxes}),
    ...(message.bases !== undefined && {bases: message.bases}),
    ...(message.removedTankIds !== undefined && {removedTankIds: message.removedTankIds}),
    ...(message.removedBuilderIds !== undefined && {
      removedBuilderIds: message.removedBuilderIds,
    }),
    ...(message.removedPillboxIds !== undefined && {
      removedPillboxIds: message.removedPillboxIds,
    }),
    ...(message.removedBaseIds !== undefined && {removedBaseIds: message.removedBaseIds}),
    ...(message.terrainUpdates !== undefined && {terrainUpdates: message.terrainUpdates}),
    ...(message.soundEvents !== undefined && {soundEvents: message.soundEvents}),
    ...(message.hudMessages !== undefined && {
      hudMessages: message.hudMessages.map(hud => ({
        id: hud.id,
        tick: hud.tick,
        class: toProtoHudMessageClass(hud.class),
        text: hud.text,
      })),
    }),
    ...(message.matchEnded !== undefined && {matchEnded: message.matchEnded}),
    ...(message.winningTeams !== undefined && {winningTeams: message.winningTeams}),
  };
}

export function encodeServerMessage(message: ServerMessage): Uint8Array {
  const encoded = message.type === 'welcome'
    ? proto.jsbolo.ServerMessage.encode({welcome: toProtoWelcome(message)}).finish()
    : proto.jsbolo.ServerMessage.encode({update: toProtoUpdate(message)}).finish();
  return encoded;
}

function fromProtoWelcome(welcome: proto.jsbolo.IWelcomeMessage): WelcomeMessage {
  const map = welcome.map;
  return {
    type: 'welcome',
    playerId: welcome.playerId ?? 0,
    assignedTeam: welcome.assignedTeam ?? 0,
    currentTick: welcome.currentTick ?? 0,
    mapName: welcome.mapName ?? '',
    map: {
      width: map?.width ?? 0,
      height: map?.height ?? 0,
      terrain: map?.terrain ? [...map.terrain] : [],
      terrainLife: map?.terrainLife ? [...map.terrainLife] : [],
    },
    tanks: welcome.tanks ? welcome.tanks.map(tank => fromProtoTank(tank)) : [],
    pillboxes: welcome.pillboxes ? [...welcome.pillboxes] as Pillbox[] : [],
    bases: welcome.bases ? [...welcome.bases] as Base[] : [],
    ...(welcome.matchEnded !== null &&
      welcome.matchEnded !== undefined && {matchEnded: welcome.matchEnded}),
    ...(welcome.winningTeams && welcome.winningTeams.length > 0 && {
      winningTeams: [...welcome.winningTeams],
    }),
  };
}

function fromProtoUpdate(update: proto.jsbolo.IUpdateMessage): UpdateMessage {
  return {
    type: 'update',
    tick: update.tick ?? 0,
    // Shells are always materialized to preserve lifecycle semantics.
    shells: update.shells ? [...update.shells] as Shell[] : [],
    ...(update.tanks && update.tanks.length > 0 && {
      tanks: update.tanks.map(tank => fromProtoTank(tank)),
    }),
    ...(update.builders &&
      update.builders.length > 0 && {
        builders: update.builders.map(builder => fromProtoBuilder(builder)),
      }),
    ...(update.pillboxes &&
      update.pillboxes.length > 0 && {pillboxes: [...update.pillboxes] as Pillbox[]}),
    ...(update.bases && update.bases.length > 0 && {bases: [...update.bases] as Base[]}),
    ...(update.removedTankIds &&
      update.removedTankIds.length > 0 && {removedTankIds: [...update.removedTankIds]}),
    ...(update.removedBuilderIds &&
      update.removedBuilderIds.length > 0 && {
        removedBuilderIds: [...update.removedBuilderIds],
      }),
    ...(update.removedPillboxIds &&
      update.removedPillboxIds.length > 0 && {
        removedPillboxIds: [...update.removedPillboxIds],
      }),
    ...(update.removedBaseIds &&
      update.removedBaseIds.length > 0 && {removedBaseIds: [...update.removedBaseIds]}),
    ...(update.terrainUpdates &&
      update.terrainUpdates.length > 0 && {
        terrainUpdates: [...update.terrainUpdates] as TerrainUpdate[],
      }),
    ...(update.soundEvents &&
      update.soundEvents.length > 0 && {soundEvents: [...update.soundEvents] as SoundEvent[]}),
    ...(update.hudMessages &&
      update.hudMessages.length > 0 && {
        hudMessages: update.hudMessages.map(hud => ({
          id: Number(hud.id ?? 0),
          tick: hud.tick ?? 0,
          class: fromProtoHudMessageClass(hud.class),
          text: hud.text ?? '',
        })),
      }),
    ...(update.matchEnded !== null &&
      update.matchEnded !== undefined && {matchEnded: update.matchEnded}),
    ...(update.winningTeams && update.winningTeams.length > 0 && {
      winningTeams: [...update.winningTeams],
    }),
  };
}

export function decodeServerMessage(data: BinaryData): ServerMessage {
  const decoded = proto.jsbolo.ServerMessage.decode(toUint8Array(data));
  if (decoded.welcome) {
    return fromProtoWelcome(decoded.welcome);
  }
  if (decoded.update) {
    return fromProtoUpdate(decoded.update);
  }
  throw new Error('Invalid server message: unsupported or missing payload');
}
