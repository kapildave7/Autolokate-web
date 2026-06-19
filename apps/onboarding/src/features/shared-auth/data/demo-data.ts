/** Valid demo mobile — only 9999999999 passes validation. */
export const demoMobileRaw = '9999999999';

/** Figma display format for mobile numbers. */
export function formatMobileForDisplay(value: string): string {
  const digits = value.replace(/\D/g, '').slice(-10);
  if (digits.length <= 5) {
    return digits;
  }
  return `${digits.slice(0, 5)} ${digits.slice(5)}`;
}

export const demoMobileDisplay = formatMobileForDisplay(demoMobileRaw);

/** @deprecated Use demoMobileDisplay */
export const demoMobile = demoMobileDisplay;

/** Valid demo OTP. */
export const demoOtp = '123456';
