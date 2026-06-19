import { AlIcon } from '@autolokate/icons';
import { AlButton } from '@autolokate/ui';

import { EmptyStateHero, InlineStatusBanner } from '../../../../components/compositions/index.js';
import { FlowStepShell } from '../../../../components/flow-step-shell/index.js';
import type { PurchaseScreenState } from '../../types.js';
import { demoPlate } from '../../../purchase-activation/data/demo-data.js';

export type P06PaymentSuccessScreenProps = {
  state?: PurchaseScreenState;
  onContinue?: () => void;
  onBack?: () => void;
  showBack?: boolean;
};

export function P06PaymentSuccessScreen({
  state = 'default',
  onContinue,
  onBack,
  showBack = true,
}: P06PaymentSuccessScreenProps) {
  const loading = state === 'loading';
  const isError = state === 'error';

  return (
    <FlowStepShell
      phase="purchase"
      step={6}
      title="Payment successful"
      description="your vehicle is now protected"
      footerLabel={loading ? 'Finishing…' : 'Continue'}
      footerLoading={loading}
      footerDisabled={isError}
      showBack={showBack}
      onBack={onBack}
      onContinue={onContinue}
    >
      {isError ? (
        <InlineStatusBanner variant="error">
          Activation completed but receipt failed to load. Check your email for confirmation.
        </InlineStatusBanner>
      ) : null}
      <EmptyStateHero
        variant="success"
        icon={<AlIcon name="circle-check" size={64} aria-hidden />}
        heading="You&apos;re protected!"
        headingVariant="h2"
        message={`Secure plan activated for ${demoPlate}. Emergency contacts and crash detection are now active.`}
      >
        {state === 'success' || state === 'default' ? (
          <AlButton variant="secondary">View receipt</AlButton>
        ) : null}
      </EmptyStateHero>
    </FlowStepShell>
  );
}
