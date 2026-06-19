import { LOGO_ASPECT_RATIO, type BrandLogoProps } from '../types.js';

const DEFAULT_LABEL = 'Autolokate';
const LOGO_SRC = new URL('../assets/autolokate_dark.png', import.meta.url).href;

export function AlLogo({
  size = 120,
  className,
  'aria-label': ariaLabel = DEFAULT_LABEL,
  variant = 'light',
}: BrandLogoProps) {
  const height = typeof size === 'number' ? size / LOGO_ASPECT_RATIO : undefined;

  return (
    <img
      src={LOGO_SRC}
      width={size}
      height={height}
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
