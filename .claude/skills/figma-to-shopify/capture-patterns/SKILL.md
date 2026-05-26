---
name: capture-patterns
description: Capture patterns learned from a completed figma-to-shopify session by diffing the Phase 1 snapshot against the fixed files. Invoke automatically when the user says they are done with a section — phrases like "I'm done with the section", "the section is finished", "that's good, capture it", "capture the patterns", or any natural indication that QA and fixes are complete.
argument-hint: [session-folder-name]
---

You are extracting patterns from the difference between what `/figma-to-shopify` generated (Phase 1) and what the section looks like after all fixes were applied. These patterns improve future generations.

Arguments provided: $ARGUMENTS

---

## Phase 0 — Locate Session Folder

1. If `$ARGUMENTS` contains a session folder name, use it directly.
2. Otherwise, scan `.claude/skills/figma-to-shopify/sessions/` and find the most recently created folder. If multiple candidates exist and the active section name is known, filter by that name.
3. Confirm the folder with the user if ambiguous.
4. All file reads in this skill use paths relative to the main working directory (not a worktree). Run: `git worktree list | head -1 | awk '{print $1}'` to get the main repo root.

---

## Phase 1 — Load Files

Read all files under `sessions/<session-folder>/phase1/` — these are the Phase 1 snapshots.

For each snapshot file, read the corresponding current file from the main working directory:
- `sections/<section-name>.liquid`
- Every `blocks/_<section-name>__*.liquid`
- `styles/sections/<section-name>.scss`

Also read `session.md` for context (section name, Figma URLs, notes).

---

## Phase 2 — Generate Diff

For each file pair (snapshot vs current), run:

```bash
diff <main-repo>/sessions/<session-folder>/phase1/<file> <main-repo>/<file>
```

Collect all diffs into `sessions/<session-folder>/phase2-diff.patch`.

If a file is identical (no diff), skip it.

---

## Phase 3 — Analyze Changes

For each changed chunk in the diff, identify:

- **Root cause category:** typography / spacing / layout / color / schema / liquid-pattern / template-json
- **What Phase 1 got wrong:** describe the mistake concisely
- **The correct pattern:** what it should be and why
- **Generalizable?** Would this apply to other sections, or is it one-off (e.g. specific to this comp's unusual layout)?

Write your analysis to `sessions/<session-folder>/phase2-analysis.md`:

```markdown
# Phase 2 Analysis — <session-folder>

## Changes Found

### [Category] — <short description>
**Wrong (Phase 1):** `<the incorrect code or value>`
**Correct:** `<the fix>`
**Pattern:** <one-sentence rule>
**Generalizable:** yes / no — <reason>
```

---

## Phase 4 — Update learned-patterns.md

Read `.claude/skills/figma-to-shopify/learned-patterns.md`.

For each generalizable finding from Phase 3:
- Check if an existing rule already covers it. If so, strengthen or clarify the existing rule instead of adding a duplicate.
- If it's new, add it under the correct category section.

Each rule must be one sentence: "When X, do Y (not Z)."

Write the updated file back to `.claude/skills/figma-to-shopify/learned-patterns.md`.

---

## Phase 5 — Cleanup & Report

1. Delete the session folder: `rm -rf sessions/<session-folder>/`
   — The learning is now in `learned-patterns.md`. The raw session data is no longer needed.

2. Report:
   - **Patterns added:** list each new rule
   - **Patterns strengthened:** list any existing rules that were updated
   - **One-off fixes not captured:** list any non-generalizable changes and why they were skipped
   - **learned-patterns.md now has N rules** across M categories
