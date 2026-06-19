import { AlIcon } from '@autolokate/icons';
import { AlText } from '@autolokate/ui';

import { EmptyStateHero } from '../../../../components/compositions/index.js';
import { FlowStepShell } from '../../../../components/flow-step-shell/index.js';
import { DEFAULT_PURCHASE_PLAN_ID } from '../../../qr-purchase/data/purchase-plans.js';
import { getContactsEmptyDescription } from '../../emergency-limits.js';
import type { EmergencyScreenNavigationProps } from '../../types.js';

import '../../emergency.css';

export type E05ContactsEmptyScreenProps = EmergencyScreenNavigationProps & {
  description?: string;
};

const defaultContactsDescription = getContactsEmptyDescription(DEFAULT_PURCHASE_PLAN_ID);

/** E0 · No contacts — Figma 373:37 */
export function E05ContactsEmptyScreen({
  description = defaultContactsDescription,
  onContinue,
  onBack,
  showBack = true,
  footerSecondaryLabel = 'Enter a number instead',
  onFooterSecondary,
}: E05ContactsEmptyScreenProps) {
  return (
    <FlowStepShell
      phase="emergency"
      step={6}
      title="Who should we call?"
      description={description}
      footerLabel="Add from contacts"
      hideProgress
      showBack={showBack}
      onBack={onBack}
      onContinue={onContinue}
      footerSecondaryLabel={footerSecondaryLabel}
      onFooterSecondary={onFooterSecondary}
    >
      <EmptyStateHero
        icon={
          <div className="ob-emergency-hero-icon">
            <AlIcon name="users" size={48} aria-hidden />
          </div>
        }
        message="No contacts yet"
      />
      <div className="ob-emergency-trust-row">
        <AlIcon name="shield-check" size={16} aria-hidden />
        <AlText variant="caption" tone="muted">
          Encrypted · only used to reach them in a crash
        </AlText>
      </div>
    </FlowStepShell>
  );
}
