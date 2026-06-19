import type { InputHTMLAttributes } from 'react';

export type AlToggleProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> & {
  label?: string;
  helperText?: string;
  loading?: boolean;
};
