import { AlIcon } from '@autolokate/icons';

import { PurchaseStatusShell } from '../../../../components/compositions/purchase-status-shell/index.js';

export type R10cPaymentUnconfirmedScreenProps = {
  onCheckStatus?: () => void;
};

/** R10c · Payment unconfirmed — Figma 579:1638 */
export function R10cPaymentUnconfirmedScreen({ onCheckStatus }: R10cPaymentUnconfirmedScreenProps) {
  return (
    <PurchaseStatusShell
      ambient="attention"
      title="We couldn't confirm your payment"
      description="If money was deducted, don't pay again. We'll verify and update you on WhatsApp within a few minutes"
      visual={
        <AlIcon
          name="payment-unconfirmed-halo"
          size={240}
          className="ob-purchase-status-halo"
          aria-hidden
        />
      }
      footerLabel="Check status"
      onContinue={onCheckStatus}
    />
  );
}
