# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A single-page browser app ("Code Reader") that uses the device camera to scan
barcodes and QR codes via the [ZXing](https://github.com/zxing-js) library,
then displays the decoded content and barcode format. Built with React 19 and
Vite, deployed as a static site to GitHub Pages.

## Commands

```bash
npm install        # install dependencies
npm run dev        # start Vite dev server with HMR
npm run build      # production build to dist/
npm run preview    # serve the production build locally
npm run lint       # run ESLint over the repo
```

There is no test suite or test runner configured.

## Architecture

The entire app is two files:

- `src/main.jsx` — entry point. Mounts `<App>` inside a custom `ErrorBoundary`
  (class component) and a top-level `try/catch` that replaces `document.body`
  with an error page if `createRoot` fails. Both layers exist to surface
  failures in the deployed GitHub Pages build, where the console is the only
  debugging channel — keep the heavy `console.log`/error reporting when editing.
- `src/App.jsx` — the scanner UI and all logic. Holds a `BrowserMultiFormatReader`
  instance in a `useRef` (created once), lists camera devices and decodes from
  the first one via `decodeFromVideoDevice`, and stores results in state.
  Always call `codeReader.current.reset()` (done in `stopScanning`) to release
  the camera; the unmount effect handles this on teardown.

State flow is local React state only — no router, no global store, no backend.
`isLoading` gates an initial render, `isScanning` toggles the camera, and
`codeData` holds the last decoded `{ text, format }`.

### Dependency notes

- The barcode reader is imported from `@zxing/library` in `App.jsx`. Note that
  `@zxing/browser` is also installed but currently unused.
- `@mui/material` + `@emotion/react`/`@emotion/styled` are installed but not yet
  used; styling is hand-written CSS in `src/App.css` and `src/index.css`.

## Deployment & GitHub Pages constraints

This app is served from a sub-path (`https://nikosi.github.io/code_assist`), so
several settings are load-bearing and must stay in sync — changing one usually
means changing the others:

- `vite.config.js` sets `base: "/code_assist/"`. Asset paths break in production
  if this doesn't match the repo/Pages path.
- `package.json` `homepage` field mirrors the same URL.
- `.github/workflows/deploy.yml` builds and publishes `dist/` to the `gh-pages`
  branch on every push to `main`. Deployment is automatic; do not hand-edit the
  `gh-pages` branch.
- `public/404.html` implements the SPA-on-GitHub-Pages redirect hack
  (rafgraph/spa-github-pages) with `pathSegmentsToKeep = 1` to match the single
  path segment in the base path.

## Conventions

- ESLint uses the flat-config format (`eslint.config.js`). `no-unused-vars`
  ignores identifiers matching `^[A-Z_]` (so unused capitalized/constant
  imports like components don't error).
- Files are plain JSX (`.jsx`), ES modules (`"type": "module"`), browser
  globals. No TypeScript.
- Camera access requires a secure context (HTTPS or localhost); test scanning
  via `npm run dev` (localhost) rather than opening built files directly.
