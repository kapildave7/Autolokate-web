import type { AlIconName } from '@autolokate/icons';

import type { RelationshipId } from '../types.js';

export type RelationshipOption = {
  id: RelationshipId;
  label: string;
  icon: AlIconName;
};

/** Figma E3 / R3 relation tiles — icons mapped to available DS icon set. */
export const RELATIONSHIP_OPTIONS: readonly RelationshipOption[] = [
  { id: 'spouse', label: 'Spouse', icon: 'heart' },
  { id: 'parent', label: 'Parent', icon: 'user' },
  { id: 'child', label: 'Child', icon: 'circle-user' },
  { id: 'sibling', label: 'Sibling', icon: 'users' },
  { id: 'friend', label: 'Friend', icon: 'smile' },
  { id: 'relative', label: 'Relative', icon: 'house' },
  { id: 'colleague', label: 'Colleague', icon: 'store' },
  { id: 'other', label: 'Other', icon: 'ellipsis' },
] as const;
