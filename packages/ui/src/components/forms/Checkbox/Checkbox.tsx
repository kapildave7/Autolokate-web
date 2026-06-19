import { useId } from 'react';

import { cn } from '../../../utils/cn.js';

import type { AlCheckboxProps } from './Checkbox.types.js';
import './Checkbox.css';

export function AlCheckbox({
  label,
  helperText,
  errorText,
  className,
  id,
  disabled,
  ...props
}: AlCheckboxProps) {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;

  return (
    <label className={cn('al-checkbox', disabled && 'is-disabled', className)} htmlFor={checkboxId}>
      <span className="al-checkbox__control">
        <input
          id={checkboxId}
          type="checkbox"
          className="al-checkbox__input"
          disabled={disabled}
          {...props}
        />
        <span className="al-checkbox__box" aria-hidden />
      </span>
      <span className="al-checkbox__meta">
        <span className="al-checkbox__label">{label}</span>
        {errorText ? <span className="al-checkbox__error">{errorText}</span> : null}
        {!errorText && helperText ? <span className="al-checkbox__hint">{helperText}</span> : null}
      </span>
    </label>
  );
}
