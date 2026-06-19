/** Autolokate protection plan tiers (THEMING.md §1). */
export type PlanTier = 'safe' | 'secure' | 'shield' | 'shield-plus';

export type PlanStatus = 'active' | 'pending' | 'expired' | 'cancelled';

export type Plan = {
  id: string;
  tier: PlanTier;
  name: string;
  priceInPaise: number;
  currency: 'INR';
  status: PlanStatus;
  vehicleId: string;
  startsAt: string;
  expiresAt: string;
};

export type PlanSummary = Pick<Plan, 'id' | 'tier' | 'name' | 'priceInPaise' | 'status'>;
