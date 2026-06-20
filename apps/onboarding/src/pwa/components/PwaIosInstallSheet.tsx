import { AlButton, AlPermissionSheet } from '@autolokate/ui';

import { PWA_INSTALL_DISMISS_KEY, PWA_INSTALL_DISMISS_MS } from '../constants.js';

import './PwaIosInstallSheet.css';

type PwaIosInstallSheetProps = {
  open: boolean;
  onDismiss: () => void;
};

function readDismissedRecently(): boolean {
  const raw = window.localStorage.getItem(PWA_INSTALL_DISMISS_KEY);
  if (!raw) {
    return false;
  }
  const dismissedAt = Number(raw);
  if (!Number.isFinite(dismissedAt)) {
    return false;
  }
  return Date.now() - dismissedAt < PWA_INSTALL_DISMISS_MS;
}

export function shouldShowIosInstallSheet(): boolean {
  return !readDismissedRecently();
}

export function dismissIosInstallSheet(): void {
  window.localStorage.setItem(PWA_INSTALL_DISMISS_KEY, String(Date.now()));
}

/** iOS Chrome / Edge — must open in Safari to install. */
export function PwaIosInstallSheet({ open, onDismiss }: PwaIosInstallSheetProps) {
  return (
    <AlPermissionSheet
      open={open}
      title="Install on your iPhone"
      description="Chrome on iPhone can't install apps directly. Use Safari to add Autolokate to your home screen."
      primaryLabel="Got it"
      onPrimary={onDismiss}
      secondaryLabel="Not now"
      onSecondary={onDismiss}
      onDismiss={onDismiss}
    >
      <ol className="pwa-ios-install-sheet__steps">
        <li>
          Open this page in <strong>Safari</strong>
        </li>
        <li>
          Tap <strong>Share</strong>
        </li>
        <li>
          Tap <strong>Add to Home Screen</strong>
        </li>
      </ol>
    </AlPermissionSheet>
  );
}

type PwaIosSafariInstallBannerProps = {
  onDismiss: () => void;
};

/** iOS Safari — Add to Home Screen guidance. */
export function PwaIosSafariInstallBanner({ onDismiss }: PwaIosSafariInstallBannerProps) {
  return (
    <section className="pwa-ios-safari-banner" aria-label="Install Autolokate">
      <div className="pwa-ios-safari-banner__copy">
        <p className="pwa-ios-safari-banner__title">Add to Home Screen</p>
        <p className="pwa-ios-safari-banner__description">
          Tap Share, then &quot;Add to Home Screen&quot; for quick SOS access.
        </p>
      </div>
      <div className="pwa-ios-safari-banner__actions">
        <AlButton size="sm" variant="primary" onClick={onDismiss}>
          Got it
        </AlButton>
        <button type="button" className="pwa-ios-safari-banner__dismiss" onClick={onDismiss}>
          Not now
        </button>
      </div>
    </section>
  );
}
