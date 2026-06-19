import type { ReactNode } from 'react';

export type AlPermissionSheetProps = {
  open: boolean;
  title: string;
  description?: string;
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  onDismiss?: () => void;
  children?: ReactNode;
};
