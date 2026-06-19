import { journeyPaths } from '../constants.js';

/** URL paths for the purchase segment inside the journey orchestrator. */
export const purchaseJourneyPaths = {
  r03Vehicle: `${journeyPaths.purchase}/r03-vehicle`,
  r04Fetching: `${journeyPaths.purchase}/r04-fetching`,
  r04bFetchFailed: `${journeyPaths.purchase}/r04b-fetch-failed`,
  r05Confirm: `${journeyPaths.purchase}/r05-confirm`,
  r06ChoosePlan: `${journeyPaths.purchase}/r06-choose-plan`,
  r07RiderCover: `${journeyPaths.purchase}/r07-rider-cover`,
  r08OrderSummary: `${journeyPaths.purchase}/r08-order-summary`,
  r08bPromoApplied: `${journeyPaths.purchase}/r08b-promo-applied`,
  r08cInvalidPromo: `${journeyPaths.purchase}/r08c-invalid-promo`,
  r09ProcessingPayment: `${journeyPaths.purchase}/r09-processing-payment`,
  r09bStillConfirming: `${journeyPaths.purchase}/r09b-still-confirming`,
  r10PaymentSuccess: `${journeyPaths.purchase}/r10-payment-success`,
  r10bPaymentFailed: `${journeyPaths.purchase}/r10b-payment-failed`,
  r10cPaymentUnconfirmed: `${journeyPaths.purchase}/r10c-payment-unconfirmed`,
} as const;

export type PurchaseJourneyPath = (typeof purchaseStepPathSequence)[number];

/** Active purchase journey — Auth → R03–R10 → Emergency handoff on R10 Continue. */
export const purchaseStepPathSequence = [
  purchaseJourneyPaths.r03Vehicle,
  purchaseJourneyPaths.r04Fetching,
  purchaseJourneyPaths.r05Confirm,
  purchaseJourneyPaths.r06ChoosePlan,
  purchaseJourneyPaths.r07RiderCover,
  purchaseJourneyPaths.r08OrderSummary,
  purchaseJourneyPaths.r09ProcessingPayment,
  purchaseJourneyPaths.r10PaymentSuccess,
] as const;

export function getNextPurchasePath(currentPath: string): string | null {
  const index = purchaseStepPathSequence.indexOf(currentPath as PurchaseJourneyPath);
  if (index < 0 || index >= purchaseStepPathSequence.length - 1) {
    return null;
  }
  return purchaseStepPathSequence[index + 1] ?? null;
}

export function getPrevPurchasePath(currentPath: string): string | null {
  const index = purchaseStepPathSequence.indexOf(currentPath as PurchaseJourneyPath);
  if (index <= 0) {
    return null;
  }
  return purchaseStepPathSequence[index - 1] ?? null;
}

/** First purchase screen after Shared Auth (Figma R03). */
export function getPurchaseActivationStartPath(): string {
  return purchaseJourneyPaths.r03Vehicle;
}
