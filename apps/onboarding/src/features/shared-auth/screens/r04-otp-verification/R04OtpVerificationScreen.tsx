/* eslint-disable @typescript-eslint/no-deprecated -- legacy screen kept for reference */
import { AlButton, AlOtpInput, AlText } from '@autolokate/ui';

import { FormFieldStack } from '../../../../components/compositions/index.js';
import { FlowStepShell } from '../../../../components/flow-step-shell/index.js';
import type { R04OtpVerificationScreenProps } from '../../types.js';
import { demoOtp } from '../../data/demo-data.js';

export type { R04OtpVerificationScreenProps };

export function R04OtpVerificationScreen({
  state = 'default',
  onContinue,
  onBack,
  showBack = true,
  otpValue,
  onOtpChange,
  otpErrorKind = null,
  onResendOtp,
  resendCooldownSeconds = 0,
}: R04OtpVerificationScreenProps) {
  const loading = state === 'loading';
  const isError = state === 'error';
  const isEmpty = state === 'empty';
  const isSuccess = state === 'success';
  const interactive = otpValue !== undefined && onOtpChange !== undefined;
  const displayOtp = interactive ? otpValue : isEmpty ? '' : demoOtp;
  const otpFilled = displayOtp.length > 0;
  const canResend = Boolean(onResendOtp) && resendCooldownSeconds === 0 && !loading;

  const errorText =
    otpErrorKind === 'expired'
      ? 'This code has expired. Request a new OTP.'
      : isError
        ? 'Incorrect code. Try again or request a new OTP.'
        : undefined;

  const helperText = isSuccess
    ? 'Mobile number verified.'
    : isEmpty
      ? 'Enter the OTP sent to your mobile.'
      : canResend
        ? undefined
        : resendCooldownSeconds > 0
          ? `Didn’t receive it? Resend in 0:${String(resendCooldownSeconds).padStart(2, '0')}`
          : 'Didn’t receive it? Resend in 0:30';

  return (
    <FlowStepShell
      phase="shared"
      step={4}
      title="Verify OTP"
      description="enter the 6-digit code we sent"
      footerLabel={loading ? 'Verifying…' : 'Verify'}
      footerLoading={loading}
      footerDisabled={isEmpty || (interactive && displayOtp.length < 6)}
      showBack={showBack}
      onBack={onBack}
      onContinue={onContinue}
    >
      <FormFieldStack>
        <AlOtpInput
          className="ob-otp-input-external"
          length={6}
          label="One-time password"
          value={displayOtp}
          onChange={onOtpChange ?? (() => undefined)}
          state={isError ? 'error' : isSuccess ? 'success' : otpFilled ? 'filled' : 'empty'}
          helperText={helperText}
          loading={loading}
          disabled={loading}
        />
        {errorText ? (
          <p className="ob-otp-validation-error" role="alert">
            {errorText}
          </p>
        ) : null}
        {canResend ? (
          <AlButton variant="ghost" size="sm" onClick={onResendOtp}>
            Resend OTP
          </AlButton>
        ) : null}
        {!isError && !isSuccess ? (
          <AlText variant="caption" tone="muted">
            Code sent to +91 98765 43210
          </AlText>
        ) : null}
      </FormFieldStack>
    </FlowStepShell>
  );
}
