import {NEUTRAL_TEAM, type MapCell} from '@jsbolo/shared';

interface MineVisibilityRecord {
  ownerTeam: number;
  visibleToTeams: Set<number>;
}

interface MineWorldView {
  hasMineAt(tileX: number, tileY: number): boolean;
  setMineAt(tileX: number, tileY: number, hasMine: boolean): void;
  getMapData(): MapCell[][];
}

interface TeamOwned {
  ownerTeam: number;
}

export class MatchStateSystem {
  private readonly alliances = new Map<number, Set<number>>();
  private readonly pendingAllianceRequests = new Set<string>();
  private readonly mineVisibility = new Map<string, MineVisibilityRecord>();

  private matchEnded = false;
  private winningTeams: number[] = [];

  evaluateWinCondition(ownedEntities: Iterable<TeamOwned>): boolean {
    if (this.matchEnded) {
      return false;
    }

    const teams = Array.from(ownedEntities);
    if (teams.length === 0) {
      return false;
    }

    const firstOwner = teams[0]!.ownerTeam;
    if (firstOwner === NEUTRAL_TEAM) {
      return false;
    }

    for (const entity of teams) {
      if (entity.ownerTeam === NEUTRAL_TEAM) {
        return false;
      }
      if (!this.areTeamsAllied(firstOwner, entity.ownerTeam)) {
        return false;
      }
    }

    this.matchEnded = true;
    this.winningTeams = this.getAllianceMembers(firstOwner);
    return true;
  }

  requestAlliance(fromTeam: number, toTeam: number): boolean {
    if (fromTeam === toTeam || this.areTeamsAllied(fromTeam, toTeam)) {
      return false;
    }
    // Manual rule: teams must leave their old alliance before joining a new one.
    if (!this.canFormAlliance(fromTeam, toTeam)) {
      return false;
    }
    this.pendingAllianceRequests.add(this.getAllianceKey(fromTeam, toTeam));
    return true;
  }

  /**
   * Cancel a previously sent alliance request.
   * Returns false when no matching pending request exists.
   */
  cancelAllianceRequest(fromTeam: number, toTeam: number): boolean {
    const key = this.getAllianceKey(fromTeam, toTeam);
    if (!this.pendingAllianceRequests.has(key)) {
      return false;
    }
    this.pendingAllianceRequests.delete(key);
    return true;
  }

  acceptAlliance(toTeam: number, fromTeam: number): boolean {
    const key = this.getAllianceKey(fromTeam, toTeam);
    if (!this.pendingAllianceRequests.has(key)) {
      return false;
    }
    if (!this.canFormAlliance(fromTeam, toTeam)) {
      return false;
    }

    this.pendingAllianceRequests.delete(key);
    this.createAlliance(fromTeam, toTeam);
    return true;
  }

  createAlliance(teamA: number, teamB: number): void {
    if (teamA === teamB) {
      return;
    }
    if (!this.canFormAlliance(teamA, teamB)) {
      return;
    }

    const alliesA = this.alliances.get(teamA) ?? new Set<number>();
    alliesA.add(teamB);
    this.alliances.set(teamA, alliesA);

    const alliesB = this.alliances.get(teamB) ?? new Set<number>();
    alliesB.add(teamA);
    this.alliances.set(teamB, alliesB);
  }

  breakAlliance(teamA: number, teamB: number): void {
    this.alliances.get(teamA)?.delete(teamB);
    this.alliances.get(teamB)?.delete(teamA);
  }

  leaveAlliance(team: number): void {
    const allies = this.alliances.get(team);
    if (!allies) {
      return;
    }

    for (const ally of allies) {
      this.alliances.get(ally)?.delete(team);
    }
    this.alliances.delete(team);
  }

  // ASSUMPTION: alliance graph is non-transitive for now (direct links only).
  areTeamsAllied(teamA: number, teamB: number): boolean {
    if (teamA === teamB) {
      return true;
    }
    if (teamA === NEUTRAL_TEAM || teamB === NEUTRAL_TEAM) {
      return false;
    }
    return this.alliances.get(teamA)?.has(teamB) ?? false;
  }

  placeMineForTeam(
    team: number,
    tileX: number,
    tileY: number,
    world: MineWorldView,
    visibilityOverride?: ReadonlySet<number>
  ): boolean {
    if (world.hasMineAt(tileX, tileY)) {
      return false;
    }

    const visibleToTeams = visibilityOverride
      ? new Set<number>(visibilityOverride)
      : this.getMineVisibilityTeams(team);

    world.setMineAt(tileX, tileY, true);
    this.mineVisibility.set(`${tileX},${tileY}`, {
      ownerTeam: team,
      // ASSUMPTION: mine visibility is snapshot-based at placement time.
      // Pre-alliance mines are not retro-shared; post-break sharing applies only to new mines.
      visibleToTeams,
    });
    return true;
  }

  clearMineVisibilityAt(tileX: number, tileY: number): void {
    this.mineVisibility.delete(`${tileX},${tileY}`);
  }

  getVisibleMineTilesForTeam(
    team: number,
    world: MineWorldView
  ): Array<{x: number; y: number}> {
    const visible: Array<{x: number; y: number}> = [];
    const mapData = world.getMapData();
    for (let y = 0; y < mapData.length; y++) {
      const row = mapData[y]!;
      for (let x = 0; x < row.length; x++) {
        const cell = row[x]!;
        if (!cell.hasMine) {
          continue;
        }

        const visibility = this.mineVisibility.get(`${x},${y}`);
        // ASSUMPTION: mines without visibility metadata (for example map-loaded mines)
        // are treated as globally visible for compatibility.
        if (!visibility || visibility.visibleToTeams.has(team)) {
          visible.push({x, y});
        }
      }
    }
    return visible;
  }

  isMatchEnded(): boolean {
    return this.matchEnded;
  }

  getWinningTeams(): number[] {
    return [...this.winningTeams];
  }

  private getAllianceMembers(team: number): number[] {
    const members = new Set<number>([team]);
    const allies = this.alliances.get(team);
    if (allies) {
      for (const ally of allies) {
        members.add(ally);
      }
    }
    return Array.from(members).sort((a, b) => a - b);
  }

  /**
   * Classic behavior: a team can only be in one alliance pairing at a time.
   *
   * Existing A<->B alliances may be re-requested/re-accepted idempotently,
   * but A cannot join C until A leaves B.
   */
  private canFormAlliance(teamA: number, teamB: number): boolean {
    return this.canTeamJoinAlliance(teamA, teamB) && this.canTeamJoinAlliance(teamB, teamA);
  }

  private canTeamJoinAlliance(team: number, targetTeam: number): boolean {
    const allies = this.alliances.get(team);
    if (!allies || allies.size === 0) {
      return true;
    }
    return allies.size === 1 && allies.has(targetTeam);
  }

  private getMineVisibilityTeams(team: number): Set<number> {
    const visibleToTeams = new Set<number>([team]);
    const allies = this.alliances.get(team);
    if (allies) {
      for (const ally of allies) {
        visibleToTeams.add(ally);
      }
    }
    return visibleToTeams;
  }

  private getAllianceKey(fromTeam: number, toTeam: number): string {
    return `${fromTeam}->${toTeam}`;
  }
}
