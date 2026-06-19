const INR_FORMATTER = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

/** Format paise as INR (e.g. 99900 → "₹999"). */
export function formatInrFromPaise(paise: number): string {
  return INR_FORMATTER.format(paise / 100);
}

/** Format a 10-digit Indian mobile number for display (e.g. 9876543210 → "98765 43210"). */
export function formatMobileNumber(mobile: string): string {
  const digits = mobile.replace(/\D/g, '');
  if (digits.length !== 10) {
    return mobile;
  }

  return `${digits.slice(0, 5)} ${digits.slice(5)}`;
}

/** Normalize a vehicle registration string for display (uppercase, collapsed whitespace). */
export function formatVehicleRegistration(registration: string): string {
  return registration.trim().replace(/\s+/g, ' ').toUpperCase();
}

/** Mask a mobile number for safe display (e.g. 9876543210 → "98***3210"). */
export function maskMobileNumber(mobile: string): string {
  const digits = mobile.replace(/\D/g, '');
  if (digits.length < 6) {
    return mobile;
  }

  return `${digits.slice(0, 2)}***${digits.slice(-4)}`;
}
