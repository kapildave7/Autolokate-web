import { AlIcon } from '@autolokate/icons';
import { AlButton, AlText } from '@autolokate/ui';

import { AuthStepShell } from '../../../../components/auth-step-shell/index.js';
import { SHARED_AUTH_PROGRESS_TOTAL } from '../../../../journey/progress/index.js';
import { flowLabels } from '../../../../journey/constants.js';
import type { ActivationFlowId } from '../../../../journey/types.js';
import { QR_SCAN_STEP } from '../../constants.js';
import type { QrScanScreenProps } from '../../types.js';

import './qr-scan-screen.css';

const demoFlows: ActivationFlowId[] = ['purchase', 'prepaid', 'b2b2c'];

/** QrScan · Step 3 — shared post-auth QR activation entry (Figma-aligned shell). */
export function QrScanScreen({
  onScan,
  onSelectFlow,
  onBack,
  showBack = true,
}: QrScanScreenProps) {
  return (
    <AuthStepShell
      progressConfig={{
        step: QR_SCAN_STEP,
        total: SHARED_AUTH_PROGRESS_TOTAL,
        showProgress: true,
        showMeta: false,
      }}
      title="Scan your sticker"
      description="Point your camera at the Autolokate QR on your vehicle"
      footerLabel="Scan sticker"
      showBack={showBack}
      onBack={onBack}
      onContinue={onScan}
      contentGap="otp"
    >
      <div className="ob-qr-scan__camera" aria-hidden={false}>
        <div className="ob-qr-scan__camera-frame">
          <span className="ob-qr-scan__corner ob-qr-scan__corner--tl" />
          <span className="ob-qr-scan__corner ob-qr-scan__corner--tr" />
          <span className="ob-qr-scan__corner ob-qr-scan__corner--bl" />
          <span className="ob-qr-scan__corner ob-qr-scan__corner--br" />
        </div>
        <AlIcon name="scan-line" size={40} className="ob-qr-scan__camera-icon" aria-hidden />
        <AlText tone="muted" variant="caption" className="ob-qr-scan__guidance">
          Align the QR inside the frame · good lighting helps
        </AlText>
      </div>

      <section className="ob-qr-scan__demo" aria-label="Demo flow selector">
        <AlText tone="muted" variant="caption" className="ob-qr-scan__demo-label">
          Demo · pick a flow
        </AlText>
        <div className="ob-qr-scan__demo-actions">
          {demoFlows.map((flow) => (
            <AlButton
              key={flow}
              variant="secondary"
              className="ob-qr-scan__demo-btn"
              onClick={() => {
                onSelectFlow?.(flow);
              }}
            >
              {flowLabels[flow]}
            </AlButton>
          ))}
        </div>
      </section>
    </AuthStepShell>
  );
}
