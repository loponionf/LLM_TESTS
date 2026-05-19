# AI_CHATGPT.md — Working agreement for ChatGPT and Claude Code with local AI on this repository

This file documents how Jean-Paul, ChatGPT, and Claude Code using a local AI backend work together on this repository.
It is primarily a ChatGPT-facing protocol/reference file, not a default implementation input for Claude Code.
It is intended as a stable handoff/reference document after new chats, systematic `/clear`, local model resets, or pull-request reviews.

The repository is expected to be used as an experiment harness: ChatGPT prepares the work, Jean-Paul relays prompts to Claude Code, Claude Code uses a local AI backend to implement and open a pull request, then ChatGPT reviews the pull request before anything is accepted.

## 1. Role split

### Jean-Paul

- Owns the repository and decides what is acceptable in practice.
- Runs Claude Code configured to use a local AI backend.
- Performs a `/clear` systematically before giving Claude Code a new task, unless explicitly stated otherwise.
- Gives Claude Code the self-contained prompts prepared by ChatGPT.
- Performs real-world/manual validation when needed.
- Shares PR number/link, logs, screenshots, diffs, or test results with ChatGPT for review.
- Does not have to preserve Claude Code chat history; prompts should be self-contained.

### ChatGPT

- Frames work before implementation.
- Creates or updates GitHub issues when asked.
- Produces compact, self-contained prompts for Claude Code using a local AI backend.
- Uses `AI_CHATGPT.md` as its own workflow/protocol reference.
- Does not ask Claude Code to read `AI_CHATGPT.md` by default for normal implementation tasks.
- Does not ask Claude Code to read mapping files by default; maps are used only when needed to avoid ambiguity or excessive rediscovery.
- Assumes Claude Code has just been reset with `/clear` before each task.
- Assumes the local AI backend has limited context and unreliable memory.
- Builds and maintains a progressively versioned understanding of the repository through reviewed mapping files.
- Reviews pull requests produced by Claude Code.
- Checks scope, diff quality, tests, regressions, and issue acceptance criteria.
- Guides the next corrective prompt when a PR is blocked by failing tests or uncertainty.
- Prefer targeted corrective PRs for code/test errors instead of discarding useful work.
- When a PR is unrecoverable, explicitly instruct rollback/abandon and split the work into smaller tasks before retrying.
- Merges the pull request when the review is acceptable and the project workflow allows it.
- Closes the related GitHub issue after the PR is merged and acceptance evidence is sufficient.
- Does not pretend manual validation was done; Jean-Paul performs real tests.

### Claude Code with local AI backend

- Receives one narrow task at a time.
- Must not rely on prior chat history, because Jean-Paul normally runs `/clear` before each task.
- Must read the repository files needed for the task before editing.
- Must make small, surgical changes.
- Must run relevant tests when possible.
- Must not burn excessive local-model context on long failing-test diagnosis.
- Must commit, push, and open a pull request when asked, even if the PR is blocked by failing tests, as long as the partial work is useful for review.
- Must report the pull request number explicitly, in addition to the PR URL.
- Must report exactly what changed, what was tested, what failed, and what remains risky.

## 2. Core principle for Claude Code prompts

Claude Code is used as the coding agent, but the model behind it is a local AI backend with a short context window and a “goldfish memory”.
Jean-Paul normally runs `/clear` before every new task.
Therefore every implementation prompt must be explicit, narrow, and self-contained.

A Claude Code prompt should never assume that the model remembers:

- previous chats;
- previous Claude Code context;
- previous instructions;
- previous repository analysis;
- the issue context unless repeated in the prompt;
- decisions made outside the current prompt;
- files it has not just read.

Default rule:

```text
/clear before each task
one prompt = one atomic task = one branch/PR
```

If the task is too large to fit in one prompt, ChatGPT should split it into smaller GitHub issues or implementation steps.

## 3. General workflow

Preferred pattern:

```text
Idea or bug
→ ChatGPT clarifies scope
→ ChatGPT creates/updates a GitHub issue when useful
→ ChatGPT prepares a self-contained Claude Code prompt
→ Jean-Paul runs /clear in Claude Code
→ Jean-Paul gives the prompt to Claude Code
→ Claude Code uses the local AI backend to create a branch, implement, test, commit, push, and open a PR
→ Claude Code reports the PR number and PR URL
→ Jean-Paul gives the PR number/link to ChatGPT
→ ChatGPT reviews the PR
→ Claude Code fixes review findings if needed, again from a self-contained prompt after /clear unless told otherwise
→ Jean-Paul performs real validation when needed
→ ChatGPT merges the PR when acceptable
→ ChatGPT closes the related issue when evidence is sufficient
```

