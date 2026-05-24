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

## The workflow

### Step 1 — Confirm repo, ensure on v2

```bash
# Confirm we're in the right repo
git remote -v
# Expect: origin https://github.com/rajavenkatesh04/Hostels.git
```

If origin is not the Hostels repo: stop and tell the user "This doesn't look like the Hostels repo. The ship skill is configured for that repo only."

```bash
# Check current branch
git branch --show-current
```

If current branch is NOT `v2`:
- Switch automatically: `git checkout v2`
- Tell the user: "You were on `{previous branch}` — switched to `v2`."
- If the checkout fails (uncommitted changes that would be overwritten), STOP and report. Tell the user to commit or stash their work on the current branch first.

If current branch IS `v2`: proceed silently.

### Step 2 — Show what's about to be committed

```bash
git status --short
```

Show the output to the user. They should see the list of modified/added/deleted files.

If `git status --short` shows nothing (clean working tree):
- Tell the user: "Nothing to commit on v2. Skipping to the main-promotion step in case you have unpushed v2 commits to promote."
- Skip directly to Step 4.

### Step 3 — Auto-generate commit message, commit, push v2

Analyze the changed files and write a concise conventional-commit-style message yourself. Do NOT ask the user for a message.

Guidelines for the message:
- Use a conventional prefix: `feat:` for new functionality, `fix:` for bug fixes, `refactor:` for code changes that don't change behavior, `docs:` for docs/README/comments, `chore:` for housekeeping (config, dependencies, .gitignore, etc.), `style:` for formatting only.
- Keep the subject line under 72 characters.
- Be specific about what changed, not vague. "feat: add comparison drawer to hostel listing" beats "feat: new feature".
- Look at the actual diff (`git diff --staged` after staging) if the file names alone aren't enough to write a good message.
- If multiple unrelated things changed, mention the most significant one in the subject and list the rest in the body (separate the body from subject with a blank line).
- Don't include "by Claude" or any attribution to yourself. The commit is the user's.

Then run:

```bash
git add -A
git diff --staged --stat  # show user what's being staged
git commit -m "{your generated message}"
git push origin v2
```

After push completes, tell the user briefly: "Committed and pushed to v2: `{commit message}`. Vercel preview building."

### Step 4 — Promote v2 to main

```bash
git checkout main
git pull origin main
git merge v2
git push origin main
```

Expected: fast-forward merge (main is one or more commits behind v2). If there's a merge conflict, STOP. Report the conflict files. The user needs to resolve manually.

After successful push, tell the user: "Promoted to main. Vercel production deploying — should be live at hostel-livid.vercel.app in ~2 minutes."

### Step 5 — Switch back to v2

```bash
git checkout v2
```

Final state: user is back on `v2`, ready for next work. Tell them: "Back on v2. Ready for next changes."

## Error handling

**Checkout to v2 fails (uncommitted changes block it):** Stop. Tell the user to stash or commit their current-branch work first. Do not force-checkout.

**Detached HEAD or unknown branch state:** Stop, report. Do not attempt to fix automatically.

**Merge conflict in step 4:** Stop. Show the conflict files. Tell the user to resolve, then re-run the skill.

**Push rejected (non-fast-forward):** Someone pushed to main from elsewhere. Tell the user: "main has commits I don't have. Run `git fetch origin && git log origin/main` to see them, then decide whether to merge or override."

**Network failure mid-flow:** Whichever step failed, report it. Don't auto-retry. The user should re-run after fixing connectivity.

**Generated commit message looks wrong to the user:** If the user pushes back on the auto-generated message after the fact, offer to amend it: `git commit --amend -m "new message"` then `git push origin v2 --force-with-lease` (only safe because v2 is the user's working branch, not main). But don't proactively ask — only if they raise it.

## What this skill does NOT do

- Force-push to main (never)
- Create feature branches (use `git checkout -b branch-name` manually for those)
- Delete branches (cleanup is manual)
- Touch v1-snapshot or any backup branches
- Run tests, builds, or deploys (Vercel handles deploys)
- Pull v2 before committing (current local v2 is assumed authoritative)
- Ask the user for a commit message (the skill writes it from the diff)

## Tone

When reporting to the user, be brief. Use plain language. Don't narrate every git command — show the output of key steps and the final state. The user wants confirmation that it worked, not a story.
