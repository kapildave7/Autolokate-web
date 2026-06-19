import { AlIcon } from '@autolokate/icons';
import { AlText } from '@autolokate/ui';

import './language-switcher.css';

export type LanguageSwitcherProps = {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
};

/** Figma languageSwitcher pill — 559:1636 */
export function LanguageSwitcher({ label, onClick, disabled = false }: LanguageSwitcherProps) {
  return (
    <button type="button" className="ob-language-switcher" onClick={onClick} disabled={disabled}>
      <AlText variant="caption" tone="muted">
        {label}
      </AlText>
      <AlIcon name="chevron-down" size={16} aria-hidden />
    </button>
  );
}
