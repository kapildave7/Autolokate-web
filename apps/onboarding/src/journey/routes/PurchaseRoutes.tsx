import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';

import { formatPlateInput } from '@autolokate/ui';

import {
  fetchVahanDetails,
  getPlateFetchIntent,
  normalizePlate,
} from '../../features/qr-purchase/data/vahan-demo.js';
import {
  R03VehicleNumberScreen,
  R04FetchingVehicleScreen,
  R04bFetchFailedScreen,
  R05ConfirmVehicleScreen,
  R06ChoosePlanScreen,
  R07RiderCoverScreen,
  R08OrderSummaryScreen,
  R08bPromoAppliedScreen,
  R08cInvalidPromoScreen,
  R09ProcessingPaymentScreen,
  R09bStillConfirmingScreen,
  R10PaymentSuccessScreen,
  R10bPaymentFailedScreen,
  R10cPaymentUnconfirmedScreen,
} from '../../features/qr-purchase/screens/index.js';
import type { PurchaseVehiclePlateState } from '../../features/qr-purchase/types-vehicle.js';
import type {
  PurchasePlanId,
  PurchaseRiderCount,
} from '../../features/qr-purchase/types-checkout.js';
import { DEFAULT_PURCHASE_PLAN_ID, VALID_PROMO_CODE } from '../../features/qr-purchase/data/purchase-plans.js';
import { buildOrderSummary } from '../../features/qr-purchase/data/purchase-pricing.js';
import {
  getDemoPaymentOutcome,
  PAYMENT_CONFIRMING_MS,
  PAYMENT_PROCESSING_MS,
  resolveConfirmingPaymentOutcome,
} from '../../features/qr-purchase/data/purchase-payment-demo.js';
import { isValidPromoCode, normalizePromoCode } from '../../features/qr-purchase/data/purchase-promo.js';
import { getPurchasePostPaymentEmergencyPath } from '../activation-routing.js';
import { authJourneyPaths } from '../auth/auth-routing.js';
import { useJourney } from '../JourneyContext.js';
import { purchaseJourneyPaths } from '../purchase/purchase-routing.js';

function PurchaseSegmentBootstrap({ children }: { children: ReactNode }) {
  const { setPhase } = useJourney();

  useEffect(() => {
    setPhase('activation');
  }, [setPhase]);

  return children;
}

function usePurchaseCheckout() {
  const { session, updateSession } = useJourney();
  const purchase = session.purchase ?? {};
  const planId = purchase.selectedPlanId ?? DEFAULT_PURCHASE_PLAN_ID;
  const riderCount = purchase.riderCount ?? 1;

  const patchPurchase = (patch: Partial<typeof purchase>) => {
    updateSession({
      purchase: {
        ...purchase,
        ...patch,
      },
    });
  };

  return { session, purchase, planId, riderCount, patchPurchase, updateSession };
}

function getOrderSummaryPath(promoApplied?: boolean, promoInvalid?: boolean) {
  if (promoInvalid) {
    return purchaseJourneyPaths.r08cInvalidPromo;
  }
  return promoApplied ? purchaseJourneyPaths.r08bPromoApplied : purchaseJourneyPaths.r08OrderSummary;
}

/** After payment success, resume at R10 until the user continues to emergency. */
function getPostPaymentSuccessPath(): string {
  return purchaseJourneyPaths.r10PaymentSuccess;
}

function getPostPaymentResumePath(purchase: ReturnType<typeof usePurchaseCheckout>['purchase']): string | null {
  if (!purchase.checkoutReady) {
    return null;
  }

  switch (purchase.paymentStatus) {
    case 'success':
      return getPostPaymentSuccessPath();
    case 'unconfirmed':
      return purchaseJourneyPaths.r10cPaymentUnconfirmed;
    case 'confirming':
      return purchaseJourneyPaths.r09bStillConfirming;
    case 'failed':
      return purchaseJourneyPaths.r10bPaymentFailed;
    default:
      return null;
  }
}

function redirectIfPaymentSucceeded(
  navigate: ReturnType<typeof useNavigate>,
  purchase: ReturnType<typeof usePurchaseCheckout>['purchase'],
): boolean {
  const resumePath = getPostPaymentResumePath(purchase);
  if (!resumePath) {
    return false;
  }
  void navigate(resumePath, { replace: true });
  return true;
}

