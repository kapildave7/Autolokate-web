import { AlIcon } from '@autolokate/icons';

import { AlOfflineChip, EmptyStateHero } from '../../../../components/compositions/index.js';
import { FlowStepShell } from '../../../../components/flow-step-shell/index.js';
import { DEFAULT_PURCHASE_PLAN_ID } from '../../../qr-purchase/data/purchase-plans.js';
import {
  getEntitledRiderSlots,
  getRiderPromptDescription,
  getRiderPromptOfflineDescription,
} from '../../emergency-limits.js';
import type { EmergencyRiderPromptState, EmergencyScreenNavigationProps } from '../../types.js';

import '../../emergency.css';

export type E01RiderPromptScreenProps = EmergencyScreenNavigationProps & {
  viewState?: EmergencyRiderPromptState;
  description?: string;
};

const defaultRiderDescription = getRiderPromptDescription(
  getEntitledRiderSlots(DEFAULT_PURCHASE_PLAN_ID, 1),
);

/** R0 · Rider prompt — Figma 375:37 */
export function E01RiderPromptScreen({
  viewState = 'default',
  description = defaultRiderDescription,
  onContinue,
  onBack,
  showBack = true,
  footerSecondaryLabel = 'Skip for now',
  onFooterSecondary,
}: E01RiderPromptScreenProps) {
  const isLoading = viewState === 'loading';
  const isError = viewState === 'error';
  const isOffline = viewState === 'offline';

  const resolvedDescription = isError
    ? 'We couldn’t load your rider cover'
    : isOffline
      ? getRiderPromptOfflineDescription()
      : description;

  return (
    <FlowStepShell
      phase="emergency"
      step={1}
      title="Add your rider’s details?"
      description={resolvedDescription}
      footerLabel={isError ? 'Try again' : 'Add rider details'}
      footerLoading={isLoading}
      footerDisabled={isOffline || isLoading}
      hideProgress
      headerAccessory={isOffline ? <AlOfflineChip /> : undefined}
      showBack={showBack}
      onBack={onBack}
      onContinue={onContinue}
      footerSecondaryLabel={footerSecondaryLabel}
      onFooterSecondary={onFooterSecondary}
    >
      <EmptyStateHero
        icon={
          <div className="ob-emergency-hero-icon">
            <AlIcon name="circle-user" size={50} aria-hidden />
          </div>
        }
      />
    </FlowStepShell>
  );
}
