import { IconSvg } from '../IconSvg.js';
import type { IconProps } from '../types.js';

export function PlusIcon(props: IconProps) {
  return (
    <IconSvg {...props}>
      <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </IconSvg>
  );
}
