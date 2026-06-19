import { AlIcon } from '@autolokate/icons';
import { AlButton, AlHeading, AlScreenBg, AlText } from '@autolokate/ui';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getActivationCompleteTitle } from '../../features/qr-purchase/data/purchase-pricing.js';
import { resolvePurchasePlanId } from '../../features/emergency/emergency-limits.js';
import { useJourney } from '../JourneyContext.js';

import { buildCompletionSummary } from './completion-experience/build-completion-summary.js';
import { ConfettiBurst } from '../../components/compositions/confetti-burst/index.js';

import './completion-experience/completion-experience.css';

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      setReduced(media.matches);
    };
    sync();
    media.addEventListener('change', sync);
    return () => {
      media.removeEventListener('change', sync);
    };
  }, []);

  return reduced;
}

export function JourneyCompletedScreen() {
  const navigate = useNavigate();
  const { session, authStatus, clearJourney, setPhase } = useJourney();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [showConfetti, setShowConfetti] = useState(false);

  const summary = useMemo(
    () => buildCompletionSummary(session, authStatus),
    [authStatus, session],
  );

  const planId = resolvePurchasePlanId(session.purchase?.selectedPlanId);
  const headline = getActivationCompleteTitle(planId);
  const subtitle = summary.plate
    ? `${summary.plate} is protected · crash detection is live`
    : 'Your vehicle protection is live';

  useEffect(() => {
    setPhase('completed');
  }, [setPhase]);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }
    setShowConfetti(true);
    const timer = window.setTimeout(() => {
      setShowConfetti(false);
    }, 1600);
    return () => {
      window.clearTimeout(timer);
    };
  }, [prefersReducedMotion]);

  const finish = () => {
    clearJourney();
    void navigate('/journey');
  };

  const checklist = [
    {
      label: 'Plan activated',
      detail: summary.planActive ? `${summary.planName} plan is active` : `${summary.planName} plan`,
      done: summary.planActive,
    },
    {
      label: 'Emergency contacts configured',
      detail:
        summary.contactCount === 1
          ? '1 contact ready for alerts'
          : `${String(summary.contactCount)} contacts ready for alerts`,
      done: summary.contactsConfigured,
    },
    {
      label: 'Protection active',
      detail: summary.protectionActive ? 'Monitoring and alerts are on' : 'Finishing setup',
      done: summary.protectionActive,
    },
  ];

  return (
    <AlScreenBg variant="protected" className="ob-completion">
      <ConfettiBurst active={showConfetti} />
      <div className="ob-completion__frame">
        <div className="ob-completion__hero-wrap">
          <span className="ob-completion__hero-ring" aria-hidden />
          <div className={`ob-completion__hero${prefersReducedMotion ? '' : ' ob-completion__hero--float'}`}>
            <AlIcon name="activation-complete-halo" size={240} aria-hidden />
          </div>
        </div>

        <div className="ob-completion__copy">
          <AlHeading variant="h1" className="ob-completion__title">
            {headline}
          </AlHeading>
          <AlText tone="muted">{subtitle}</AlText>
          {summary.ownerName ? (
            <AlText variant="caption" tone="muted">
              Welcome, {summary.ownerName}
            </AlText>
          ) : null}
        </div>

        <ul className="ob-completion__checklist">
          {checklist.map((item) => (
            <li key={item.label} className="ob-completion__checklist-item">
              <AlIcon name="circle-check" size={20} className="ob-completion__check-icon" aria-hidden />
              <AlText>
                <strong>{item.label}</strong>
                <br />
                {item.detail}
              </AlText>
            </li>
          ))}
        </ul>

        <footer className="ob-completion__footer">
          <AlButton variant="primary" className="ob-completion__cta" onClick={finish}>
            Go to dashboard
          </AlButton>
          <button type="button" className="ob-completion__finish-link" onClick={finish}>
            Finish
          </button>
        </footer>
      </div>
    </AlScreenBg>
  );
}
