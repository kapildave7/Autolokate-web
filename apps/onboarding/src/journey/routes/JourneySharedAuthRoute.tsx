import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { getPostAuthActivationPath } from '../activation-routing.js';
import { resetPurchaseCheckoutSession } from '../navigation/select-activation-flow.js';
import { useJourney } from '../JourneyContext.js';
import { AuthRoutes } from './AuthRoutes.js';

export function JourneySharedAuthRoute() {
  const navigate = useNavigate();
  const { completeAuth, setPhase, selectedFlow, setSelectedFlow, session, updateSession } = useJourney();

  const handleAuthCompleted = useCallback(() => {
    const flow = selectedFlow ?? 'purchase';
    if (!selectedFlow) {
      setSelectedFlow('purchase');
    }
    completeAuth();

    if (flow === 'purchase') {
      updateSession(resetPurchaseCheckoutSession());
      setPhase('activation');
    } else {
      setPhase('emergency');
    }

    void navigate(getPostAuthActivationPath(flow, session));
  }, [completeAuth, navigate, selectedFlow, session, setPhase, setSelectedFlow, updateSession]);

  return <AuthRoutes onAuthCompleted={handleAuthCompleted} />;
}

export { authJourneyPaths } from '../auth/auth-routing.js';
