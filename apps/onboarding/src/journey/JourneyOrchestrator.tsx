import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { PwaScanRoutes } from '../features/post-activation-pwa/routes/PwaScanRoutes.js';
import { JourneyProvider } from './JourneyContext.js';
import { JourneyRoutes } from './routes/JourneyRoutes.js';

import './journey.css';

/** Top-level router — PWA segment isolated from onboarding journey provider. */
export function JourneyOrchestrator() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/pwa/scan/*" element={<PwaScanRoutes />} />
        <Route
          path="*"
          element={
            <JourneyProvider>
              <JourneyRoutes />
            </JourneyProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
