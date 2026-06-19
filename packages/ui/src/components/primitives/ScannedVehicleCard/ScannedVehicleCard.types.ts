export type AlScannedVehicleCardProps = {
  plate: string;
  model: string;
  /** Green footer line inside card — Figma 843:2080 · 1034:2351 · 1040:2374 */
  footerLabel?: string | null;
  /** @deprecated Use footerLabel */
  protectedLabel?: string | null;
  /** Green border + glow — Figma 1040:2374 protected consumer */
  protected?: boolean;
  className?: string;
};
