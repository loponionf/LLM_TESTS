LLM_TESTS - Project Index
==========================

This repository is an LLM-driven development testbed. Top-level folders are
independent subprojects or challenges, each developed through GitHub issues,
Claude Code prompts, pull requests, and ChatGPT review.

Workflow
--------
  ChatGPT plans and reviews.
  Claude Code (local AI) implements.
  Jean-Paul validates.

Implementation prompts must stay scoped to the relevant subfolder.
Normal subproject tasks should read the subproject's own README first and
must not inspect the whole repository by default.

Top-level project folders
-------------------------

1. Tetris/
   Standalone browser-based Tetris game (HTML/CSS/JS, no build step).
   Documentation: Readme.txt
   Entry: index.html
   Scope: work only inside Tetris/ unless a cross-project change is explicitly required.

2. LocalBoard/
   Offline-first Kanban board (Vite + TypeScript, single-page app).
   Documentation: README.md
   Entry: index.html  (dev server at http://localhost:5173)
   Launch: launch_localboard.bat (Windows) or npm install && npm run dev
   Scope: work only inside LocalBoard/ unless a cross-project change is explicitly required.

3. AmigaDemo/
   Collection of Amiga tracker music files (.MOD, .XM, .S3M, .IT).
   No local documentation file found.
   Subfolder: Music/ contains the audio samples.
   Scope: treat as asset-only folder unless new tasks are created for it.

Notes
-----
- Each subproject should maintain its own local documentation.
- This root README is updated only when a new top-level project folder appears.
- Planned or future folders are not listed here until they exist on disk.
