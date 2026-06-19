export type VehicleId = string;

export type VehicleRegistration = string;

export type ProtectionStatus = 'protected' | 'partial' | 'unprotected' | 'expired';

export type Vehicle = {
  id: VehicleId;
  registration: VehicleRegistration;
  make: string | null;
  model: string | null;
  year: number | null;
  isActive: boolean;
  protectionStatus: ProtectionStatus;
  planId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type VehicleSummary = Pick<
  Vehicle,
  'id' | 'registration' | 'make' | 'model' | 'isActive' | 'protectionStatus'
>;
