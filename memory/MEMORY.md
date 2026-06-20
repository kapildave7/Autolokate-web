# Agent Memory Index

**Last updated:** 2026-06-20 (docs consolidation pass)

This file is the entry point for long-lived project memory. Detailed historical reports live in `docs/archive/`.

---

## Source-of-truth documents (`docs/`)

| File | Use when |
|------|----------|
| `PROJECT_STATUS.md` | Current flow status, signoffs, open P2 issues |
| `VISUAL_TRUTH_MATRIX_V2.md` | Visual verification — **PIXEL PERFECT VERIFIED** |
| `FINAL_THEME_SIGNOFF.md` | Dark/light theme compliance |
| `FINAL_PRODUCTION_READINESS.md` | Ship readiness |
| `CLAUDE_PROJECT_INDEX.md` | Routes, session model, components, Figma rules |

---

## Visual evidence

| Path | Contents |
|------|----------|
| `docs/visual-truth/samples/` | 10 representative 393px runtime PNG |
| `docs/visual-truth/completed/` | Completed screen before/after + Figma 171:59 |
| `docs/archive/visual-truth-metadata/` | capture-manifest.json, measurements.json |

Full 1308-screenshot capture set was removed during consolidation (2026-06-20). Re-generate via `apps/onboarding/scripts/visual-truth-capture.mjs`.

---

## Historical reports

All intermediate AUDIT · PARITY · RECOVERY · RECONSTRUCTION · FIX · REPORT · SIGNOFF docs:

→ **`docs/archive/`** (185+ files)

Includes: `THEMING.md`, flow signoffs, parity matrices, bugfix reports, post-activation rebuild docs.

---

## Project memory files (`memory/`)

| File | Status |
|------|--------|
| `MEMORY.md` | This index |
| `project-open-issues.md` | *To be maintained — see PROJECT_STATUS open issues* |
| `project-known-decisions.md` | *To be maintained — see CLAUDE_PROJECT_INDEX §12* |
| `project-route-map.md` | *See CLAUDE_PROJECT_INDEX §2–3* |
| `project-component-inventory.md` | *See CLAUDE_PROJECT_INDEX §8* |
| `project-signoff-status.md` | *See PROJECT_STATUS signoff table* |
| `feedback-pre-edit-protocol.md` | *Add when defined* |

---

## Truth hierarchy

1. Figma
2. `VISUAL_TRUTH_MATRIX_V2.md` + `docs/visual-truth/samples/`
3. `PROJECT_STATUS.md` / `FINAL_*` signoffs
4. `docs/archive/` (historical only)
