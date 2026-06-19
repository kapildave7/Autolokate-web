import type { SVGProps } from 'react';

/**
 * Shared props for Autolokate SVG icon components.
 * Icons inherit color via currentColor — Figma stroke weight is 2px at 24×24.
 */
export type IconProps = {
  size?: number | string;
  className?: string;
  strokeWidth?: number;
  'aria-label'?: string;
} & Omit<SVGProps<SVGSVGElement>, 'width' | 'height' | 'strokeWidth' | 'color'>;

export const ICON_VIEW_BOX = '0 0 24 24';
export const ICON_DEFAULT_SIZE = 24;
export const ICON_DEFAULT_STROKE_WIDTH = 2;
