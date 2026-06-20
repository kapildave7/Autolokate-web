# OTP Parity Report

**Date:** 2026-06-17  
**Sprint:** P0 Device + UX Fix  
**Status:** FIXED

---

## Problem

OTP cells stretched unevenly on some viewports — flex growth distorted Figma cell dimensions.

---

## Solution

### `@autolokate/ui` — `AlOtpInput`

**`OtpInput.css`**

- Cells use `flex: 0 0 calc(...)` — **no flex growth**
- Width derived from `--al-otp-count` CSS variable and `--al-comp-otp-gap`
- `max-width: var(--al-comp-otp-cell-height)` caps square cells
- Fixed `height: var(--al-comp-otp-cell-height)`

**`OtpInput.tsx`**

- Sets `--al-otp-count` inline style from `length` prop
- `al-otp-input--has-value` when any digit entered
- Per-cell `al-otp-input__cell--has-value` for active border on filled cells

### Active / filled borders

| State | Border |
|-------|--------|
| Empty, unfocused | 1px outline |
| Focused cell | 2px on-surface |
| Cell with digit | 2px on-surface |
| Error / success | Token overrides preserved |

### Screen overrides audited

| Location | Stretch risk | Status |
|----------|-------------|--------|
| `auth-step-shell.css` `.ob-auth-otp-input` | Background only | ✅ No flex override |
| `pwa-verify-shell.css` | Gap/status spacing | ✅ No cell flex |
| `validation-feedback.css` | Error display | ✅ No cell flex |

---

## Variants covered

| Screen | OTP length | Shell |
|--------|-----------|-------|
| A2 Auth OTP | 6 | `AuthStepShell` |
| R2 Purchase OTP | 6 | `AuthStepShell` / purchase routes |
| E2 Emergency contact OTP | 6 | `FlowStepShell` |
| PWA verify | 6 | `PwaVerifyShell` |

---

## Viewport expectation

At 320–414px widths, cells distribute evenly within the row using calculated widths — equal width and height, no responsive distortion from `flex: 1`.

---

## Verdict

**FIXED** — OTP sizing locked at component level; stretch eliminated globally.
