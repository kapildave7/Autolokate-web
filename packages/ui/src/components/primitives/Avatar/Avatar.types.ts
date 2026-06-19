import type { HTMLAttributes, ReactNode } from 'react';

export type AlAvatarSize = 'sm' | 'md' | 'lg';

export type AlAvatarProps = HTMLAttributes<HTMLDivElement> & {
  src?: string;
  alt?: string;
  initials?: string;
  icon?: ReactNode;
  size?: AlAvatarSize;
};
