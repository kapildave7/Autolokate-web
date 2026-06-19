# Autolokate Web

Monorepo for Autolokate web applications and shared packages.

## Structure

```
autolokate-web/
├── apps/           # Deployable applications
│   ├── website/    # Marketing / public website
│   ├── pwa/        # Progressive web app
│   ├── qr-flow/    # QR-based user flows
│   └── admin/      # Internal admin dashboard
├── packages/       # Shared libraries
│   ├── ui/             # Shared UI primitives
│   ├── design-system/  # Tokens, themes, and design foundations
│   ├── icons/          # Icon assets and components
│   ├── api-client/     # API client and request utilities
│   ├── auth/           # Authentication logic
│   ├── hooks/          # Shared React hooks
│   ├── utils/          # General utilities
│   └── types/          # Shared TypeScript types
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) 10+

## Getting started

```bash
pnpm install
```

## Scripts

| Command       | Description                          |
| ------------- | ------------------------------------ |
| `pnpm dev`    | Run dev servers across the workspace |
| `pnpm build`  | Build all packages and apps          |
| `pnpm lint`   | Lint all packages and apps           |
| `pnpm clean`  | Clean build artifacts                |

## Adding packages

Each app or package under `apps/` and `packages/` will get its own `package.json` when scaffolded. pnpm workspaces and Turborepo will wire them together automatically.
