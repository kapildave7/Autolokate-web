export const alMotionDurations = {
  fast: 'var(--al-motion-fast)',
  normal: 'var(--al-motion-normal)',
  slow: 'var(--al-motion-slow)',
} as const;

export const alMotionEasings = {
  standard: 'var(--al-motion-ease-standard)',
  emphasized: 'var(--al-motion-ease-emphasized)',
  decelerate: 'var(--al-motion-ease-decelerate)',
} as const;

export const alAnimations = {
  fadeIn: 'al-fade-in',
  slideUp: 'al-slide-up',
  scaleIn: 'al-scale-in',
} as const;

export type AlMotionSpeed = keyof typeof alMotionDurations;
export type AlMotionEasing = keyof typeof alMotionEasings;
export type AlAnimationName = keyof typeof alAnimations;