For development tasks, prefer:

- precise scope;
- small branches;
- surgical changes;
- explicit non-goals;
- tests before PR;
- no unrelated cleanup;
- no broad refactor unless the issue explicitly requires it;
- clear PR description with test evidence.

## 4. Prompt style for Claude Code with local AI backend

Prompts should be compact, structured, and usually in English.
Conversation with Jean-Paul can remain in French.

A good Claude Code prompt contains:

```text
Context
Repository
Issue / goal
Post-/clear assumption
Current constraints
Files to inspect first
Implementation scope
Non-goals
Step-by-step tasks
Tests to run
PR requirements
Final report format
```

Important prompt rules:

- Assume Claude Code has just had `/clear`.
- Assume the local AI backend has no memory.
- Repeat all important constraints inside the prompt.
- Tell it exactly which files or areas to inspect first.
- For normal implementation tasks, do not include `AI_CHATGPT.md` in the read list unless the task concerns workflow/protocol documentation.
- Do not include mapping files in the read list by default. Use maps only when the task is large, ambiguous, cross-cutting, or when they clearly reduce token usage versus rediscovering architecture.
- Prefer the smallest sufficient read set: task README/project doc when useful, then exact source/test files in scope.
- Tell it not to edit before inspecting relevant files.
- Tell it to keep changes minimal.
- Tell it to avoid unrelated formatting, cleanup, dependency changes, or rewrites.
- Tell it to create a dedicated branch for the issue.
- Tell it to commit and push only the relevant changes.
- Tell it to open a pull request against the target branch.
- Tell it to return the pull request number explicitly, for example `PR: #12`.
- Tell it not to close GitHub issues by itself unless explicitly asked.
- Tell it to include test results and remaining risks in the PR body or final report.
- Tell it to stop prolonged failing-test diagnosis and open a blocked PR with logs when it cannot quickly resolve the failure.

## 5. Standard Claude Code implementation prompt template

Use this template when ChatGPT prepares work for Claude Code using a local AI backend.

```text
You are working in the GitHub repository:
- <owner/repo>

Important context:
- Jean-Paul has just run /clear in Claude Code.
- You must not rely on any previous chat history or previous Claude Code context.
- You are using a local AI backend with limited context, so keep the task narrow and verify files directly.
- Read the files requested below before modifying anything.

Goal:
- <clear one-sentence goal>

Issue context:
- <GitHub issue number/title if available>
- <short acceptance criteria>

Inspect first:
- <project/task documentation if relevant, e.g. Tetris/Readme.txt>
- <file or directory 1>
- <file or directory 2>
- <tests if known>

Scope:
- <allowed changes>

Non-goals:
- Do not rewrite unrelated code.
- Do not do broad cleanup.
- Do not change dependencies unless explicitly required.
- Do not close the GitHub issue yourself.

Tasks:
1. Create a dedicated branch named `<branch-name>`.
2. Inspect the files listed above.
3. Implement the smallest change that satisfies the goal.
4. Add or update focused tests if appropriate.
5. Run the focused tests.
6. Run broader tests if feasible.
7. If tests fail, make one focused correction attempt only when the cause is obvious.
8. If tests still fail or diagnosis becomes unclear, stop diagnosis, keep the useful work, and document the failure logs in the PR/report.
9. Commit the changes with a clear message.
10. Push the branch.
11. Open a pull request against `<base-branch>` even if it is blocked by failing tests, marking it clearly as blocked/failing if needed.
12. Return the pull request number explicitly in your final response, for example `PR: #12`.

PR/report requirements:
- Summary of changed files.
- Tests run and exact result.
- If tests failed: exact failing command, relevant error excerpt, and what was attempted.
- Commit SHA.
- Pull request number, in the exact form `PR: #<number>`.
- PR URL.
- Any remaining risks or unmet acceptance criteria.
```

## 6. Analysis-only Claude Code prompt template

Use this when implementation would be risky without first understanding the code.

```text
You are working in the GitHub repository:
- <owner/repo>

Important context:
- Jean-Paul has just run /clear in Claude Code.
- You must not rely on any previous chat history or previous Claude Code context.
- You are using a local AI backend with limited context, so inspect only the requested files unless more context is truly needed.

This is analysis only.

Goal:
- <analysis goal>

Inspect:
- <project/task documentation if relevant>
- <mapping files only if necessary>
- <files/directories/issues/logs>

Rules:
- Do not modify files.
- Do not commit.
- Do not push.
- Do not open a PR.
- Do not close issues.

