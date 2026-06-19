import type { InputHTMLAttributes, ReactNode } from 'react';

export type AlTextFieldState = 'default' | 'error' | 'success' | 'disabled';

export type AlTextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  label?: string;
  helperText?: string;
  errorText?: string;
  prefix?: ReactNode;
  state?: AlTextFieldState;
  loading?: boolean;
};
