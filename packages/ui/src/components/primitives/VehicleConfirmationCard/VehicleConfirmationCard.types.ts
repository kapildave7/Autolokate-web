export type AlVehicleConfirmationCardVariant = 'scanner';

export type AlVehicleConfirmationCardProps = {
  /** Figma plate line — e.g. MH 14 CD 5678 */
  plate: string;
  /** Figma model line — e.g. Silver · Hyundai i20 */
  model: string;
  /** Green badge inside card footer — e.g. From your RC records */
  badgeLabel: string;
  /** Figma 1040:2374 — green border + glow */
  protected?: boolean;
  /** Scanner confirmation card — Post-Activation PWA only */
  variant?: AlVehicleConfirmationCardVariant;
  className?: string;
};
