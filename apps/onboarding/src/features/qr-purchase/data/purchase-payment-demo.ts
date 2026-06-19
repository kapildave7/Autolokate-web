import type { PurchasePlanId } from '../types-checkout.js';

export type DemoPaymentOutcome = 'success' | 'failed' | 'confirming' | 'unconfirmed';

/** Demo payment routing — Shield+ fails; Shield unconfirmed; Secure confirming; others succeed. */
export function getDemoPaymentOutcome(planId: PurchasePlanId): DemoPaymentOutcome {
  if (planId === 'shield-plus') {
    return 'failed';
  }
  if (planId === 'shield') {
    return 'unconfirmed';
  }
  if (planId === 'secure') {
    return 'confirming';
  }
  return 'success';
}

/** After R09b "Check status" — resolve confirming flows. */
export function resolveConfirmingPaymentOutcome(planId: PurchasePlanId): 'success' | 'unconfirmed' {
  return planId === 'shield' ? 'unconfirmed' : 'success';
}

export const PAYMENT_PROCESSING_MS = 3000;
export const PAYMENT_CONFIRMING_MS = 4000;
