import { AlStack } from '@autolokate/ui';

import {
  AddContactRow,
  EmergencyContactRow,
} from '../../../../components/compositions/index.js';
import { FlowStepShell } from '../../../../components/flow-step-shell/index.js';
import type { PurchasePlanId } from '../../../qr-purchase/types-checkout.js';
import {
  canAddEmergencyContact,
  getContactsMaxReachedMessage,
  getContactsSummaryDescription,
  getEmergencyPlanLimits,
} from '../../emergency-limits.js';
import type { EmergencyContact, EmergencyScreenNavigationProps } from '../../types.js';

export type E09ContactsSummaryScreenProps = EmergencyScreenNavigationProps & {
  contacts: EmergencyContact[];
  planId: PurchasePlanId;
  onAddAnother?: () => void;
};

/** E5 · Contacts summary — Figma 373:64 · 717:2237 */
export function E09ContactsSummaryScreen({
  contacts,
  planId,
  onAddAnother,
  onContinue,
  onBack,
  showBack = true,
}: E09ContactsSummaryScreenProps) {
  const count = contacts.length;
  const { maxEmergencyContacts, minEmergencyContacts } = getEmergencyPlanLimits(planId);
  const canAddMore = canAddEmergencyContact(count, planId);
  const isMaxReached = count >= maxEmergencyContacts;

  return (
    <FlowStepShell
      phase="emergency"
      step={10}
      title="Emergency contacts"
      description={getContactsSummaryDescription(count, planId)}
      footerLabel="Continue"
      footerDisabled={count < minEmergencyContacts}
      hideProgress
      showBack={showBack}
      onBack={onBack}
      onContinue={onContinue}
    >
      <AlStack gap="md" className="ob-contact-card-list">
        {contacts.map((contact) => (
          <EmergencyContactRow key={`${contact.mobile}-${contact.name}`} contact={contact} />
        ))}
        {canAddMore ? (
          <AddContactRow onClick={onAddAnother} disabled={!onAddAnother} />
        ) : isMaxReached ? (
          <p className="ob-emergency-max-message">{getContactsMaxReachedMessage(planId)}</p>
        ) : null}
      </AlStack>
    </FlowStepShell>
  );
}
