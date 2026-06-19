/** Figma R06 plan tiers — Safe · Secure · Shield · Shield+ */
export type PurchasePlanId = 'safe' | 'secure' | 'shield' | 'shield-plus';

export type PurchaseRiderCount = 0 | 1 | 2;

export type PurchasePaymentStatus =
  | 'idle'
  | 'processing'
  | 'confirming'
  | 'success'
  | 'failed'
  | 'unconfirmed';

export type PurchasePermissionId = 'location' | 'crashDetection' | 'notifications';

export type PurchasePermissionOutcome = 'pending' | 'granted' | 'skipped';

export type PurchasePermissionsState = Record<PurchasePermissionId, boolean>;

export type PurchaseCheckoutSession = {
  selectedPlanId?: PurchasePlanId;
  riderCount?: PurchaseRiderCount;
  promoCode?: string | null;
  promoApplied?: boolean;
  promoInvalid?: boolean;
  /** Set when user taps Pay on R08/R08b. */
  checkoutReady?: boolean;
  paymentStatus?: PurchasePaymentStatus;
  paidAmountInr?: number;
};

export type PurchasePlanDefinition = {
  id: PurchasePlanId;
  name: string;
  priceLabel: string;
  priceInr: number;
  badge?: string;
  includesLabel?: string;
  features: readonly string[];
  addon?: { label: string };
  /** Figma Secure card is 366px vs 340px for others. */
  tall?: boolean;
};

export type OrderSummaryLine = {
  label: string;
  value: string;
  tone?: 'default' | 'promo';
};

export type OrderSummaryTotals = {
  planLine: OrderSummaryLine;
  riderLine?: OrderSummaryLine;
  promoLine?: OrderSummaryLine;
  totalLabel: string;
  totalInr: number;
  gstNote: string;
  payCtaLabel: string;
};

export type PurchasePermissionDefinition = {
  id: PurchasePermissionId;
  title: string;
  recommended: string;
  offConsequence: string;
  icon: 'map-pin' | 'shield-check' | 'bell';
};

export const DEFAULT_PURCHASE_PERMISSIONS: PurchasePermissionsState = {
  location: false,
  crashDetection: false,
  notifications: false,
};
