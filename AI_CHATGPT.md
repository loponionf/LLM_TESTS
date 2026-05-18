# AI_CHATGPT.md — Working agreement for ChatGPT and local AI on this repository

This file documents how Jean-Paul, ChatGPT, and a local AI agent work together on this repository.
It is intended as a stable handoff/reference document after new chats, context loss, local model resets, or pull-request reviews.

The repository is expected to be used as an experiment harness: ChatGPT prepares the work, Jean-Paul relays prompts to a local AI, the local AI implements and opens a pull request, then ChatGPT reviews the pull request before anything is accepted.

## 1. Role split

### Jean-Paul

- Owns the repository and decides what is acceptable in practice.
- Runs the local AI agent and gives it the prompts prepared by ChatGPT.
- Performs real-world/manual validation when needed.
- Shares PR links, logs, screenshots, diffs, or test results with ChatGPT for review.
- Does not have to preserve local AI chat history; prompts should be self-contained.

### ChatGPT

- Frames work before implementation.
- Creates or updates GitHub issues when asked.
- Produces compact, self-contained prompts for the local AI.
- Assumes the local AI has limited context and unreliable memory.
- Reviews pull requests produced by the local AI.
- Checks scope, diff quality, tests, regressions, and issue acceptance criteria.
- Does not pretend manual validation was done; Jean-Paul performs real tests.
- Closes or updates issues only after implementation evidence and validation status are clear.

### Local AI agent

- Receives one narrow task at a time.
- Must not rely on prior chat history.
- Must read the repository files needed for the task before editing.
- Must make small, surgical changes.
- Must run relevant tests when possible.
- Must commit/push and open a pull request when asked.
- Must report exactly what changed, what was tested, and what remains risky.

## 2. Core principle for local AI prompts

The local AI has a short context window and a “goldfish memory”.
Therefore every implementation prompt must be explicit, narrow, and self-contained.

A local AI prompt should never assume that the model remembers:

- previous chats;
- previous instructions;
- previous repository analysis;
- the issue context unless repeated in the prompt;
- decisions made outside the current prompt;
- files it has not just read.

Default rule:

```text
One prompt = one atomic task = one branch/PR.
```

If the task is too large to fit in one prompt, ChatGPT should split it into smaller GitHub issues or implementation steps.

## 3. General workflow

Preferred pattern:

```text
Idea or bug
→ ChatGPT clarifies scope
→ ChatGPT creates/updates a GitHub issue when useful
→ ChatGPT prepares a local-AI prompt
→ Jean-Paul gives the prompt to the local AI
→ Local AI creates a branch, implements, tests, commits, pushes, and opens a PR
→ Jean-Paul gives the PR link to ChatGPT
→ ChatGPT reviews the PR
→ Local AI fixes review findings if needed
→ Jean-Paul performs real validation when needed
→ ChatGPT updates/closes the issue only when evidence is sufficient
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

## 4. Prompt style for the local AI

Prompts for the local AI should be compact, structured, and usually in English.
Conversation with Jean-Paul can remain in French.

A good local-AI prompt contains:

```text
Context
Repository
Issue / goal
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

- Assume the local AI has no memory.
- Repeat all important constraints inside the prompt.
- Tell it exactly which files or areas to inspect first.
- Tell it not to edit before inspecting relevant files.
- Tell it to keep changes minimal.
- Tell it to avoid unrelated formatting, cleanup, dependency changes, or rewrites.
- Tell it to create a dedicated branch for the issue.
- Tell it to commit and push only the relevant changes.
- Tell it to open a pull request against the target branch.
- Tell it not to close GitHub issues by itself unless explicitly asked.
- Tell it to include test results and remaining risks in the PR body or final report.

## 5. Standard local AI implementation prompt template

Use this template when ChatGPT prepares work for the local AI.

```text
You are working in the GitHub repository:
- <owner/repo>

You have limited context and must not rely on previous chat history.
Read the files requested below before modifying anything.

Goal:
- <clear one-sentence goal>

Issue context:
- <GitHub issue number/title if available>
- <short acceptance criteria>

Inspect first:
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
7. Commit the changes with a clear message.
8. Push the branch.
9. Open a pull request against `<base-branch>`.

PR/report requirements:
- Summary of changed files.
- Tests run and exact result.
- Commit SHA.
- PR URL.
- Any remaining risks or unmet acceptance criteria.
```

## 6. Analysis-only local AI prompt template

Use this when implementation would be risky without first understanding the code.

```text
You are working in the GitHub repository:
- <owner/repo>

You have limited context and must not rely on previous chat history.
This is analysis only.

Goal:
- <analysis goal>

Inspect:
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

## 7. Pull request review policy

ChatGPT reviews local-AI pull requests before they are accepted.

The review should check:

- Does the PR match the issue scope?
- Are there unrelated changes?
- Is the implementation smaller than the problem?
- Are tests added or updated when appropriate?
- Do test results support the claim?
- Is the PR description honest about risks?
- Does the diff introduce fragile heuristics, duplicated logic, or hidden global changes?
- Is manual validation needed before closing the issue?

If the PR is incomplete, ChatGPT should request changes clearly and provide a corrective prompt for the local AI.

## 8. Issue policy

GitHub issues are the operational task tracker.

Create an issue when:

- a bug or feature should survive chat history loss;
- a task needs a PR;
- a validation reveals a distinct bug;
- a larger idea should be split into atomic local-AI tasks;
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
Local AI implements and opens a PR.
ChatGPT reviews the PR.
Jean-Paul validates when needed.
ChatGPT updates/closes the related issue only after sufficient evidence.
```

## 9. Branch and PR conventions

Prefer one branch per issue.

Suggested branch names:

```text
issue-<number>-short-topic
fix/<short-topic>
feature/<short-topic>
```

Suggested commit style:

```text
Fix <specific bug>
Add <specific feature>
Document <specific workflow>
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

## 10. Local AI safety rules

The local AI must avoid:

- inventing repository state;
- claiming tests passed without running them;
- broad rewrites;
- silent dependency upgrades;
- mixing unrelated fixes;
- deleting files unless explicitly requested;
- changing generated artifacts unless that is the task;
- closing issues without instruction;
- force-pushing over unrelated work;
- hiding uncertainty.

When uncertain, the local AI should stop and report:

```text
What I inspected
What I found
What I am unsure about
What I recommend next
```

## 11. ChatGPT response pattern for this repository

When Jean-Paul asks for a task to be sent to the local AI, ChatGPT should usually provide:

```text
1. A concise French explanation for Jean-Paul.
2. The recommended GitHub issue title/body if needed.
3. A compact English prompt for the local AI.
4. A review checklist for the future PR.
```

When Jean-Paul provides a PR link, ChatGPT should:

```text
1. Fetch PR metadata and diff.
2. Review scope against the issue/prompt.
3. Inspect changed files and relevant tests.
4. Give an approve/request-changes style conclusion.
5. Provide a corrective prompt if changes are needed.
```

## 12. Repository-specific note

This repository is a testbed for experimenting with LLM-driven development.
The process matters as much as the code.

The expected loop is:

```text
ChatGPT = planner / reviewer / issue manager
Local AI = constrained implementer with short memory
Jean-Paul = operator / validator / final decision maker
```

Keep tasks small enough that a local model can succeed without needing a long-lived memory.
