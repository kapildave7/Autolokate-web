import { AlHeading } from '@autolokate/ui';

export function UsagePage() {
  return (
    <section className="ds-card ds-card--showcase">
      <AlHeading variant="h2">Usage</AlHeading>
      <ul className="ds-list">
        <li>Use `Al*` components before creating custom UI.</li>
        <li>Reference only system tokens (`--al-*`) for style values.</li>
        <li>Test all surfaces in light and dark mode.</li>
      </ul>
      <pre className="ds-code">{`import { AlButton } from '@autolokate/ui';

<AlButton variant="primary" size="md">
  Activate sticker
</AlButton>`}</pre>
    </section>
  );
}
