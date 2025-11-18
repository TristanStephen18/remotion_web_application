export interface NeonConfig {
  text: string;
  colors: string[];
  timing: {
    flickerDurationInSeconds: number;
  };
  effects: {
    fontSize: number;
    glowPulseMin: number;
    glowPulseMax: number;
    showGrain: boolean;
  };
}

// Default config if one isn't provided
export const defaultNeonConfig: NeonConfig = {
  text: 'NEON FLICKER',
  colors: ['#FF00FF', '#00FFFF', '#FF69B4', '#00FFEA', '#FF0080'],
  timing: {
    flickerDurationInSeconds: 2,
  },
  effects: {
    fontSize: 120,
    glowPulseMin: 5,
    glowPulseMax: 20,
    showGrain: true,
  },
};