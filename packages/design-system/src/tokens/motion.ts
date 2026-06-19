/** Autolokate motion primitives and transition tokens. */
export const motionDuration = {
  '--al-motion-fast': '120ms',
  '--al-motion-standard': '250ms',
  '--al-motion-normal': '250ms',
  '--al-motion-slow': '360ms',
} as const satisfies Record<string, string>;

export const motionEasing = {
  '--al-motion-ease-standard': 'cubic-bezier(0.2, 0, 0, 1)',
  '--al-motion-ease-emphasized': 'cubic-bezier(0.2, 0, 0, 0.9)',
  '--al-motion-ease-decelerate': 'cubic-bezier(0, 0, 0, 1)',
} as const satisfies Record<string, string>;

export const motionScale = {
  '--al-motion-scale-press': '0.97',
} as const satisfies Record<string, string>;

export const motion = {
  ...motionDuration,
  ...motionEasing,
  ...motionScale,
} as const satisfies Record<string, string>;

export type MotionDurationToken = keyof typeof motionDuration;
export type MotionEasingToken = keyof typeof motionEasing;
export type MotionScaleToken = keyof typeof motionScale;
export type MotionToken = keyof typeof motion;
