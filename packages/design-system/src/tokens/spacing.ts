/**
 * Autolokate spacing, radius, elevation, material, and layout tokens.
 * Figma Foundations: 4px base rhythm, radius sm/md/lg, elevation & glow.
 */

/** Spacing scale — 4px base rhythm */
export const space = {
  '--al-space-xs': '0.25rem',
  '--al-space-sm': '0.5rem',
  '--al-space-md': '0.75rem',
  '--al-space-lg': '1rem',
  '--al-space-xl': '1.5rem',
  '--al-space-xxl': '2rem',
  '--al-space-xxxl': '3rem',
} as const satisfies Record<string, string>;

/** Corner radius tokens — Figma: sm 8, md 12, lg 16, pill 999 */
export const radius = {
  '--al-radius-sm': '0.5rem',
  '--al-radius-md': '0.75rem',
  '--al-radius-lg': '1rem',
  '--al-radius-xl': '1.25rem',
  '--al-radius-control': '0.75rem',
  '--al-radius-pill': '9999px',
  '--al-radius-segment': '0.125rem',
} as const satisfies Record<string, string>;

/** Elevation & glow shadows from Figma Elevation & Material */
export const elevation = {
  '--al-elevation-flat': 'none',
  '--al-elevation-raised': '0 8px 24px rgba(0, 0, 0, 0.35)',
  '--al-shadow-nav': '0 10px 28px -4px rgba(0, 0, 0, 0.45)',
  '--al-glow-protected': '0 0 26px rgba(31, 162, 74, 0.55)',
  '--al-glow-attention': '0 0 26px rgba(245, 166, 35, 0.55)',
  '--al-glow-emergency': '0 0 26px rgba(229, 52, 42, 0.6)',
} as const satisfies Record<string, string>;

/** Semantic shadow aliases used by components. */
export const shadow = {
  '--al-shadow-none': 'var(--al-elevation-flat)',
  '--al-shadow-sm': '0 2px 8px rgba(0, 0, 0, 0.12)',
  '--al-shadow-md': 'var(--al-elevation-raised)',
  '--al-shadow-lg': '0 16px 32px rgba(0, 0, 0, 0.35)',
  '--al-shadow-plate': '0 6px 18px -4px rgba(0, 0, 0, 0.35)',
} as const satisfies Record<string, string>;

/**
 * Translucent material tiers for glass surfaces.
 * Blur values are in px; opacity as a unitless fraction for CSS.
 */
export const material = {
  '--al-material-ultra-thin-blur': '12px',
  '--al-material-ultra-thin-opacity': '0.8',
  '--al-material-thin-blur': '20px',
  '--al-material-thin-opacity': '0.7',
  '--al-material-regular-blur': '30px',
  '--al-material-regular-opacity': '0.64',
  '--al-material-thick-blur': '40px',
  '--al-material-thick-opacity': '0.55',
} as const satisfies Record<string, string>;

/** Border widths */
export const border = {
  '--al-border-width-thin': '1px',
  '--al-border-width-thick': '2px',
} as const satisfies Record<string, string>;

/**
 * Figma component dimensions — pixel-accurate specs from Consumer App DS.
 */
