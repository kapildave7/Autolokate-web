import { chromium } from 'playwright';
import { join } from 'node:path';

const BASE = 'http://127.0.0.1:5175';
const OUT = join(import.meta.dirname, 'live');
const STORAGE_KEY = 'al-pwa-scan-v1';

const baseSession = {
  bootstrapComplete: true,
  verified: true,
  mobile: '9999999999',
  name: 'Kapil',
  consentAccepted: true,
  pendingFlow: null,
  scannedVehicle: {
    plate: 'MH 12 AB 1234',
    modelSummary: 'White · Maruti Swift',
    protected: true,
    planLabel: 'Safe',
    fields: [],
  },
  reporterPlate: 'MH 12 AB 3456',
  reporterFields: [],
  reporterProtected: true,
  reporterPlanLabel: 'Safe',
  permissionsGranted: true,
  parkMePhotos: { front: 'data:image/svg+xml,<svg/>', rear: 'data:image/svg+xml,<svg/>' },
  location: { lat: 19.076, lng: 72.8777 },
  parkMeStatus: 'idle',
  sosPhotos: { front: null, rear: null, left: null, right: null },
  sosStatus: 'idle',
  simulateNetworkFail: false,
  locationDenied: false,
};

const fixes = [
  {
    file: '14-sos',
    path: '/pwa/scan/sos',
    session: { location: { lat: 19.076, lng: 72.8777 }, locationDenied: false },
  },
  {
    file: '19-help-received',
    path: '/pwa/scan/sos/help-received',
    session: { sosStatus: 'help-received' },
    height: 920,
  },
  {
    file: '20-help-dispatched',
    path: '/pwa/scan/sos/help-dispatched',
    session: { sosStatus: 'dispatched' },
    height: 920,
  },
  {
    file: '21-incident-resolved',
    path: '/pwa/scan/sos/resolved',
    session: { sosStatus: 'resolved' },
    height: 920,
  },
];

const browser = await chromium.launch();
for (const fix of fixes) {
  const context = await browser.newContext({
    viewport: { width: 393, height: fix.height ?? 852 },
    deviceScaleFactor: 2,
    colorScheme: 'dark',
  });
  const page = await context.newPage();
  const session = { ...baseSession, ...fix.session };
  await page.addInitScript(
    ({ key, value }) => window.sessionStorage.setItem(key, JSON.stringify(value)),
    { key: STORAGE_KEY, value: session },
  );
  await page.goto(`${BASE}${fix.path}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: join(OUT, `${fix.file}.png`), fullPage: false });
  await context.close();
  console.log('fixed', fix.file);
}
await browser.close();
