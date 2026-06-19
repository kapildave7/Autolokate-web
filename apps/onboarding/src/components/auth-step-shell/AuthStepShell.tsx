import type { ReactNode } from 'react';
import { AlIcon } from '@autolokate/icons';
import {
  AlButton,
  AlHeading,
  AlIconButton,
  AlScreenBg,
  AlStepProgress,
  AlText,
} from '@autolokate/ui';

import type { RouteProgressConfig } from '../../journey/progress/route-progress.types.js';

import '../compositions/validation-feedback/validation-feedback.css';
import '../step-shell-chrome/step-shell-chrome.css';
import './auth-step-shell.css';

export type AuthStepShellVariant = 'default' | 'error';

export type AuthStepShellProps = {
  progressConfig?: RouteProgressConfig | null;
  title: string;
  description?: ReactNode;
  footerLabel?: string;
  footerLoading?: boolean;
  footerDisabled?: boolean;
  hideFooter?: boolean;
  hideProgress?: boolean;
  showBack?: boolean;
  onBack?: () => void;
  onContinue?: () => void;
  ctaHelper?: string;
  variant?: AuthStepShellVariant;
  /** Purchase R03/R05 — Figma layout_3RUR9G spacing without affecting auth screens. */
  shellClassName?: string;
  contentGap?: 'mobile' | 'otp' | 'name' | 'plan';
  /** Re-mount CTA for plan-change motion (R06). */
  footerCtaKey?: string;
  /** Top-right header slot — e.g. A1 language switcher (Figma 559:1636). */
  headerAccessory?: ReactNode;
  children: ReactNode;
};

/** Figma 102:268 / 103:324 — single 16px column, 20px (mobile) or 24px (otp) gaps. */
const AUTH_FALLBACK_PROGRESS_STEP = 1;

export function AuthStepShell({
  progressConfig,
  title,
  description,
  footerLabel = 'Continue',
  footerLoading = false,
  footerDisabled = false,
  hideFooter = false,
  hideProgress = false,
  showBack = true,
  onBack,
  onContinue,
  ctaHelper,
  variant = 'default',
  shellClassName,
  contentGap = 'mobile',
  footerCtaKey,
  headerAccessory,
  children,
}: AuthStepShellProps) {
  const resolvedProgress = (() => {
    if (progressConfig !== undefined) {
      return progressConfig?.showProgress ? progressConfig : null;
    }
    if (hideProgress) {
      return null;
    }
    return {
      step: AUTH_FALLBACK_PROGRESS_STEP,
      total: 3,
      showProgress: true,
      showMeta: false,
    };
  })();

  return (
    <AlScreenBg
      variant="protected"
      className={`ob-step-chrome-screen ob-auth-shell${variant === 'error' ? ' ob-auth-shell--error' : ''}${shellClassName ? ` ${shellClassName}` : ''}`}
    >
      <div className="ob-step-chrome__frame ob-auth-shell__frame">
        <header className="ob-step-chrome__header ob-auth-shell__header">
          <AlIconButton
            icon={<AlIcon name="arrow-left" size={24} aria-hidden />}
            label="Go back"
            onClick={onBack}
            disabled={!showBack || !onBack}
            className="ob-step-chrome__back ob-auth-shell__back"
          />
          {headerAccessory ? (
            <div className="ob-auth-shell__header-accessory">{headerAccessory}</div>
          ) : null}
          {resolvedProgress?.showProgress ? (
            <AlStepProgress
              step={resolvedProgress.step}
              total={resolvedProgress.total}
              showMeta={resolvedProgress.showMeta}
              showCount={false}
              className="ob-step-chrome__progress ob-auth-shell__progress"
            />
          ) : (
            <div className="ob-step-chrome__progress-spacer" aria-hidden />
          )}
        </header>

        <div className={`ob-step-chrome__body ob-auth-shell__body ob-auth-shell__body--${contentGap}`}>
          <div className="ob-step-chrome__heading ob-auth-shell__heading">
            <AlHeading variant="h2">{title}</AlHeading>
            {description ? (
              typeof description === 'string' ? (
                <AlText tone="muted" className="ob-auth-shell__description">
                  {description}
                </AlText>
              ) : (
                <div className="ob-auth-shell__description">{description}</div>
              )
            ) : null}
          </div>
          {children}
        </div>

        {hideFooter ? null : (
          <footer className="ob-step-chrome__footer ob-auth-shell__footer">
            {ctaHelper ? (
              <AlText variant="caption" tone="muted" className="ob-step-chrome__cta-helper ob-auth-shell__cta-helper">
                {ctaHelper}
              </AlText>
            ) : null}
            <AlButton
              key={footerCtaKey}
              variant="primary"
              className="ob-step-chrome__cta ob-auth-shell__cta"
              loading={footerLoading}
              disabled={footerDisabled || footerLoading}
              onClick={onContinue}
            >
              <span className="ob-auth-shell__cta-label">{footerLabel}</span>
            </AlButton>
          </footer>
        )}
      </div>
    </AlScreenBg>
  );
}
