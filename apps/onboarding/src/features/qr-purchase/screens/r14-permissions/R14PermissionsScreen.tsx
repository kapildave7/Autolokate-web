import { AuthStepShell } from '../../../../components/auth-step-shell/index.js';
import { PermissionRow } from '../../../../components/compositions/permission-row/index.js';
import { PURCHASE_PERMISSIONS } from '../../data/purchase-permissions.js';
import type { PurchasePermissionId, PurchasePermissionsState } from '../../types-checkout.js';

import '../purchase-phase-b.css';
import './r14-permissions.css';

export type R14PermissionsScreenProps = {
  permissions: PurchasePermissionsState;
  onTogglePermission: (id: PurchasePermissionId, enabled: boolean) => void;
  onAllow?: () => void;
  onSkip?: () => void;
  onBack?: () => void;
  showBack?: boolean;
};

/** R14 · Permissions — Figma 32:132 · 764:2199 */
export function R14PermissionsScreen({
  permissions,
  onTogglePermission,
  onAllow,
  onSkip,
  onBack,
  showBack = true,
}: R14PermissionsScreenProps) {
  const allEnabled = Object.values(permissions).every(Boolean);

  return (
    <AuthStepShell
      hideProgress
      progressConfig={null}
      shellClassName="ob-auth-shell--purchase"
      title="A few permissions"
      description="Each has a clear job, and you can change them anytime"
      footerLabel="Allow & continue"
      hideFooter={!allEnabled}
      ctaHelper={allEnabled ? undefined : 'Turn on all permissions to continue'}
      showBack={showBack}
      onBack={onBack}
      onContinue={onAllow}
      contentGap="mobile"
    >
      <div className="ob-r14-permissions">
        <div className="ob-permission-list">
          {PURCHASE_PERMISSIONS.map((permission) => (
            <PermissionRow
              key={permission.id}
              permission={permission}
              enabled={permissions[permission.id]}
              onChange={(enabled) => {
                onTogglePermission(permission.id, enabled);
              }}
            />
          ))}
        </div>
        <button type="button" className="ob-purchase-skip-link" onClick={onSkip}>
          Skip
        </button>
      </div>
    </AuthStepShell>
  );
}
