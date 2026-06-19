import type {
  OrderSummaryTotals,
  PurchasePlanId,
  PurchaseRiderCount,
} from '../types-checkout.js';

import {
  PROMO_DISCOUNT_INR,
  getPurchasePlan,
} from './purchase-plans.js';

const RIDER_PRICES: Record<Exclude<PurchaseRiderCount, 0>, { price: number; strike: number }> = {
  1: { price: 949, strike: 999 },
  2: { price: 1798, strike: 1998 },
};

export function formatInr(amount: number, suffix = ''): string {
  const formatted = amount.toLocaleString('en-IN');
  return suffix ? `₹${formatted}${suffix}` : `₹${formatted}`;
}

export function getRiderPrice(riderCount: PurchaseRiderCount): number {
  if (riderCount === 0) {
    return 0;
  }
  return RIDER_PRICES[riderCount].price;
}

export function getRiderCtaLabel(riderCount: Exclude<PurchaseRiderCount, 0>): string {
  const price = formatInr(getRiderPrice(riderCount));
  return riderCount === 1 ? `Add 1 rider · ${price}` : `Add 2 riders · ${price}`;
}

export function computeGstInclusive(totalInr: number): number {
  return Math.round((totalInr * 18) / 118);
}

export function buildOrderSummary(params: {
  planId: PurchasePlanId;
  riderCount: PurchaseRiderCount;
  promoApplied?: boolean;
  promoCode?: string | null;
}): OrderSummaryTotals {
  const plan = getPurchasePlan(params.planId);
  const riderInr = getRiderPrice(params.riderCount);
  const promoInr = params.promoApplied ? PROMO_DISCOUNT_INR : 0;
  const totalInr = plan.priceInr + riderInr - promoInr;

  const result: OrderSummaryTotals = {
    planLine: {
      label: `${plan.name} plan`,
      value: plan.priceLabel,
    },
    totalLabel: formatInr(totalInr),
    totalInr,
    gstNote: `Inclusive of 18% GST (${formatInr(computeGstInclusive(totalInr))})`,
    payCtaLabel: `Pay ${formatInr(totalInr)}`,
  };

  if (params.riderCount > 0) {
    result.riderLine = {
      label: `Rider cover × ${String(params.riderCount)}`,
      value: `+${formatInr(riderInr)}`,
    };
  }

  if (params.promoApplied && params.promoCode) {
    result.promoLine = {
      label: `Promo · ${params.promoCode}`,
      value: `−${formatInr(promoInr)}`,
      tone: 'promo',
    };
  }

  return result;
}

export function getPlanContextLabel(planId: PurchasePlanId): string {
  const plan = getPurchasePlan(planId);
  return `${plan.name} plan · ${plan.priceLabel}`;
}

export function getPaymentSuccessDescription(planId: PurchasePlanId, totalInr: number): string {
  const plan = getPurchasePlan(planId);
  return `${formatInr(totalInr)} paid · your ${plan.name} plan is now active`;
}

export function getActivationCompleteTitle(planId: PurchasePlanId): string {
  const plan = getPurchasePlan(planId);
  return `${plan.name} is active`;
}

export function getActivationCompleteDescription(plate: string, planId: PurchasePlanId): string {
  const plan = getPurchasePlan(planId);
  return `${plate} is now protected by ${plan.name}. Crash detection is live`;
}

export function getActivationChipLabel(planId: PurchasePlanId): string {
  const plan = getPurchasePlan(planId);
  return `${plan.name} · active`;
}
