import type { AlVehicleRcField } from '@autolokate/ui';

import { demoPlate, demoVehicleFields } from '../../purchase-activation/data/demo-data.js';

export type VahanFetchStatus = 'success' | 'not-found' | 'error';

export type PlateFetchIntent = 'success' | 'fetch-error' | 'invalid';

export type VahanFetchResult =
  | {
      status: 'success';
      plate: string;
      fields: AlVehicleRcField[];
    }
  | {
      status: 'not-found' | 'error';
      plate: string;
    };

/** Demo plate — Vahan success (R05). */
export const demoVahanSuccessPlate = demoPlate;

/** Demo plate — Vahan fetch failure (R04b). */
export const demoVahanErrorPlate = 'MH 12 AB 0000';

/** Minimum hold on R04 before transitioning (Figma transient loader). */
export const VAHAN_FETCH_HOLD_MS = 3000;

export function normalizePlate(value: string): string {
  return value.toUpperCase().replace(/\s+/g, ' ').trim();
}

export function isPlateEntryReady(plate: string): boolean {
  return normalizePlate(plate).replace(/\s/g, '').length >= 8;
}

/** Resolve journey branch from plate before leaving R03. */
export function getPlateFetchIntent(plate: string): PlateFetchIntent {
  const normalized = normalizePlate(plate);

  if (normalized === demoVahanSuccessPlate) {
    return 'success';
  }

  if (normalized === demoVahanErrorPlate) {
    return 'fetch-error';
  }

  return 'invalid';
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

/**
 * Mock Vahan lookup — always holds VAHAN_FETCH_HOLD_MS on R04.
 * MH 12 AB 3456 → success · MH 12 AB 0000 → error · others should not reach R04.
 */
export async function fetchVahanDetails(plate: string): Promise<VahanFetchResult> {
  const normalized = normalizePlate(plate);
  const intent = getPlateFetchIntent(normalized);

  await delay(VAHAN_FETCH_HOLD_MS);

  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return { status: 'error', plate: normalized };
  }

  if (intent === 'success') {
    return {
      status: 'success',
      plate: normalized,
      fields: demoVehicleFields,
    };
  }

  if (intent === 'fetch-error') {
    return { status: 'error', plate: normalized };
  }

  return { status: 'not-found', plate: normalized };
}
