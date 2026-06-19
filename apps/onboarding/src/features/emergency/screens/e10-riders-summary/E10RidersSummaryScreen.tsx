import { AlStack } from '@autolokate/ui';

import {
  AddContactRow,
  EmergencyContactRow,
} from '../../../../components/compositions/index.js';
import { FlowStepShell } from '../../../../components/flow-step-shell/index.js';
import type { PurchasePlanId, PurchaseRiderCount } from '../../../qr-purchase/types-checkout.js';
import {
  canAddRider,
  getEntitledRiderSlots,
  getRidersMaxReachedMessage,
  getRidersSummaryDescription,
} from '../../emergency-limits.js';
import type { EmergencyRider, EmergencyScreenNavigationProps } from '../../types.js';

export type E10RidersSummaryScreenProps = EmergencyScreenNavigationProps & {
  riders: EmergencyRider[];
  planId: PurchasePlanId;
  purchasedRiderSlots: PurchaseRiderCount;
  onAddAnother?: () => void;
};

/** R4 · Riders added — Figma 822:1980 · 824:2014 */
export function E10RidersSummaryScreen({
  riders,
  planId,
  purchasedRiderSlots,
  onAddAnother,
  onContinue,
  onBack,
  showBack = true,
}: E10RidersSummaryScreenProps) {
  const count = riders.length;
  const entitled = getEntitledRiderSlots(planId, purchasedRiderSlots);
  const canAddMore = canAddRider(count, planId, purchasedRiderSlots);
  const isMaxReached = count >= entitled && entitled > 0;

  return (
    <FlowStepShell
      phase="emergency"
      step={5}
      title="Riders"
      description={getRidersSummaryDescription(count, planId, purchasedRiderSlots)}
      footerLabel="Continue"
      hideProgress
      showBack={showBack}
      onBack={onBack}
      onContinue={onContinue}
    >
      <AlStack gap="md" className="ob-contact-card-list">
        {riders.map((rider) => (
          <EmergencyContactRow key={`${rider.mobile}-${rider.name}`} contact={rider} />
        ))}
        {canAddMore ? (
          <AddContactRow label="Add another rider" onClick={onAddAnother} disabled={!onAddAnother} />
        ) : isMaxReached ? (
          <p className="ob-emergency-max-message">
            {getRidersMaxReachedMessage(planId, purchasedRiderSlots)}
          </p>
        ) : null}
      </AlStack>
    </FlowStepShell>
  );
}
