import { IconSvg } from '../IconSvg.js';
import type { IconProps } from '../types.js';

export function ChevronDownIcon(props: IconProps) {
  return (
    <IconSvg {...props}>
      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </IconSvg>
  );
}
