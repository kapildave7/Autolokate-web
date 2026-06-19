export type AlScreenSpinnerProps = {
  className?: string;
  /** Figma purchase loaders — 60px default (R04, R09). */
  size?: 'lg' | 'md';
  /** R09 — rotating partial arc; R04 uses a static full ring. */
  animated?: boolean;
  /** `emergency` — red SOS sending ring (Figma 1177:2545). */
  tone?: 'default' | 'emergency';
  'aria-label'?: string;
};
