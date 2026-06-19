import { AlIcon } from '@autolokate/icons';
import { AlPlanCard, AlText } from '@autolokate/ui';

import { InlineStatusBanner } from '../../../../components/compositions/index.js';
import { FlowStepShell } from '../../../../components/flow-step-shell/index.js';
import type { PurchaseScreenState } from '../../types.js';
import { securePlan } from '../../data/plan-data.js';

export type P02PlanDetailsScreenProps = {
  state?: PurchaseScreenState;
  onContinue?: () => void;
  onBack?: () => void;
  showBack?: boolean;
};

export function P02PlanDetailsScreen({
  state = 'default',
  onContinue,
  onBack,
  showBack = true,
}: P02PlanDetailsScreenProps) {
  const loading = state === 'loading';
  const isError = state === 'error';
  const isSuccess = state === 'success';

  return (
    <FlowStepShell
      phase="purchase"
      step={2}
      title="Plan details"
      description="review what's included in secure"
      footerLabel={loading ? 'Loading…' : isSuccess ? 'Looks good' : 'Continue'}
      footerLoading={loading}
      footerDisabled={isError}
      showBack={showBack}
      onBack={onBack}
      onContinue={onContinue}
    >
      {isError ? (
        <InlineStatusBanner variant="error">
          Plan details are unavailable. Go back and select a plan again.
        </InlineStatusBanner>
      ) : null}
      {!isError && !loading ? (
        <AlPlanCard
          name={securePlan.name}
          price={securePlan.price}
          badge={securePlan.badge}
          includesLabel={securePlan.includesLabel}
          features={[...securePlan.features]}
          addon={securePlan.addon}
          selected
          featureIcon={<AlIcon name="circle-check" size={15} aria-hidden />}
          selectedIcon={<AlIcon name="circle-check" size={24} aria-hidden />}
        />
      ) : null}
      {loading ? <AlText tone="muted">Loading plan details…</AlText> : null}
      {isSuccess ? (
        <AlText variant="caption" tone="muted">
          All features confirmed for Secure.
        </AlText>
      ) : null}
    </FlowStepShell>
  );
}
