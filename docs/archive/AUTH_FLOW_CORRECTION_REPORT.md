# AUTH Flow Correction Report

**Date:** 2026-06-18  
**Trigger:** QR scan is the **entry mechanism** (pre-onboarding), not an onboarding step. Splash removed from active graph.  
**Figma Vehicle Owner:** [`174:25`](https://www.figma.com/design/FtHCUnE0HH586PtG5yJyG0/Autolokate-%C2%B7-Consumer-App?node-id=174-25) · R02 · Your name

---

## Old route graph

```
/  →  /journey/auth/splash
        ↓
      Mobile (A1)
        ↓
      OTP (A2)
        ↓
      /journey/qr-scan  (demo flow selector)
        ↓
      Purchase / Prepaid / B2B2C activation
```

**Auth completion:** After OTP → `completeAuth()` → QR Scan  
**Guards:** Unauthed → splash; authed without flow → QR Scan

---

## New route graph

```
/  →  /journey/auth/mobile
        ↓
      OTP (A2)
        ↓
      Vehicle Owner (A3 · Figma 174:25)
        ↓  completeAuth()
      Activation (default: Purchase P01 if no flow from QR context)
```

**Auth completion:** After Vehicle Owner name submit → `completeAuth()` → activation entry  
**Demo credentials unchanged:** `9999999999` · OTP `123456` · `000000` = expired

### Active auth routes

| Path | Screen | Active |
|------|--------|--------|
| `/journey/auth/mobile` | A1 Mobile | ✓ |
| `/journey/auth/otp` | A2 OTP | ✓ |
| `/journey/auth/vehicle-owner` | A3 Vehicle Owner | ✓ |
| `/journey/auth/legal/privacy` | L1 Privacy | ✓ |
| `/journey/auth/legal/terms` | L2 Terms | ✓ |
| `/journey/auth/splash` | S0 Splash | **Redirect → mobile** |

### Deprecated redirects (files retained)

| Path | Behavior |
|------|----------|
| `/journey/qr-scan` | Redirect → `/journey/auth/mobile` |
| `/journey/purchase/qr-scan` | Redirect → P01 |
| `/journey/auth/splash` | Redirect → mobile |

---

## Removed from active graph (files kept)

| Screen | File location | Status |
|--------|---------------|--------|
| **S0 Splash** | `features/shared-auth/screens/s0-splash/` | Dev preview + re-export only |
| **QrScan** | `features/qr-activation/screens/qr-scan/` | Dev preview + `QrScanRoute.tsx` orphaned |

---

## Remaining auth screens

| ID | Screen | Figma node | Route |
|----|--------|------------|-------|
| A1 | Mobile | `102:268` family | `/journey/auth/mobile` |
| A2 | OTP | `103:324` family | `/journey/auth/otp` |
| A3 | Vehicle owner | `174:25` | `/journey/auth/vehicle-owner` |
| L1 | Privacy Policy | `60:156` | `/journey/auth/legal/privacy` |
| L2 | Terms | `61:163` | `/journey/auth/legal/terms` |

---

## Implementation summary

| Area | Change |
|------|--------|
| `AuthRoutes.tsx` | Splash removed; VehicleOwnerRoute added; OTP → vehicle-owner (not `completeAuth`) |
| `JourneySharedAuthRoute.tsx` | `completeAuth()` on vehicle owner; default flow `purchase` |
| `JourneyRoutes.tsx` | Entry → mobile; QR routes → redirects |
| `auth-routing.ts` | `vehicleOwner` path; active sequence mobile → otp → vehicle-owner |
| `activation-routing.ts` | `authCompletionEntry`; removed `qrScanEntry` |
| `JourneyRouteGuards.tsx` | Unauthed → mobile (not splash/qr-scan) |
| `A3VehicleOwnerScreen` | New — Figma 174:25 copy, no progress bar |
| `AuthStepShell` | `hideProgress`, `contentGap: name`, name field tokens |
| `flows.config` / `shared-pipeline.config` | `shared.mobile` → `shared.otp` → `shared.account` |

---

## Figma parity status

### A1 Mobile (`102:268`)

| Element | Figma | Implementation | Status |
|---------|-------|----------------|--------|
| Layout column 16px / 20px gap | ✓ | `AuthStepShell` stack | **Match** |
| Progress Step 1/5 | ✓ | `AlStepProgress` | **Match** |
| Headline 28/36 bold | ✓ | `AlHeading h2` | **Match** |
| Body 16/24 muted | ✓ | `AlText tone="muted"` | **Match** |
| Field: no external label | ✓ | `aria-label` only | **Match** |
| Field 62px, 2px border, #1A1A1A | ✓ | `ob-auth-mobile-field` | **Match** |
| Consent 22×22 + 16/22 copy | ✓ | `InlineConsentBlock` | **Match** |
| Trust row centered | ✓ | `ob-trust-row` | **Match** |
| Language pill #4A4A4A | ✓ | `ob-language-switcher` | **Match** |
| CTA 58px / 16px radius | ✓ | `ob-auth-shell__cta` | **Match** |
| Back on entry | Absent (QR entry) | `showBack={false}` | **Match intent** |
| Offline chip | ✓ | `AlOfflineChip` | **Partial** — position not absolute |
| Loading mobile submit | Implied | `footerLoading` 700ms | **Partial** — no skeleton |
| Light theme | Same tokens | DS theme swap | **Needs QA** |

### A2 OTP (`103:324`)

| Element | Figma | Implementation | Status |
|---------|-------|----------------|--------|
| Progress Step 2/5 | ✓ | Step 2 | **Match** |
| Column gap 24px | ✓ | `stack--otp` | **Match** |
| OTP boxes, no label | ✓ | Label removed | **Match** |
| Change link inline | ✓ | Underlined button | **Match** |
| Resend countdown centered | ✓ | `ob-auth-otp-status` | **Match** |
| Error amber on cells | Figma `#F5A623` | DS danger red | **Drift** |
| Success green cells | ✓ | `AlOtpInput` success | **Match** |
| Verify loading | ✓ | `footerLoading` | **Match** |
| Success → hide footer | ✓ | `hideFooter` | **Match** — brief before navigate |
| SMS fallback | ✓ | `AlSmsFallback` | **Match** |

### A3 Vehicle owner (`174:25`)

| Element | Figma | Implementation | Status |
|---------|-------|----------------|--------|
| No progress bar | ✓ | `hideProgress` | **Match** |
| Title / body copy | ✓ | Exact Figma strings | **Match** |
| Input 62px, 1px #4A4A4A, r16 | ✓ | `ob-auth-name-field` | **Match** |
| Placeholder "Your name" | ✓ | ✓ | **Match** |
| CTA "Add my name" | ✓ | ✓ | **Match** |
| ctaHelper when empty | ✓ | ✓ | **Match** |
| Column 16px / 20px gap | ✓ | `stack--name` | **Match** |

---

## Priority issues

### P0 (blocks product / wrong flow)

| # | Issue | Status |
|---|-------|--------|
| P0-1 | Splash in active onboarding graph | **Fixed** — redirect to mobile |
| P0-2 | QR Scan as post-OTP step | **Fixed** — removed from graph |
| P0-3 | Auth completion at OTP instead of vehicle owner | **Fixed** |
| P0-4 | No vehicle owner screen in auth | **Fixed** — A3 @ 174:25 |
| P0-5 | Purchase guard loop without `selectedFlow` | **Fixed** — default `purchase` on auth complete |

### P1 (visible Figma drift)

| # | Issue | Screen |
|---|-------|--------|
| P1-1 | OTP error border uses DS red, Figma amber `#F5A623` | A2 |
| P1-2 | `AlOtpInput` first cell 2px border vs others 1px — verify against Figma empty state | A2 |
| P1-3 | Offline chip not absolutely positioned (Figma y:52) | A1 |
| P1-4 | Light-theme contrast QA not signed off | A1, A2, A3 |
| P1-5 | OTP success state flash before vehicle-owner navigation (~400ms) | A2 |
| P1-6 | Hindi language picker UI only — labels not localized | A1 |

### P2 (polish / deferred)

| # | Issue | Screen |
|---|-------|--------|
| P2-1 | Splash loading bar animation vs Figma SVG | S0 (deprecated) |
| P2-2 | QrScan screen retained but unused — remove from dev sidebar when QR API lands | — |
| P2-3 | Vehicle owner name validation (min length, charset) not in Figma | A3 |
| P2-4 | Post-auth flow still defaults to Purchase P01 until QR deep-link sets `selectedFlow` | Activation |
| P2-5 | `R05AccountCreationScreen` duplicate of A3 — consolidate when purchase pipeline rewired | Purchase |

---

## Verification

```bash
cd apps/onboarding && pnpm run build   # ✓ passes
```

**Manual smoke path:**

1. Open `/` → lands on **Mobile**
2. Enter `9999999999`, accept consent → **OTP**
3. Enter `123456` → **Vehicle owner** (What should we call you?)
4. Enter name → **Add my name** → Purchase P01 (default activation)

**Negative:**

- OTP `000000` → expired error
- `/journey/qr-scan` → redirects to Mobile
- `/journey/auth/splash` → redirects to Mobile

---

## Files changed (this correction)

- `journey/routes/AuthRoutes.tsx`
- `journey/routes/JourneyRoutes.tsx`
- `journey/routes/JourneySharedAuthRoute.tsx`
- `journey/routes/PurchaseRoutes.tsx`
- `journey/routes/QrScanRoute.tsx` (deprecated compat)
- `journey/auth/auth-routing.ts`
- `journey/activation-routing.ts`
- `journey/guards/JourneyRouteGuards.tsx`
- `journey/screens/HomeScreen.tsx`
- `journey/types.ts`
- `features/shared-auth/screens/a3-vehicle-owner/*`
- `features/shared-auth/screens/a2-otp/A2OtpScreen.tsx`
- `features/shared-auth/types.ts`
- `components/auth-step-shell/*`
- `flow/registry/config/shared-pipeline.config.ts`
- `flow/registry/config/flows.config.ts`
- `dev/ScreenDevApp.tsx`
