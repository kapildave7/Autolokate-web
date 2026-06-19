import { AlIcon } from '@autolokate/icons';
import { AlAvatar, AlContactCard } from '@autolokate/ui';

import { formatMobileForDisplay } from '../../../features/emergency/data/demo-data.js';
import { RELATIONSHIP_OPTIONS } from '../../../features/emergency/data/relationships.js';
import type { EmergencyContact, EmergencyRider } from '../../../features/emergency/types.js';

import './emergency-contact-row.css';

export type EmergencyContactRowProps = {
  contact: EmergencyContact | EmergencyRider;
};

function getRelationLabel(relation: EmergencyContact['relation']): string {
  return RELATIONSHIP_OPTIONS.find((option) => option.id === relation)?.label ?? relation;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return '?';
  }
  const first = parts[0];
  const second = parts[1];
  if (!first) {
    return '?';
  }
  if (!second) {
    return first.slice(0, 1).toUpperCase();
  }
  return `${first.slice(0, 1)}${second.slice(0, 1)}`.toUpperCase();
}

export function EmergencyContactRow({ contact }: EmergencyContactRowProps) {
  const relationLabel = getRelationLabel(contact.relation);
  const verified = 'verified' in contact ? contact.verified : true;

  return (
    <AlContactCard
      className="ob-emergency-contact-card"
      name={contact.name}
      subtitle={`${relationLabel} · ${formatMobileForDisplay(contact.mobile)}`}
      verified={verified}
      avatar={
        <AlAvatar size="md" initials={getInitials(contact.name)} aria-hidden />
      }
      verifiedIcon={<AlIcon name="circle-check" size={20} aria-hidden />}
    />
  );
}
