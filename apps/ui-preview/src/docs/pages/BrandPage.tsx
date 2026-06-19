import { AlBrandMark, AlLogo } from '@autolokate/brand';
import { AlHeading, AlStack } from '@autolokate/ui';

export function BrandPage() {
  return (
    <AlStack gap="lg">
      <section className="ds-card ds-card--showcase">
        <AlHeading variant="h2">Brand showcase</AlHeading>
        <div className="preview-row">
          <div className="ds-brand ds-brand--light">
            <AlLogo size={120} variant="light" />
          </div>
          <div className="ds-brand ds-brand--dark">
            <AlLogo size={120} variant="dark" />
          </div>
        </div>
      </section>
      <section className="ds-card ds-card--showcase">
        <AlHeading variant="h3">Logo mark sizes</AlHeading>
        <div className="preview-row">
          {[32, 64, 120, 240].map((size) => (
            <AlBrandMark key={size} size={size} />
          ))}
        </div>
      </section>
    </AlStack>
  );
}
