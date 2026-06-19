import type { ReactNode } from 'react';

export type AlContactCardProps = {
  name: string;
  subtitle: string;
  verified?: boolean;
  verifiedLabel?: string;
  avatar?: ReactNode;
  verifiedIcon?: ReactNode;
  className?: string;
};
