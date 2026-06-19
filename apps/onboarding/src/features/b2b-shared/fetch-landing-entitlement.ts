import type { LandingEntitlement } from './types-landing.js';

export type LandingFetchResult<T = LandingEntitlement> =
  | { ok: true; entitlement: T }
  | { ok: false; error: 'network' | 'not-found' };

const LANDING_FETCH_DELAY_MS = 2_000;

/** Demo-only entitlement loader — no API. Supports QA via `?demo=loading|error`. */
export async function fetchLandingEntitlement<T>(
  loader: () => T,
  options?: { demo?: string | null; forceError?: boolean },
): Promise<{ ok: true; entitlement: T } | { ok: false; error: 'network' | 'not-found' }> {
  const demo = options?.demo?.toLowerCase();

  await delay(LANDING_FETCH_DELAY_MS);

  if (demo === 'error' || options?.forceError) {
    return { ok: false, error: 'network' };
  }

  return { ok: true, entitlement: loader() };
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}
