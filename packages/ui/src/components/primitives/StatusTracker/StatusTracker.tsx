import { cn } from '../../../utils/cn.js';
import { AlDispatchTimeline } from '../DispatchTimeline/DispatchTimeline.js';

import type { AlStatusTrackerProps } from './StatusTracker.types.js';
import './StatusTracker.css';

/** Figma 1063:2427 + CC tracker — vehicle chip + timeline. */
export function AlStatusTracker({
  plate,
  model,
  steps,
  variant = 'park-me',
  className,
}: AlStatusTrackerProps) {
  return (
    <div className={cn('al-status-tracker', className)}>
      <div className="al-status-tracker__vehicle">
        <span className="al-status-tracker__vehicle-icon" aria-hidden>
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <path
              d="M5 17h2M17 17h2M3 11l2-5h14l2 5M5 11v6h14v-6"
              stroke="#FFFFFF"
              strokeWidth={1.75}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <div className="al-status-tracker__vehicle-copy">
          <p className="al-status-tracker__plate">{plate}</p>
          <p className="al-status-tracker__model">{model}</p>
        </div>
      </div>
      <AlDispatchTimeline steps={steps} variant={variant} />
    </div>
  );
}
