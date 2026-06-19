import type { LandingEntitlement } from '../../b2b-shared/types-landing.js';

/** Figma 411:38 · Pre-paid welcome — Sharma Fleet / Shield / MH12 AB 1234 */
export function getDemoPrepaidLandingEntitlement(): LandingEntitlement {
  return {
    title: 'Activate your plan',
    bodyCopy: 'Sharma Fleet set up and paid for your plan. Nothing to pay.',
    sectionLabel: 'Covered by',
    partnerName: 'Sharma Fleet',
    partnerInitials: 'SF',
    partnerSubtitle: 'Pre-paid by your company',
    vehiclePlate: 'MH12 AB 1234',
    planId: 'shield',
    riderCount: 0,
    planStatusLabel: 'Paid',
  };
}
