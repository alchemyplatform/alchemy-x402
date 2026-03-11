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

Every changeset should include a description of what changed. Avoid empty changesets.

### Manual

```bash
pnpm changeset
```

Follow the prompts to select the package (`@alchemy/x402`), bump type (`patch`, `minor`, or `major`), and enter a summary. This creates a `.changeset/<random-name>.md` file — commit it with your PR.

### Using Claude Code

If you use [Claude Code](https://claude.com/claude-code), run the `/changeset` skill:

```
/changeset          # will ask for bump type
/changeset patch    # skip the prompt
/changeset minor
/changeset major
```

It reviews the diff since the last release, generates a summary, and creates the `.changeset/*.md` file for you.

## Release flow

1. Merge a PR with changeset files to `main`
2. CI automatically bumps the version, updates `CHANGELOG.md`, commits, and publishes to npm

## Secrets

Add an `NPM_PUBLISH_TOKEN` secret to the repo (**Settings > Secrets and variables > Actions**) with a token from [npmjs.com](https://www.npmjs.com/settings/~/tokens).
