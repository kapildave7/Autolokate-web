import type { ActivationFlowId } from '../../journey/types.js';

export type QrScanScreenProps = {
  onScan?: () => void;
  onSelectFlow?: (flow: ActivationFlowId) => void;
  onBack?: () => void;
  showBack?: boolean;
};
