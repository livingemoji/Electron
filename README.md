# Electron Chat MVP

A minimal Electron + React app with a local SQLite database and a mock WebSocket feed.

## Features
- Electron main process with IPC bridge (`preload.ts`)
- React renderer (Vite) with chat list + messages
- SQLite storage via `better-sqlite3`
- Mock WS server that streams new messages

## Requirements
- Node.js 18+ recommended

## Setup
```bash
npm install
```

## Development
Runs TypeScript in watch mode, Vite dev server, and Electron together.
```bash
npm run dev:all
```

## Build
```bash
npm run build
```

## Scripts
- `npm run dev:all` — Vite + TS watch + Electron
- `npm run dev:renderer` — Vite only
- `npm run dev:main` — TypeScript watch only
- `npm run build` — Build main + renderer

## Project Structure
- `src/main/` — Electron main process, DB, WS server
- `src/main/preload.ts` — IPC bridge
- `src/renderer/` — React UI
- `shared/` — shared types
- `dist/` — build output

## Notes
- The app uses Electron `app.getPath("userData")` for the database location.
- The renderer expects `window.api` from the preload bridge.
