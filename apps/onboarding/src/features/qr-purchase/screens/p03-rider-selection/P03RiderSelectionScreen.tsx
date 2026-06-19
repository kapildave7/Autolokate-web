import { AlChip, AlStack, AlText, AlToggle } from '@autolokate/ui';

import { InlineStatusBanner } from '../../../../components/compositions/index.js';
import { FlowStepShell } from '../../../../components/flow-step-shell/index.js';
import type { PurchaseScreenState } from '../../types.js';

export type P03RiderSelectionScreenProps = {
  state?: PurchaseScreenState;
  onContinue?: () => void;
  onBack?: () => void;
  showBack?: boolean;
};

export function P03RiderSelectionScreen({
  state = 'default',
  onContinue,
  onBack,
  showBack = true,
}: P03RiderSelectionScreenProps) {
  const loading = state === 'loading';
  const isError = state === 'error';
  const isSuccess = state === 'success';

  return (
    <FlowStepShell
      phase="purchase"
      step={3}
      title="Rider cover"
      description="add protection for passengers on your vehicle"
      footerLabel={loading ? 'Saving…' : 'Continue'}
      footerLoading={loading}
      footerDisabled={isError}
      showBack={showBack}
      onBack={onBack}
      onContinue={onContinue}
    >
      {isError ? (
        <InlineStatusBanner variant="error">
          Rider options couldn&apos;t be saved. Try again.
        </InlineStatusBanner>
      ) : null}
      <AlStack gap="lg">
        <AlToggle
          label="Add rider cover"
          helperText="Covers up to 2 riders on the same vehicle"
          checked={state !== 'error'}
          loading={loading}
          disabled={loading || isError}
          onChange={() => undefined}
        />
        <AlStack gap="sm">
          <AlText variant="label">Number of riders</AlText>
          <div className="ob-purchase-rider-row">
            <AlChip
              variant={isSuccess ? 'green' : 'neutral'}
              label="1 rider"
              onClick={loading || isError ? undefined : () => undefined}
            />
            <AlChip
              variant={state === 'default' || isSuccess ? 'green' : 'neutral'}
              label="2 riders"
              onClick={loading || isError ? undefined : () => undefined}
            />
          </div>
        </AlStack>
        {isSuccess ? (
          <AlText variant="caption" tone="muted">
            Rider cover added for 2 riders · ₹199/yr
          </AlText>
        ) : null}
      </AlStack>
    </FlowStepShell>
  );
}
