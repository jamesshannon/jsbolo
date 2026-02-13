import {describe, expect, it} from 'vitest';
import {HudMessageService} from '../hud-message-service.js';

describe('HudMessageService', () => {
  it('routes alliance messages only to allied/source-team players', () => {
    const service = new HudMessageService();
    const players = [
      {id: 1, tank: {team: 1}},
      {id: 2, tank: {team: 2}},
      {id: 3, tank: {team: 3}},
    ];

    service.publishAlliance({
      tick: 10,
      text: 'alliance-only',
      sourceTeam: 1,
      players,
      areTeamsAllied: (a: number, b: number) => (a === 1 && b === 2) || (a === 2 && b === 1),
    });

    expect(service.drainForPlayer(1)).toHaveLength(1);
    expect(service.drainForPlayer(2)).toHaveLength(1);
    expect(service.drainForPlayer(3)).toHaveLength(0);
  });

  it('routes personal messages only to the targeted player', () => {
    const service = new HudMessageService();
    service.publishPersonal({
      tick: 20,
      text: 'private',
      playerId: 7,
    });

    expect(service.drainForPlayer(7)).toHaveLength(1);
    expect(service.drainForPlayer(8)).toHaveLength(0);
  });

  it('coalesces identical adjacent messages in a short window', () => {
    const service = new HudMessageService();
    service.publishPersonal({
      tick: 100,
      text: 'Builder action failed: cannot place mine here.',
      playerId: 1,
    });
    service.publishPersonal({
      tick: 120,
      text: 'Builder action failed: cannot place mine here.',
      playerId: 1,
    });

    expect(service.drainForPlayer(1)).toEqual([expect.objectContaining({
      text: 'Builder action failed: cannot place mine here. (x2)',
    })]);
  });

  it('expires stale queued messages and seeds recent global context to new players', () => {
    const service = new HudMessageService();
    const players = [{id: 1, tank: {team: 1}}];

    service.publishGlobal({
      tick: 10,
      text: 'Old message',
      players,
    });
    service.publishGlobal({
      tick: 650,
      text: 'Recent message',
      players,
    });

    service.seedPlayerFromRecentGlobal(2, 700);
    const seeded = service.drainForPlayer(2);
    expect(seeded.map(m => m.text)).toEqual(['Recent message']);
  });

  it('drops oldest low-priority messages first when queue overflows', () => {
    const service = new HudMessageService();
    const players = [{id: 1, tank: {team: 1}}];

    // Fill with low-priority status noise first.
    for (let i = 0; i < 40; i++) {
      service.publishPersonal({
        tick: i + 1,
        text: `status-${i}`,
        playerId: 1,
        class: 'system_status',
      });
    }

    // Add normal-priority chat.
    for (let i = 0; i < 24; i++) {
      service.publishGlobal({
        tick: 100 + i,
        text: `chat-${i}`,
        players,
        class: 'chat_global',
      });
    }

    // Overflow with high-priority structure events.
    for (let i = 0; i < 8; i++) {
      service.publishGlobal({
        tick: 200 + i,
        text: `capture-${i}`,
        players,
        class: 'global_notification',
        priority: 'high',
      });
    }

    const drained = service.drainForPlayer(1);
    const allText = drained.map(m => m.text);
    const lowCount = allText.filter(text => text.startsWith('status-')).length;
    const normalCount = allText.filter(text => text.startsWith('chat-')).length;

    expect(drained.length).toBe(64);
    expect(lowCount).toBe(32);
    expect(normalCount).toBe(24);
    expect(allText.filter(text => text.startsWith('capture-'))).toHaveLength(8);
  });
});
