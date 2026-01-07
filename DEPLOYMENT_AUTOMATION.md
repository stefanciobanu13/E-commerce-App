# Automated Deployment Setup (GitHub Actions)

This document explains the automated workflows added to this repository and the repository secrets you need to configure.

## What I added

- `.github/workflows/deploy-frontend-netlify.yml` — builds the `client` app and deploys to Netlify using the Netlify CLI.
- `.github/workflows/deploy-backend-render.yml` — triggers a Render deploy when `server/` changes are pushed.
- `server/db.js` updated to support `DATABASE_URL` (cloud providers) and SSL when `NODE_ENV=production`.

## GitHub repository secrets to add

Add these secrets at GitHub → Settings → Secrets → Actions:

- `NETLIFY_AUTH_TOKEN` — Netlify personal access token with Deploy permissions.
- `NETLIFY_SITE_ID` — Site ID for your Netlify site.
- `RENDER_API_KEY` — API key from Render dashboard.
- `RENDER_SERVICE_ID` — Service ID of the Render Web Service for the backend.

## How to set up Netlify (frontend)
1. Create a new site in Netlify and connect your GitHub repo.
2. Set the build command to `npm run build` and the publish directory to `dist` (or set base dir to `client/` and leave publish as `dist`).
3. Add `VITE_API_URL` as an environment variable pointing to your backend URL.
4. Add the Netlify site ID and a personal access token as `NETLIFY_SITE_ID` and `NETLIFY_AUTH_TOKEN` in GitHub secrets.

## How to set up Render (backend)
1. Create a new Web Service on Render and connect your GitHub repo.
2. Set the root directory to `server/` in the Render service settings.
3. Set the build and start commands (defaults are usually fine: `npm install`, `npm start`).
4. Add environment variables (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `CORS_ORIGIN`, `PORT`) in the Render dashboard.
5. Copy the Service ID and create an API key in Render; add both as `RENDER_SERVICE_ID` and `RENDER_API_KEY` in GitHub secrets.

## Trigger behavior
- When you push changes to `client/`, GitHub Actions will build and deploy the frontend to Netlify.
- When you push changes to `server/`, GitHub Actions will trigger a Render deploy for your backend.

## Notes & Helpful Commands
- To find `NETLIFY_SITE_ID`, use `netlify sites:list --json` with `NETLIFY_AUTH_TOKEN` or check the site settings in the dashboard.
- On Render, the Service ID is visible in the service settings page.

---

If you want, I can:
- Create the Netlify site for you (you'll need to provide a Netlify token),
- Provision a Render service via API (you'll need to provide an API key), or
- Walk you through both dashboards step-by-step.

Tell me which provider(s) you want me to act on, or if you'd prefer that I create the GitHub Actions only and you provide the provider secrets yourself.