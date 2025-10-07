# MediScanner (medical-history-app)

A small React + Vite application for managing medical history, charts, and prescription images.

## What this project is

MediScanner (package name: `medical-history-app`) is a TypeScript React application built with Vite. It includes a small state store (Redux Toolkit), API client helpers, image upload support (ImageKit), and a few UI pages for authentication and viewing medical history and charts.

Key technologies:
- React 18 + TypeScript
- Vite
- Redux Toolkit
- Tailwind CSS
- ImageKit (client-side uploads)
- Vitest + Testing Library for tests

## Quick start

Prerequisites
- Node.js (16+ recommended)
- pnpm (recommended) or npm/yarn

Install dependencies (pnpm recommended):

```bash
pnpm install
# or with npm:
# npm install
```

Run in development mode:

```bash
pnpm dev
# or
# npm run dev
```

Open http://localhost:5173 in your browser (Vite default) unless the dev server prints a different port.

## Environment variables

This project uses Vite environment variables (prefixed with `VITE_`). Create a `.env.local` (or `.env`) in the project root and add any variables you need. Example:

```
VITE_API_BASE_URL=https://api.example.com
VITE_IMAGEKIT_PUBLIC_KEY=public_xxx
VITE_IMAGEKIT_ENDPOINT_URL=https://ik.imagekit.io/your_imagekit_id
# Any other secrets or backend endpoints used by your API
```

## Tests

This project uses Vitest and Testing Library. Run tests with:

```bash
pnpm test
```


## Contributing

1. Fork/branch the repo
2. Add a clear commit message
3. Run linters and typechecks before creating a PR

Small PR checklist:
- Is the code typed (TypeScript)?
- Do tests pass? (`pnpm test`)
- Was lint run? (`pnpm lint`)

## License

This project is licensed under the MIT License - see the [LICENSE](https://choosealicense.com/licenses/mit/) file for details.

---

If you'd like, I can also:
- Add a short CONTRIBUTING.md
- Create a sample `.env.example` with recommended variables
- Wire up a simple GitHub Actions workflow for CI (lint + typecheck + tests)

Tell me which of the above you'd like next.
