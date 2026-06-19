export type AlDispatchTimelineStepState = 'pending' | 'active' | 'complete' | 'error';

export type AlDispatchTimelineActiveGlyph =
  | 'shield-check'
  | 'phone'
  | 'activity'
  | 'triangle-alert';

/** Figma 982:2387 (park-me 24px) · 931:2270 (sos 18px) · 1153:2542 (contacts). */
export type AlDispatchTimelineVariant = 'park-me' | 'sos' | 'contacts';

export type AlDispatchTimelineStep = {
  id: string;
  label: string;
  subtitle: string;
  state: AlDispatchTimelineStepState;
  /** Figma active glyph inside amber disc — defaults to shield-check when active. */
  activeGlyph?: AlDispatchTimelineActiveGlyph;
  /** Figma rail segment height below this step (px). */
  connectorHeight?: number;
};

export type AlDispatchTimelineProps = {
  steps: readonly AlDispatchTimelineStep[];
  /** Typography + glyph scale from Figma CC tracker instances. */
  variant?: AlDispatchTimelineVariant;
  className?: string;
};
