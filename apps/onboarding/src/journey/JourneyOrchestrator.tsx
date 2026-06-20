import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { AutolokateRootProvider } from '../platform/AutolokateRootProvider.js';
import { PwaScanRoutes } from '../features/post-activation-pwa/routes/PwaScanRoutes.js';
import { PwaAppShell } from '../pwa/index.js';
import { JourneyRoutes } from './routes/JourneyRoutes.js';

import './journey.css';

/** Top-level router — both journey and PWA segments share AutolokateRootProvider. */
export function JourneyOrchestrator() {
  return (
    <BrowserRouter>
      <AutolokateRootProvider>
        <PwaAppShell>
          <Routes>
            <Route path="/pwa/scan/*" element={<PwaScanRoutes />} />
            <Route path="*" element={<JourneyRoutes />} />
          </Routes>
        </PwaAppShell>
      </AutolokateRootProvider>
    </BrowserRouter>
  );
}
