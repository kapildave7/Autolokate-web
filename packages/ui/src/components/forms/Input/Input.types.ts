import type { InputHTMLAttributes, ReactNode } from 'react';

export type AlInputVariant = 'default' | 'error' | 'success' | 'disabled';

export type AlInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  label?: string;
  helperText?: string;
  errorText?: string;
  mono?: boolean;
  inputClassName?: string;
  trailing?: ReactNode;
  variant?: AlInputVariant;
};
