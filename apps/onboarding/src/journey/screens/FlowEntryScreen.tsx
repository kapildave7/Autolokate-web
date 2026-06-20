import { useEffect, useRef } from 'react';
import { AlButton, AlHeading, AlScreenBg, AlText } from '@autolokate/ui';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { FlowOptionCard } from '../../components/compositions/flow-entry/index.js';
import { useThemeMode } from '../../hooks/useThemeMode.js';
import { PwaInstallPrompt } from '../../pwa/index.js';
import { usePwaScan } from '../../features/post-activation-pwa/context/PwaScanContext.js';
import {
  ACTIVATION_FLOW_ENTRIES,
  dispatchPlatformFlow,
  dispatchQrPayload,
  isQrEntryUrl,
  parseQrFromSearchParams,
  POST_ACTIVATION_FLOW_ENTRY,
} from '../../platform/index.js';
import { useJourney } from '../JourneyContext.js';

import './flow-entry-screen.css';

/** Production flow entry — Figma-aligned journey selector. */
export function FlowEntryScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setSelectedFlow, setPhase, updateSession } = useJourney();
  const { updateSession: updatePwaSession } = usePwaScan();
  const { themeMode, applyTheme } = useThemeMode();
  const qrHandledRef = useRef(false);

  useEffect(() => {
    setPhase('flow-select');
  }, [setPhase]);

  const dispatchDeps = { setSelectedFlow, setPhase, navigate, updateSession };

  useEffect(() => {
    if (qrHandledRef.current || !isQrEntryUrl(searchParams)) {
      return;
    }

    const result = parseQrFromSearchParams(searchParams);
    if (!result.ok) {
      return;
    }

    qrHandledRef.current = true;
    dispatchQrPayload(result.payload, {
      setSelectedFlow,
      setPhase,
      navigate,
      updateSession,
      updatePwaSession,
    });
  }, [navigate, searchParams, setPhase, setSelectedFlow, updatePwaSession, updateSession]);

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

        <PwaInstallPrompt />

        <ul className="ob-flow-entry__options">
          {ACTIVATION_FLOW_ENTRIES.map((entry) => (
            <li key={entry.id}>
              <FlowOptionCard
                label={entry.label}
                onSelect={() => {
                  dispatchPlatformFlow({ flowId: entry.id, source: 'homeCard' }, dispatchDeps);
                }}
              />
            </li>
          ))}
          <li>
            <FlowOptionCard
              label={POST_ACTIVATION_FLOW_ENTRY.label}
              description={POST_ACTIVATION_FLOW_ENTRY.description}
              onSelect={() => {
                dispatchPlatformFlow(
                  { flowId: POST_ACTIVATION_FLOW_ENTRY.id, source: 'homeCard' },
                  dispatchDeps,
                );
              }}
            />
          </li>
        </ul>
      </div>
    </AlScreenBg>
  );
}
