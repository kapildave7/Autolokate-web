/**
 * Autolokate typography tokens.
 * Single UI family: Inter (Figma Foundations RC2).
 */

/** Font family primitives — Inter for all roles; token names kept for compatibility. */
export const fontFamily = {
  '--al-font-family-sans': '"Inter", system-ui, sans-serif',
  '--al-font-family-ui': '"Inter", system-ui, sans-serif',
  '--al-font-family-mono': '"Inter", system-ui, sans-serif',
  '--al-text-sans-family': '"Inter", system-ui, sans-serif',
  '--al-text-ui-family': '"Inter", system-ui, sans-serif',
  '--al-text-mono-family': '"Inter", system-ui, sans-serif',
} as const satisfies Record<string, string>;

/**
 * Semantic text roles from THEMING.md §2.
 * Each role exposes size, line-height, and weight as CSS variables.
 */
export const textDisplay = {
  '--al-text-display-size': '2.25rem',
  '--al-text-display-line-height': '2.75rem',
  '--al-text-display-weight': '700',
  '--al-text-display-letter-spacing': '-0.02em',
} as const satisfies Record<string, string>;

export const textHeadline = {
  '--al-text-headline-size': '1.75rem',
  '--al-text-headline-line-height': '2.25rem',
  '--al-text-headline-weight': '700',
  '--al-text-headline-letter-spacing': '-0.01em',
} as const satisfies Record<string, string>;

export const textTitle = {
  '--al-text-title-size': '1.375rem',
  '--al-text-title-line-height': '1.75rem',
  '--al-text-title-weight': '600',
  '--al-text-title-letter-spacing': '-0.01em',
} as const satisfies Record<string, string>;

export const textBodyLarge = {
  '--al-text-body-large-size': '1.0625rem',
  '--al-text-body-large-line-height': '1.5rem',
  '--al-text-body-large-weight': '400',
  '--al-text-body-large-letter-spacing': '0em',
} as const satisfies Record<string, string>;

export const textBody = {
  '--al-text-body-size': '1rem',
  '--al-text-body-line-height': '1.5rem',
  '--al-text-body-weight': '400',
  '--al-text-body-letter-spacing': '0em',
} as const satisfies Record<string, string>;

export const textLabel = {
  '--al-text-label-size': '0.8125rem',
  '--al-text-label-line-height': '1.125rem',
  '--al-text-label-weight': '500',
  '--al-text-label-letter-spacing': '0.01em',
} as const satisfies Record<string, string>;

export const textCaption = {
  '--al-text-caption-size': '0.75rem',
  '--al-text-caption-line-height': '1rem',
  '--al-text-caption-weight': '400',
  '--al-text-caption-letter-spacing': '0.01em',
} as const satisfies Record<string, string>;

export const textMono = {
  '--al-text-mono-size': '0.9375rem',
  '--al-text-mono-line-height': '1.375rem',
  '--al-text-mono-weight': '500',
  '--al-text-mono-letter-spacing': '0.02em',
} as const satisfies Record<string, string>;

/** Shared typography primitives for fine-grained control when needed. */
export const typographyPrimitives = {
  '--al-font-weight-regular': '400',
  '--al-font-weight-medium': '500',
  '--al-font-weight-semibold': '600',
  '--al-font-weight-bold': '700',
  '--al-font-feature-tabular': '"tnum" on, "lnum" on',
} as const satisfies Record<string, string>;

/** Flat typography token map for CSS variable injection. */
export const typography = {
  ...fontFamily,
  ...textDisplay,
  ...textHeadline,
  ...textTitle,
  ...textBodyLarge,
  ...textBody,
  ...textLabel,
  ...textCaption,
  ...textMono,
  ...typographyPrimitives,
} as const satisfies Record<string, string>;

export type FontFamilyToken = keyof typeof fontFamily;
export type TextRoleToken =
  | keyof typeof textDisplay
  | keyof typeof textHeadline
  | keyof typeof textTitle
  | keyof typeof textBodyLarge
  | keyof typeof textBody
  | keyof typeof textLabel
  | keyof typeof textCaption
  | keyof typeof textMono;
export type TypographyToken = keyof typeof typography;
