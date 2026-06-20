import {
  PWA_SCANNED_MODEL,
  PWA_SCANNED_PLAN,
  pwaScannedVehicleFields,
} from '../../features/post-activation-pwa/data/pwa-demo-data.js';
import type { PwaScanSession } from '../../features/post-activation-pwa/context/pwa-scan-types.js';
import { b2b2cJourneyPaths } from '../../journey/b2b2c/b2b2c-routing.js';
import { prepaidJourneyPaths } from '../../journey/prepaid/prepaid-routing.js';
import { selectActivationFlow } from '../../journey/navigation/select-activation-flow.js';
import type { FlowDispatchDeps } from '../entry/flow-dispatcher.js';
import { dispatchPlatformFlow } from '../entry/flow-dispatcher.js';

import type { QrActivatedPayload, QrPayload } from './qr-dispatch-contract.js';

export type QrDispatchDeps = FlowDispatchDeps & {
  updatePwaSession: (patch: Partial<PwaScanSession>) => void;
};

export function applyActivatedQrToPwaSession(
  payload: QrActivatedPayload,
  updatePwaSession: (patch: Partial<PwaScanSession>) => void,
): void {
  updatePwaSession({
    bootstrapComplete: false,
    scannedVehicle: {
      plate: payload.plate,
      modelSummary: PWA_SCANNED_MODEL,
      protected: true,
      planLabel: payload.planLabel ?? PWA_SCANNED_PLAN,
      fields: pwaScannedVehicleFields,
    },
  });
}

/** Route a decoded QR payload into the correct onboarding or PWA flow. */
export function dispatchQrPayload(payload: QrPayload, deps: QrDispatchDeps): void {
  if (payload.type === 'activated') {
    applyActivatedQrToPwaSession(payload, deps.updatePwaSession);
    dispatchPlatformFlow({ flowId: 'postActivation', source: 'qrPayload' }, deps);
    return;
  }

  if (payload.type === 'purchase') {
    selectActivationFlow('purchase', deps);
    return;
  }

  if (payload.type === 'prepaid') {
    deps.setSelectedFlow('prepaid');
    deps.setPhase('flow-select');
    deps.updateSession?.({
      prepaid: { voucherId: payload.voucherId },
    });
    void deps.navigate(prepaidJourneyPaths.welcome);
    return;
  }

  deps.setSelectedFlow('b2b2c');
  deps.setPhase('flow-select');
  deps.updateSession?.({
    b2b2c: { partnerId: payload.partnerId, variant: payload.variant },
  });
  void deps.navigate(
    payload.variant === 'plan-rider'
      ? b2b2cJourneyPaths.welcomePlanRider
      : b2b2cJourneyPaths.welcome,
  );
}
