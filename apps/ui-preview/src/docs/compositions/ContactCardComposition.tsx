import { AlIcon } from '@autolokate/icons';
import { AlAvatar, AlField, AlStack } from '@autolokate/ui';

export function ContactCardComposition() {
  return (
    <AlStack direction="row" gap="md" align="center">
      <AlAvatar icon={<AlIcon name="user" size={22} aria-hidden />} />
      <AlField label="Owner" value="Shibu Shrivastva" />
    </AlStack>
  );
}
