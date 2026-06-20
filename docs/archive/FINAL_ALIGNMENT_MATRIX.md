# Final Alignment Matrix

**Date:** 2026-06-19  
**Build:** `pnpm --filter @autolokate/onboarding build` ✅

---

## Global Totals

| Metric | Count |
|--------|------:|
| Screens verified | **65** |
| Alignment issues found | **9** |
| Alignment issues fixed | **9** |
| Shared component fixes | **13 files** |
| Per-screen patches | **0** |

---

## Matrix — Onboarding Journey (36 screens)

| Screen | Route | Shell | Text X | Back X | CTA X | Figma node |
|--------|-------|-------|:------:|:------:|:-----:|------------|
| Flow Entry | `/journey` | Flow entry | ✅ 16 | — | ✅ 16 | hub |
| A1 Mobile | `/journey/auth/mobile` | Auth | ✅ 16 | ✅ 4/16 | ✅ 16 | `102:268` |
| A2 OTP | `/journey/auth/otp` | Auth | ✅ 16 | ✅ 4/16 | ✅ 16 | `103:324` |
| A3 Vehicle owner | `/journey/auth/vehicle-owner` | Auth | ✅ 16 | ✅ 4/16 | ✅ 16 | `174:25` |
| L1 Privacy | `…/legal/privacy` | Legal reader | ✅ 16 | ✅ 4/16 | — | `60:156` |
| L2 Terms | `…/legal/terms` | Legal reader | ✅ 16 | ✅ 4/16 | — | `61:163` |
| R03 Vehicle | `/journey/purchase/r03-vehicle` | Flow | ✅ 16 | ✅ 4/16 | ✅ 16 | `170:25` |
| R04–R10c | `/journey/purchase/*` | Flow / Status | ✅ | ✅ | ✅ | purchase set |
| Prepaid welcome | `/journey/prepaid/welcome` | Welcome | ✅ 16 | ✅ 4/16 | ✅ 16 | `411:38` |
| B2B2C welcome | `/journey/b2b2c/welcome*` | Welcome | ✅ 16 | ✅ 4/16 | ✅ 16 | `386:889` |
| Emergency R0–E5 | `/journey/emergency/*` | Flow | ✅ 16 | ✅ 4/16 | ✅ 16 | emergency set |
| Completed | `/journey/completed` | Completion | ✅* | — | ✅ 16 | celebration |

\*Centered layout by design.

---

## Matrix — Post-Activation PWA (29 screens)

| Area | Routes | Shell | Text X | Back | CTA X |
|------|--------|-------|:------:|:----:|:-----:|
| Loading / vehicle | 2 | PwaScan | ✅ 16 | — | ✅ 16 |
| Verify | 3 | PwaScan + verify | ✅ 16 | ✅ 4/16 | ✅ 16 |
| Park Me | 11 | PwaScan | ✅ 16 | ✅ 4/16 | ✅ 16 |
| SOS | 14 | PwaScan | ✅ 16 | ✅ 4/16 | ✅ 16 |

Sample Figma: SOS status `849:321` — title x:16, CTA x:16 w:361.

---

## Issue → Fix Map

| ID | Symptom | Root cause | Shared fix | Screens |
|----|---------|------------|------------|---------|
| A1 | Text @ ~28px on welcome | Double frame padding | `welcome-activation-shell.css` | 3 |
| A2 | Headline tracking off | DS −0.01em | `step-shell-chrome.css` | ~36 |
| A3 | Subtitle wrong case | Flow shell lowercase | `flow-step-shell.css` | ~25 |
| A4 | Top spacing short | 16px vs 22px | `--ob-shell-header-top` | ~65 |
| B1 | Back icon @ ~28px | Centered 48×48 | `.ob-shell-back` | ~52 |
| B2 | Back hit @ ~16px | Missing bleed | `.ob-shell-back` | ~52 |
| B3 | Legal icon 20px | Wrong size prop | `LegalReaderHeader.tsx` | 2 |
| B4 | PWA back misaligned | Split gutter + center | `pwa-scan-shell.css` | 29 |
| C1 | Checkbox visual offset | 48px grid column | `inline-consent-block.css` | 2 |

---

## Responsive — All Shells @ 320–414

| Check | 320 | 360 | 375 | 390 | 393 | 414 |
|-------|:---:|:---:|:---:|:---:|:---:|:---:|
| Content gutter 16px | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Back icon x:16 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Back hit x:4 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| CTA full width in gutter | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| No horizontal clip | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## Before / After Summary

| Layer | Before | After |
|-------|--------|-------|
| Gutter model | 4px + 12px split (inconsistent) | Single 16px |
| Back icon | Centered @ ~28px | Left @ 16px |
| Back hit area | @ ~16px | @ 4px (48×48) |
| Welcome text | @ ~28px | @ 16px |
| Headline tracking | −0.01em | 0 |

---

## Remaining Drift (P2)

| Item | Notes |
|------|-------|
| Status bar chrome | Not rendered on web (Figma y offset simulated via 22px) |
| Purchase status center layout | Intentional — not step-column |
| Plan carousel peek | Horizontal clip by design |

---

## Verdict

**ALIGNMENT PASS** — All 65 active screens inherit fixes through 6 shared shells. Zero per-screen offset patches.
