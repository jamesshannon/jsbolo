import type {Tank} from '@shared';
import {
  type AllianceRelations,
  getTankAllianceId,
  isFriendlyToLocalAlliance,
} from './alliance-relations.js';

export type TankHudRelation = 'self' | 'friendly' | 'hostile' | 'neutral';

export interface TankHudMarker {
  playerId: number;
  relation: TankHudRelation;
}

export interface DeriveTankHudMarkersInput {
  tanks: Iterable<Tank>;
  myPlayerId: number | null;
  myAllianceId: number | null;
  allianceRelations: AllianceRelations;
}

/**
 * Compute deterministic tank status markers for the HUD relation pane.
 *
 * Classic intent:
 * - local player: black marker
 * - allies: green markers
 * - hostiles: red markers
 */
export function deriveTankHudMarkers(input: DeriveTankHudMarkersInput): TankHudMarker[] {
  const tanks = Array.from(input.tanks).sort((a, b) => a.id - b.id);
  const markers: TankHudMarker[] = [];

  for (const tank of tanks) {
    if (input.myPlayerId !== null && tank.id === input.myPlayerId) {
      markers.push({playerId: tank.id, relation: 'self'});
      continue;
    }

    if (input.myAllianceId === null) {
      markers.push({playerId: tank.id, relation: 'neutral'});
      continue;
    }

    if (isFriendlyToLocalAlliance(
      input.myAllianceId,
      getTankAllianceId(tank),
      input.allianceRelations
    )) {
      markers.push({playerId: tank.id, relation: 'friendly'});
      continue;
    }

    markers.push({playerId: tank.id, relation: 'hostile'});
  }

  return markers;
}
