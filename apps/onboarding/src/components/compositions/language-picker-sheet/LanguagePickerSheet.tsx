import { AlText } from '@autolokate/ui';

import type { AuthLanguageId } from '../../../features/shared-auth/types.js';

import './language-picker-sheet.css';

export type LanguageOption = {
  id: AuthLanguageId;
  nativeLabel: string;
  englishLabel?: string;
};

const defaultLanguages: LanguageOption[] = [
  { id: 'en', nativeLabel: 'English' },
  { id: 'hi', nativeLabel: 'हिंदी', englishLabel: 'Hindi' },
];

export type LanguagePickerSheetProps = {
  open: boolean;
  selectedId: AuthLanguageId;
  onSelect: (id: AuthLanguageId) => void;
  onClose: () => void;
  languages?: LanguageOption[];
};

/** Figma Language picker overlay — 677:2071 */
export function LanguagePickerSheet({
  open,
  selectedId,
  onSelect,
  onClose,
  languages = defaultLanguages,
}: LanguagePickerSheetProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="ob-language-picker" role="presentation">
      <button type="button" className="ob-language-picker__scrim" aria-label="Close language picker" onClick={onClose} />
      <div className="ob-language-picker__sheet" role="dialog" aria-modal="true" aria-labelledby="ob-language-picker-title">
        <div className="ob-language-picker__handle" aria-hidden />
        <AlText id="ob-language-picker-title" variant="body" className="ob-language-picker__title">
          Choose your language
        </AlText>
        <div className="ob-language-picker__list">
          {languages.map((language) => {
            const selected = language.id === selectedId;
            return (
              <button
                key={language.id}
                type="button"
                className={`ob-language-picker__row${selected ? ' ob-language-picker__row--selected' : ''}`}
                onClick={() => {
                  onSelect(language.id);
                  onClose();
                }}
              >
                <span className="ob-language-picker__labels">
                  <AlText variant="body">{language.nativeLabel}</AlText>
                  {language.englishLabel ? (
                    <AlText variant="caption" tone="muted">
                      {language.englishLabel}
                    </AlText>
                  ) : null}
                </span>
                {selected ? (
                  <AlText variant="body" className="ob-language-picker__check">
                    ✓
                  </AlText>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
