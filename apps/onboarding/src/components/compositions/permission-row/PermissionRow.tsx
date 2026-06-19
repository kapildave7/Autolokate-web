import { AlIcon } from '@autolokate/icons';
import { AlToggle } from '@autolokate/ui';

import type { PurchasePermissionDefinition } from '../../../features/qr-purchase/types-checkout.js';

import './permission-row.css';

export type PermissionRowProps = {
  permission: PurchasePermissionDefinition;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
};

/** Figma R14 layout_CVZEGR — icon tile + copy + toggle row. */
export function PermissionRow({ permission, enabled, onChange }: PermissionRowProps) {
  return (
    <div className="ob-permission-row">
      <div className="ob-permission-row__icon-tile">
        <AlIcon name={permission.icon} size={22} aria-hidden />
      </div>
      <div className="ob-permission-row__body">
        <span className="ob-permission-row__title">{permission.title}</span>
        <span className="ob-permission-row__recommended">{permission.recommended}</span>
        {enabled ? null : (
          <span className="ob-permission-row__consequence">{permission.offConsequence}</span>
        )}
      </div>
      <AlToggle
        className="ob-permission-row__toggle"
        checked={enabled}
        onChange={(event) => {
          onChange(event.target.checked);
        }}
        aria-label={`${permission.title} permission`}
      />
    </div>
  );
}
