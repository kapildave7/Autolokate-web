import type { CompositionPageId } from '../../types.js';
import { CompositionShowcase } from '../../components/CompositionShowcase.js';
import { BottomNavComposition } from '../../compositions/BottomNavComposition.js';
import { ContactCardComposition } from '../../compositions/ContactCardComposition.js';
import { EmptyContentComposition } from '../../compositions/EmptyContentComposition.js';
import { FormSectionComposition } from '../../compositions/FormSectionComposition.js';
import { PlanCardComposition } from '../../compositions/PlanCardComposition.js';
import { QuickActionRowComposition } from '../../compositions/QuickActionRowComposition.js';
import { StatusCardComposition } from '../../compositions/StatusCardComposition.js';
import { StepProgressComposition } from '../../compositions/StepProgressComposition.js';
import { VehicleInfoComposition } from '../../compositions/VehicleInfoComposition.js';
import { getCompositionMeta } from '../../compositions/metadata.js';

const compositionIssues: Partial<Record<CompositionPageId, string[]>> = {
  'composition-form-section': [
    'AlOtpInput shows 6 cells in code; Figma INPUTS row displays 6 cells with focus on cell 4 — aligned.',
  ],
};

function renderComposition(page: CompositionPageId) {
  switch (page) {
    case 'composition-form-section':
      return <FormSectionComposition />;
    case 'composition-vehicle-info':
      return <VehicleInfoComposition />;
    case 'composition-contact-card':
      return <ContactCardComposition />;
    case 'composition-quick-action-row':
      return <QuickActionRowComposition />;
    case 'composition-bottom-nav':
      return <BottomNavComposition />;
    case 'composition-status-card':
      return <StatusCardComposition />;
    case 'composition-empty-content':
      return <EmptyContentComposition />;
    case 'composition-step-progress':
      return <StepProgressComposition />;
    case 'composition-plan-card':
      return <PlanCardComposition />;
    default:
      return null;
  }
}

export function CompositionsPage({ page }: { page: CompositionPageId }) {
  const meta = getCompositionMeta(page);

  if (!meta) {
    return null;
  }

  return (
    <CompositionShowcase meta={meta} issues={compositionIssues[page] ?? []}>
      {renderComposition(page)}
    </CompositionShowcase>
  );
}
