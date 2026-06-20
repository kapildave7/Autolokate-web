import type { InputHTMLAttributes } from 'react';

export type AlCheckboxLayout = 'default' | 'icon-only';

export type AlCheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> & {
  label: string;
  helperText?: string;
  errorText?: string;
  /** Icon-only hides visible label; copy lives in a sibling (e.g. InlineConsentBlock). */
  layout?: AlCheckboxLayout;
};
