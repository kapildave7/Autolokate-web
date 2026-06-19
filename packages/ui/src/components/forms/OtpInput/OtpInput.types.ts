export type AlOtpInputState = 'empty' | 'filled' | 'error' | 'success';

export type AlOtpInputProps = {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  helperText?: string;
  errorText?: string;
  state?: AlOtpInputState;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
};
