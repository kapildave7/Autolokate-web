import type { PurchasePlanId, PurchaseRiderCount } from '../qr-purchase/types-checkout.js';
import {
  B2B_INCLUDES_LABEL,
  B2B_RIDER_ROW_LABEL,
  B2B_SECURE_FEATURES,
  B2B_SHIELD_FEATURES,
} from './b2b-welcome-copy.js';

export type WelcomePlanDisplay = {
  planName: string;
  priceDisplay?: string;
  includesLabel: string;
  features: readonly string[];
  riderRowLabel?: string;
};

export function resolveWelcomePlanDisplay(
  planId: PurchasePlanId,
  priceDisplay: string | undefined,
  riderCount: PurchaseRiderCount,
): WelcomePlanDisplay {
  const isShield = planId === 'shield';
  const showRider = riderCount > 0;

  return {
    planName: isShield ? 'Shield' : 'Secure',
    priceDisplay: priceDisplay || undefined,
    includesLabel: B2B_INCLUDES_LABEL,
    features: isShield ? B2B_SHIELD_FEATURES : B2B_SECURE_FEATURES,
    riderRowLabel: showRider ? B2B_RIDER_ROW_LABEL : undefined,
  };
}