Report:
- Root cause or current architecture finding.
- Relevant files/functions.
- Recommended minimal implementation plan.
- Risks and unknowns.
- Suggested tests.
```

## 7. Failing-test and blocked-PR handoff rule

Claude Code must not spend excessive local-model context trying to solve unclear failing tests.

When a test/build failure appears:

1. Capture the exact command.
2. Capture the relevant error excerpt.
3. Make at most one focused fix attempt if the cause is obvious.
4. If the failure persists or the cause is unclear, stop diagnosis.
5. Commit the useful work if it is coherent.
6. Push the branch.
7. Open a PR marked clearly as blocked/failing tests.
8. Report `PR: #<number>`, PR URL, commit SHA, failing command, and error excerpt.

ChatGPT will then review the PR and prepare the next corrective prompt after `/clear`.

This rule exists to preserve local AI context and avoid low-quality speculative debugging.

Blocked PRs must not be merged until ChatGPT review confirms the issue is understood and the acceptance criteria are met.

## 8. Corrective PR policy

When Claude Code makes a code or test error inside an otherwise useful PR, do not automatically revert to the sources before the error.

The preferred workflow is:

```text
Claude Code opens the imperfect or blocked PR
→ ChatGPT reviews the actual diff and failure evidence
→ ChatGPT identifies the smallest corrective action
→ Jean-Paul runs /clear
→ Claude Code applies a targeted correction
→ Claude Code pushes the correction and opens/updates a PR
→ ChatGPT reviews again
```

Corrective prompts should focus on the current error, not on redoing the whole task.

Use a targeted corrective PR when:

- the branch history is clean;
- the PR scope is mostly correct;
- the error is localized;
- the failing test or review finding can be addressed by a small patch;
- preserving the existing work is safer than recreating it.

Do not ask Claude Code to return to pre-error sources unless the PR is structurally unsafe.

A PR is structurally unsafe when:

- it is based on the wrong branch or stale base;
- the diff contains unrelated files from previous issues;
- the history/scope makes review unreliable;
- generated or accidental files polluted the branch;
- fixing the branch would be riskier than recreating it cleanly.

In a structurally unsafe PR, ChatGPT may close the PR and ask for a fresh branch from current `origin/main`.

In a normal code/test error, preserve the useful work and produce a narrow fix.

### Rejected PR rule for local AI continuity

When a PR is wrong but Claude Code still has a useful local working state, ChatGPT should prefer closing/rejecting the PR without asking Claude Code to resynchronize first.

Rationale: with a local AI backend, forcing an immediate `git fetch`, `checkout main`, or `pull` can destroy the useful local context and cause the model to rediscover or resend too much work.

Preferred rejection workflow:

```text
PR is wrong or rejected
→ ChatGPT closes or marks the PR as rejected
→ ChatGPT does not ask Claude Code to sync, fetch, pull, or checkout main
→ Claude Code keeps its current local branch and files
→ Claude Code applies only the requested local fix
→ Claude Code commits
→ Claude Code opens a new clean PR
→ ChatGPT reviews the new PR
```

Use this when:

- the local branch is likely still useful;
- the error is localized or reviewable;
- asking for a resync would waste local-model context;
- the goal is to keep Claude Code's current sources and avoid re-sending the whole task.

Only ask Claude Code to resynchronize from `main` when the PR or branch is structurally unsafe, based on the structural-safety criteria above.

## 9. Rollback and task-splitting rule

When a PR is so flawed that the work must be restarted, ChatGPT must not simply ask Claude Code to redo the same large task.

If everything must be taken back, ChatGPT should:

1. State clearly that the current PR is not salvageable.
2. Explain whether the branch should be abandoned, closed, reverted, or reset.
3. Identify the smallest safe rollback point.
4. Split the original task into two or more smaller independent tasks.
5. Create or update GitHub issues for the smaller tasks when useful.
6. Provide the next prompt for only the first smaller task.

Use this path when:

- the PR combines too many responsibilities;
- the model misunderstood the architecture;
- the patch rewrites unrelated code;
- the implementation is too tangled to review safely;
- the failure suggests the task was too broad for the local AI context;
- a targeted correction would be more complex than a clean smaller retry.

Preferred retry pattern:

```text
bad broad PR
→ close or abandon it with reason
→ split original issue into smaller issue A and issue B
→ run /clear
→ implement issue A only
→ review/merge issue A
→ run /clear
→ implement issue B only
```

When instructing rollback, be explicit and safe. Avoid destructive commands unless necessary. Prefer abandoning a bad branch/PR over rewriting shared history.

