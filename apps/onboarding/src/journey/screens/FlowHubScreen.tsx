import { AlButton, AlHeading, AlStack, AlText } from '@autolokate/ui';
import { useNavigate } from 'react-router-dom';

import { flowLabels, journeyPaths } from '../constants.js';
import { useJourney } from '../JourneyContext.js';
import { selectActivationFlow } from '../navigation/select-activation-flow.js';
import type { ActivationFlowId } from '../types.js';

import '../journey.css';

const flowHubCards: { flow: ActivationFlowId; label: string }[] = [
  { flow: 'purchase', label: 'Purchase' },
  { flow: 'prepaid', label: 'Prepaid' },
  { flow: 'b2b2c', label: 'B2B2C' },
];

/** QA-only entry hub — not part of production consumer paths. */
export function FlowHubScreen() {
  const navigate = useNavigate();
  const { setSelectedFlow, setPhase, updateSession } = useJourney();

  return (
    <div className="journey-home journey-home--flow-hub">
      <AlStack gap="sm">
        <AlText variant="label">QA only</AlText>
        <AlHeading variant="h2">Flow Hub</AlHeading>
        <AlText tone="muted">Temporary screen for development and QA routing.</AlText>
      </AlStack>

      <div className="journey-home__options">
        {flowHubCards.map((card) => (
          <AlButton
            key={card.flow}
            variant="secondary"
            onClick={() => {
              selectActivationFlow(card.flow, { setSelectedFlow, setPhase, navigate, updateSession });
            }}
          >
            {card.label}
          </AlButton>
        ))}
      </div>

      <AlText variant="caption" tone="muted">
        {flowLabels.purchase}
      </AlText>
      <AlText variant="caption" tone="muted">
        {flowLabels.prepaid}
      </AlText>
      <AlText variant="caption" tone="muted">
        {flowLabels.b2b2c}
      </AlText>

      <AlButton
        variant="ghost"
        onClick={() => {
          void navigate(journeyPaths.root);
        }}
      >
        Back to Flow Entry
      </AlButton>
    </div>
  );
}
