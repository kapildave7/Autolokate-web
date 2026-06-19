import type { HTMLAttributes, ReactNode } from 'react';

export type StatusBarProps = HTMLAttributes<HTMLDivElement> & {
  time?: string;
  icons?: ReactNode;
};
