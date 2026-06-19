import type { ReactNode } from 'react';

export type AlScenePhotoCardState = 'empty' | 'filled' | 'capturing';

export type AlScenePhotoCardVariant = 'square' | 'stacked' | 'wide';

export type AlScenePhotoCardProps = {
  label: string;
  state?: AlScenePhotoCardState;
  variant?: AlScenePhotoCardVariant;
  imageUrl?: string | null;
  onCapture?: () => void;
  className?: string;
  icon?: ReactNode;
};