export const component = {
  '--al-comp-button-height': '3.625rem',
  '--al-comp-button-radius': '1rem',
  '--al-comp-button-padding-x': '1.5rem',
  '--al-comp-button-font-size': '1rem',
  '--al-comp-button-line-height': '1.25rem',
  '--al-comp-spinner-size': '1.25rem',
  '--al-comp-spinner-stroke': '2.5px',
  '--al-comp-toggle-width': '2.875rem',
  '--al-comp-toggle-height': '1.75rem',
  '--al-comp-toggle-knob': '1.375rem',
  '--al-comp-chip-padding-y': '0.25rem',
  '--al-comp-chip-padding-x': '0.75rem',
  '--al-comp-chip-gap': '0.5rem',
  '--al-comp-chip-dot': '0.5rem',
  '--al-comp-status-pill-padding-y': '0.25rem',
  '--al-comp-status-pill-padding-x': '0.75rem',
  '--al-comp-bottom-nav-width': '22.0625rem',
  '--al-comp-bottom-nav-height': '4rem',
  '--al-comp-bottom-nav-radius': '1rem',
  '--al-comp-input-height': '3.875rem',
  '--al-comp-text-field-radius': '0.75rem',
  '--al-comp-input-radius': '1rem',
  '--al-comp-otp-cell-height': '3.75rem',
  '--al-comp-otp-gap': '0.625rem',
  '--al-comp-otp-digit-size': '1.375rem',
  '--al-comp-quick-action-width': '6.875rem',
  '--al-comp-quick-action-padding-y': '1rem',
  '--al-comp-quick-action-gap': '0.625rem',
  '--al-comp-step-track-height': '0.375rem',
  '--al-comp-step-segment-height': '0.25rem',
  '--al-comp-step-segment-gap': '0.375rem',
  '--al-comp-field-gap': '0.125rem',
  '--al-comp-avatar-md': '2.875rem',
  '--al-comp-avatar-icon-md': '1.375rem',
  '--al-comp-plate-input-height': '3.875rem',
  '--al-comp-plate-input-radius': '0.75rem',
  '--al-comp-plate-input-padding-left': '1.125rem',
  '--al-comp-plate-digit-size': '1.5rem',
  '--al-comp-plate-divider-width': '0.125rem',
  '--al-comp-plate-divider-height': '1.625rem',
  '--al-comp-plan-card-width': '16.875rem',
  '--al-comp-plan-card-radius': '1.25rem',
  '--al-comp-plan-card-padding-y': '1.125rem',
  '--al-comp-plan-card-padding-x': '1.25rem',
  '--al-comp-plan-card-gap': '0.875rem',
  '--al-comp-plan-feature-gap': '0.5625rem',
  '--al-comp-plan-badge-font-size': '0.6875rem',
  '--al-comp-plan-includes-font-size': '0.75rem',
  '--al-comp-plan-selected-icon': '1.5rem',
  '--al-comp-vehicle-rc-radius': '1rem',
  '--al-comp-vehicle-rc-padding': '1rem',
  '--al-comp-vehicle-rc-gap': '1rem',
  '--al-comp-vehicle-rc-row-gap': '0.8125rem',
  '--al-comp-vehicle-rc-col-gap': '1rem',
  '--al-comp-vehicle-rc-plate-size': '1.8125rem',
  '--al-comp-vehicle-rc-badge-size': '1.875rem',
  '--al-comp-vehicle-rc-badge-radius': '0.4375rem',
  '--al-comp-screen-bg-tint-size': '45rem',
  '--al-comp-screen-bg-tint-offset-y': '7%',
} as const satisfies Record<string, string>;

/**
 * Layout constants — scaffold margins, touch targets.
 */
export const layout = {
  '--al-layout-content-margin': 'var(--al-space-lg)',
  '--al-layout-section-gap': 'var(--al-space-xl)',
  '--al-layout-control-height-sm': '2.25rem',
  '--al-layout-control-height-md': '2.75rem',
  '--al-layout-control-height-lg': '3.625rem',
  '--al-layout-touch-target-min': '3rem',
  '--al-layout-touch-target-sos': '4.5rem',
  '--al-layout-icon-sm': '1.25rem',
  '--al-layout-icon-md': '1.5rem',
  '--al-layout-icon-lg': '1.75rem',
  '--al-layout-icon-hero-min': '6rem',
  '--al-layout-icon-hero-max': '10rem',
} as const satisfies Record<string, string>;

/** Flat spacing token map for CSS variable injection. */
export const spacing = {
  ...space,
  ...radius,
  ...elevation,
  ...shadow,
  ...material,
  ...border,
  ...component,
  ...layout,
} as const satisfies Record<string, string>;

export type SpaceToken = keyof typeof space;
export type RadiusToken = keyof typeof radius;
export type ElevationToken = keyof typeof elevation;
export type ShadowToken = keyof typeof shadow;
export type MaterialToken = keyof typeof material;
export type ComponentToken = keyof typeof component;
export type LayoutToken = keyof typeof layout;
export type SpacingToken = keyof typeof spacing;
