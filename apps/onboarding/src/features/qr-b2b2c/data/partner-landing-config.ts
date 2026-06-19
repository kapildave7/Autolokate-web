import type { LandingEntitlement } from '../../b2b-shared/types-landing.js';
import type { PurchasePlanId, PurchaseRiderCount } from '../../qr-purchase/types-checkout.js';

export type PartnerLandingVariant = 'plan-only' | 'plan-rider';

/** Figma 386:889 / 443:37 · Partner welcome */
export function getDemoPartnerLandingEntitlement(
  variant: PartnerLandingVariant = 'plan-only',
): LandingEntitlement {
  const planId: PurchasePlanId = 'secure';
  const riderCount: PurchaseRiderCount = variant === 'plan-rider' ? 1 : 0;

  return {
    title: 'Activate your plan',
    bodyCopy:
      variant === 'plan-rider'
        ? 'Sharma Motors set up and paid for your plan and rider. Activate it now.'
        : 'Sharma Motors set up and paid for your plan. Activate it now.',
    sectionLabel: 'You got this from',
    partnerName: 'Sharma Motors',
    partnerInitials: 'SM',
    partnerSubtitle: 'Authorised partner',
    vehiclePlate: 'MH12 AB 1234',
    planId,
    riderCount,
    planStatusLabel: 'Paid',
    priceDisplay: '\u20b9999/year',
  };
}
