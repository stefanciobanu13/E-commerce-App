# Frontend (client) — Local Setup

This project uses Vite + React located in `/client`.

## Prerequisites
- Node.js 16+ and npm

## Install
```bash
cd client
npm install
```

## Run in development
```bash
npm run dev
# Open http://localhost:5173 (default Vite port)
```

## Environment
Create `/client/.env` or `/client/.env.local` for local overrides.
Example `.env` entries:
```
VITE_API_URL=http://localhost:3001
```

## Build & Preview production build
```bash
npm run build
npm run preview
```

## Linting & Formatting
```bash
npm run lint
npm run format
```

## Notes
- During deployment (Netlify), use `VITE_API_URL` in `.env.production`.
- See `DEPLOYMENT_PLAN.md` for front-end deployment steps.