## 10. Progressive project mapping

For larger repositories, ChatGPT should progressively build a reliable understanding of the project through versioned mapping files committed to the repository.

The goal is not to keep the whole project in chat context. The goal is to create an external, reviewable, diffable memory of the codebase.

Suggested structure:

```text
ai_project/
  AI_PROJECT_STATE.md
  AI_TODO.md
  AI_DECISIONS.md
  AI_VALIDATION_LOG.md
  maps/
    00_repo_overview.md
    01_entrypoints.md
    02_build_and_run.md
    03_test_strategy.md
    folders/
      <folder-name>.md
```

Mapping files should be factual and compact. They should describe what was verified in the repository, not what the model guesses.

Each folder map should prefer this shape:

```text
# <folder path>

## Verified role
- ...

## Key files
- `<file>`: ...

## Entrypoints / exported APIs
- ...

## Internal dependencies
- ...

## External dependencies
- ...

## Runtime/build/test relevance
- ...

## Risks / fragile areas
- ...

## Unknowns / to verify
- ...
```

Mapping rules:

- Mark verified facts clearly.
- Mark hypotheses explicitly as `Hypothesis`.
- Mark unknowns explicitly as `Unknown`.
- Do not turn guesses into documentation.
- Do not describe files that were not inspected.
- Do not overgeneralize from one file to the whole project.
- Keep maps short enough to be useful after `/clear`.
- Update maps when a PR changes the meaning of a folder.

For large projects, ChatGPT may create dedicated mapping issues before implementation issues.

Mapping workflow:

```text
ChatGPT creates a narrow mapping issue
→ Claude Code reads only the targeted folder/files
→ Claude Code creates or updates the relevant map file
→ Claude Code opens a PR
→ ChatGPT verifies that the map matches the inspected sources
→ ChatGPT merges the map PR
→ future prompts rely on the reviewed map only when it is needed
```

Implementation prompts for large projects should normally ask Claude Code to read the smallest sufficient set, in this order:

```text
1. exact source/test files in scope
2. project/task documentation if it directly constrains the work
3. mapping files only when needed to avoid ambiguity, reduce rediscovery, or handle cross-cutting architecture
```

Maps are guidance, not truth by themselves. Claude Code must still inspect the actual files it edits.

## 11. Pull request review policy

ChatGPT reviews Claude Code pull requests before they are accepted.

The review should check:

- Does the PR match the issue scope?
- Does the PR preserve the expected project state from already merged or closed issues?
- Are there unrelated changes?
- Is the implementation smaller than the problem?
- Are tests added or updated when appropriate?
- Do test results support the claim?
- Is the PR description honest about risks?
- Does the diff introduce fragile heuristics, duplicated logic, or hidden global changes?
- Is manual validation needed before closing the issue?
- For blocked/failing-test PRs: is the failure documented clearly enough for ChatGPT to guide the next prompt?
- For corrective PRs: does the fix target the actual reviewed error without rewriting unrelated work?
- For mapping PRs: do the map claims match the inspected source files, and are hypotheses/unknowns labelled correctly?

### Expected-state and closed-issue guard

Before calling a diff item unrelated, out of scope, or removable, ChatGPT must verify whether that code belongs to the expected repository state.

Required review rule:

```text
Do not request removal of a feature only because it is outside the current issue.
First check whether the feature was introduced or validated by a previous closed issue, merged PR, or accepted project state.
If yes, preserve it and only review whether the current PR regressed it.
```

This is especially important when several local-AI tasks are chained and branches may contain work from earlier issues.
A feature that is outside the current issue can still be part of the expected baseline.

When unsure, ChatGPT should search closed issues and merged PRs before giving a corrective prompt that removes code.
If a correction prompt has already asked Claude Code to remove a feature that turns out to be previously accepted, ChatGPT must immediately reverse the instruction and tell Claude Code to preserve or restore that feature.

If the PR is incomplete, ChatGPT should request changes clearly and provide a corrective prompt for Claude Code. Because Jean-Paul normally uses `/clear`, corrective prompts should also be self-contained.

If the PR is blocked by failing tests, ChatGPT should not merge it until the failure is understood and resolved or explicitly accepted as non-blocking.

If the PR is acceptable, ChatGPT can merge it when the repository policy allows it, then close the related issue if acceptance evidence is sufficient.

## 12. Issue policy

GitHub issues are the operational task tracker.

Create an issue when:

- a bug or feature should survive chat history loss;
- a task needs a PR;
- a validation reveals a distinct bug;
- a larger idea should be split into atomic Claude Code tasks;
- a folder or subsystem needs a reviewed mapping file;
- a future improvement should not be mixed into the current PR.

