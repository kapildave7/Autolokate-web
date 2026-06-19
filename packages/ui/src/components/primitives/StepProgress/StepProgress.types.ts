import type { HTMLAttributes } from 'react';

export type AlStepProgressProps = HTMLAttributes<HTMLDivElement> & {
  step: number;
  total?: number;
  label?: string;
  /** When true, renders optional label + step count above the track. Figma default is track-only. */
  showMeta?: boolean;
  /** When false, hides the numeric count (e.g. when label is "Step 3 of 5"). */
  showCount?: boolean;
};
