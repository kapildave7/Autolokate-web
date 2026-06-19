import type { ReactNode } from 'react';

export type AlScannerHubCardVariant = 'park-me' | 'emergency';

export type AlScannerHubCardProps = {
  variant: AlScannerHubCardVariant;
  title: string;
  subtitle: string;
  icon: ReactNode;
  chevron?: ReactNode;
  onSelect: () => void;
  className?: string;
};
