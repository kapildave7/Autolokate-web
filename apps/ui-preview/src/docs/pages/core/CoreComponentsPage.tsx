import type { CoreComponentPageId } from '../../types.js';

import { AlAvatarPage } from './AlAvatarPage.js';
import { AlBottomNavPage } from './AlBottomNavPage.js';
import { AlButtonPage } from './AlButtonPage.js';
import { AlCheckboxPage } from './AlCheckboxPage.js';
import { AlChipPage } from './AlChipPage.js';
import { AlFieldPage } from './AlFieldPage.js';
import { AlInputPage } from './AlInputPage.js';
import { AlOtpInputPage } from './AlOtpInputPage.js';
import { AlPlanCardPage } from './AlPlanCardPage.js';
import { AlPlateInputPage } from './AlPlateInputPage.js';
import { AlQuickActionPage } from './AlQuickActionPage.js';
import { AlStatusPillPage } from './AlStatusPillPage.js';
import { AlStepProgressPage } from './AlStepProgressPage.js';
import { AlTextFieldPage } from './AlTextFieldPage.js';
import { AlTogglePage } from './AlTogglePage.js';
import { AlVehicleRcCardPage } from './AlVehicleRcCardPage.js';
import { LayoutComponentPage } from './LayoutComponentPage.js';
import { StatusBarPage } from './StatusBarPage.js';

const layoutPages = new Set<CoreComponentPageId>([
  'core-text',
  'core-heading',
  'core-stack',
  'core-grid',
  'core-container',
  'core-divider',
  'core-icon-button',
]);

type LayoutComponentPageId =
  | 'core-text'
  | 'core-heading'
  | 'core-stack'
  | 'core-grid'
  | 'core-container'
  | 'core-divider'
  | 'core-icon-button';

export function CoreComponentsPage({ page }: { page: CoreComponentPageId }) {
  if (layoutPages.has(page)) {
    return <LayoutComponentPage page={page as LayoutComponentPageId} />;
  }

  switch (page) {
    case 'core-button':
      return <AlButtonPage />;
    case 'core-status-pill':
      return <AlStatusPillPage />;
    case 'core-text-field':
      return <AlTextFieldPage />;
    case 'core-input':
      return <AlInputPage />;
    case 'core-otp-input':
      return <AlOtpInputPage />;
    case 'core-toggle':
      return <AlTogglePage />;
    case 'core-checkbox':
      return <AlCheckboxPage />;
    case 'core-chip':
      return <AlChipPage />;
    case 'core-plate-input':
      return <AlPlateInputPage />;
    case 'core-plan-card':
      return <AlPlanCardPage />;
    case 'core-vehicle-rc-card':
      return <AlVehicleRcCardPage />;
    case 'core-avatar':
      return <AlAvatarPage />;
    case 'core-field':
      return <AlFieldPage />;
    case 'core-quick-action':
      return <AlQuickActionPage />;
    case 'core-step-progress':
      return <AlStepProgressPage />;
    case 'core-bottom-nav':
      return <AlBottomNavPage />;
    case 'core-status-bar':
      return <StatusBarPage />;
    default:
      return <AlButtonPage />;
  }
}
