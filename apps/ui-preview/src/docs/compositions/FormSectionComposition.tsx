import { useState } from 'react';
import {
  AlContainer,
  AlInput,
  AlOtpInput,
  AlPlateInput,
  AlStack,
  AlTextField,
} from '@autolokate/ui';

export function FormSectionComposition() {
  const [otp, setOtp] = useState('472');

  return (
    <AlContainer width="narrow">
      <AlStack gap="lg">
        <AlTextField label="Mobile number" defaultValue="98765 43210" />
        <AlPlateInput value="MH 12 AB 3456" />
        <AlInput label="Full name" defaultValue="Your name" />
        <AlOtpInput length={6} value={otp} onChange={setOtp} state="empty" />
      </AlStack>
    </AlContainer>
  );
}
