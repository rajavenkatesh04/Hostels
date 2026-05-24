---
name: ship
description: Use when the user wants to commit their current v2 work and promote it to main (production). Triggers on phrases like "ship it", "deploy this", "push to prod", "commit and push", or "/ship". Handles the full v2 → main flow with safety checks. Do NOT use for partial work in progress — only when the user explicitly wants to release.
---

# Ship to Production

This skill handles the full workflow of shipping committed work from the `v2` branch to `main` (which Vercel auto-deploys to production at hostel-livid.vercel.app).

## When to use

The user has finished changes and wants those changes live on production. Trigger phrases include "ship it", "ship to prod", "deploy this", "/ship", "promote to main", "release this".

Do NOT use this skill for:
- Work-in-progress commits (those just need `git commit`, no main merge)
- Hotfixes to v1 (different workflow, ask the user)
- Anything that would force-push main (use the explicit v2→main swap, not this skill)

## Core principles (read before every invocation)

1. **One ship = one commit.** Stage everything with `git add -A`. Never split changes into multiple commits because they "seem unrelated." If the user wanted separate commits, they would have committed before invoking ship.

2. **Always complete the full workflow.** Steps 1 through 5, every time. Do not stop at "pushed to v2" — the user said ship, which means production. Only the explicit error conditions in the Error Handling section justify stopping mid-flow.

3. **No improvisation.** This skill's instructions are commands, not suggestions. If you think a different approach would be better, the user can adjust manually after. Don't deviate based on judgment about what's "cleaner."

4. **Brief output.** Show key command output and final state. Don't narrate every step. The user wants confirmation it worked, not a story.

## The workflow

### Step 1 — Confirm repo, ensure on v2

```bash
git remote -v
```

If origin is not `https://github.com/rajavenkatesh04/Hostels.git`: stop and tell the user "This doesn't look like the Hostels repo. The ship skill is configured for that repo only."

```bash
git branch --show-current
```

If current branch is NOT `v2`:
- Switch automatically: `git checkout v2`
- Tell the user: "You were on `{previous branch}` — switched to v2."
- If checkout fails because uncommitted changes would be overwritten, STOP. Tell the user to commit or stash their work on the current branch first. Do not force.

If current branch IS `v2`: proceed silently, no announcement.

### Step 2 — Show what's about to be committed

```bash
git status --short
```

Show the output. The user sees the list of modified/added/deleted files.

If working tree is clean (no output):
- Tell the user: "Nothing to commit on v2. Skipping to main-promotion in case you have unpushed v2 commits to promote."
- Skip directly to Step 4.

**Unexpected files in the diff:** If `.claude/`, `node_modules/`, `.next/`, `.env*`, or other typically-ignored paths appear in the status, mention it once: "Note: `{path}` is modified — including it. Add to `.gitignore` if this is unwanted churn." Then proceed. Do NOT skip these files. Do NOT split them out.

### Step 3 — Auto-generate commit message, commit, push v2

Analyze the staged diff and write a concise conventional-commit-style message yourself. Do NOT ask the user for a message.

Guidelines for the message:
- Conventional prefix: `feat:` (new functionality), `fix:` (bug fix), `refactor:` (no behavior change), `docs:` (docs/comments), `chore:` (config/deps/gitignore), `style:` (formatting).
- Subject line under 72 characters.
- Specific, not vague: "feat: add comparison drawer to hostel listing" not "feat: new feature".
- Look at `git diff --staged` if filenames alone aren't enough to describe what changed.
- **Multiple unrelated changes:** pick the most significant for the subject line, list the rest in the body (blank line after subject). Do NOT skip files or split commits.
- No attribution to yourself. The commit is the user's work.

Then run, in this exact order:

```bash
git add -A
git diff --staged --stat
git commit -m "{your generated message}"
git push origin v2
```

Brief confirmation: "Committed and pushed to v2: `{message}`. Continuing to main promotion."

Do NOT stop here. Continue immediately to Step 4.

### Step 4 — Promote v2 to main

```bash
git checkout main
git pull origin main
git merge v2
git push origin main
```

Expected: fast-forward merge. If there's a merge conflict, STOP. Report the conflict files. The user resolves manually and re-runs the skill.

After successful push: "Promoted to main at `{short-sha}`. Production deploying — live at hostel-livid.vercel.app in ~2 minutes."

### Step 5 — Switch back to v2

```bash
git checkout v2
```

Final state: user is back on `v2`. Tell them: "Back on v2. Ready for next changes."

## Error handling

**Checkout to v2 fails (uncommitted changes block it):** Stop. Tell user to stash or commit current-branch work first. Do not force-checkout.

**Checkout to main fails mid-flow (dirty working tree from prior step):** This can happen if files were modified between steps (e.g., Claude Code's own settings file). Run `git stash push -u -m "ship-flow-interim"`, retry the checkout, complete the merge and push, then `git checkout v2 && git stash pop`. Tell the user once at the end: "Stashed and reapplied `{files}` during the flow."

**Detached HEAD or unknown branch state:** Stop, report. Do not attempt to fix automatically.

**Merge conflict in step 4:** Stop. Show conflict files. User resolves manually, then re-runs the skill.

**Push rejected (non-fast-forward) on main:** Someone else pushed to main. Tell the user: "main has commits I don't have. Run `git fetch origin && git log origin/main` to see them, then decide whether to merge or override."

**Push rejected on v2:** Less common. Same diagnosis — `git fetch origin && git log origin/v2`. User decides.

**Network failure mid-flow:** Report the step that failed. Do not auto-retry. User re-runs after fixing connectivity.

**Generated commit message looks wrong (user pushes back after the fact):** Offer to amend: `git commit --amend -m "new message"` then `git push origin v2 --force-with-lease`. Safe on v2 only — NEVER force-push to main. Only do this if user explicitly asks.

## What this skill does NOT do

- Force-push to main (never, under any circumstance)
- Split changes across multiple commits, even if files seem unrelated (one ship = one commit)
- Stop after pushing to v2 without promoting to main (the full flow runs every time)
- Create feature branches (manual: `git checkout -b name`)
- Delete branches (cleanup is manual)
- Touch v1-snapshot or backup branches
- Run tests, builds, or deploys (Vercel handles deploys)
- Pull v2 before committing (local v2 is assumed authoritative)
- Ask the user for a commit message (skill writes it from the diff)
- Verify production is live (user does this themselves via Vercel dashboard + incognito browser)

## Tone

Brief. Plain language. Show key command output and final state. The user wants confirmation it worked. Don't recap the workflow at the end — they just lived through it.