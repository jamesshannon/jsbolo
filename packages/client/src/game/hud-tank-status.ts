import type {Tank} from '@shared';

export type TankHudRelation = 'self' | 'friendly' | 'hostile' | 'neutral';

export interface TankHudMarker {
  playerId: number;
  relation: TankHudRelation;
}

export interface DeriveTankHudMarkersInput {
  tanks: Iterable<Tank>;
  myPlayerId: number | null;
  myTeam: number | null;
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

    if (input.myTeam === null) {
      markers.push({playerId: tank.id, relation: 'neutral'});
      continue;
    }

    if (tank.team === input.myTeam) {
      markers.push({playerId: tank.id, relation: 'friendly'});
      continue;
    }

    markers.push({playerId: tank.id, relation: 'hostile'});
  }

  return markers;
}
