import { AlButton, AlHeading, AlStack, AlText } from '@autolokate/ui';
import { useNavigate } from 'react-router-dom';

import { flowLabels, journeyPaths } from '../constants.js';
import { ACTIVATION_FLOW_ENTRIES, dispatchPlatformFlow } from '../../platform/index.js';
import { useJourney } from '../JourneyContext.js';

import '../journey.css';

/** QA-only entry hub — not part of production consumer paths. */
export function FlowHubScreen() {
  const navigate = useNavigate();
  const { setSelectedFlow, setPhase, updateSession } = useJourney();

  const dispatchDeps = { setSelectedFlow, setPhase, navigate, updateSession };

  return (
    <div className="journey-home journey-home--flow-hub">
      <AlStack gap="sm">
        <AlText variant="label">QA only</AlText>
        <AlHeading variant="h2">Flow Hub</AlHeading>
        <AlText tone="muted">Temporary screen for development and QA routing.</AlText>
      </AlStack>

      <div className="journey-home__options">
        {ACTIVATION_FLOW_ENTRIES.map((entry) => (
          <AlButton
            key={entry.id}
            variant="secondary"
            onClick={() => {
              dispatchPlatformFlow({ flowId: entry.id, source: 'flowHub' }, dispatchDeps);
            }}
          >
            {entry.id === 'purchase' ? 'Purchase' : entry.id === 'prepaid' ? 'Prepaid' : 'B2B2C'}
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
