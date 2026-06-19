import type { ReactNode } from 'react';

export type AlRelationGridOption<T extends string = string> = {
  id: T;
  label: string;
  icon: ReactNode;
};

export type AlRelationGridProps<T extends string = string> = {
  label?: string;
  value?: T;
  options: readonly AlRelationGridOption<T>[];
  onChange?: (value: T) => void;
  disabled?: boolean;
  className?: string;
};
