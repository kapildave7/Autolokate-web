import { AlButton, AlHeading, AlScreenBg, AlText } from '@autolokate/ui';

import './PwaOfflineScreen.css';

type PwaOfflineScreenProps = {
  onRetry?: () => void;
};

/** In-app offline recovery — avoids white screen when shell is loaded but network drops. */
export function PwaOfflineScreen({ onRetry }: PwaOfflineScreenProps) {
  return (
    <AlScreenBg variant="protected" className="pwa-offline-screen">
      <img className="pwa-offline-screen__icon" src="/icons/icon-192.png" width="72" height="72" alt="" />
      <AlHeading variant="h2">You're offline</AlHeading>
      <AlText tone="muted" className="pwa-offline-screen__description">
        Autolokate needs a connection to continue. Check your network, then try again.
      </AlText>
      <AlButton
        variant="primary"
        onClick={() => {
          if (onRetry) {
            onRetry();
            return;
          }
          window.location.reload();
        }}
      >
        Try again
      </AlButton>
    </AlScreenBg>
  );
}
