# Code Cleanup Report

**Date:** 2026-06-20  
**Scope:** Dead code, unused exports, orphan files, duplicate helpers

---

## 1. Cleaned This Session ✅

| Item | Action | Files Affected |
|------|--------|----------------|
| Dead CSS `.ob-purchase-plan-context` | Deleted rule | `purchase-phase-b.css` |
| Dead CSS `.ob-shell__cta-secondary` | Deleted rule | `flow-step-shell.css` |
| `LanguagePickerSheet` export | Removed from barrel | `compositions/index.ts` |
| `LanguageSwitcher` export | Removed from barrel | `compositions/index.ts` |
| `completion-experience/ConfettiBurst.tsx` | Deleted orphan re-export | `journey/screens/completion-experience/` |
| `#ff4a3d` hardcoded color | → `var(--al-signal-red-bright)` | `pwa-scan.css` |
| `#8c8f94` placeholder color | → `var(--al-color-on-surface-muted)` | `PlateInput.css` |

---

## 2. Orphan Files — Safe to Delete (Not Yet Deleted)

These files are not in the production route graph but are protected by the `isDevPreview` flag in `main.tsx`. They exist for development preview purposes. Should be deleted in a dedicated cleanup sprint:

| Path | Reason Safe to Delete |
|------|----------------------|
| `features/qr-purchase/screens/p01-r01/` through `p06-*/` (6 dirs) | Only in ScreenDevApp (dev-only), not in PurchaseRoutes |
| `features/qr-purchase/screens/r14-permissions/` | Archived per project memory, dev-only |
| `features/qr-purchase/screens/r15-activation-complete/` | Archived per project memory, dev-only |
| `components/compositions/language-picker-sheet/` | Language picker removed per project memory; exports already removed |
| `components/compositions/language-switcher/` | Same as above |
| `features/qr-activation/screens/qr-scan/QrScanScreen.tsx` | Production route redirects; only in ScreenDevApp |

**Cleanup also needed in:**
- `features/qr-purchase/screens/inventory.ts` — remove P01–P06 entries
- `dev/ScreenDevApp.tsx` — remove import/render blocks for P01–P06, R14, R15, QrScan
- `features/qr-purchase/screens/index.ts` — remove R14/R15 export lines

---

## 3. No Duplicate Helpers Found ✅

- No duplicate utility functions
- No duplicate motion patterns (PWA motion wrappers are feature-scoped)
- No duplicate layout helpers
- `FormFieldStack` is a thin wrapper over `AlStack` — acceptable, not a violation

---

## 4. No Unused Route Files Found ✅

All route files (`*Routes.tsx`, `*Route.tsx`) are imported and mounted in the route hierarchy. No dangling route components.

---

## 5. Minor DRY Violations (Not Fixed — Low Priority)

| File | Issue |
|------|-------|
| `dev/ScreenDevApp.tsx:660` | Hardcodes `'al-onboarding-theme'` string instead of importing `THEME_KEY` from constants |
| Emergency screens (E01, E05, E09, E10) | Import `DEFAULT_PURCHASE_PLAN_ID` directly from `qr-purchase` instead of going through `emergency-limits.ts` |

---

## 6. Summary

- **Deleted:** 1 orphan file, 2 CSS dead rules, 4 dead exports
- **Token compliance:** 2 hardcoded values → design tokens
- **Remaining orphan files:** 8+ (safe to delete in cleanup sprint, dev-only)
- **No duplicate helpers, no duplicate components, no duplicate routes**
