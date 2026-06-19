export type AlSosHoldButtonProps = {
  holding?: boolean;
  progress?: number;
  onHoldStart?: () => void;
  onHoldEnd?: () => void;
  /** Keep siren on during route handoff without a fresh pointer down. */
  playAlertTone?: boolean;
  className?: string;
  label?: string;
  hint?: string;
};
