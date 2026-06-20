import { demoMobileRaw } from '@/features/shared-auth/data/demo-data.js';
import { formatMobileIntl } from '@/shared/format-mobile.js';

import type { RelationshipId } from '../types.js';

export const demoRiderName = 'Rohan Sharma';
export const demoContactName = 'Anita Sharma';
export const demoMobileDisplay = formatMobileIntl(demoMobileRaw);

export const demoPickerContact = {
  name: demoContactName,
  mobile: demoMobileRaw,
  relation: 'spouse' as RelationshipId,
};

export { formatMobileIntl as formatMobileForDisplay };