function applyPromoCode(
  code: string,
  patchPurchase: ReturnType<typeof usePurchaseCheckout>['patchPurchase'],
  navigate: ReturnType<typeof useNavigate>,
) {
  const normalized = normalizePromoCode(code);
  if (!normalized) {
    return;
  }
  if (isValidPromoCode(normalized)) {
    patchPurchase({
      promoApplied: true,
      promoCode: normalized,
      promoInvalid: false,
    });
    void navigate(purchaseJourneyPaths.r08bPromoApplied);
    return;
  }
  patchPurchase({
    promoApplied: false,
    promoCode: normalized,
    promoInvalid: true,
  });
  void navigate(purchaseJourneyPaths.r08cInvalidPromo);
}

function startPayment(
  patchPurchase: ReturnType<typeof usePurchaseCheckout>['patchPurchase'],
  navigate: ReturnType<typeof useNavigate>,
  purchase: ReturnType<typeof usePurchaseCheckout>['purchase'],
  params: {
    planId: PurchasePlanId;
    riderCount: PurchaseRiderCount;
    promoApplied?: boolean;
    promoCode?: string | null;
  },
) {
  if (purchase.paymentStatus === 'success' && purchase.checkoutReady) {
    void navigate(getPostPaymentSuccessPath(), { replace: true });
    return;
  }

  const summary = buildOrderSummary({
    planId: params.planId,
    riderCount: params.riderCount,
    promoApplied: params.promoApplied,
    promoCode: params.promoCode,
  });

  patchPurchase({
    selectedPlanId: params.planId,
    riderCount: params.riderCount,
    checkoutReady: true,
    paymentStatus: 'processing',
    paidAmountInr: summary.totalInr,
  });
  void navigate(purchaseJourneyPaths.r09ProcessingPayment);
}

function R03Route() {
  const navigate = useNavigate();
  const { session, updateSession } = useJourney();
  const { purchase } = usePurchaseCheckout();
  const vehicle = session.vehicle ?? {};

  const [plate, setPlate] = useState(() => formatPlateInput(vehicle.plate ?? ''));
  const [plateState, setPlateState] = useState<PurchaseVehiclePlateState>(() => {
    if (vehicle.fetchStatus === 'not-found') {
      return 'error';
    }
    if (vehicle.plate?.trim()) {
      return 'filled';
    }
    return 'empty';
  });

  useEffect(() => {
    if (vehicle.fetchStatus === 'not-found') {
      setPlateState('error');
    }
  }, [vehicle.fetchStatus]);

  useEffect(() => {
    redirectIfPaymentSucceeded(navigate, purchase);
  }, [navigate, purchase]);

  const handleFetch = useCallback(() => {
    const normalized = normalizePlate(plate);
    const intent = getPlateFetchIntent(normalized);

    if (intent === 'invalid') {
      updateSession({
        vehicle: {
          ...vehicle,
          plate: normalized,
          fetchStatus: 'not-found',
        },
      });
      setPlateState('error');
      return;
    }

    updateSession({
      vehicle: {
        ...vehicle,
        plate: normalized,
        fetchStatus: 'fetching',
      },
    });
    void navigate(purchaseJourneyPaths.r04Fetching);
  }, [navigate, plate, updateSession, vehicle]);

  return (
    <R03VehicleNumberScreen
      plateValue={plate}
      plateState={plateState}
      onPlateChange={(value) => {
        setPlate(value);
        if (plateState === 'error') {
          setPlateState(value.trim() ? 'filled' : 'empty');
          updateSession({
            vehicle: {
              ...vehicle,
              plate: normalizePlate(value),
              fetchStatus: 'idle',
            },
          });
        } else {
          setPlateState(value.trim() ? 'filled' : 'empty');
        }
      }}
      onBack={() => {
        void navigate(authJourneyPaths.vehicleOwner);
      }}
      onContinue={handleFetch}
    />
  );
}

