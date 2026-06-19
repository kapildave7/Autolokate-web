/* eslint-disable @typescript-eslint/no-deprecated -- legacy screen kept for reference */
import { AlText, AlTextField } from '@autolokate/ui';

import { FormFieldStack } from '../../../../components/compositions/index.js';
import { FlowStepShell } from '../../../../components/flow-step-shell/index.js';
import type { R03MobileNumberScreenProps } from '../../types.js';
import { demoMobileDisplay } from '../../data/demo-data.js';

export type { R03MobileNumberScreenProps };

export function R03MobileNumberScreen({
  state = 'default',
  onContinue,
  onBack,
  showBack = true,
  mobileValue,
  onMobileChange,
}: R03MobileNumberScreenProps) {
  const loading = state === 'loading';
  const isError = state === 'error';
  const isEmpty = state === 'empty';
  const isSuccess = state === 'success';
  const interactive = mobileValue !== undefined && onMobileChange !== undefined;

  return (
    <FlowStepShell
      phase="shared"
      step={3}
      title="Mobile number"
      description="we'll send a verification code"
      footerLabel={loading ? 'Sending OTP…' : 'Send OTP'}
      footerLoading={loading}
      footerDisabled={isEmpty || (interactive && !mobileValue.trim())}
      showBack={showBack}
      onBack={onBack}
      onContinue={onContinue}
    >
      <FormFieldStack>
        <AlTextField
          label="Mobile number"
          value={interactive ? mobileValue : undefined}
          defaultValue={interactive ? undefined : isEmpty ? '' : demoMobileDisplay}
          onChange={onMobileChange ? (event) => {
            onMobileChange(event.target.value);
          } : undefined}
          prefix="+91"
          loading={loading}
          state={isError ? 'error' : isSuccess ? 'success' : 'default'}
          aria-describedby={isError ? 'r03-mobile-error' : undefined}
          helperText={
            isSuccess ? 'OTP sent successfully.' : isEmpty ? 'Enter your mobile number.' : undefined
          }
          disabled={loading}
          inputMode="numeric"
          autoComplete="tel"
          aria-invalid={isError || undefined}
        />
        {isError ? (
          <p id="r03-mobile-error" className="ob-field-validation-error" role="alert">
            Enter a valid 10-digit mobile number.
          </p>
        ) : null}
        {!isError && !isSuccess && !isEmpty ? (
          <AlText variant="caption" tone="muted">
            Standard SMS rates may apply.
          </AlText>
        ) : null}
      </FormFieldStack>
    </FlowStepShell>
  );
}
