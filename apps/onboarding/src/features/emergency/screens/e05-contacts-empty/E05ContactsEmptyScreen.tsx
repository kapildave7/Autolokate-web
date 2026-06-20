import { AlIcon } from '@autolokate/icons';
import { AlText } from '@autolokate/ui';

import { EmptyStateHero } from '@/components/compositions/index.js';
import { FlowStepShell } from '@/components/flow-step-shell/index.js';
import { E0_CONTACTS_EMPTY_DESCRIPTION } from '../../emergency-limits.js';
import type { EmergencyScreenNavigationProps } from '../../types.js';

import '../../emergency.css';

export type E05ContactsEmptyScreenProps = EmergencyScreenNavigationProps & {
  description?: string;
};

/** E0 · No contacts — Figma 373:37 */
export function E05ContactsEmptyScreen({
  description = E0_CONTACTS_EMPTY_DESCRIPTION,
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
      footerSecondaryFirst
    >
      <div className="ob-emergency-empty-state">
        <EmptyStateHero
          icon={
            <div className="ob-emergency-hero-icon">
              <AlIcon name="users" size={48} aria-hidden />
            </div>
          }
          message={<p className="ob-emergency-hero-message">No contacts yet</p>}
        />
        <div className="ob-emergency-trust-row">
          <AlIcon name="shield-check" size={16} aria-hidden />
          <AlText tone="muted" className="ob-emergency-trust-row__text">
            Encrypted · only used to reach them in a crash
          </AlText>
        </div>
      </div>
    </FlowStepShell>
  );
}
