import { AlIcon } from '@autolokate/icons';
import { AlPlanCard, AlStack } from '@autolokate/ui';

const secureFeatures = [
  'Automatic crash detection',
  'Ambulance + ₹3,000 cover',
  '3 contacts + AI calling',
  '₹1L accidental · ₹1k/day hospital',
  'Driver score & leaderboard',
];

export function PlanCardComposition() {
  return (
    <AlStack gap="lg" align="start">
      <AlPlanCard
        name="Secure"
        price="₹999/yr"
        badge="MOST POPULAR"
        includesLabel="Includes everything in Safe"
        features={secureFeatures}
        addon={{ label: 'Rider cover · up to 2 · add-on' }}
        selected
        featureIcon={<AlIcon name="circle-check" size={15} aria-hidden />}
        selectedIcon={<AlIcon name="circle-check" size={24} aria-hidden />}
        onSelect={() => undefined}
      />
    </AlStack>
  );
}
