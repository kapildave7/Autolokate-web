import type { HTMLAttributes, ReactNode } from 'react';

export type AlBottomNavItem = {
  id: string;
  label: string;
  icon?: ReactNode;
  active?: boolean;
  onClick?: () => void;
};

export type AlBottomNavProps = HTMLAttributes<HTMLElement> & {
  items: AlBottomNavItem[];
};
