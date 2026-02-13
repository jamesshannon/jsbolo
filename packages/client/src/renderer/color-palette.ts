export type HudColorMode = 'default' | 'colorblind';

export interface RelationPalette {
  self: string;
  friendly: string;
  hostile: string;
  neutral: string;
}

export function getRelationPalette(mode: HudColorMode): RelationPalette {
  if (mode === 'colorblind') {
    return {
      self: '#f5f5f5',
      friendly: '#3a7bff',
      hostile: '#ff9a2f',
      neutral: '#d7bf2f',
    };
  }

  return {
    self: '#0a0a0a',
    friendly: '#26d93b',
    hostile: '#de2f2f',
    neutral: '#d7bf2f',
  };
}
