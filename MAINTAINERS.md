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

### Using an AI agent

Ask your agent to create a changeset after your changes are ready. A good prompt:

```
Create a changeset for this branch. Look at the changes since main, determine the appropriate bump type (patch/minor/major), and write a concise summary.
```

The agent will review your diff, create the `.changeset/*.md` file with the right bump type and description, and commit it with your PR.

## Release flow

1. Merge a PR with changeset files to `main`
2. CI automatically bumps the version, updates `CHANGELOG.md`, commits, and publishes to npm

## Secrets

Add an `NPM_PUBLISH_TOKEN` secret to the repo (**Settings > Secrets and variables > Actions**) with a token from [npmjs.com](https://www.npmjs.com/settings/~/tokens).
