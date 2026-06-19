# Auth Final Signoff Audit — Figma Parity

**App:** `@autolokate/onboarding`  
**Date:** 2026-06-17  
**Mode:** Audit only — no code changes  
**Source of truth:** Figma section **`91:268`** · **Shared · Auth + Legal · common to all 3 apps · ✅ READY FOR DEV**  
**File:** [Autolokate · Consumer App](https://www.figma.com/design/FtHCUnE0HH586PtG5yJyG0/) (`FtHCUnE0HH586PtG5yJyG0`) · canvas `5:2`

**Implementation reviewed:** `features/shared-auth/screens/r01–r05` · `features/shared-legal/screens/r06` · `FlowStepShell` · `@autolokate/ui` primitives

---

## Executive summary

The codebase implements a **6-step shared pipeline** (vehicle → RC → mobile → OTP → name → legal) that **does not match** the Figma **Shared · Auth + Legal** section structure.

| Figma Shared section | Code R01–R06 |
|---------------------|--------------|
| Splash → Mobile (+ inline consent) → OTP → Legal **document readers** (L1/L2) | Vehicle plate → RC confirm → Mobile → OTP → Name → **standalone legal consent** |
| **5-step** progress (`AlStepProgress/Step1of5`, `Step2of5`) | **6-step** progress (`SHARED_FLOW_STEP_COUNT = 6`) |
| Consent + language switcher on **Mobile** frames | Consent deferred to **R06** only |
| 14 OTP state frames + SMS fallback | 5 generic view states; no network/offline/resend-failed |

**Aggregate parity vs Figma Shared · Auth + Legal (source of truth):** **~22%**

**Final verdict:** **NOT READY**

---

## Figma section inventory (`91:268`)

| # | Frame | Node ID | Maps to code |
|---|-------|---------|--------------|
| 01 | Splash | `27:98` | — (not implemented) |
| 02 | Mobile · Empty | `102:268` | Partial → **R03** |
| 03 | Mobile · Filled | `44:133` | Partial → **R03** |
| 04 | Mobile · Ready | `102:303` | Partial → **R03** |
| 05 | Mobile · Error | `102:334` | Partial → **R03** error |
| 06 | Mobile · Offline | `557:1606` | **Missing** on R03 |
| 07 | OTP · Default | `103:324` | Partial → **R04** |
| 08 | OTP · Typing | `29:100` | Partial → **R04** filled |
| 09 | OTP · Verifying | `103:408` | Partial → **R04** loading |
| 10 | OTP · Success | `103:453` | Partial → **R04** success |
| 11 | OTP · Error | `103:364` | Partial → **R04** error |
| 12 | OTP · Network error | `556:1577` | **Missing** on R04 |
| 13 | OTP · Resend | `130:419` | Partial → **R04** resend |
| 14 | OTP · Resend failed | `557:1647` | **Missing** on R04 |
| L1 | Privacy Policy | `60:156` | Document reader — not R06 |
| L2 | Terms & Conditions | `61:163` | Document reader — not R06 |

**Not in this section (but referenced by current code):**

| Code screen | Actual Figma reference | Section |
|-------------|------------------------|---------|
| R01 | `170:25` · R03 · Vehicle number | Consumer · QR Activation + Purchase |
| R02 | `170:71` · R05 · Confirm vehicle | Consumer · QR Activation + Purchase |
| R05 | `174:25` · R02 · Your name | Consumer · QR Activation + Purchase |

---

## Cross-cutting findings

### Spacing & layout

| Spec (Figma Shared) | Implementation | Drift |
|---------------------|----------------|-------|
| Frame width 393px | Shell max-width 24.5625rem (393px) | ✓ Match |
| Horizontal padding 16px on content column | `--al-space-lg` (16px) in shell | ✓ Match |
| Mobile content column gap **20px** | Shell header/content uses `--al-space-md` / `--al-space-lg` mix | Minor drift |
| OTP content column gap **24px** | Same shell gap as mobile | Incorrect on R04 |
| Footer CTA 361×58 @ y=762 | Full-width CTA in footer | ✓ Match |
| CTA helper text 28px above footer (`ctaHelper` @ y=734) | Not implemented on R03/R04 | Missing |
| Step progress **5 segments**, 6px gap, 4px bar height | **6 segments** via `SHARED_FLOW_STEP_COUNT` | **Wrong step count** |
| Progress placement: below back, above headline block | Progress below headline in `FlowStepShell` | **Hierarchy drift** |

### Typography & hierarchy

| Element | Figma | Code | Drift |
|---------|-------|------|-------|
| Headline | Inter 700 · 28/36 · sentence case | `AlHeading h2` · correct token sizes | ✓ Sizes match |
| Body / description | Inter 400 · 16/24 · `#8A8A8A` | `AlText tone="muted"` | ✓ Token match |
| Description casing | Sentence case in Figma | `.ob-shell__description { text-transform: lowercase }` | **Forced lowercase on all descriptions** |
| Label / helper | Inter 500 · 13/18 | `AlText variant="caption"` / field helpers | ✓ Generally match |
| CTA | Inter 600 · 16/20 | `AlButton primary` | ✓ Match |

### Themes

| Theme | Figma | Implementation | Status |
|-------|-------|----------------|--------|
| **Dark** | Fill `#0A0A0C` · protected green radial tint | `AlScreenBg variant="protected"` + dark tokens | ✓ Strong |
| **Light** | Foundations `501:37` | Theme toggle via `data-theme="light"` | ◐ DS-level parity; **screen copy/layout not re-audited frame-by-frame in light** |
| Error OTP border | Amber `#F5A623` (`101:33`) | `AlOtpInput` uses `--al-color-danger` (red) | **Major DS drift** (documented in FIGMA_RC2) |
| Error mobile field | Amber `#F5A623` stroke | `AlTextField` error state | ◐ Depends on DS error token mapping |

### Animations & transitions

| Area | Figma | Implementation |
|------|-------|----------------|
| Screen transitions | Static frames — no motion spec | None (instant step swap) | N/A / acceptable if product accepts |
| Button loading | `AlButton/Primary·Loading` instances | `footerLoading` on shell | ✓ Present |
| OTP verifying | Dedicated verifying frame | Loading state on button + `AlOtpInput loading` | ✓ Partial |
| Pressed states | Opacity 0.82 on button | DS scale 0.97 | Minor drift (DS-level) |
| Ambient tint on error | Orange radial on mobile/OTP error frames | Green protected tint always | **Wrong tint for error states** |

---

## Per-screen audit

### R01 · Vehicle number

**Code:** `R01VehicleNumberScreen.tsx`  
**Figma Shared · Auth + Legal:** **No frame**  
**Nearest Figma (code reference):** `170:25` · R03 · Vehicle number *(Purchase section — not Shared source of truth)*

| Parity vs Shared section | **0%** — screen not in section |
| Parity vs `170:25` (implementation intent) | **~44%** |

#### Figma reference (`170:25`)

- Headline: **Add your vehicle**
- Body: **Type your plate number, we'll pull the rest from Vahan**
- CTA: **Fetch from Vahan**
- `AlPlateInput` light surface `#E4E4E8` + shadow
- Skeleton chips: **Vahan will fill these in** (6 pill placeholders)
- Trust row: **We only read your RC details · encrypted**
- Optional `AlOfflineChip`: **You're offline, we'll retry**

#### Implementation

- Headline: **Vehicle number**
- Description: **enter your registration number** (lowercased)
- CTA: **Continue** / **Looking up…**
- Plate input only — no skeleton preview, no trust row, no offline chip
- Error: caption only; **no `AlPlateInput` error border** (DS gap)

#### Missing items

- Entire screen absent from Shared · Auth + Legal section
- Figma copy, CTA label, skeleton preview, trust row, offline chip
- Plate input presentation parity (light plate card in Purchase Figma)

#### State coverage

| State | Figma (170:25 family) | Code | Status |
|-------|----------------------|------|--------|
| default | ✓ | ✓ | Partial copy |
| loading | ✓ (579:1687 fetch variants) | ✓ | Different UX (no skeleton) |
| error | ✓ (`579:1700` not found) | ✓ caption | No input error border |
| empty | — | ✓ EmptyStateHero | Invented vs Figma |
| success | — | ✓ caption | Not in Figma R01 |
| offline | ✓ chip | ✗ | Missing |

---

### R02 · Confirm vehicle

**Code:** `R02VehicleDetailsScreen.tsx`  
**Figma Shared · Auth + Legal:** **No frame**  
**Nearest Figma:** `170:71` · R05 · Confirm vehicle *(Purchase section)*

| Parity vs Shared section | **0%** |
| Parity vs `170:71` | **~71%** |

#### Figma reference (`170:71`)

- Headline: **Confirm your vehicle**
- Body: **We fetched these details from Vahan. Tap to confirm**
- CTA: **Looks right**
- Inline `RC card` (`170:79`) — no full-screen empty/error heroes on default frame

#### Implementation

- Headline: **Confirm vehicle** ✓ close
- Body: **review your registration certificate details** (lowercased) — drift
- CTA: **Confirm vehicle** / **Confirmed** — not **Looks right**
- `AlVehicleRcCard` present on default ✓
- Loading / empty / error use `EmptyStateHero` — **not in default Figma frame** (separate fetch/error frames exist in Purchase: `179:25`, `579:1663`)

#### Missing items

- RC card decorative car watermark (`170:80`)
- Exact CTA copy **Looks right**
- Figma body copy
- Screen not in Shared section

#### Visual drift

- Step indicator 2/6 vs no step bar on Purchase confirm frame
- Error/empty/loading as centered heroes vs Figma inline card layout

#### State coverage

| State | Figma | Code | Status |
|-------|-------|------|--------|
| default | ✓ RC card | ✓ | Good |
| loading | ✓ fetch frame | ✓ hero | Different pattern |
| error | ✓ Vahan error frames | ✓ hero | Different pattern |
| empty | — | ✓ hero | Invented |
| success | — | ✓ CTA label | Minor |

---

### R03 · Mobile number

**Code:** `R03MobileNumberScreen.tsx`  
**Figma Shared · Auth + Legal:** `02`–`06` · Mobile frames

| Parity vs Shared section | **~36%** |

#### Figma reference (`102:268` default)

- Headline: **What's your number?**
- Body: **We'll send a code on WhatsApp (or SMS)**
- CTA: **Get OTP**
- **Step 1 of 5** progress bar
- **Language switcher** (English + chevron) top-right
- **Inline consent checkbox** + linked Privacy Policy / Terms copy
- Trust row: **Encrypted at rest · never sold to third parties**
- **ctaHelper:** Enter your number to continue
- Field placeholder: **Mobile number** (empty state)

#### Implementation

- Headline: **Mobile number**
- Body: **we'll send a verification code** (lowercased)
- CTA: **Send OTP**
- **Step 3 of 6**
- No language switcher, no consent block, no trust row, no ctaHelper
- Extra caption: **Standard SMS rates may apply.** — **not in Figma**

#### Error state (`102:334`)

| Figma | Code |
|-------|------|
| Field stroke `#F5A623` | `AlTextField state="error"` |
| **Enter your 10-digit number, no 0 or +91 in front** | **Enter a valid 10-digit mobile number.** |
| Orange ambient tint | Green protected tint |
| ctaHelper: **Enter a valid number to continue** | Missing |
| Consent checkbox **on** in error frame | N/A — no consent on screen |

#### Offline state (`557:1606`) — **Missing entirely**

- `AlOfflineChip`: **You're offline, we'll retry**
- ctaHelper: **Offline, we'll send the code once you're back**
- Disabled CTA

#### Missing items

- Language switcher
- Inline legal consent (core Shared auth pattern)
- Trust row with shield-check
- Footer ctaHelper copy
- Offline frame
- Figma headline/body/CTA copy
- Correct step index (1/5 not 3/6)

#### Incorrect spacing

- Figma stacks progress **above** headline; shell places progress **below** headline block
- Missing 8px trust row gap block between consent and footer helper zone

---

### R04 · OTP verification

**Code:** `R04OtpVerificationScreen.tsx`  
**Figma Shared · Auth + Legal:** `07`–`14` · OTP frames

| Parity vs Shared section | **~41%** |

#### Figma reference (`103:324` default)

- Headline: **Enter the 6-digit code**
- Body: **Sent on WhatsApp to 98765 43210** + inline **Change** link (underlined)
- CTA: **Verify**
- **Step 2 of 5**
- Resend: **Resend code in 0:24** (Label, centered)
- Content gap **24px**
- No separate “Code sent to…” footer caption

#### Implementation

- Headline: **Verify OTP**
- Body: **enter the 6-digit code we sent** (lowercased)
- CTA: **Verify** ✓
- **Step 4 of 6**
- No **Change** link
- Resend: **Didn't receive it? Resend in 0:30** + ghost **Resend OTP** button
- Extra caption: **Code sent to +91 98765 43210**

#### Error state (`103:364`)

| Figma | Code |
|-------|------|
| **Incorrect code, try again** | **Incorrect code. Try again or request a new OTP.** |
| Underlined **Resend code** link in otpStatus column | Ghost button when cooldown = 0 |
| **`AlSmsFallback`:** Didn't get the code? **Get it by SMS** | **Missing** |
| OTP cells amber `#F5A623` border | Red danger border (DS) |
| Orange ambient tint | Green tint |

#### Network error (`556:1577`) — **Missing**

- **Couldn't reach the server, tap Verify to retry**
- Resend code + SMS fallback + active Verify CTA

#### Success (`103:453`)

- Green OTP cell borders (`AlOtpInput/Success`)
- **No footer CTA** on success frame
- Code shows success helper + continues flow — acceptable functionally, visual drift

#### Resend / Resend failed (`130:419`, `557:1647`) — **Partial / missing**

#### Missing items

- Change number link
- SMS fallback component
- Network error frame
- Resend failed frame
- Figma copy throughout
- Step 2/5 progress
- OTP error color parity (amber vs red)

#### Animations / transitions

- Verifying frame uses loading CTA — code `footerLoading` ✓
- No auto-advance animation spec in Figma — N/A

---

### R05 · Account creation / name

**Code:** `R05AccountCreationScreen.tsx`  
**Figma Shared · Auth + Legal:** **No frame**  
**Nearest Figma:** `174:25` · R02 · Your name *(Purchase section)*

| Parity vs Shared section | **0%** |
| Parity vs `174:25` | **~47%** |

#### Figma reference (`174:25`)

- Headline: **What should we call you?**
- Body: **So we can personalise your alerts and dashboard**
- CTA: **Add my name**
- Secondary: **Skip for now** (centered body link)
- `AlInput` 361×62 · radius 16px

#### Implementation

- Headline: **Create account**
- Body: **tell us your name as on the RC** (lowercased)
- CTA: **Continue** / **Creating…**
- No skip action
- Helper: **This name will appear on your protection profile.** — not in Figma

#### Missing items

- Skip for now
- Figma headline/body/CTA
- Screen not in Shared section

---

### R06 · Legal consent

**Code:** `R06LegalConsentScreen.tsx`  
**Figma Shared · Auth + Legal:** **No dedicated consent gate frame**

| Parity vs Shared section | **~18%** |

#### Figma model

- **Consent is captured on Mobile frames** (`102:268`–`102:334`, `557:1606`) via inline checkbox + linked copy:
  > So Autolokate can keep you safe and run your vehicle services, I agree to the Privacy Policy and Terms. You can withdraw anytime.
- **L1 · Privacy Policy** (`60:156`) and **L2 · Terms & Conditions** (`61:163`) are **document reader screens**, not a checkbox gate
- Trust row on mobile: **Encrypted at rest · never sold to third parties**

#### Implementation

- Standalone step 6/6: **Terms & privacy**
- Long prose block + separate checkbox
- Empty state hero for unavailable documents — **not in Figma Shared section**
- Footer **Accept & continue**

#### Missing items

- Consent should live on **R03 Mobile** per Figma Shared auth
- L1/L2 document screens not implemented as linked destinations
- Language switcher (mobile)
- Step should not exist as 6/6 in Shared auth model

#### State coverage

| State | Figma | Code | Status |
|-------|-------|------|--------|
| default (unchecked) | On mobile frame | ✓ separate screen | Wrong placement |
| error | Implied on mobile submit | ✓ checkbox error | Wrong screen |
| loading | — | ✓ | OK |
| empty | — | ✓ hero | Invented |
| success | — | ✓ | Invented |

---

## Figma parity checklist (19 Shared auth frames)

| Frame | Node | Implemented equivalent | Parity |
|-------|------|------------------------|--------|
| 01 · Splash | `27:98` | — | ✗ |
| 02 · Mobile · Empty | `102:268` | R03 partial | ◐ |
| 03 · Mobile · Filled | `44:133` | R03 partial | ◐ |
| 04 · Mobile · Ready | `102:303` | R03 partial | ◐ |
| 05 · Mobile · Error | `102:334` | R03 error partial | ◐ |
| 06 · Mobile · Offline | `557:1606` | — | ✗ |
| 07 · OTP · Default | `103:324` | R04 partial | ◐ |
| 08 · OTP · Typing | `29:100` | R04 filled | ◐ |
| 09 · OTP · Verifying | `103:408` | R04 loading | ✓ |
| 10 · OTP · Success | `103:453` | R04 success partial | ◐ |
| 11 · OTP · Error | `103:364` | R04 error partial | ◐ |
| 12 · OTP · Network error | `556:1577` | — | ✗ |
| 13 · OTP · Resend | `130:419` | R04 resend partial | ◐ |
| 14 · OTP · Resend failed | `557:1647` | — | ✗ |
| L1 · Privacy Policy | `60:156` | — | ✗ |
| L2 · Terms & Conditions | `61:163` | — | ✗ |

**Frames with acceptable parity:** 1 / 16 interactive frames (**6%**)  
**Frames partially represented:** 9  
**Frames missing:** 6  

*(R01/R02/R05 vehicle/name screens are outside this section entirely.)*

---

## Responsive audit (code vs Figma 393px)

| Width | Finding |
|-------|---------|
| 320 | Shell caps correctly; OTP 6-cell row fits; **consent + language row absent** so no wrap issues — but missing UI |
| 360–414 | Matches Figma column width intent |
| Step progress | 6 bars vs Figma 5 — visual mismatch at all widths |

Figma specifies 393×852; shell uses `min-height: 100dvh` — acceptable.

---

## Summary scorecard

| Screen | vs Shared · Auth + Legal | Primary gaps |
|--------|--------------------------|------------|
| **R01** | **0%** | Not in section; wrong flow entirely |
| **R02** | **0%** | Not in section; Purchase-only RC confirm |
| **R03** | **36%** | Copy, consent-on-mobile, language, trust, offline, step count |
| **R04** | **41%** | Copy, Change link, SMS fallback, network/resend-failed, error color, step count |
| **R05** | **0%** | Not in section; Purchase name screen |
| **R06** | **18%** | Consent model wrong; L1/L2 missing |

**Weighted average (equal weight): ~22%**

---

## What passes (reuse without blocking minor polish)

- Dark canvas `#0A0A0C` + protected ambient via `AlScreenBg`
- 393px column / 16px horizontal padding
- Core DS components used (`AlTextField`, `AlOtpInput`, `AlPlateInput`, `AlVehicleRcCard`, `AlCheckbox`) — component-level specs largely audited in FIGMA_RC2
- Interactive validation + navigation pipeline (functional, not visual parity)
- Dev preview state toggles for generic view states

---

## Blockers before READY

1. **Reconcile flow architecture** with Figma Shared · Auth + Legal: Splash → Mobile (+ consent + language) → OTP → legal docs — not 6-step vehicle-first pipeline.
2. **Move legal consent** from R06 to **Mobile** screen per Figma `102:268`.
3. **Implement missing frames:** Mobile offline, OTP network error, OTP resend failed, L1/L2 readers, Splash (if in scope).
4. **Align all copy, CTAs, and step progress** to Figma (5 steps; Step1of5 / Step2of5 placement).
5. **Fix R03/R04 Figma-specific UI:** language switcher, trust row, ctaHelper, Change link, `AlSmsFallback`, orange error ambient tint.
6. **Fix `AlOtpInput` error border color** to amber `#F5A623` (DS — affects R04 parity).
7. **Remove or relocate R01/R02/R05** from “Shared Auth” signoff scope — they belong to **Purchase activation** Figma section unless product merges flows.

---

## Final verdict

### **NOT READY**

The implemented R01–R06 pipeline is a **Purchase-flavored 6-step onboarding** grafted under the “Shared Auth” name. It does **not** match the Figma **Shared · Auth + Legal · common to all 3 apps** section, which defines a **5-step mobile + OTP auth** with **inline consent** and separate legal document screens.

Signoff against the designated Figma source of truth requires architectural realignment and visual/state parity work on R03/R04 before READY can be granted.

---

## Appendix — Code references

| Screen | File |
|--------|------|
| R01 | `apps/onboarding/src/features/shared-auth/screens/r01-vehicle-number/R01VehicleNumberScreen.tsx` |
| R02 | `apps/onboarding/src/features/shared-auth/screens/r02-vehicle-details/R02VehicleDetailsScreen.tsx` |
| R03 | `apps/onboarding/src/features/shared-auth/screens/r03-mobile-number/R03MobileNumberScreen.tsx` |
| R04 | `apps/onboarding/src/features/shared-auth/screens/r04-otp-verification/R04OtpVerificationScreen.tsx` |
| R05 | `apps/onboarding/src/features/shared-auth/screens/r05-account-creation/R05AccountCreationScreen.tsx` |
| R06 | `apps/onboarding/src/features/shared-legal/screens/r06-legal-consent/R06LegalConsentScreen.tsx` |
| Shell | `apps/onboarding/src/components/flow-step-shell/FlowStepShell.tsx` |

## Appendix — Figma URLs (Shared section)

| Frame | URL |
|-------|-----|
| Section | [91:268 · Shared · Auth + Legal](https://www.figma.com/design/FtHCUnE0HH586PtG5yJyG0/?node-id=91-268) |
| Mobile · Empty | [102:268](https://www.figma.com/design/FtHCUnE0HH586PtG5yJyG0/?node-id=102-268) |
| Mobile · Error | [102:334](https://www.figma.com/design/FtHCUnE0HH586PtG5yJyG0/?node-id=102-334) |
| Mobile · Offline | [557:1606](https://www.figma.com/design/FtHCUnE0HH586PtG5yJyG0/?node-id=557-1606) |
| OTP · Default | [103:324](https://www.figma.com/design/FtHCUnE0HH586PtG5yJyG0/?node-id=103-324) |
| OTP · Error | [103:364](https://www.figma.com/design/FtHCUnE0HH586PtG5yJyG0/?node-id=103-364) |
| OTP · Network error | [556:1577](https://www.figma.com/design/FtHCUnE0HH586PtG5yJyG0/?node-id=556-1577) |
| OTP · Success | [103:453](https://www.figma.com/design/FtHCUnE0HH586PtG5yJyG0/?node-id=103-453) |

## Related documents

| Document | Relationship |
|----------|--------------|
| [AUTH_FLOW_SIGNOFF.md](./AUTH_FLOW_SIGNOFF.md) | Functional signoff (91/100) — predates Shared-section parity audit |
| [FIGMA_RC2_PARITY_AUDIT.md](./FIGMA_RC2_PARITY_AUDIT.md) | DS component-level drift (OTP error color) |
| [SHARED_FLOW_IMPLEMENTATION.md](./SHARED_FLOW_IMPLEMENTATION.md) | Phase 4 implementation notes |
| [VEHICLE_INFO_AUDIT.md](./VEHICLE_INFO_AUDIT.md) | R02 RC card spec (`170:79`) |
