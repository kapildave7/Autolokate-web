import { getEmergencyPlanLimits, resolvePurchasePlanId } from '../../features/emergency/emergency-limits.js';
import type { EmergencyPlanLimits } from '../../features/emergency/emergency-limits.js';
import type { PurchasePlanId, PurchaseRiderCount } from '../../features/qr-purchase/types-checkout.js';
import type { JourneySession } from '../types.js';

export type EmergencyFoundationContext = {
  planId: PurchasePlanId;
  riderCount: PurchaseRiderCount;
  limits: EmergencyPlanLimits;
};

/** Reads purchase session fields that drive emergency foundation rules. */
export function resolveEmergencyFoundationContext(
  session: Pick<JourneySession, 'purchase'>,
): EmergencyFoundationContext {
  const planId = resolvePurchasePlanId(session.purchase?.selectedPlanId);
  const riderCount = session.purchase?.riderCount ?? 0;

  return {
    planId,
    riderCount,
    limits: getEmergencyPlanLimits(planId),
  };
}