Issue bodies should include:

```text
Context
Goal
Scope
Non-goals
Acceptance criteria
Validation notes
```

Close an issue only when:

- the PR is merged or otherwise accepted by the project workflow;
- tests are acceptable for the scope;
- real validation is done when the issue is UI/output/runtime visible;
- remaining risks are documented;
- Jean-Paul agrees the issue is complete.

Default closure owner:

```text
Claude Code implements and opens a PR.
Claude Code reports the PR number and PR URL.
ChatGPT reviews the PR.
ChatGPT merges the PR when acceptable.
Jean-Paul validates when needed.
ChatGPT updates/closes the related issue only after sufficient evidence.
```

## 13. Branch and PR conventions

Prefer one branch per issue.

Suggested branch names:

```text
issue-<number>-short-topic
fix/<short-topic>
feature/<short-topic>
map/<folder-or-subsystem>
```

Suggested commit style:

```text
Fix <specific bug>
Add <specific feature>
Document <specific workflow>
Map <folder or subsystem>
```

PR descriptions should include:

```text
Summary
Changed files
Tests run
Manual validation needed
Related issue
Risks / follow-ups
```

If tests fail, PR descriptions should additionally include:

```text
Blocked status
Failing command
Relevant error excerpt
What was attempted
Suggested next step
```

Claude Code's final response must include:

```text
PR: #<number>
PR URL: <url>
Commit SHA: <sha>
```

## 14. Claude Code / local AI safety rules

Claude Code with local AI backend must avoid:

- inventing repository state;
- claiming tests passed without running them;
- broad rewrites;
- silent dependency upgrades;
- mixing unrelated fixes;
- deleting files unless explicitly requested;
- changing generated artifacts unless that is the task;
- closing issues without instruction;
- force-pushing over unrelated work;
- hiding uncertainty;
- writing architectural claims into maps without source evidence;
- repeatedly guessing fixes for failing tests until context is exhausted;
- discarding useful PR work just because one localized error exists;
- retrying the same oversized task unchanged after a full failure;
- deleting or removing a previously accepted feature just because it is outside the current issue.

When uncertain, Claude Code should stop and report:

```text
What I inspected
What I found
What I am unsure about
What I recommend next
```

## 15. ChatGPT response pattern for this repository

When Jean-Paul asks for a task to be sent to Claude Code, ChatGPT should usually provide:

```text
1. A concise French explanation for Jean-Paul.
2. The recommended GitHub issue title/body if needed.
3. A compact English prompt for Claude Code, self-contained after /clear.
4. A review checklist for the future PR.
```

When Jean-Paul provides a PR number or PR link, ChatGPT should:

```text
1. Fetch PR metadata and diff.
2. Review scope against the issue/prompt.
3. Inspect changed files and relevant tests.
4. Check whether apparently out-of-scope changes belong to already closed issues, merged PRs, or accepted baseline behavior.
5. Give an approve/request-changes style conclusion.
6. Merge the PR if it is acceptable and no manual validation blocker remains.
7. Close/update the related issue after merge when acceptance criteria are satisfied.
8. Provide a corrective prompt if changes are needed.
```

When Jean-Paul provides a blocked/failing-test PR, ChatGPT should:

```text
1. Review the diff and the failing-test evidence.
2. Decide whether the current PR should be fixed, replaced, or closed.
3. Prefer a targeted corrective prompt when the PR is structurally safe.
4. Ask for a fresh branch only when the branch/history/scope is structurally unsafe.
5. If everything must be restarted, split the task into smaller tasks before retrying.
6. Avoid asking Claude Code to rediscover context already visible in the PR.
```

When a PR is rejected but the local branch is useful, ChatGPT should:

```text
1. Close or mark the PR as rejected.
2. Do not ask Claude Code to sync, fetch, pull, or checkout main.
3. Tell Claude Code to keep its current local branch and files.
4. Ask for only the minimal local correction.
5. Have Claude Code commit and open a new PR.
```

When the project becomes large or unclear, ChatGPT should prefer creating a mapping issue before asking Claude Code for implementation.

## 16. Repository-specific note

This repository is a testbed for experimenting with LLM-driven development.
The process matters as much as the code.

The expected loop is:

```text
ChatGPT = planner / reviewer / merger / issue manager / map curator
Claude Code = coding agent
Local AI backend = constrained model with short memory
Jean-Paul = operator / validator / final decision maker
```

Keep tasks small enough that Claude Code using the local model can succeed after a fresh `/clear`.
