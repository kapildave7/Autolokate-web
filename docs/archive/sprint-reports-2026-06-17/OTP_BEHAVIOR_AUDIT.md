# OTP Behavior Audit

**Sprint:** P0 Input + Interaction Fix  
**Date:** 2026-06-17  
**Component:** `AlOtpInput` (`packages/ui/src/components/forms/OtpInput/`)

---

## Issue 2 — Active box not highlighted when digit exists

### Before

CSS tied “active” styling to `--has-value` only:

```css
.al-otp-input__cell--has-value {
  border-width: 2px;
  border-color: var(--al-color-on-surface);
}
.al-otp-input__cell:focus {
  outline: none; /* no visual change */
}
```

When multiple cells had digits (e.g. `[1][2][3][ ][ ][ ]`), all filled cells looked identical. The focused cell with an existing digit did not stand out — cursor in box 1 but no distinct active state vs boxes 2–3.

Empty focused cells also had no active border (only `outline: none`).

### After (Figma-aligned)

| State | Border |
|-------|--------|
| Empty, unfocused | 1px `--al-color-outline` |
| **Focused (empty or filled)** | **2px `--al-color-on-surface`** |
| Filled, not focused (partial entry) | 1px `--al-color-outline` |
| All digits entered (`state="filled"`) | 2px `--al-color-on-surface` on all cells |
| Error | 2px `--al-color-warning` on all cells |
| Success | 2px `--al-color-success` on all cells |

Focused cell always wins — even when it already contains a digit.

### Files changed

| File | Change |
|------|--------|
| `packages/ui/src/components/forms/OtpInput/OtpInput.css` | Focus-first active model; partial vs filled states |
| `packages/ui/src/components/forms/OtpInput/OtpInput.tsx` | Added `pattern="[0-9]*"` |
| `apps/onboarding/src/components/auth-step-shell/auth-step-shell.css` | Error override for `--has-value:not(:focus)` |
| `apps/ui-preview/src/docs/components/core-showcase.css` | Showcase focus demo uses `:focus` selector |

### Implementations audited (all use `AlOtpInput`)

| Screen | Route / ID | Composition |
|--------|------------|-------------|
| A2 · Shared auth OTP | `auth/otp` | `A2OtpScreen` |
| R2 · Rider OTP | `emergency/rider-otp` | `E03RiderOtpScreen` → `EmergencyOtpScreen` |
| E2 · Contact OTP | `emergency/contact-otp` | `E07ContactOtpScreen` → `EmergencyOtpScreen` |
| PWA · Bystander verify | `pwa-shared-routes` | Inline OTP block |
| UI Preview | `core-otp-input` | `AlOtpInputPage` state matrix |
| Form section composition | ui-preview | `FormSectionComposition` |

No screen-local OTP markup found — single primitive fix covers all flows.

### State verification matrix

| State | Empty | Typing | Filled | Active (focus) | Error | Success |
|-------|-------|--------|--------|----------------|-------|---------|
| A2 | ✓ 1px cells | ✓ focused 2px | ✓ all 2px | ✓ focused 2px even with digit | ✓ amber 2px | ✓ green 2px |
| R2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| E2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| PWA verify | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| ui-preview matrix | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### Keyboard attributes (Issue 3 overlap)

| Attribute | Value |
|-----------|-------|
| `inputMode` | `numeric` |
| `pattern` | `[0-9]*` |
| `autoComplete` | `one-time-code` (first cell), `off` (rest) |

---

## Build status

```
npm run build — 12/12 packages successful (exit 0)
```

---

## Final verdict

**FIXED**
