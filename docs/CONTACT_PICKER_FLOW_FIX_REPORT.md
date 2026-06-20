# Contact Picker Flow Fix Report

**Date:** 2026-06-17  
**Status:** FIXED

---

## Problem

After selecting a contact, the flow **looped** or behaved unexpectedly:

- Skipped mobile entry and OTP
- Jumped directly to name screen (E3)
- Set `otpVerified: true` without user OTP entry
- Back from E3 sent picker users to E0 (`contacts-empty`), causing repeat picker loops
- E1 cleared `fromPicker` and dropped prefilled name from draft

---

## Root cause

`E0Route` `onContinue` handler (post-picker):

```ts
// BEFORE — broken
patchEmergency({ contactDraft: { name, mobile, fromPicker: true, otpVerified: true } });
navigate(emergencyJourneyPaths.contactName); // skipped E1 + E2
```

Additional bugs:

| Location | Issue |
|----------|-------|
| `E1Route` onContinue | `fromPicker: false` wiped picker metadata and name |
| `E3Route` onBack | `fromPicker` branch → `contactsEmpty` instead of OTP |
| `E3Route` onContinue | `verified: draft.otpVerified ?? draft.fromPicker` bypassed OTP |

---

## Expected flow (unchanged routes)

```
E0  Tap "Add from contacts" → native picker → select contact
      ↓
E1  Mobile prefilled (editable) → user taps "Get OTP"
      ↓
E2  OTP entry → user verifies
      ↓
E3  Name prefilled (editable), relation user-selected → user taps "Save contact"
      ↓
E5  Contacts summary
```

Picker populates **draft state only**. Each step advance requires an explicit footer CTA.

---

## Fix

**File:** `apps/onboarding/src/journey/routes/EmergencyRoutes.tsx`

### E0 — after picker success

| Before | After |
|--------|-------|
| `otpVerified: true` | `otpVerified: false` |
| `navigate(contactName)` | `navigate(contactMobile)` |
| Cancel on supported API | Stay on E0 (unchanged) |
| Unsupported API | Manual entry fallback (unchanged) |

### E1 — onContinue

| Before | After |
|--------|-------|
| Spread + `fromPicker: false` | Spread only; preserves `name`, `fromPicker` |
| | Sets `otpVerified: false` |

### E3 — onBack

| Before | After |
|--------|-------|
| Picker → `contactsEmpty` | Always → `contactOtp` |

### E3 — onContinue

| Before | After |
|--------|-------|
| `verified: otpVerified ?? fromPicker` | `verified: Boolean(otpVerified)` |

---

## Flow coverage

| Flow | Add from contacts | Status |
|------|-------------------|--------|
| Emergency E0 | ✅ Only surface | Fixed |
| Auth | N/A | — |
| Family / rider | Manual entry only | — |
| E5 Add another | Manual mobile entry | Unchanged (by design) |

---

## Verdict

**FIXED** — Linear E0→E1→E2→E3 flow restored; no loops, no OTP skip, no implicit verification.
