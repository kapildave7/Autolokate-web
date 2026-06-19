import type { PurchasePlanDefinition, PurchasePlanId } from '../types-checkout.js';

/** Figma 183:25 / 232:102 — four AlPlanCardW instances in carousel. */
export const PURCHASE_PLANS: readonly PurchasePlanDefinition[] = [
  {
    id: 'safe',
    name: 'Safe',
    priceLabel: '₹99/yr',
    priceInr: 99,
    features: [
      'QR identity, Park Me & parking memory',
      'Phone dashcam',
      'Challan, FASTag & renewal alerts',
      'Community, service history & Angel',
      '1 emergency contact + WhatsApp alert',
    ],
  },
  {
    id: 'secure',
    name: 'Secure',
    priceLabel: '₹999/yr',
    priceInr: 999,
    badge: 'MOST POPULAR',
    includesLabel: 'Includes everything in Safe',
    tall: true,
    features: [
      'Automatic crash detection',
      'Ambulance + ₹3,000 cover',
      '2 contacts + AI calling',
      '₹1L accidental · ₹1,000/day hospital',
      'Driver score & leaderboard',
    ],
    addon: { label: 'Rider cover · up to 2 · add-on' },
  },
  {
    id: 'shield',
    name: 'Shield',
    priceLabel: '₹1,999/yr',
    priceInr: 1999,
    includesLabel: 'Includes everything in Secure',
    features: [
      'Roadside assistance (50 km)',
      '₹3L accidental · ₹1,500/day hospital',
      'Ambulance cover ₹5,000',
    ],
    addon: { label: 'Rider cover · up to 2 · add-on' },
  },
  {
    id: 'shield-plus',
    name: 'Shield+',
    priceLabel: '₹2,999/yr',
    priceInr: 2999,
    includesLabel: 'Includes everything in Shield',
    features: [
      'Roadside assistance (100 km+)',
      '₹5L accidental · ₹2,000/day hospital',
      'Ambulance cover ₹10,000',
    ],
    addon: { label: 'Rider cover · up to 2 · add-on' },
  },
] as const;

export const DEFAULT_PURCHASE_PLAN_ID: PurchasePlanId = 'secure';

export const VALID_PROMO_CODE = 'FRIEND50';
export const PROMO_DISCOUNT_INR = 100;

export function getPurchasePlan(planId: PurchasePlanId): PurchasePlanDefinition {
  const plan = PURCHASE_PLANS.find((entry) => entry.id === planId);
  if (plan) {
    return plan;
  }
  const fallbackPlan = PURCHASE_PLANS[1];
  if (!fallbackPlan) {
    throw new Error('Default purchase plan missing from catalog');
  }
  return fallbackPlan;
}
