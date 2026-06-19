/** Figma Consumer App icon names from Foundations & Components. */
export type AlIconName =
  | 'house'
  | 'store'
  | 'users'
  | 'circle-user'
  | 'scan-line'
  | 'square-parking'
  | 'receipt-text'
  | 'shield-check'
  | 'chevron-down'
  | 'chevron-right'
  | 'camera'
  | 'activity'
  | 'triangle-alert'
  | 'check'
  | 'bell'
  | 'car'
  | 'fetch-failed-halo'
  | 'payment-success-halo'
  | 'payment-unconfirmed-halo'
  | 'activation-complete-halo'
  | 'heart'
  | 'smile'
  | 'ellipsis'
  | 'phone'
  | 'arrow-left'
  | 'plus'
  | 'user'
  | 'map-pin'
  | 'circle-check'
  | 'circle-x'
  | 'credit-card';

export type AlIconSize = 16 | 20 | 24 | 32 | 48;

export type AlIconProps = {
  name: AlIconName;
  size?: number;
  className?: string | undefined;
  'aria-label'?: string | undefined;
};
