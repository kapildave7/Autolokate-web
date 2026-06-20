import { useId } from 'react';

import { cn } from '../../../utils/cn.js';

import type { AlTextFieldProps } from './TextField.types.js';
import './TextField.css';

export function AlTextField({
  label,
  helperText,
  errorText,
  prefix = '+91',
  state = 'default',
  loading = false,
  className,
  id,
  disabled,
  ...props
}: AlTextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const isError = state === 'error' || Boolean(errorText);
  const isSuccess = state === 'success' && !isError;
  const isDisabled = state === 'disabled' || Boolean(disabled);
  const isFilled =
    String(props.value ?? props.defaultValue ?? '').trim().length > 0;
  const describedBy = isError ? errorId : helperText ? hintId : undefined;

  return (
    <div
      className={cn(
        'al-text-field',
        isError && 'al-text-field--error',
        isSuccess && 'al-text-field--success',
        isDisabled && 'al-text-field--disabled',
        isFilled && 'al-text-field--filled',
        loading && 'is-loading',
        className,
      )}
    >
      {label ? (
        <label className="al-text-field__label" htmlFor={inputId}>
          {label}
        </label>
      ) : null}
      <div className="al-text-field__control">
        {prefix ? (
          <span className="al-text-field__prefix" aria-hidden>
            {prefix}
          </span>
        ) : null}
        <input
          id={inputId}
          className="al-text-field__input"
          disabled={isDisabled || loading}
          aria-invalid={isError || undefined}
          aria-describedby={describedBy}
          aria-busy={loading || undefined}
          {...props}
        />
        {loading ? <span className="al-text-field__spinner" aria-hidden /> : null}
      </div>
      {helperText && !isError ? (
        <span className="al-text-field__hint" id={hintId}>
          {helperText}
        </span>
      ) : null}
      {isError && errorText ? (
        <span className="al-text-field__error" id={errorId} role="alert">
          {errorText}
        </span>
      ) : null}
    </div>
  );
}
