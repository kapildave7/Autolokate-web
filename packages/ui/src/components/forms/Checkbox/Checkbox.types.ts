import type { InputHTMLAttributes } from 'react';

export type AlCheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> & {
  label: string;
  helperText?: string;
  errorText?: string;
};
