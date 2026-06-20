export function isIosDevice(): boolean {
  if (typeof navigator === 'undefined') {
    return false;
  }
  const ua = navigator.userAgent;
  return (
    /iPad|iPhone|iPod/.test(ua) ||
    (/\bMac\b/.test(ua) && navigator.maxTouchPoints > 1)
  );
}

export function isIosSafari(): boolean {
  if (!isIosDevice()) {
    return false;
  }
  const ua = navigator.userAgent;
  return /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua);
}

/** iOS Chrome, Edge, Firefox, etc. — WebKit wrapper without native install prompt. */
export function isIosNonSafariBrowser(): boolean {
  if (!isIosDevice()) {
    return false;
  }
  return !isIosSafari();
}

export function isAndroidDevice(): boolean {
  return /Android/.test(navigator.userAgent);
}

export function isStandaloneDisplay(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in window.navigator &&
      Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone))
  );
}
