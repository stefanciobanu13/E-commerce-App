# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

## Deployment (Monorepo)

This repository is a monorepo containing two packages:
- `/client` — React + Vite frontend (deploy to Netlify)
- `/server` — Express backend with PostgreSQL (deploy to Railway / Render / other)

Quick steps to deploy from the same GitHub repository:

1. Push all changes to GitHub (main branch).
2. Deploy backend on Railway/Render: point deployment to the repository and set the **root directory** to `server/`.
   - Set environment variables from `/server/.env` (`DB_*`, `PORT`, etc.).
3. Deploy frontend on Netlify: connect the same repository and set the **base directory** to `client/`.
   - Build command: `npm run build` (or `cd client && npm run build` if you set base dir to root)
   - Publish directory: `dist`
   - Add a Netlify environment variable `VITE_API_URL` with the backend URL.
4. Ensure CORS on the backend allows the Netlify URL (`CORS_ORIGIN` env var).
5. Test the live site and API endpoints.

For a detailed step-by-step checklist, see `DEPLOYMENT_PLAN.md` in the repository.
