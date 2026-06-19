import type { HTMLAttributes } from 'react';

export type AlStatusPillVariant = 'protected' | 'attention' | 'alert';

export type AlStatusPillProps = HTMLAttributes<HTMLSpanElement> & {
  label: string;
  variant: AlStatusPillVariant;
};
