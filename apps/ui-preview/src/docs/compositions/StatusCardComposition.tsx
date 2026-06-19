import { AlChip, AlHeading, AlStack, AlStatusPill, AlText } from '@autolokate/ui';

export function StatusCardComposition() {
  return (
    <AlStack gap="lg">
      <AlStack gap="sm">
        <AlHeading variant="h4">Protection status</AlHeading>
        <AlText tone="muted">Live signal from your active plan and vehicle health checks.</AlText>
      </AlStack>
      <AlStack direction="row" gap="md" align="center">
        <AlStatusPill variant="protected" label="Protected" />
        <AlStatusPill variant="attention" label="Renew soon" />
        <AlStatusPill variant="alert" label="Action needed" />
      </AlStack>
      <AlStack direction="row" gap="sm" align="center">
        <AlChip variant="green" label="Coverage active" />
        <AlChip variant="amber" label="Service due" />
        <AlChip variant="neutral" label="Offline device" />
      </AlStack>
    </AlStack>
  );
}
