import { AlOtpInput, AlText } from '@autolokate/ui';

import { FlowStepShell, type FlowStepCaptureProgress } from '../../../../components/flow-step-shell/index.js';
import { OTP_LENGTH } from '../../../shared-auth/auth-flow/auth-flow.validation.js';
import { formatMobileForOtpDescription } from '../../data/demo-data.js';
import type { EmergencyOtpState, EmergencyScreenNavigationProps } from '../../types.js';

import '../../emergency.css';

export type EmergencyOtpScreenProps = EmergencyScreenNavigationProps & {
  otpState?: EmergencyOtpState;
  step: number;
  captureProgress?: FlowStepCaptureProgress;
  mobile: string;
  otpValue?: string;
  onOtpChange?: (otp: string) => void;
  otpErrorKind?: 'wrong' | 'expired' | null;
  resendCooldownSeconds?: number;
  onResendOtp?: () => void;
  onChangeNumber?: () => void;
};

/** R2 / E2 OTP — Figma 789:2109 · 789:2027 */
export function EmergencyOtpScreen({
  otpState = 'default',
  step,
  captureProgress = { step: 2, total: 3 },
  mobile,
  otpValue = '',
  onOtpChange,
  otpErrorKind = null,
  resendCooldownSeconds = 0,
  onResendOtp,
  onChangeNumber,
  onContinue,
  onBack,
  showBack = true,
}: EmergencyOtpScreenProps) {
  const verifying = otpState === 'verifying';
  const isWrongOrExpired = otpState === 'error' || otpErrorKind !== null;
  const isNetworkError = otpState === 'network-error';
  const canResend = Boolean(onResendOtp) && resendCooldownSeconds === 0 && !verifying;

  const errorText =
    otpErrorKind === 'expired'
      ? 'This code has expired. Request a new OTP.'
      : isWrongOrExpired
        ? 'Incorrect code. Try again.'
        : isNetworkError
          ? 'Couldn’t reach the server. Tap Verify to retry.'
          : undefined;

  const resendCountdown =
    resendCooldownSeconds > 0
      ? `Resend code in 0:${String(resendCooldownSeconds).padStart(2, '0')}`
      : undefined;

  return (
    <FlowStepShell
      phase="emergency"
      step={step}
      title="Enter their code"
      description={
        <div className="ob-emergency-otp-desc">
          <AlText tone="muted" as="span" className="ob-emergency-otp-desc__text">
            Sent to them on WhatsApp · {formatMobileForOtpDescription(mobile)}
          </AlText>
          {onChangeNumber ? (
            <button type="button" className="ob-emergency-otp-desc__change" onClick={onChangeNumber}>
              Change
            </button>
          ) : null}
        </div>
      }
      footerLabel="Verify"
      footerLoading={verifying}
      footerDisabled={verifying || otpValue.length < OTP_LENGTH}
      captureProgress={captureProgress}
      bodyGap="otp"
      showBack={showBack}
      onBack={onBack}
      onContinue={onContinue}
    >
      <AlOtpInput
        className="ob-otp-input-external"
        length={OTP_LENGTH}
        label="One-time password"
        value={otpValue}
        onChange={onOtpChange ?? (() => undefined)}
        state={
          isWrongOrExpired || isNetworkError ? 'error' : otpValue.length === OTP_LENGTH ? 'filled' : 'empty'
        }
        loading={verifying}
        disabled={verifying}
      />
      <div className="ob-emergency-otp-status">
        {errorText ? (
          <p className="ob-otp-validation-error" role="alert">
            {errorText}
          </p>
        ) : null}
        {canResend ? (
          <button type="button" className="ob-emergency-otp-resend-link" onClick={onResendOtp}>
            Resend code
          </button>
        ) : resendCountdown ? (
          <AlText variant="caption" tone="muted">
            {resendCountdown}
          </AlText>
        ) : null}
      </div>
    </FlowStepShell>
  );
}
