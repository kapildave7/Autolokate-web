import { useCallback } from 'react';
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
import {
  getDemoPartnerLandingEntitlement,
  type PartnerLandingVariant,
} from '../../data/partner-landing-config.js';

export type PartnerWelcomeScreenProps = {
  variant?: PartnerLandingVariant;
};

const PARTNER_BODY_COPY: Record<PartnerLandingVariant, string> = {
  'plan-only': 'Sharma Motors set up and paid for your plan. Activate it now.',
  'plan-rider':
    'Sharma Motors set up and paid for your plan and rider. Activate it now.',
};

export function PartnerWelcomeScreen({ variant = 'plan-only' }: PartnerWelcomeScreenProps) {
  const navigate = useNavigate();
  const { setSelectedFlow, setPhase, updateSession } = useJourney();
  const loadConfig = useCallback(
    () => getDemoPartnerLandingEntitlement(variant),
    [variant],
  );
  const { viewState, config, retry } = useWelcomeLanding({ loadConfig });

  const handleActivate = () => {
    if (!config || viewState !== 'default') {
      return;
    }

    setSelectedFlow('b2b2c');
    updateSession({
      b2b2c: { entitlement: config, variant },
      ...applyLandingEntitlementToSession(config),
    });
    setPhase('shared-auth');
    void navigate(authJourneyPaths.mobile);
  };

  const planDisplay = config
    ? resolveWelcomePlanDisplay(config.planId, config.priceDisplay, config.riderCount)
    : null;

  const successBodyCopy = config?.bodyCopy ?? PARTNER_BODY_COPY[variant];
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
          <div className="ob-welcome-shell__partner-section">
            <p className="ob-welcome-shell__section-label">You got this from</p>
            <PartnerActivationCardSkeleton />
          </div>
          <PlanActivationCardSkeleton />
        </>
      ) : planDisplay && config ? (
        <>
          <div className="ob-welcome-shell__partner-section">
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
