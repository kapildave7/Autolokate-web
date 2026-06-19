import { AlTextField } from '@autolokate/ui';

import { FormFieldStack } from '../../../../components/compositions/index.js';
import { FlowStepShell } from '../../../../components/flow-step-shell/index.js';
import { demoMobileDisplay } from '../../../shared-auth/data/demo-data.js';
import { MOBILE_INPUT_DISPLAY_MAX } from '../../../shared-auth/auth-flow/auth-flow.validation.js';
import type { EmergencyMobileState, EmergencyScreenNavigationProps } from '../../types.js';

export type E06ContactMobileScreenProps = EmergencyScreenNavigationProps & {
  mobileState?: EmergencyMobileState;
  mobileValue?: string;
  onMobileChange?: (mobile: string) => void;
};

/** E1 · Contact mobile — Figma 789:1982 */
export function E06ContactMobileScreen({
  mobileState = 'default',
  mobileValue,
  onMobileChange,
  onContinue,
  onBack,
  showBack = true,
}: E06ContactMobileScreenProps) {
  const isError = mobileState === 'error';
  const isOffline = mobileState === 'offline';
  const interactive = mobileValue !== undefined && onMobileChange !== undefined;

  return (
    <FlowStepShell
      phase="emergency"
      step={7}
      title="Their mobile number"
      description="We’ll send them a code on WhatsApp. Enter it here to confirm."
      footerLabel="Get OTP"
      footerDisabled={isOffline || (interactive && !mobileValue.trim())}
      captureProgress={{ step: 1, total: 3 }}
      showBack={showBack}
      onBack={onBack}
      onContinue={onContinue}
    >
      <FormFieldStack>
        <AlTextField
          label="Mobile number"
          value={interactive ? mobileValue : undefined}
          defaultValue={interactive ? undefined : demoMobileDisplay}
          onChange={
            onMobileChange
              ? (event) => {
                  onMobileChange(event.target.value);
                }
              : undefined
          }
          prefix="+91"
          state={isError ? 'error' : 'default'}
          aria-describedby={isError ? 'e06-mobile-error' : undefined}
          helperText={isOffline ? 'No internet connection' : undefined}
          disabled={isOffline}
          inputMode="numeric"
          autoComplete="tel"
          maxLength={MOBILE_INPUT_DISPLAY_MAX}
        />
        {isError ? (
          <p id="e06-mobile-error" className="ob-field-validation-error" role="alert">
            Enter a valid 10-digit mobile number.
          </p>
        ) : null}
      </FormFieldStack>
    </FlowStepShell>
  );
}
