export class RespawnSystem {
  private readonly respawnByEntityId = new Map<number, number>();

  schedule(entityId: number, currentTick: number, delayTicks: number): void {
    this.respawnByEntityId.set(entityId, currentTick + delayTicks);
  }

  shouldRespawn(entityId: number, currentTick: number): boolean {
    const respawnAt = this.respawnByEntityId.get(entityId);
    if (respawnAt === undefined) {
      return false;
    }
    return currentTick >= respawnAt;
  }

  clear(entityId: number): void {
    this.respawnByEntityId.delete(entityId);
  }
}
