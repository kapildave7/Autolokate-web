import { useEffect } from 'react';
import { AlButton, AlHeading, AlScreenBg, AlText } from '@autolokate/ui';
import { useNavigate } from 'react-router-dom';

import { FlowOptionCard } from '../../components/compositions/flow-entry/index.js';
import { pwaScanPaths } from '../../features/post-activation-pwa/constants/pwa-scan-paths.js';
import { useThemeMode } from '../../hooks/useThemeMode.js';
import { flowLabels } from '../constants.js';
import { useJourney } from '../JourneyContext.js';
import { selectActivationFlow } from '../navigation/select-activation-flow.js';
import type { ActivationFlowId } from '../types.js';

import './flow-entry-screen.css';

const flowOptions: ActivationFlowId[] = ['purchase', 'prepaid', 'b2b2c'];

/** Production flow entry — Figma-aligned journey selector. */
export function FlowEntryScreen() {
  const navigate = useNavigate();
  const { setSelectedFlow, setPhase, updateSession } = useJourney();
  const { themeMode, applyTheme } = useThemeMode();

  useEffect(() => {
    setPhase('flow-select');
  }, [setPhase]);

  const handleSelect = (flow: ActivationFlowId) => {
    selectActivationFlow(flow, { setSelectedFlow, setPhase, navigate, updateSession });
  };

  return (
    <AlScreenBg variant="protected" className="ob-flow-entry">
      <div className="ob-flow-entry__theme-toggle" role="group" aria-label="Theme">
        <AlButton
          size="sm"
          variant={themeMode === 'dark' ? 'primary' : 'ghost'}
          className="ob-flow-entry__theme-btn"
          onClick={() => {
            applyTheme('dark');
          }}
        >
          Dark
        </AlButton>
        <AlButton
          size="sm"
          variant={themeMode === 'light' ? 'primary' : 'ghost'}
          className="ob-flow-entry__theme-btn"
          onClick={() => {
            applyTheme('light');
          }}
        >
          Light
        </AlButton>
      </div>
      <div className="ob-flow-entry__body">
        <div className="ob-flow-entry__heading">
          <AlHeading variant="h2">Activate your protection</AlHeading>
          <AlText tone="muted" className="ob-flow-entry__description">
            Choose your activation type
          </AlText>
        </div>

        <ul className="ob-flow-entry__options">
          {flowOptions.map((flow) => (
            <li key={flow}>
              <FlowOptionCard
                label={flowLabels[flow]}
                onSelect={() => {
                  handleSelect(flow);
                }}
              />
            </li>
          ))}
          <li>
            <FlowOptionCard
              label="QR Scan (Post-Activation)"
              description="Already activated vehicle"
              onSelect={() => {
                void navigate(pwaScanPaths.loading);
              }}
            />
          </li>
        </ul>
      </div>
    </AlScreenBg>
  );
}
