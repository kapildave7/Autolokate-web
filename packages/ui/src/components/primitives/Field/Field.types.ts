import type { HTMLAttributes, ReactNode } from 'react';

export type AlFieldProps = HTMLAttributes<HTMLDivElement> & {
  label: string;
  value: ReactNode;
  tone?: 'default' | 'muted';
};
