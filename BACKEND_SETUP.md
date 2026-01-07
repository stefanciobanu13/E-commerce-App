# Backend (server) — Local Setup

The backend is an Express.js app located in `/server`.

## Prerequisites
- Node.js 16+ and npm
- PostgreSQL (or use a hosted database)

## Install
```bash
cd server
npm install
```

## Environment
Create `/server/.env` with the following variables (example):
```
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce_db
NODE_ENV=development
PORT=3001
```

**Do not commit secrets** — use `.env` locally and environment variables in host environments.

## Run the server
```bash
npm start
# or for development with auto-reload:
npm run dev
```

## Database
- Create the database listed in `DB_NAME` and ensure your `DB_USER` has rights.
- Run any migrations or seed scripts (if present).

## Testing
If tests are available:
```bash
npm test
```

## Notes
- Update CORS origin when deploying (see `DEPLOYMENT_PLAN.md`).
- For production, set `NODE_ENV=production` and configure `PORT` with your host provider.