function R04Route() {
  const navigate = useNavigate();
  const { session, updateSession } = useJourney();
  const { purchase } = usePurchaseCheckout();
  const plate = session.vehicle?.plate ?? '';

  useEffect(() => {
    if (redirectIfPaymentSucceeded(navigate, purchase)) {
      return;
    }
    if (!plate) {
      void navigate(purchaseJourneyPaths.r03Vehicle, { replace: true });
      return;
    }

    const intent = getPlateFetchIntent(plate);
    if (intent === 'invalid') {
      updateSession({
        vehicle: {
          plate: normalizePlate(plate),
          fetchStatus: 'not-found',
        },
      });
      void navigate(purchaseJourneyPaths.r03Vehicle, { replace: true });
      return;
    }

    const abortController = new AbortController();

    void (async () => {
      const result = await fetchVahanDetails(plate);

      if (abortController.signal.aborted) {
        return;
      }

      if (result.status === 'success') {
        updateSession({
          vehicle: {
            plate: result.plate,
            fields: result.fields,
            fetchStatus: 'success',
          },
        });
        void navigate(purchaseJourneyPaths.r05Confirm, { replace: true });
        return;
      }

      updateSession({
        vehicle: {
          plate: result.plate,
          fetchStatus: 'error',
        },
      });
      void navigate(purchaseJourneyPaths.r04bFetchFailed, { replace: true });
    })();

    return () => {
      abortController.abort();
    };
  }, [navigate, plate, purchase, updateSession]);

  return <R04FetchingVehicleScreen />;
}

function R04bRoute() {
  const navigate = useNavigate();
  const { session, purchase, updateSession } = usePurchaseCheckout();
  const vehicle = session.vehicle ?? {};

  useEffect(() => {
    redirectIfPaymentSucceeded(navigate, purchase);
  }, [navigate, purchase]);

  return (
    <R04bFetchFailedScreen
      onRetry={() => {
        updateSession({
          vehicle: {
            ...vehicle,
            fetchStatus: 'idle',
          },
        });
        void navigate(purchaseJourneyPaths.r03Vehicle);
      }}
      onEnterManually={() => {
        updateSession({
          vehicle: {
            ...vehicle,
            fetchStatus: 'not-found',
          },
        });
        void navigate(purchaseJourneyPaths.r03Vehicle);
      }}
    />
  );
}

function R05Route() {
  const navigate = useNavigate();
  const { session, updateSession } = useJourney();
  const { purchase } = usePurchaseCheckout();
  const vehicle = session.vehicle ?? {};

  useEffect(() => {
    if (redirectIfPaymentSucceeded(navigate, purchase)) {
      return;
    }
    if (!vehicle.plate || vehicle.fetchStatus !== 'success' || !vehicle.fields?.length) {
      void navigate(purchaseJourneyPaths.r03Vehicle, { replace: true });
    }
  }, [navigate, purchase, vehicle.fields, vehicle.fetchStatus, vehicle.plate]);

  return (
    <R05ConfirmVehicleScreen
      plate={vehicle.plate}
      fields={vehicle.fields}
      onBack={() => {
        void navigate(purchaseJourneyPaths.r03Vehicle);
      }}
      onContinue={() => {
        updateSession({
          vehicle: {
            ...vehicle,
            confirmed: true,
          },
          purchase: {
            selectedPlanId: DEFAULT_PURCHASE_PLAN_ID,
            riderCount: 1,
            promoApplied: false,
            promoCode: null,
            promoInvalid: false,
            checkoutReady: false,
            paymentStatus: 'idle',
          },
        });
        void navigate(purchaseJourneyPaths.r06ChoosePlan);
      }}
    />
  );
}

function R06Route() {
  const navigate = useNavigate();
  const { session, planId, patchPurchase, purchase } = usePurchaseCheckout();

  useEffect(() => {
    if (redirectIfPaymentSucceeded(navigate, purchase)) {
      return;
    }
    if (!session.vehicle?.confirmed) {
      void navigate(purchaseJourneyPaths.r05Confirm, { replace: true });
    }
  }, [navigate, purchase, session.vehicle?.confirmed]);

  return (
    <R06ChoosePlanScreen
      selectedPlanId={planId}
      onSelectPlan={(id: PurchasePlanId) => {
        patchPurchase({ selectedPlanId: id });
      }}
      onBack={() => {
        void navigate(purchaseJourneyPaths.r05Confirm);
      }}
      onContinue={() => {
        patchPurchase({ selectedPlanId: planId });
        void navigate(purchaseJourneyPaths.r07RiderCover);
      }}
    />
  );
}

