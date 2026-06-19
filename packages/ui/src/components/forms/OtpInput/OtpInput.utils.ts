import type { ClipboardEvent, KeyboardEvent, RefObject } from 'react';

export function buildOtpDigits(length: number, value: string): string[] {
  return Array.from({ length }, (_, index) => value[index] ?? '');
}

export function focusOtpCell(
  inputsRef: RefObject<Array<HTMLInputElement | null>>,
  index: number,
): void {
  inputsRef.current[index]?.focus();
}

export function handleOtpChange(
  digits: string[],
  index: number,
  nextChar: string,
  length: number,
  onChange: (value: string) => void,
  inputsRef: RefObject<Array<HTMLInputElement | null>>,
): void {
  const digit = nextChar.replace(/\D/g, '').slice(-1);
  const next = [...digits];
  next[index] = digit;
  onChange(next.join('').slice(0, length));
  if (digit && index < length - 1) {
    focusOtpCell(inputsRef, index + 1);
  }
}

export function handleOtpKeyDown(
  digits: string[],
  index: number,
  event: KeyboardEvent<HTMLInputElement>,
  inputsRef: RefObject<Array<HTMLInputElement | null>>,
): void {
  if (event.key === 'Backspace' && !digits[index] && index > 0) {
    focusOtpCell(inputsRef, index - 1);
  }
}

export function handleOtpPaste(
  event: ClipboardEvent<HTMLInputElement>,
  length: number,
  onChange: (value: string) => void,
  inputsRef: RefObject<Array<HTMLInputElement | null>>,
): void {
  event.preventDefault();
  const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
  if (!pasted) return;
  onChange(pasted);
  focusOtpCell(inputsRef, Math.min(pasted.length, length - 1));
}
