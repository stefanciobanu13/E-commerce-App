# Architecture Overview

This is a simple e-commerce reference application with a separation between frontend and backend.

Components:
- Frontend (client/): React + Vite — static build served by Netlify or any static host
- Backend (server/): Express.js + PostgreSQL — REST API for products, orders, and users
- Database: PostgreSQL — stores users, products, orders, order_items

Flow:
1. User loads frontend (static files)
2. Frontend calls backend API (`VITE_API_URL`) to fetch products, authentication, and place orders
3. Backend performs DB operations and returns JSON responses

Deployment:
- Frontend: Build using `cd client && npm run build`, deploy to Netlify (see `DEPLOYMENT_PLAN.md`)
- Backend: Deploy to Railway/Render or similar, set `DB_*` environment variables

Authentication & Authorization:
- Simple token format used for demo `token-<userId>`; admin role is stored in users table and enforced by `authorizeAdmin` middleware

Database Initialization:
- The server includes `initializeDatabase()` and `seedDatabase()` on startup (see `/server/db.js`)

Notes & Next steps:
- Replace demo token system with secure JWT or OAuth in production
- Add migrations (e.g., with Knex or Sequelize) and CI tests for schema changes
- Add API documentation generator (OpenAPI / Swagger) if API expands
