# AUTH Post-OTP Fix Report

**Date:** 2026-06-17  
**Scope:** Splash → Mobile → OTP → QR Scan (post-auth flow selector removal + black screen fix)

---

## Root cause

Two compounding issues produced the black screen and incorrect flow order:

### 1. No QR Scan screen — redirect-only bootstrap

`/journey/purchase/qr-scan` rendered `PurchaseQrScanRedirect`, which immediately `<Navigate>`d to P01 (`/journey/purchase/p01-plan-selection`). There was **no `QrScan` component** in the codebase.

### 2. Nested route path mismatch (primary render failure)

`PurchaseRoutes` registered child `<Route>` elements with **absolute paths** (e.g. `/journey/purchase/p01-plan-selection`) inside the parent splat route `/journey/purchase/*`. Under React Router v7, those child routes **did not match** the remaining URL segment, so:

1. OTP success → `/journey/purchase/qr-scan` → redirect to P01  
2. P01 route failed to match → catch-all `/journey/purchase/*` → redirect back to `qr-scan`  
3. **Redirect loop** → blank/black frame with no mounted screen UI

### 3. Flow selector before auth (product flow error)

`/` and `/journey` routed to `HomeScreen`, which required `setSelectedFlow()` before auth. Guards (`RequireSelectedFlow` on auth, `RequireAuthCompleted` requiring `selectedFlow`) enforced flow selection **before** authentication — opposite of the target model.

---

## Route audit

| Path | Before | After |
|------|--------|-------|
| `/` | → `/journey` (Home selector) | → `/journey/auth/splash` |
| `/journey` | Home selector | → `/journey/auth/splash` |
| `/journey/home` | — | Dev-only Home selector (unchanged UI, not default entry) |
| `/journey/auth/*` | Auth (guarded by `RequireSelectedFlow`) | Auth (no flow guard) |
| `/journey/qr-scan` | **Missing** | **QrScanScreen** (requires `AUTH_COMPLETED`) |
| `/journey/purchase/qr-scan` | Redirect → P01 (loop) | Redirect → `/journey/qr-scan` (compat) |
| `/journey/purchase/*` | Absolute nested paths + redirect bootstrap | Relative paths (`p01-plan-selection`, …) |
| `/journey/prepaid/*` | Placeholder + auth guard | + `RequireSelectedFlowMatch('prepaid')` |
| `/journey/b2b2c/*` | Placeholder + auth guard | + `RequireSelectedFlowMatch('b2b2c')` |
| Unknown `*` | → Home | → `/journey/auth/splash` |

### Guard changes

| Guard | Before | After |
|-------|--------|-------|
| `RequireSelectedFlow` | Redirect → Home if no flow | Redirect → QR Scan (if authed) or Splash |
| `RequireAuthCompleted` | Required `selectedFlow` + auth | Auth only |
| `RequireSelectedFlowMatch` | Redirect → Home if no flow | Redirect → QR Scan if no/wrong flow |

### Auth completion navigation

| Before | After |
|--------|-------|
| `getActivationEntryPath(selectedFlow)` → `/journey/purchase/qr-scan` | `journeyPaths.qrScan` → `/journey/qr-scan` |

---

## Render audit

| Check | Result |
|-------|--------|
| `QrScanScreen` import path | ✓ `features/qr-activation/screens/qr-scan` |
| Shell / background | ✓ `AuthStepShell` + `AlScreenBg variant="protected"` |
| Progress bar | ✓ Step 3 of 5 (`QR_SCAN_STEP`) |
| Camera placeholder | ✓ Framed viewport + `scan-line` icon |
| Scan CTA | ✓ Footer “Scan sticker” |
| Demo flow buttons | ✓ Purchase / Prepaid / B2B2C |
| Purchase P01 after demo select | ✓ Relative routes match; `FlowStepShell` renders |
| Error boundaries | None in journey tree (unchanged) |
| Build (`pnpm run build`) | ✓ Passes |

---

## QR screen implementation

**Location:** `apps/onboarding/src/features/qr-activation/screens/qr-scan/QrScanScreen.tsx`

**Layout (Figma-aligned auth shell):**

- Reuses `AuthStepShell` (same pattern as A1 Mobile / A2 OTP)
- Step **3 / 5** progress segments
- Headline: **“Scan your sticker”**
- Subcopy: **“Point your camera at the Autolokate QR on your vehicle”**
- Camera placeholder with corner guides + `scan-line` icon
- Guidance: **“Align the QR inside the frame · good lighting helps”**
- Primary CTA: **“Scan sticker”** (camera integration deferred)
- Demo block: **“Demo · pick a flow”** with flow-labeled secondary buttons

**Route wrapper:** `journey/routes/QrScanRoute.tsx` — sets phase `activation`, handles demo flow selection via `setSelectedFlow()` + `getPostQrActivationPath()`.

---

## Target flow (verified)

```
Splash (/journey/auth/splash)
  → Mobile (/journey/auth/mobile)     [demo: 9999999999]
  → OTP (/journey/auth/otp)           [demo: 123456]
  → QR Scan (/journey/qr-scan)        [visible screen]
  → (demo) Purchase → P01 … P06
  → (demo) Prepaid / B2B2C → activation placeholders
```

**Verification:** `pnpm run build` succeeds. Manual smoke: open app root → complete auth with demo credentials → lands on QR Scan with visible UI (no black frame).

---

## Remaining gaps

| Gap | Severity | Notes |
|-----|----------|-------|
| No dedicated Figma QR frame fetched | Medium | Screen follows Shared Auth shell tokens; dedicated QR Figma node not in repo |
| Real camera / QR decode | High | “Scan sticker” CTA is presentational; demo buttons drive flow |
| `purchase.qr-scan` step still in flow config | Low | Journey entry moved to `/journey/qr-scan`; config graph unchanged |
| `/journey/home` dev selector retained | Low | Not on default path; available for theme/flow dev testing |
| OTP → QR back navigation | Low | Back from QR Scan returns to OTP (auth not reset) |
| Prepaid / B2B2C activation screens | Medium | Still placeholders after demo select |

---

## Files changed

- `features/qr-activation/**` — new QR Scan screen module
- `journey/routes/QrScanRoute.tsx` — new
- `journey/routes/JourneyRoutes.tsx` — entry + QR route
- `journey/routes/JourneySharedAuthRoute.tsx` — post-OTP → QR Scan
- `journey/routes/PurchaseRoutes.tsx` — relative paths, removed redirect bootstrap
- `journey/guards/JourneyRouteGuards.tsx` — auth/flow guard split
- `journey/constants.ts` — `qrScan`, `home` paths
- `journey/activation-routing.ts` — shared QR entry + purchase → P01
- `journey/purchase/purchase-routing.ts` — sequence without legacy qr-scan step
- `router/routes.schema.ts` — journey home + qrScan paths
