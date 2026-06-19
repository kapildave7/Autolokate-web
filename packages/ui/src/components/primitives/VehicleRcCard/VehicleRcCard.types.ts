import type { ReactNode } from 'react';

export type AlVehicleRcField = {
  label: string;
  value: string;
};

export type AlVehicleRcCardProps = {
  registrationNumber: string;
  verifiedLabel?: string;
  verifiedIcon?: ReactNode;
  /** Figma R05 — icon/car watermark at 5% opacity. */
  watermarkIcon?: ReactNode;
  fields: AlVehicleRcField[];
  className?: string;
};
