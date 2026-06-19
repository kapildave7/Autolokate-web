import { AlIcon } from '@autolokate/icons';
import { AlVehicleRcCard } from '@autolokate/ui';

const vehicleFields = [
  { label: 'Owner', value: 'Shibu Shrivastva' },
  { label: 'Class', value: 'LMV · Car' },
  { label: 'Maker', value: 'Maruti Suzuki' },
  { label: 'Model', value: 'Swift VXi' },
  { label: 'Fuel', value: 'Petrol' },
  { label: 'Colour', value: 'Pearl White' },
  { label: 'Registered', value: '14 Mar 2021' },
  { label: 'Valid till', value: '13 Mar 2036' },
];

export function VehicleInfoComposition() {
  return (
    <AlVehicleRcCard
      registrationNumber="MH 12 AB 3456"
      verifiedLabel="Verified"
      verifiedIcon={<AlIcon name="circle-check" size={14} aria-hidden />}
      fields={vehicleFields}
    />
  );
}
