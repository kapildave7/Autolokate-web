import { AlInput } from '@autolokate/ui';

import { FormFieldStack, RelationshipSelector } from '../../../../components/compositions/index.js';
import { FlowStepShell } from '../../../../components/flow-step-shell/index.js';
import { demoRiderName } from '../../data/demo-data.js';
import type { EmergencyNameFormState, EmergencyScreenNavigationProps, RelationshipId } from '../../types.js';

export type E04RiderNameScreenProps = EmergencyScreenNavigationProps & {
  nameValue?: string;
  onNameChange?: (name: string) => void;
  relation?: RelationshipId;
  onRelationChange?: (relation: RelationshipId) => void;
  formState?: EmergencyNameFormState;
};

/** R3 · Rider name — Figma 374:71 */
export function E04RiderNameScreen({
  nameValue,
  onNameChange,
  relation,
  onRelationChange,
  formState = 'default',
  onContinue,
  onBack,
  showBack = true,
}: E04RiderNameScreenProps) {
  const interactive = nameValue !== undefined && onNameChange !== undefined;
  const isSubmitting = formState === 'submitting';
  const isError = formState === 'error';
  const isInvalid = interactive && (!nameValue.trim() || !relation);
  const showDisabledHelper = isInvalid && !isSubmitting && !isError;

  return (
    <FlowStepShell
      phase="emergency"
      step={4}
      title="Add this rider"
      description="Add their name and how they’re related"
      footerLabel="Save rider"
      footerLoading={isSubmitting}
      footerDisabled={isInvalid || isSubmitting}
      footerHelperText={
        isError
          ? 'We couldn’t save rider details'
          : showDisabledHelper
            ? 'Add a name to continue'
            : undefined
      }
      footerHelperTone={isError ? 'warning' : 'muted'}
      captureProgress={{ step: 3, total: 3 }}
      showBack={showBack}
      onBack={onBack}
      onContinue={onContinue}
    >
      <FormFieldStack>
        <AlInput
          value={interactive ? nameValue : undefined}
          defaultValue={interactive ? undefined : demoRiderName}
          onChange={
            onNameChange
              ? (event) => {
                  onNameChange(event.target.value);
                }
              : undefined
          }
          disabled={!interactive || isSubmitting}
        />
        <RelationshipSelector
          value={relation}
          onChange={onRelationChange}
          disabled={!interactive || isSubmitting}
        />
      </FormFieldStack>
    </FlowStepShell>
  );
}
