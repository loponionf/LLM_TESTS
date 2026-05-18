# AI_CHATGPT.md — Working agreement for ChatGPT and Claude Code with local AI on this repository

This file documents how Jean-Paul, ChatGPT, and Claude Code using a local AI backend work together on this repository.
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
- Assumes Claude Code has just been reset with `/clear` before each task.
- Assumes the local AI backend has limited context and unreliable memory.
- Reviews pull requests produced by Claude Code.
- Checks scope, diff quality, tests, regressions, and issue acceptance criteria.
- Merges the pull request when the review is acceptable and the project workflow allows it.
- Closes the related GitHub issue after the PR is merged and acceptance evidence is sufficient.
- Does not pretend manual validation was done; Jean-Paul performs real tests.

### Claude Code with local AI backend

- Receives one narrow task at a time.
- Must not rely on prior chat history, because Jean-Paul normally runs `/clear` before each task.
- Must read the repository files needed for the task before editing.
- Must make small, surgical changes.
- Must run relevant tests when possible.
- Must commit, push, and open a pull request when asked.
- Must report the pull request number explicitly, in addition to the PR URL.
- Must report exactly what changed, what was tested, and what remains risky.

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
- Tell it not to edit before inspecting relevant files.
- Tell it to keep changes minimal.
- Tell it to avoid unrelated formatting, cleanup, dependency changes, or rewrites.
- Tell it to create a dedicated branch for the issue.
- Tell it to commit and push only the relevant changes.
- Tell it to open a pull request against the target branch.
- Tell it to return the pull request number explicitly, for example `PR: #12`.
- Tell it not to close GitHub issues by itself unless explicitly asked.
- Tell it to include test results and remaining risks in the PR body or final report.

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
10. Return the pull request number explicitly in your final response, for example `PR: #12`.

PR/report requirements:
- Summary of changed files.
- Tests run and exact result.
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

ChatGPT reviews Claude Code pull requests before they are accepted.

The review should check:

- Does the PR match the issue scope?
- Are there unrelated changes?
- Is the implementation smaller than the problem?
- Are tests added or updated when appropriate?
- Do test results support the claim?
- Is the PR description honest about risks?
- Does the diff introduce fragile heuristics, duplicated logic, or hidden global changes?
- Is manual validation needed before closing the issue?

If the PR is incomplete, ChatGPT should request changes clearly and provide a corrective prompt for Claude Code. Because Jean-Paul normally uses `/clear`, corrective prompts should also be self-contained.

If the PR is acceptable, ChatGPT can merge it when the repository policy allows it, then close the related issue if acceptance evidence is sufficient.

## 8. Issue policy

GitHub issues are the operational task tracker.

Create an issue when:

- a bug or feature should survive chat history loss;
- a task needs a PR;
- a validation reveals a distinct bug;
- a larger idea should be split into atomic Claude Code tasks;
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

Claude Code's final response must include:

```text
PR: #<number>
PR URL: <url>
Commit SHA: <sha>
```

## 10. Claude Code / local AI safety rules

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
- hiding uncertainty.

When uncertain, Claude Code should stop and report:

```text
What I inspected
What I found
What I am unsure about
What I recommend next
```

## 11. ChatGPT response pattern for this repository

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
4. Give an approve/request-changes style conclusion.
5. Merge the PR if it is acceptable and no manual validation blocker remains.
6. Close/update the related issue after merge when acceptance criteria are satisfied.
7. Provide a corrective prompt if changes are needed.
```

## 12. Repository-specific note

This repository is a testbed for experimenting with LLM-driven development.
The process matters as much as the code.

The expected loop is:

```text
ChatGPT = planner / reviewer / merger / issue manager
Claude Code = coding agent
Local AI backend = constrained model with short memory
Jean-Paul = operator / validator / final decision maker
```

Keep tasks small enough that Claude Code using the local model can succeed after a fresh `/clear`.
