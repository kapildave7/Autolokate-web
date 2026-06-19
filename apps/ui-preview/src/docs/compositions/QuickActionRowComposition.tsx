import { AlIcon } from '@autolokate/icons';
import { AlQuickAction, AlStack } from '@autolokate/ui';

const actions = [
  { label: 'Scan', icon: 'scan-line' },
  { label: 'Add', icon: 'plus' },
  { label: 'Parking', icon: 'square-parking' },
  { label: 'Receipt', icon: 'receipt-text' },
] as const;

export function QuickActionRowComposition() {
  return (
    <AlStack direction="row" gap="sm" align="start">
      {actions.map((action) => (
        <AlQuickAction
          key={action.label}
          label={action.label}
          icon={<AlIcon name={action.icon} size={24} aria-hidden />}
        />
      ))}
    </AlStack>
  );
}
