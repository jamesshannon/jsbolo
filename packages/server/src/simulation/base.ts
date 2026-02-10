/**
 * Base (refueling/resupply station) simulation
 */

import {
  TILE_SIZE_WORLD,
  BASE_STARTING_ARMOR,
  BASE_STARTING_SHELLS,
  BASE_STARTING_MINES,
  TANK_MAX_ARMOR,
  TANK_MAX_SHELLS,
  TANK_MAX_MINES,
} from '@jsbolo/shared';

export class ServerBase {
  id: number;
  tileX: number;
  tileY: number;
  armor: number;
  shells: number;
  mines: number;
  ownerTeam: number; // 255 = neutral

  private static nextId = 1;
  private refuelCooldown = 0; // Ticks between refueling

  constructor(tileX: number, tileY: number, ownerTeam = 255) {
    this.id = ServerBase.nextId++;
    this.tileX = tileX;
    this.tileY = tileY;
    this.armor = BASE_STARTING_ARMOR;
    this.shells = BASE_STARTING_SHELLS;
    this.mines = BASE_STARTING_MINES;
    this.ownerTeam = ownerTeam;
  }

  /**
   * Update base state
   */
  update(): void {
    if (this.refuelCooldown > 0) {
      this.refuelCooldown--;
    }
  }

  /**
   * Check if base can refuel a tank
   */
  canRefuel(): boolean {
    return (
      this.refuelCooldown === 0 &&
      this.armor > 0 &&
      (this.shells > 0 || this.mines > 0)
    );
  }

  /**
   * Refuel a tank (transfer resources)
   * Returns true if any resources were transferred
   */
  refuelTank(tank: {
    armor: number;
    shells: number;
    mines: number;
    team: number;
  }): boolean {
    // Only refuel friendly tanks (or neutral base refuels anyone)
    if (this.ownerTeam !== 255 && tank.team !== this.ownerTeam) {
      return false;
    }

    let transferred = false;

    // Transfer armor (1 per tick when near base)
    if (tank.armor < TANK_MAX_ARMOR && this.armor > 0) {
      const amount = Math.min(1, TANK_MAX_ARMOR - tank.armor, this.armor);
      tank.armor += amount;
      this.armor -= amount;
      transferred = true;
    }

    // Transfer shells (1 per tick when near base)
    if (tank.shells < TANK_MAX_SHELLS && this.shells > 0) {
      const amount = Math.min(1, TANK_MAX_SHELLS - tank.shells, this.shells);
      tank.shells += amount;
      this.shells -= amount;
      transferred = true;
    }

    // Transfer mines (1 per tick when near base)
    if (tank.mines < TANK_MAX_MINES && this.mines > 0) {
      const amount = Math.min(1, TANK_MAX_MINES - tank.mines, this.mines);
      tank.mines += amount;
      this.mines -= amount;
      transferred = true;
    }

    if (transferred) {
      this.refuelCooldown = 2; // Small cooldown between transfers
    }

    return transferred;
  }

  /**
   * Take damage from a shell
   */
  takeDamage(damage: number): boolean {
    this.armor -= damage;
    return this.armor <= 0; // Return true if destroyed
  }

  /**
   * Check if base is dead
   */
  isDead(): boolean {
    return this.armor <= 0;
  }

  /**
   * Capture base by a team
   */
  capture(team: number): void {
    this.ownerTeam = team;
  }

  /**
   * Get world position (center of tile)
   */
  getWorldPosition(): {x: number; y: number} {
    return {
      x: (this.tileX + 0.5) * TILE_SIZE_WORLD,
      y: (this.tileY + 0.5) * TILE_SIZE_WORLD,
    };
  }

  /**
   * Check if a tank is in range for refueling
   */
  isTankInRange(tankX: number, tankY: number, range: number): boolean {
    const pos = this.getWorldPosition();
    const dx = tankX - pos.x;
    const dy = tankY - pos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < range;
  }
}
