import { journeyPaths } from '../constants.js';

import type { RouteProgressConfig } from './route-progress.types.js';

const purchaseBase = journeyPaths.purchase;

/** Figma Consumer · QR Activation + Purchase — no step progress bar on any purchase frame. */
export const purchaseRouteProgressByPath: Record<string, RouteProgressConfig | null> = {
  [`${purchaseBase}/r03-vehicle`]: null,
  [`${purchaseBase}/r04-fetching`]: null,
  [`${purchaseBase}/r04b-fetch-failed`]: null,
  [`${purchaseBase}/r05-confirm`]: null,
  [`${purchaseBase}/r06-choose-plan`]: null,
  [`${purchaseBase}/r07-rider-cover`]: null,
  [`${purchaseBase}/r08-order-summary`]: null,
  [`${purchaseBase}/r08b-promo-applied`]: null,
  [`${purchaseBase}/r09-processing-payment`]: null,
  [`${purchaseBase}/r10-payment-success`]: null,
  [`${purchaseBase}/r10b-payment-failed`]: null,
};

export function getPurchaseRouteProgress(pathname: string): RouteProgressConfig | null {
  const normalized = pathname.replace(/\/+$/, '');
  if (normalized.startsWith(`${purchaseBase}/`) || normalized === purchaseBase) {
    return purchaseRouteProgressByPath[normalized] ?? null;
  }
  return null;
}
