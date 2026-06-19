import type { ReactNode } from 'react';

import '../validation-feedback/validation-feedback.css';

export type FormFieldStackProps = {
  children: ReactNode;
};

export function FormFieldStack({ children }: FormFieldStackProps) {
  return <div className="ob-field-stack">{children}</div>;
}
