import { AlHeading, AlStack, AlText } from '@autolokate/ui';

import { EmptyStateHero, InlineStatusBanner } from '../../../../components/compositions/index.js';
import { FlowStepShell } from '../../../../components/flow-step-shell/index.js';
import type { PurchaseScreenState } from '../../types.js';
import { checkoutTotal } from '../../data/plan-data.js';

export type P05PaymentProcessingScreenProps = {
  state?: PurchaseScreenState;
  onContinue?: () => void;
  onBack?: () => void;
  showBack?: boolean;
};

export function P05PaymentProcessingScreen({
  state = 'default',
  onContinue,
  onBack,
  showBack = true,
}: P05PaymentProcessingScreenProps) {
  const loading = state === 'loading' || state === 'default';
  const isError = state === 'error';
  const isSuccess = state === 'success';

  return (
    <FlowStepShell
      phase="purchase"
      step={5}
      title="Processing payment"
      description="please don't close the app"
      footerLabel={isError ? 'Retry payment' : 'Processing…'}
      footerLoading={loading && !isError}
      footerDisabled={isError ? false : loading}
      showBack={showBack}
      onBack={onBack}
      onContinue={onContinue}
    >
      {isError ? (
        <InlineStatusBanner variant="error">
          Payment failed. Your card was not charged. Try again or use a different method.
        </InlineStatusBanner>
      ) : null}
      <EmptyStateHero variant={isSuccess ? 'success' : 'processing'}>
        {isSuccess ? (
          <AlStack gap="sm" align="center">
            <AlHeading variant="h3">Payment authorised</AlHeading>
            <AlText tone="muted" align="center">
              Redirecting to confirmation…
            </AlText>
          </AlStack>
        ) : (
          <AlStack gap="sm" align="center">
            <AlText variant="title">₹{checkoutTotal.replace('₹', '')}</AlText>
            <AlText tone="muted" align="center">
              {loading ? 'Confirming with your bank…' : 'Ready to process payment.'}
            </AlText>
          </AlStack>
        )}
      </EmptyStateHero>
    </FlowStepShell>
  );
}
