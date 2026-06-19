import { AlHeading, AlText } from '@autolokate/ui';

export function InstallationPage() {
  return (
    <section className="ds-card ds-card--showcase">
      <AlHeading variant="h2">Installation</AlHeading>
      <AlText>Install once and import the design tokens at application root.</AlText>
      <pre className="ds-code">{`pnpm add @autolokate/design-system @autolokate/ui @autolokate/icons @autolokate/brand

import '@autolokate/design-system/theme.css';
import { AlButton } from '@autolokate/ui';
import { AlIcon } from '@autolokate/icons';`}</pre>
    </section>
  );
}
