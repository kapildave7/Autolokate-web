import { IconSvg } from '../IconSvg.js';
import type { IconProps } from '../types.js';

export function CircleXIcon(props: IconProps) {
  return (
    <IconSvg {...props}>
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#E5342A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15 9L9 15" stroke="#E5342A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 9L15 15" stroke="#E5342A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </IconSvg>
  );
}
