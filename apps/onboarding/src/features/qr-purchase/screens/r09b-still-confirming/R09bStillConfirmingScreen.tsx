import { AlScreenSpinner } from '@autolokate/ui';

import { PurchaseStatusShell } from '../../../../components/compositions/purchase-status-shell/index.js';

export type R09bStillConfirmingScreenProps = {
  onCheckStatus?: () => void;
};

/** R09b · Still confirming — Figma 579:1687 */
export function R09bStillConfirmingScreen({ onCheckStatus }: R09bStillConfirmingScreenProps) {
  return (
    <PurchaseStatusShell
      title="Still confirming your payment"
      description="This is taking longer than usual. Your payment is safe, please don't pay again"
      visual={<AlScreenSpinner size="lg" animated aria-label="Still confirming payment" />}
      footerLabel="Check status"
      footerVariant="text-link"
      onContinue={onCheckStatus}
    />
  );
}
