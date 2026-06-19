# Autolokate Onboarding — Project Status

**Last updated:** 2026-06-19  
**Source of truth priority:** Figma → screenshots → audit reports → implementation reports

---

## What This Repo Is

**Not the Consumer App.**

This repo is the **Autolokate Onboarding + Activation + Post-Activation PWA** only:

- Consumer QR onboarding (Purchase, Prepaid, B2B2C flows)
- Shared Auth (Mobile → OTP → Vehicle owner name)
- Emergency + Rider contact setup
- Post-Activation PWA (SOS Emergency, Park Me)

**Journey entry:** `/journey`  
**PWA entry:** `/pwa/scan/*` (isolated — no JourneyProvider, no shared session)

---

## Current Flows

| Flow | Entry | Status |
|------|-------|--------|
| **Purchase** | `/journey` → Auth → R03–R10 → Emergency | FIXES REQUIRED |
| **Prepaid** | `/journey` → PrepaidWelcome → Auth → Emergency | Active / Functional |
| **B2B2C** | `/journey` → PartnerWelcome → Auth → Emergency | Active / Functional |
| **Emergency** | After activation (all flows) | CONDITIONAL |
| **Auth (Shared)** | `/journey/auth/*` | CONDITIONAL |
| **Post-Activation PWA** | `/pwa/scan/*` | SIGNED OFF (V4) |

---

## Signoff Status by Area

### Auth — CONDITIONAL

- **Latest signoff:** `AUTH_FIGMA_PARITY_SIGNOFF.md` (2026-06-17)
- **Verdict:** NOT READY for pixel signoff
- **Figma section:** `91:268` · Shared · Auth + Legal
- **What's done:** Flow is functional. Mobile, OTP, Vehicle owner screens route correctly.
- **Open gaps:**
  - OTP screen (A2): title/description layout drift, resend copy, SMS fallback states
  - Inline consent on Mobile differs from Figma structure
  - Splash screen deprecated — redirects to Mobile (correct)

### Purchase — FIXES REQUIRED

- **Latest signoff:** `PURCHASE_FINAL_SIGNOFF.md` (2026-06-17)
- **Latest gap report:** `PURCHASE_FINAL_FIGMA_GAP_REPORT.md` (2026-06-18)
- **Phase A visual signoff:** `PHASE_A_VISUAL_SIGNOFF.md` (2026-06-17, R03–R05)
- **R06 signoff:** `R06_CAROUSEL_FINAL_REPORT.md` (~94% parity)
- **Figma section:** `167:434` · Consumer · QR Activation + Purchase
- **Terminal screen:** R10 / R10b / R10c — purchase ends here
- **Archived:** R14 Permissions, R15 Activation Complete — **do not restore**
- **Open gaps:**
  - Post-payment browser-back guards missing (R08/R08b/R09b routes)
  - R08c, R09b, R10c branch frame pixel gaps
  - Orphan screens: P01–P06 exist in code, not in active route graph

### Emergency — CONDITIONAL

- **Latest signoff:** `EMERGENCY_FINAL_SIGNOFF.md` (2026-06-18)
- **Figma section:** `371:1275` · Emergency + Rider
- **What's done:** All 19 Figma frames have code paths. Plan limits correct. Core navigation wired.
- **Open gaps:**
  - OTP screens (R2/E2): title/layout/copy drift, change-link position/structure
  - R0 offline: chip placement + copy drift
  - R0/E0 hero: absolute positioning in Figma vs flex-centered scroll in code
  - E0 trust row: fixed `y: 540` in Figma vs `margin-block-start: auto` in code
- **Plan limits (locked):**
  - safe: 1 contact, 0 riders
  - secure: 2 contacts, 2 riders
  - shield: 3 contacts, 2 riders
  - shield+: 3 contacts, 2 riders

### Post-Activation PWA — SIGNED OFF

- **Latest signoff:** `POST_ACTIVATION_FINAL_SIGNOFF_V4.md`
- **All 30 frames wired and signed off**
- SOS: hold required (4000ms) — tap must never trigger
- Park Me: auth required, location must never be hardcoded

### Prepaid — Active

- Welcome screen wired at `/journey/prepaid/welcome`
- No purchase, no payment, no vehicle activation
- Routes to Emergency after auth

### B2B2C — Active

- Welcome screen at `/journey/b2b2c/welcome` (plan-only) and `/journey/b2b2c/welcome/plan-rider`
- No purchase, no payment, no vehicle activation
- Routes to Emergency after auth

---

## Known Decisions (Locked)

### Architecture — Never change without explicit instruction

- Journey phase order: `home → flow-select → shared-auth → activation → emergency → completed`
- Purchase route sequence: R03 → R04 → R05 → R06 → R07 → R08 → R09 → R10 → Emergency
- Emergency handoff from Purchase: always enters at `contacts-empty` (not `rider-prompt`)
- Auth completion: routes to `vehicle-owner`, not directly to activation
- Session persistence: `sessionStorage` for journey state, `localStorage` for flow selection + theme
- PWA isolation: `/pwa/scan/*` has no `JourneyProvider`, no shared session with onboarding

