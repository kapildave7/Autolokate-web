import { AlIcon } from '@autolokate/icons';
import { AlChip } from '@autolokate/ui';

import { PurchaseStatusShell } from '../../../../components/compositions/purchase-status-shell/index.js';
import type { PurchasePlanId } from '../../types-checkout.js';
import {
  getActivationChipLabel,
  getActivationCompleteDescription,
  getActivationCompleteTitle,
} from '../../data/purchase-pricing.js';

import './r15-activation-complete.css';

export type R15ActivationCompleteScreenProps = {
  selectedPlanId: PurchasePlanId;
  plate: string;
  onComplete?: () => void;
  completed?: boolean;
};

/** R15 · Activation complete — Figma 171:59 · terminal screen (no navigation). */
export function R15ActivationCompleteScreen({
  selectedPlanId,
  plate,
  onComplete,
  completed = false,
}: R15ActivationCompleteScreenProps) {
  return (
    <PurchaseStatusShell
      title={getActivationCompleteTitle(selectedPlanId)}
      description={getActivationCompleteDescription(plate, selectedPlanId)}
      visual={
        <AlIcon
          name="activation-complete-halo"
          size={240}
          className="ob-purchase-status-halo"
          aria-hidden
        />
      }
      bodyAccessory={
        <AlChip variant="green" label={getActivationChipLabel(selectedPlanId)} className="ob-r15-activation-complete__chip" />
      }
      footerLabel={completed ? 'Done' : 'Go to home'}
      footerDisabled={completed}
      onContinue={onComplete}
    />
  );
}
