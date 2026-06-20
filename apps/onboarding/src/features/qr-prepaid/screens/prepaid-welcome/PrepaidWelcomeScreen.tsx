import { useNavigate } from 'react-router-dom';

import {
  PartnerActivationCard,
  PartnerActivationCardSkeleton,
  PlanActivationCard,
  PlanActivationCardSkeleton,
  WelcomeActivationErrorPanel,
  WelcomeActivationShell,
} from '@/components/compositions/welcome-activation/index.js';
import { applyLandingEntitlementToSession } from '@/features/b2b-shared/apply-landing-entitlement.js';
import { getWelcomeShellPresentation } from '@/features/b2b-shared/get-welcome-shell-presentation.js';
import { resolveWelcomePlanDisplay } from '@/features/b2b-shared/resolve-welcome-plan-display.js';
import { useWelcomeLanding } from '@/features/b2b-shared/use-welcome-landing.js';
import { journeyPaths } from '@/journey/constants.js';
import { useJourney } from '@/journey/JourneyContext.js';
import { authJourneyPaths } from '@/journey/auth/auth-routing.js';
import { getDemoPrepaidLandingEntitlement } from '../../data/prepaid-landing-config.js';

const PREPAID_SUCCESS_BODY =
  'Sharma Fleet set up and paid for your plan. Nothing to pay.';

export function PrepaidWelcomeScreen() {
  const navigate = useNavigate();
  const { setSelectedFlow, setPhase, updateSession } = useJourney();
  const { viewState, config, retry } = useWelcomeLanding({
    loadConfig: getDemoPrepaidLandingEntitlement,
  });

  const handleActivate = () => {
    if (!config || viewState !== 'default') {
      return;
    }

    setSelectedFlow('prepaid');
    updateSession({
      prepaid: { entitlement: config },
      ...applyLandingEntitlementToSession(config),
    });
    setPhase('shared-auth');
    void navigate(authJourneyPaths.mobile);
  };

  const planDisplay = config
    ? resolveWelcomePlanDisplay(config.planId, config.priceDisplay, config.riderCount)
    : null;

  const successBodyCopy = config?.bodyCopy ?? PREPAID_SUCCESS_BODY;
  const shell = getWelcomeShellPresentation(viewState, successBodyCopy);

  return (
    <WelcomeActivationShell
      title={shell.title}
      description={shell.description}
      footerLabel={shell.footerLabel}
      footerDisabled={shell.footerDisabled}
      footerDimmed={shell.footerDimmed}
      showBack={shell.showBack}
      bgVariant={shell.bgVariant}
      onBack={() => {
        void navigate(journeyPaths.root);
      }}
      onContinue={() => {
        if (viewState === 'error') {
          retry();
          return;
        }
        handleActivate();
      }}
    >
      {viewState === 'error' ? (
        <WelcomeActivationErrorPanel />
      ) : viewState === 'loading' ? (
        <>
          <div className="ob-welcome-shell__partner-section ob-welcome-shell__partner-section--top-offset">
            <p className="ob-welcome-shell__section-label">Covered by</p>
            <PartnerActivationCardSkeleton />
          </div>
          <PlanActivationCardSkeleton />
        </>
      ) : planDisplay && config ? (
        <>
          <div className="ob-welcome-shell__partner-section ob-welcome-shell__partner-section--top-offset">
            <p className="ob-welcome-shell__section-label">{config.sectionLabel}</p>
            <PartnerActivationCard
              initials={config.partnerInitials}
              name={config.partnerName}
              subtitle={config.partnerSubtitle}
            />
          </div>
          <PlanActivationCard
            planName={planDisplay.planName}
            priceDisplay={planDisplay.priceDisplay}
            statusLabel={config.planStatusLabel}
            includesLabel={planDisplay.includesLabel}
            features={planDisplay.features}
            riderRowLabel={planDisplay.riderRowLabel}
            vehiclePlate={config.vehiclePlate}
          />
        </>
      ) : null}
    </WelcomeActivationShell>
  );
}