### Archived — Do Not Restore

- **R14 Permissions:** archived
- **R15 Activation Complete:** archived
- **Splash screen:** deprecated, redirects to Mobile

### Component Ownership (Precise)

| Component | Correct usage |
|-----------|---------------|
| `AlVehicleConfirmationCard` | Scanner confirmation only — NOT for purchase RC confirm |
| `AlScannedVehicleCard` | Scan result display only |
| `AlDispatchTimeline` | Shared timeline primitive |
| `AlSosHoldButton` | Single implementation — no alternates |

### Design Rules

- Status bar: **never render**
- Fake mobile chrome: **never render**
- Battery / network indicators: **never render**
- Language picker: removed
- Theme: Dark + Light — toggled at `/journey` only

### Default Mode

All future work defaults to **visual refinement and Figma parity**. Do not redesign flows, business rules, or session architecture without explicit instruction.

---

## Latest Active Reports

| Area | Document | Date | Verdict |
|------|----------|------|---------|
| Auth | `AUTH_FIGMA_PARITY_SIGNOFF.md` | 2026-06-17 | CONDITIONAL |
| Purchase overall | `PURCHASE_FINAL_SIGNOFF.md` | 2026-06-17 | FIXES REQUIRED |
| Purchase gap analysis | `PURCHASE_FINAL_FIGMA_GAP_REPORT.md` | 2026-06-18 | Open gaps listed |
| Purchase Phase A (R03–R05) | `PHASE_A_VISUAL_SIGNOFF.md` | 2026-06-17 | Signed off |
| Purchase R06 | `R06_CAROUSEL_FINAL_REPORT.md` | — | ~94% parity |
| Emergency | `EMERGENCY_FINAL_SIGNOFF.md` | 2026-06-18 | CONDITIONAL |
| Post-Activation PWA | `POST_ACTIVATION_FINAL_SIGNOFF_V4.md` | — | SIGNED OFF |
| Overall app | `CONSUMER_APP_FINAL_SIGNOFF.md` | 2026-06-17 | See doc |
| Icon alignment | `ICON_ALIGNMENT_FINAL_REPORT.md` | 2026-06-17 | Final pass done |
| Figma QA | `FIGMA_FINAL_QA_REPORT.md` | 2026-06-17 | Final QA |
| Bugfixes | `FINAL_BUGFIX_REPORT.md` | 2026-06-17 | Post-activation final |
| P0 bugfixes | `P0_FINAL_BUGFIX_REPORT.md` | 2026-06-17 | Post-activation P0 |
| Design system | `THEMING.md` | — | Living reference |

---

## Open Issues Summary

| Priority | Area | Issue |
|----------|------|-------|
| HIGH | Purchase | Post-payment browser-back guards missing |
| HIGH | Auth | OTP screen A2 pixel/layout drift vs Figma |
| HIGH | Emergency | OTP screens R2/E2 pixel/layout drift |
| MED | Emergency | R0 offline chip placement + copy drift |
| MED | Emergency | R0/E0 hero vertical positioning |
| MED | Emergency | E0 trust row fixed position vs scroll |
| MED | Purchase | R08c/R09b/R10c branch frame pixel gaps |
| MED | Purchase | P06Route stale emergency wiring (orphan route with live handoff) |
| LOW | Purchase | P01–P06 orphan screens in codebase |
| LOW | Codebase | Auth dead code: AuthFlowApp, SharedAuthSegment — safe to delete |
| LOW | Codebase | PurchaseStepShell, HomeScreen, EmergencyPlaceholderScreen, QrScanRoute — orphan files |
| LOW | CSS | Hardcoded hex colors in pwa-emergency-screen.css |

→ Full details: `REPO_HEALTH_AUDIT.md` · Full issue list: `memory/project-open-issues.md`

---

## Route Ownership Quick Reference

| Route segment | Owner file |
|--------------|------------|
| `/journey/auth/*` | `journey/routes/AuthRoutes.tsx` |
| `/journey/purchase/*` | `journey/routes/PurchaseRoutes.tsx` |
| `/journey/prepaid/*` | `journey/routes/PrepaidRoutes.tsx` |
| `/journey/b2b2c/*` | `journey/routes/B2b2cRoutes.tsx` |
| `/journey/emergency/*` | `journey/routes/EmergencyRoutes.tsx` |
| `/pwa/scan/*` | `features/post-activation-pwa/routes/PwaScanRoutes.tsx` |

---

## Full Route Map and Architecture

→ See `CLAUDE_PROJECT_INDEX.md` for complete route maps, session model, component inventory, and design system reference.
