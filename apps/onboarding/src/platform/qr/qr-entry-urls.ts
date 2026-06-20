import type { QrPayload } from './qr-dispatch-contract.js';

/** Production deploy base — update when the Vercel domain changes. */
export const QR_ENTRY_BASE_URL = 'https://onboarding-lemon-six.vercel.app';

export function buildQrEntryUrl(payload: QrPayload, baseUrl = QR_ENTRY_BASE_URL): string {
  const url = new URL('/journey', baseUrl);

  url.searchParams.set('type', payload.type);

  switch (payload.type) {
    case 'purchase':
      url.searchParams.set('token', payload.token);
      if (payload.orgId) {
        url.searchParams.set('orgId', payload.orgId);
      }
      break;
    case 'prepaid':
      url.searchParams.set('voucherId', payload.voucherId);
      break;
    case 'b2b2c':
      url.searchParams.set('partnerId', payload.partnerId);
      url.searchParams.set('variant', payload.variant);
      break;
    case 'activated':
      url.searchParams.set('vehicleId', payload.vehicleId);
      url.searchParams.set('plate', payload.plate);
      if (payload.planLabel) {
        url.searchParams.set('planLabel', payload.planLabel);
      }
      break;
    default: {
      const _exhaustive: never = payload;
      return _exhaustive;
    }
  }

  return url.toString();
}

/** Ready-to-print demo URLs for all four Autolokate entry flows. */
export const DEMO_QR_ENTRY_URLS = {
  purchase: buildQrEntryUrl({ type: 'purchase', token: 'demo-purchase-001' }),
  prepaid: buildQrEntryUrl({ type: 'prepaid', voucherId: 'demo-voucher-001' }),
  b2b2cPlanOnly: buildQrEntryUrl({
    type: 'b2b2c',
    partnerId: 'demo-partner-001',
    variant: 'plan-only',
  }),
  b2b2cPlanRider: buildQrEntryUrl({
    type: 'b2b2c',
    partnerId: 'demo-partner-001',
    variant: 'plan-rider',
  }),
  postActivation: buildQrEntryUrl({
    type: 'activated',
    vehicleId: 'demo-vehicle-001',
    plate: 'MH 12 AB 1234',
    planLabel: 'Safe',
  }),
} as const;
