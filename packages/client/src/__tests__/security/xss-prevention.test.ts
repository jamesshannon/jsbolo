/**
 * Security Audit — XSS Prevention Tests
 *
 * Covers: S5 (debug overlay mapName XSS), S6 (debug overlay terrainInfo XSS).
 */

import {describe, it, expect, beforeEach, afterEach} from 'vitest';
import {DebugOverlay} from '../../debug/debug-overlay.js';

describe('Security: XSS Prevention', () => {
  let overlay: DebugOverlay;

  beforeEach(() => {
    overlay = new DebugOverlay();
    // Enable the overlay so update() actually renders
    overlay.toggle();
  });

  afterEach(() => {
    overlay.destroy();
  });

  describe('S5: Debug overlay mapName XSS', () => {
    it('should escape HTML in mapName', () => {
      const maliciousName = '<img src=x onerror=alert(1)>';

      overlay.update({
        mapName: maliciousName,
      });

      const overlayEl = document.getElementById('debug-overlay');
      expect(overlayEl).not.toBeNull();

      // The raw HTML should NOT contain an unescaped <img> tag
      const html = overlayEl!.innerHTML;
      expect(html).not.toContain('<img');
      expect(html).toContain('&lt;img');
    });

    it('should escape script tags in mapName', () => {
      const maliciousName = '<script>alert("xss")</script>';

      overlay.update({
        mapName: maliciousName,
      });

      const overlayEl = document.getElementById('debug-overlay');
      const html = overlayEl!.innerHTML;
      expect(html).not.toContain('<script>');
      expect(html).toContain('&lt;script&gt;');
    });
  });

  describe('S6: Debug overlay terrainInfo XSS', () => {
    it('should escape HTML in terrain type name', () => {
      const maliciousTerrain = '<div onmouseover=alert(1)>GRASS</div>';

      overlay.update({
        terrainInfo: {
          terrain: maliciousTerrain,
          life: 1,
          hasMine: false,
        },
      });

      const overlayEl = document.getElementById('debug-overlay');
      const html = overlayEl!.innerHTML;
      expect(html).not.toContain('<div onmouseover');
      expect(html).toContain('&lt;div');
    });
  });

  describe('Safe values pass through correctly', () => {
    it('should display normal mapName without corruption', () => {
      overlay.update({
        mapName: 'Everard Island',
      });

      const overlayEl = document.getElementById('debug-overlay');
      const html = overlayEl!.innerHTML;
      expect(html).toContain('Everard Island');
    });

    it('should display normal terrain type without corruption', () => {
      overlay.update({
        terrainInfo: {
          terrain: 'GRASS',
          life: 1,
          hasMine: false,
        },
      });

      const overlayEl = document.getElementById('debug-overlay');
      const html = overlayEl!.innerHTML;
      expect(html).toContain('GRASS');
    });
  });
});
