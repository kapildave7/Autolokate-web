import type { PurchasePermissionDefinition } from '../types-checkout.js';

/** Figma R14 / R14b — three permission cards. */
export const PURCHASE_PERMISSIONS: readonly PurchasePermissionDefinition[] = [
  {
    id: 'location',
    title: 'Location',
    recommended: 'Recommended · Guide help to your exact spot in a crash',
    offConsequence: 'Off · we can\'t guide help to your spot in a crash',
    icon: 'map-pin',
  },
  {
    id: 'crashDetection',
    title: 'Crash detection',
    recommended: 'Recommended · Sense a serious impact automatically',
    offConsequence: 'Off · you won\'t be auto-alerted in a crash',
    icon: 'shield-check',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    recommended: 'Renewals, bookings and safety alerts',
    offConsequence: 'Off · you may miss renewals and safety alerts',
    icon: 'bell',
  },
] as const;
