---
name: changeset
description: Add a new changeset for the @alchemy/x402 package. Use when the user wants to create a changeset or prepare for a release.
disable-model-invocation: true
argument-hint: "[patch|minor|major]"
allowed-tools: Read, Glob, Grep, Bash(git *)
---

# Add a new changeset for @alchemy/x402

## Steps

1. **Determine the bump type.** If the user passed an argument (`$ARGUMENTS`), use it as the bump type (patch, minor, or major). Otherwise, ask the user which bump type they want.

2. **Gather changes since the last release.** Run:
   ```
   git log --all --oneline --grep="chore: release" -1
   ```
   to find the last release commit, then:
   ```
   git log <release-commit>..main --oneline
   ```
   and:
   ```
   git diff <release-commit>..main -- . ':!.github' ':!.changeset'
   ```
   to see what changed. Focus only on changes relevant to the `@alchemy/x402` library, CLI, or README. Ignore CI/workflow changes.

3. **Generate a summary.** Write a concise, specific summary of the changes (1-2 sentences). Focus on user-facing impact.

4. **Create the changeset file.** Write a new markdown file in `.changeset/` with a descriptive kebab-case filename. Use this format:

   ```markdown
   ---
   "@alchemy/x402": <bump-type>
   ---

   <summary>
   ```

5. **Confirm** by showing the user the created changeset content.
