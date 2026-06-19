import { AlIcon } from '@autolokate/icons';
import { AlButton, AlHeading, AlStack, AlText } from '@autolokate/ui';

export function EmptyContentComposition() {
  return (
    <AlStack gap="xl" align="center">
      <AlStack gap="md" align="center">
        <AlIcon name="car" size={48} aria-hidden />
        <AlStack gap="sm" align="center">
          <AlHeading variant="h3">No vehicles yet</AlHeading>
          <AlText tone="muted" align="center">
            Add your first vehicle to start protection and access roadside services.
          </AlText>
        </AlStack>
      </AlStack>
      <AlButton variant="primary">Add vehicle</AlButton>
    </AlStack>
  );
}
