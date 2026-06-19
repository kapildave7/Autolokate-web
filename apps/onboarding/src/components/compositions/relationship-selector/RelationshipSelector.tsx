import { AlIcon } from '@autolokate/icons';
import { AlRelationGrid } from '@autolokate/ui';

import { RELATIONSHIP_OPTIONS } from '../../../features/emergency/data/relationships.js';
import type { RelationshipId } from '../../../features/emergency/types.js';

export type RelationshipSelectorProps = {
  value?: RelationshipId;
  onChange?: (relation: RelationshipId) => void;
  disabled?: boolean;
};

/** Thin wrapper — options from emergency data; grid primitive lives in @autolokate/ui. */
export function RelationshipSelector({ value, onChange, disabled = false }: RelationshipSelectorProps) {
  return (
    <AlRelationGrid
      className="ob-relationship-selector"
      value={value}
      onChange={onChange}
      disabled={disabled}
      options={RELATIONSHIP_OPTIONS.map((option) => ({
        id: option.id,
        label: option.label,
        icon: <AlIcon name={option.icon} size={26} aria-hidden />,
      }))}
    />
  );
}
