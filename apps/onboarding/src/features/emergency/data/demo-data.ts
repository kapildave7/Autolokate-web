import { demoMobileRaw } from '../../shared-auth/data/demo-data.js';

import type { RelationshipId } from '../types.js';

export const demoRiderName = 'Rohan Sharma';
export const demoContactName = 'Anita Sharma';
export const demoMobileDisplay = '+91 98765 43210';

export const demoPickerContact = {
  name: demoContactName,
  mobile: demoMobileRaw,
  relation: 'spouse' as RelationshipId,
};

export function formatMobileForDisplay(mobile: string): string {
  const digits = mobile.replace(/\D/g, '');
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  return mobile.startsWith('+') ? mobile : `+91 ${mobile}`;
}

/** Figma R2/E2 — "98765 43210" (no country code). */
export function formatMobileForOtpDescription(mobile: string): string {
  const digits = mobile.replace(/\D/g, '');
  const local = digits.length >= 10 ? digits.slice(-10) : digits;
  if (local.length === 10) {
    return `${local.slice(0, 5)} ${local.slice(5)}`;
  }
  return mobile;
}
