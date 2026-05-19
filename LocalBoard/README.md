# LocalBoard

LocalBoard is the second local-LLM coding test application for this repository.

Goal: build a small offline-first Kanban board through GitHub issues, Claude Code prompts, pull requests, and ChatGPT review.

## Target application

A compact Kanban-style task board:

- columns such as Backlog, Todo, In Progress, and Done;
- cards with title, description, priority, tags, and status;
- create, edit, delete, and move cards;
- local persistence;
- focused tests;
- clear README and validation notes.

## Launching locally

### Windows (batch launcher)

Double-click `launch_localboard.bat` in the `LocalBoard/` directory.
The script checks that `node_modules` exists and starts the Vite dev server.

### Manual steps (Windows, macOS, Linux)

```bat
cd LocalBoard
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Process rule

Each implementation step should be handled as one atomic GitHub issue and one pull request.
Claude Code should receive self-contained prompts after `/clear`, inspect the relevant files first, make minimal changes, run tests when feasible, then open a PR for ChatGPT review.