function R07Route() {
  const navigate = useNavigate();
  const { session, planId, riderCount, patchPurchase, purchase } = usePurchaseCheckout();
  const selectedRiderCount: Exclude<PurchaseRiderCount, 0> =
    riderCount === 0 ? 1 : riderCount;

  useEffect(() => {
    if (redirectIfPaymentSucceeded(navigate, purchase)) {
      return;
    }
    if (!session.vehicle?.confirmed || !session.purchase?.selectedPlanId) {
      void navigate(purchaseJourneyPaths.r06ChoosePlan, { replace: true });
    }
  }, [navigate, purchase, session.purchase?.selectedPlanId, session.vehicle?.confirmed]);

  const goToSummary = (count: PurchaseRiderCount) => {
    patchPurchase({ riderCount: count, promoApplied: false, promoCode: null });
    void navigate(purchaseJourneyPaths.r08OrderSummary);
  };

  return (
    <R07RiderCoverScreen
      selectedPlanId={planId}
      selectedRiderCount={selectedRiderCount}
      onSelectRiderCount={(count) => {
        patchPurchase({ riderCount: count });
      }}
      onSkip={() => {
        goToSummary(0);
      }}
      onBack={() => {
        void navigate(purchaseJourneyPaths.r06ChoosePlan);
      }}
      onContinue={() => {
        goToSummary(selectedRiderCount);
      }}
    />
  );
}

function R08Route() {
  const navigate = useNavigate();
  const { session, planId, riderCount, purchase, patchPurchase } = usePurchaseCheckout();
  const [promoInput, setPromoInput] = useState(purchase.promoCode ?? '');

  useEffect(() => {
    if (redirectIfPaymentSucceeded(navigate, purchase)) {
      return;
    }
    if (!session.purchase?.selectedPlanId) {
      void navigate(purchaseJourneyPaths.r06ChoosePlan, { replace: true });
    }
  }, [navigate, purchase, session.purchase?.selectedPlanId]);

  return (
    <R08OrderSummaryScreen
      selectedPlanId={planId}
      riderCount={riderCount}
      promoCode={promoInput}
      onPromoCodeChange={setPromoInput}
      onApplyPromo={() => {
        if (purchase.paymentStatus === 'success') {
          redirectIfPaymentSucceeded(navigate, purchase);
          return;
        }
        applyPromoCode(promoInput, patchPurchase, navigate);
      }}
      onBack={() => {
        void navigate(purchaseJourneyPaths.r07RiderCover);
      }}
      onContinue={() => {
        startPayment(patchPurchase, navigate, purchase, {
          planId,
          riderCount,
          promoApplied: false,
          promoCode: null,
        });
      }}
    />
  );
}

function R08cRoute() {
  const navigate = useNavigate();
  const { session, planId, riderCount, purchase, patchPurchase } = usePurchaseCheckout();
  const [promoInput, setPromoInput] = useState(purchase.promoCode ?? '');

  useEffect(() => {
    if (redirectIfPaymentSucceeded(navigate, purchase)) {
      return;
    }
    if (!session.purchase?.promoInvalid || !session.purchase.promoCode) {
      void navigate(purchaseJourneyPaths.r08OrderSummary, { replace: true });
    }
  }, [navigate, purchase, session.purchase?.promoCode, session.purchase?.promoInvalid]);

  return (
    <R08cInvalidPromoScreen
      selectedPlanId={planId}
      riderCount={riderCount}
      promoCode={promoInput}
      onPromoCodeChange={(code) => {
        setPromoInput(code);
        if (purchase.promoInvalid) {
          patchPurchase({ promoInvalid: false });
        }
      }}
      onApplyPromo={() => {
        applyPromoCode(promoInput, patchPurchase, navigate);
      }}
      onBack={() => {
        patchPurchase({ promoInvalid: false, promoCode: null });
        void navigate(purchaseJourneyPaths.r08OrderSummary);
      }}
      onContinue={() => {
        startPayment(patchPurchase, navigate, purchase, {
          planId,
          riderCount,
          promoApplied: false,
          promoCode: null,
        });
      }}
    />
  );
}

function R08bRoute() {
  const navigate = useNavigate();
  const { session, planId, riderCount, purchase, patchPurchase } = usePurchaseCheckout();

  useEffect(() => {
    if (redirectIfPaymentSucceeded(navigate, purchase)) {
      return;
    }
    if (!session.purchase?.promoApplied || !session.purchase.promoCode) {
      void navigate(getOrderSummaryPath(false, session.purchase?.promoInvalid), { replace: true });
    }
  }, [navigate, purchase, session.purchase?.promoApplied, session.purchase?.promoCode, session.purchase?.promoInvalid]);

  return (
    <R08bPromoAppliedScreen
      selectedPlanId={planId}
      riderCount={riderCount}
      promoCode={purchase.promoCode ?? VALID_PROMO_CODE}
      onRemovePromo={() => {
        if (purchase.paymentStatus === 'success') {
          redirectIfPaymentSucceeded(navigate, purchase);
          return;
        }
        patchPurchase({ promoApplied: false, promoCode: null });
        void navigate(purchaseJourneyPaths.r08OrderSummary);
      }}
      onBack={() => {
        void navigate(purchaseJourneyPaths.r08OrderSummary);
      }}
      onContinue={() => {
        startPayment(patchPurchase, navigate, purchase, {
          planId,
          riderCount,
          promoApplied: true,
          promoCode: purchase.promoCode ?? VALID_PROMO_CODE,
        });
      }}
    />
  );
}

