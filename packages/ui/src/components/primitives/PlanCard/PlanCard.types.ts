import type { HTMLAttributes, ReactNode } from 'react';

export type AlPlanCardAddon = {
  label: string;
};

export type AlPlanCardProps = Omit<HTMLAttributes<HTMLElement>, 'onSelect'> & {
  name: string;
  price: string;
  features: string[];
  badge?: string;
  includesLabel?: string;
  addon?: AlPlanCardAddon;
  selected?: boolean;
  featureIcon?: ReactNode;
  selectedIcon?: ReactNode;
  onSelect?: () => void;
};
