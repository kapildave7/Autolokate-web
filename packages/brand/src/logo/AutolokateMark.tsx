import { type BrandLogoProps } from '../types.js';

const DEFAULT_LABEL = 'Autolokate';
const LOGO_SRC = new URL('../assets/autolokate_dark.png', import.meta.url).href;

export function AlBrandMark({
  size = 32,
  className,
  'aria-label': ariaLabel = DEFAULT_LABEL,
  variant = 'light',
}: BrandLogoProps) {
  return (
    <img
      src={LOGO_SRC}
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={ariaLabel}
      draggable={false}
      style={{
        display: 'block',
        objectFit: 'contain',
        filter: variant === 'dark' ? 'brightness(0) invert(1)' : undefined,
      }}
    />
  );
}