function R09Route() {
  const navigate = useNavigate();
  const { session, planId, purchase, patchPurchase } = usePurchaseCheckout();

  useEffect(() => {
    if (redirectIfPaymentSucceeded(navigate, purchase)) {
      return;
    }
    if (!session.purchase?.checkoutReady || session.purchase.paymentStatus !== 'processing') {
      void navigate(getOrderSummaryPath(session.purchase?.promoApplied, session.purchase?.promoInvalid), {
        replace: true,
      });
    }
  }, [
    navigate,
    purchase,
    session.purchase?.checkoutReady,
    session.purchase?.paymentStatus,
    session.purchase?.promoApplied,
    session.purchase?.promoInvalid,
  ]);

  useEffect(() => {
    if (session.purchase?.paymentStatus !== 'processing' || purchase.paymentStatus === 'success') {
      return;
    }

    let cancelled = false;

    const timer = window.setTimeout(() => {
      if (cancelled) {
        return;
      }

      const outcome = getDemoPaymentOutcome(planId);
      if (outcome === 'confirming') {
        patchPurchase({ paymentStatus: 'confirming' });
        void navigate(purchaseJourneyPaths.r09bStillConfirming, { replace: true });
        return;
      }
      if (outcome === 'success') {
        patchPurchase({ paymentStatus: 'success' });
        void navigate(purchaseJourneyPaths.r10PaymentSuccess, { replace: true });
        return;
      }
      if (outcome === 'unconfirmed') {
        patchPurchase({ paymentStatus: 'unconfirmed' });
        void navigate(purchaseJourneyPaths.r10cPaymentUnconfirmed, { replace: true });
        return;
      }

      patchPurchase({ paymentStatus: 'failed' });
      void navigate(purchaseJourneyPaths.r10bPaymentFailed);
    }, PAYMENT_PROCESSING_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [navigate, patchPurchase, planId, purchase.paymentStatus, session.purchase?.paymentStatus]);

  return <R09ProcessingPaymentScreen />;
}

function R09bRoute() {
  const navigate = useNavigate();
  const { session, planId, purchase, patchPurchase } = usePurchaseCheckout();

  useEffect(() => {
    if (redirectIfPaymentSucceeded(navigate, purchase)) {
      return;
    }
    if (session.purchase?.paymentStatus !== 'confirming') {
      void navigate(getOrderSummaryPath(session.purchase?.promoApplied, session.purchase?.promoInvalid), {
        replace: true,
      });
    }
  }, [
    navigate,
    purchase,
    session.purchase?.paymentStatus,
    session.purchase?.promoApplied,
    session.purchase?.promoInvalid,
  ]);

  const resolveConfirming = useCallback(() => {
    const outcome = resolveConfirmingPaymentOutcome(planId);
    if (outcome === 'success') {
      patchPurchase({ paymentStatus: 'success' });
      void navigate(purchaseJourneyPaths.r10PaymentSuccess, { replace: true });
      return;
    }
    patchPurchase({ paymentStatus: 'unconfirmed' });
    void navigate(purchaseJourneyPaths.r10cPaymentUnconfirmed, { replace: true });
  }, [navigate, patchPurchase, planId]);

  useEffect(() => {
    if (session.purchase?.paymentStatus !== 'confirming') {
      return;
    }

    let cancelled = false;
    const timer = window.setTimeout(() => {
      if (cancelled) {
        return;
      }
      resolveConfirming();
    }, PAYMENT_CONFIRMING_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [resolveConfirming, session.purchase?.paymentStatus]);

  return <R09bStillConfirmingScreen onCheckStatus={resolveConfirming} />;
}

function R10Route() {
  const navigate = useNavigate();
  const { setPhase, session, updateSession } = useJourney();
  const { planId, purchase } = usePurchaseCheckout();
  const paidAmountInr = purchase.paidAmountInr ?? 0;

  useEffect(() => {
    if (session.purchase?.paymentStatus !== 'success') {
      void navigate(getOrderSummaryPath(session.purchase?.promoApplied, session.purchase?.promoInvalid), {
        replace: true,
      });
    }
  }, [
    navigate,
    session.purchase?.paymentStatus,
    session.purchase?.promoApplied,
    session.purchase?.promoInvalid,
  ]);

  return (
    <R10PaymentSuccessScreen
      selectedPlanId={planId}
      paidAmountInr={paidAmountInr}
      onContinue={() => {
        setPhase('emergency');
        const purchaseSession = session.purchase ?? {};
        updateSession({
          emergency: {
            ...session.emergency,
            riderSkipped: false,
          },
          purchase: {
            ...purchaseSession,
            riderCount:
              purchaseSession.riderCount ??
              (purchaseSession.selectedPlanId ? 1 : 0),
          },
        });
        void navigate(getPurchasePostPaymentEmergencyPath(), { replace: true });
      }}
    />
  );
}

function R10bRoute() {
  const navigate = useNavigate();
  const { session, patchPurchase } = usePurchaseCheckout();
  const orderSummaryPath = getOrderSummaryPath(
    session.purchase?.promoApplied,
    session.purchase?.promoInvalid,
  );

  useEffect(() => {
    if (session.purchase?.paymentStatus !== 'failed') {
      void navigate(orderSummaryPath, {
        replace: true,
      });
    }
  }, [
    navigate,
    orderSummaryPath,
    session.purchase?.paymentStatus,
  ]);

  return (
    <R10bPaymentFailedScreen
      onBack={() => {
        patchPurchase({
          checkoutReady: false,
          paymentStatus: 'idle',
        });
        void navigate(orderSummaryPath);
      }}
      onRetry={() => {
        patchPurchase({
          checkoutReady: false,
          paymentStatus: 'idle',
        });
        void navigate(orderSummaryPath);
      }}
    />
  );
}

function R10cRoute() {
  const navigate = useNavigate();
  const { session, planId, patchPurchase } = usePurchaseCheckout();

  useEffect(() => {
    if (session.purchase?.paymentStatus !== 'unconfirmed') {
      void navigate(getOrderSummaryPath(session.purchase?.promoApplied, session.purchase?.promoInvalid), {
        replace: true,
      });
    }
  }, [
    navigate,
    session.purchase?.paymentStatus,
    session.purchase?.promoApplied,
    session.purchase?.promoInvalid,
  ]);

  return (
    <R10cPaymentUnconfirmedScreen
      onBack={() => {
        patchPurchase({ paymentStatus: 'processing' });
        void navigate(purchaseJourneyPaths.r09ProcessingPayment);
      }}
      onCheckStatus={() => {
        const outcome = resolveConfirmingPaymentOutcome(planId);
        if (outcome === 'success') {
          patchPurchase({ paymentStatus: 'success' });
          void navigate(purchaseJourneyPaths.r10PaymentSuccess);
          return;
        }
        patchPurchase({ paymentStatus: 'unconfirmed' });
      }}
    />
  );
}

export function PurchaseRoutes() {
  return (
    <PurchaseSegmentBootstrap>
      <Routes>
        <Route index element={<Navigate to={purchaseJourneyPaths.r03Vehicle} replace />} />
        <Route path="r03-vehicle" element={<R03Route />} />
        <Route path="r04-fetching" element={<R04Route />} />
        <Route path="r04b-fetch-failed" element={<R04bRoute />} />
        <Route path="r05-confirm" element={<R05Route />} />
        <Route path="r06-choose-plan" element={<R06Route />} />
        <Route path="r07-rider-cover" element={<R07Route />} />
        <Route path="r08-order-summary" element={<R08Route />} />
        <Route path="r08b-promo-applied" element={<R08bRoute />} />
        <Route path="r08c-invalid-promo" element={<R08cRoute />} />
        <Route path="r09-processing-payment" element={<R09Route />} />
        <Route path="r09b-still-confirming" element={<R09bRoute />} />
        <Route path="r10-payment-success" element={<R10Route />} />
        <Route path="r10b-payment-failed" element={<R10bRoute />} />
        <Route path="r10c-payment-unconfirmed" element={<R10cRoute />} />
        <Route path="*" element={<Navigate to={purchaseJourneyPaths.r03Vehicle} replace />} />
      </Routes>
    </PurchaseSegmentBootstrap>
  );
}

export { purchaseJourneyPaths };
