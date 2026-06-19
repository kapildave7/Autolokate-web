import {
  AlAvatar,
  AlChip,
  AlContainer,
  AlDivider,
  AlHeading,
  AlStack,
  AlStatusPill,
  AlText,
} from '@autolokate/ui';

export function OverviewPage() {
  return (
    <AlStack gap="lg">
      <section className="ds-card ds-card--showcase">
        <AlText variant="caption" className="ds-eyebrow">
          Figma Consumer App
        </AlText>
        <AlHeading variant="h2">Autolokate Design System</AlHeading>
        <AlText>
          Design System RC1 — production-hardened core library aligned to Figma Foundations &amp;
          Components. ui-preview is the single source of truth for every component.
        </AlText>
        <div className="ds-overview-pill-row">
          <span className="ds-overview-pill">16 core components</span>
          <span className="ds-overview-pill">7 layout primitives</span>
          <span className="ds-overview-pill">19 Figma icons</span>
          <span className="ds-overview-pill">RC1</span>
        </div>
      </section>

      <section className="ds-card ds-card--showcase">
        <AlHeading variant="h3">Core components</AlHeading>
        <ul className="ds-list">
          <li>Buttons — AlButton</li>
          <li>Inputs — AlTextField, AlInput, AlOtpInput, AlPlateInput, AlToggle, AlCheckbox</li>
          <li>Selection — AlChip, AlPlanCard</li>
          <li>Navigation — AlBottomNav, AlStatusBar</li>
          <li>Display — AlStatusPill, AlAvatar, AlField, AlVehicleRcCard, AlQuickAction</li>
          <li>Progress — AlStepProgress</li>
        </ul>
      </section>

      <section className="ds-card ds-card--showcase">
        <AlHeading variant="h3">Layout primitives</AlHeading>
        <AlContainer width="wide">
          <AlText tone="muted">
            AlText, AlHeading, AlIconButton, AlStack, AlGrid, AlContainer, AlDivider
          </AlText>
          <AlDivider />
          <div className="preview-row">
            <AlAvatar initials="AL" />
            <AlChip variant="green" label="Protected" />
            <AlStatusPill label="Protected" variant="protected" />
          </div>
        </AlContainer>
      </section>
    </AlStack>
  );
}
