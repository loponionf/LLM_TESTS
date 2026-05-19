# LocalBoard

LocalBoard is the second local-LLM coding test application for this repository.

Goal: build a small offline-first Kanban board through GitHub issues, Claude Code prompts, pull requests, and ChatGPT review.

This folder is intentionally minimal for now. The actual application scaffold must be created by Claude Code using the local AI backend from a dedicated GitHub issue and pull request.

## Target application

A compact Kanban-style task board:

- columns such as Backlog, Todo, In Progress, and Done;
- cards with title, description, priority, tags, and status;
- create, edit, delete, and move cards;
- local persistence;
- focused tests;
- clear README and validation notes.

## Process rule

Each implementation step should be handled as one atomic GitHub issue and one pull request.
Claude Code should receive self-contained prompts after `/clear`, inspect the relevant files first, make minimal changes, run tests when feasible, then open a PR for ChatGPT review.
