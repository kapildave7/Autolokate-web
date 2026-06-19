import { AlIcon } from '@autolokate/icons';
import { AlPlanCard, AlText } from '@autolokate/ui';

import { InlineStatusBanner } from '../../../../components/compositions/index.js';
import { FlowStepShell } from '../../../../components/flow-step-shell/index.js';
import type { PurchaseScreenState } from '../../types.js';
import { safePlan, securePlan } from '../../data/plan-data.js';

export type P01PlanSelectionScreenProps = {
  state?: PurchaseScreenState;
  onContinue?: () => void;
  onBack?: () => void;
  showBack?: boolean;
};

export function P01PlanSelectionScreen({
  state = 'default',
  onContinue,
  onBack,
  showBack = true,
}: P01PlanSelectionScreenProps) {
  const loading = state === 'loading';
  const isError = state === 'error';
  const isSuccess = state === 'success';

  return (
    <FlowStepShell
      phase="purchase"
      step={1}
      title="Choose your plan"
      description="From daily essentials to full crash protection."
      footerLabel={loading ? 'Loading plans…' : 'Choose Secure'}
      footerLoading={loading}
      footerDisabled={isError}
      showBack={showBack}
      onBack={onBack}
      onContinue={onContinue}
    >
      {isError ? (
        <InlineStatusBanner variant="error">
          We couldn&apos;t load plans. Check your connection and try again.
        </InlineStatusBanner>
      ) : null}
      {isSuccess ? (
        <InlineStatusBanner variant="success">Secure plan selected.</InlineStatusBanner>
      ) : null}
      <div className="ob-purchase-plan-carousel">
        <AlPlanCard
          name={safePlan.name}
          price={safePlan.price}
          features={[...safePlan.features]}
          featureIcon={<AlIcon name="circle-check" size={15} aria-hidden />}
          onSelect={loading ? undefined : () => undefined}
        />
        <AlPlanCard
          name={securePlan.name}
          price={securePlan.price}
          badge={securePlan.badge}
          includesLabel={securePlan.includesLabel}
          features={[...securePlan.features.slice(0, 3)]}
          addon={securePlan.addon}
          selected={isSuccess || state === 'default'}
          featureIcon={<AlIcon name="circle-check" size={15} aria-hidden />}
          selectedIcon={<AlIcon name="circle-check" size={24} aria-hidden />}
          onSelect={loading ? undefined : () => undefined}
        />
      </div>
      {!isError ? (
        <AlText variant="caption" tone="muted">
          Swipe to compare tiers. Continue with your selected plan.
        </AlText>
      ) : null}
    </FlowStepShell>
  );
}
