export function normalizeMobile(value: string): string {
  return value.replace(/\D/g, '').slice(-10);
}

export function formatMobileInput(value: string): string {
  const digits = normalizeMobile(value);
  if (digits.length <= 5) {
    return digits;
  }
  return `${digits.slice(0, 5)} ${digits.slice(5, 10)}`;
}

/** Clamp typed input to 10 digits and apply display spacing. */
export function clampMobileInput(value: string): string {
  return formatMobileInput(value.replace(/\D/g, '').slice(0, 10));
}

export const MOBILE_DIGIT_MAX = 10;
export const MOBILE_INPUT_DISPLAY_MAX = 11;

export function isValidMobile(value: string): boolean {
  return normalizeMobile(value) === '9999999999';
}

export function isExpiredOtp(value: string): boolean {
  return value === '000000';
}

export function isValidOtp(value: string): boolean {
  return value === '123456';
}

export const OTP_LENGTH = 6;

/** Figma resend countdown starts at 0:24 */
export const RESEND_COOLDOWN_SECONDS = 24;
