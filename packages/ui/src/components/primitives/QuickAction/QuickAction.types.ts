import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type AlQuickActionProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  icon: ReactNode;
  loading?: boolean;
};
