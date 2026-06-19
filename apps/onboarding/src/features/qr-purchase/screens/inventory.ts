import type { PurchaseScreenInventoryEntry } from '../types.js';

export const purchaseScreenInventory: Record<
  PurchaseScreenInventoryEntry['id'],
  PurchaseScreenInventoryEntry
> = {
  PlanSelection: {
    id: 'PlanSelection',
    stepId: 'purchase.plan-select',
    featureFolder: 'features/qr-purchase/screens/p01-plan-selection',
    figmaRef: '232:102 · R06 Choose plan · AlPlanCardW 231:80',
    description: 'Plan tier carousel — Safe and Secure',
  },
  PlanDetails: {
    id: 'PlanDetails',
    stepId: 'purchase.plan-details',
    featureFolder: 'features/qr-purchase/screens/p02-plan-details',
    figmaRef: '232:102 · Secure tier detail',
    description: 'Selected plan feature recap',
  },
  RiderSelection: {
    id: 'RiderSelection',
    stepId: 'purchase.rider-select',
    featureFolder: 'features/qr-purchase/screens/p03-rider-selection',
    figmaRef: 'Plan addon · Rider cover',
    description: 'Rider add-on toggle and count',
  },
  CheckoutSummary: {
    id: 'CheckoutSummary',
    stepId: 'purchase.checkout-summary',
    featureFolder: 'features/qr-purchase/screens/p04-checkout-summary',
    figmaRef: 'Checkout · line items',
    description: 'Order summary before payment',
  },
  PaymentProcessing: {
    id: 'PaymentProcessing',
    stepId: 'purchase.payment-processing',
    featureFolder: 'features/qr-purchase/screens/p05-payment-processing',
    figmaRef: 'Payment · processing',
    description: 'Payment in progress',
  },
  PaymentSuccess: {
    id: 'PaymentSuccess',
    stepId: 'purchase.payment-success',
    featureFolder: 'features/qr-purchase/screens/p06-payment-success',
    figmaRef: 'Payment · success',
    description: 'Activation complete',
  },
};
