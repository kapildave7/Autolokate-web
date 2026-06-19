import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

export type AlChipVariant = 'green' | 'amber' | 'neutral';

type AlChipSharedProps = {
  variant?: AlChipVariant;
  label?: string;
  icon?: ReactNode;
};

export type AlChipSpanProps = AlChipSharedProps &
  Omit<HTMLAttributes<HTMLSpanElement>, 'onClick'> & {
    onClick?: undefined;
  };

export type AlChipButtonProps = AlChipSharedProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
    onClick: ButtonHTMLAttributes<HTMLButtonElement>['onClick'];
  };

export type AlChipProps = AlChipSpanProps | AlChipButtonProps;
