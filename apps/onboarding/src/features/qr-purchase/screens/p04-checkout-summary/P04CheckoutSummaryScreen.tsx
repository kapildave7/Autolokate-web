import { AlDivider, AlField, AlHeading, AlText } from '@autolokate/ui';

import { InlineStatusBanner } from '../../../../components/compositions/index.js';
import { FlowStepShell } from '../../../../components/flow-step-shell/index.js';
import type { PurchaseScreenState } from '../../types.js';
import { checkoutLines, checkoutTotal } from '../../data/plan-data.js';

export type P04CheckoutSummaryScreenProps = {
  state?: PurchaseScreenState;
  onContinue?: () => void;
  onBack?: () => void;
  showBack?: boolean;
};

export function P04CheckoutSummaryScreen({
  state = 'default',
  onContinue,
  onBack,
  showBack = true,
}: P04CheckoutSummaryScreenProps) {
  const loading = state === 'loading';
  const isError = state === 'error';
  const isSuccess = state === 'success';

  return (
    <FlowStepShell
      phase="purchase"
      step={4}
      title="Review & pay"
      description="Check your order, then pay securely."
      footerLabel={loading ? 'Preparing…' : `Pay ${checkoutTotal}`}
      footerLoading={loading}
      footerDisabled={isError}
      showBack={showBack}
      onBack={onBack}
      onContinue={onContinue}
    >
      {isError ? (
        <InlineStatusBanner variant="error">
          Unable to calculate totals. Refresh and try again.
        </InlineStatusBanner>
      ) : null}
      {!isError ? (
        <div className="ob-purchase-checkout">
          {checkoutLines.map((line) => (
            <AlField key={line.label} label={line.label} value={line.value} />
          ))}
          <AlDivider />
          <div className="ob-purchase-checkout__total">
            <AlHeading variant="h3">Total</AlHeading>
            <AlText variant="title">{checkoutTotal}</AlText>
          </div>
          {isSuccess ? (
            <AlText variant="caption" tone="muted">
              Order summary verified. Ready for payment.
            </AlText>
          ) : (
            <AlText variant="caption" tone="muted">
              Inclusive of GST. Billed annually.
            </AlText>
          )}
        </div>
      ) : null}
    </FlowStepShell>
  );
}
