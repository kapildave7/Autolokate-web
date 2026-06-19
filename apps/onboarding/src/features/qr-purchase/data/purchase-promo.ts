import { VALID_PROMO_CODE } from './purchase-plans.js';

export function normalizePromoCode(code: string): string {
  return code.trim().toUpperCase();
}

export function isValidPromoCode(code: string): boolean {
  return normalizePromoCode(code) === VALID_PROMO_CODE;
}
