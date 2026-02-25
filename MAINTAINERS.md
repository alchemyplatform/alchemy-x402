# For maintainers

## Getting started

```bash
git clone git@github.com:alchemyplatform/alchemy-x402.git
cd alchemy-x402
```

### Prerequisites

- Node.js >= 20
- [pnpm](https://pnpm.io/)

**Option A** — [mise](https://mise.jdx.dev/) (recommended, installs both Node and pnpm from `.tool-versions`):

```bash
mise install
```

**Option B** — [corepack](https://nodejs.org/api/corepack.html) (ships with Node, reads `packageManager` from package.json):

```bash
corepack enable
```

### Build and test

```bash
pnpm install
pnpm run build
pnpm run typecheck
pnpm test
```

## Adding a changeset

This project uses [Changesets](https://github.com/changesets/changesets) for versioning and npm publishing.

When your PR includes a user-facing change, ask your AI agent (e.g. Claude Code) to generate a minor or major changeset. Commit the generated `.changeset/*.md` file with your PR.

## Release flow

1. Merge PRs with changeset files to `main`
2. CI automatically opens a "Version Packages" PR that bumps the version and updates `CHANGELOG.md`
3. Merge the version PR to publish to npm

## Secrets

Add an `NPM_PUBLISH_TOKEN` secret to the repo (**Settings > Secrets and variables > Actions**) with a token from [npmjs.com](https://www.npmjs.com/settings/~/tokens).
