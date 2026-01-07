# API Reference

Base URL (local): `http://localhost:3001/api`

## Authentication
- POST `/api/login`
  - Body: `{ "email": "user@example.com", "password": "secret" }`
  - Response: `{ "accessToken": "token-<userId>", "user": { id, email, role } }`
  - Notes: The application uses a simple token format `token-<userId>` for demo purposes. Pass it in the `Authorization` header as `Bearer <token>`.

- GET `/api/me`
  - Headers: `Authorization: Bearer token-<userId>`
  - Response: `{ id, email, role }` (or 401 if token invalid)

## Products
- GET `/api/products`
  - Returns: array of products

- GET `/api/products/:id`
  - Returns: single product or 404

- POST `/api/products` (Admin only)
  - Headers: `Authorization: Bearer token-<adminId>`
  - Body: `{ name, price, description, image, stock, category }`
  - Creates a product and returns it (201)

- PUT `/api/products/:id` (Admin only)
  - Body: same product fields
  - Updates product or returns 404

- DELETE `/api/products/:id` (Admin only)
  - Returns 204 on success or 404

## Orders
- GET `/api/orders` (Admin only)
  - Returns list of orders; each includes aggregated `items` array

- GET `/api/orders/:id` (Admin only)
  - Returns order detail (with `items`) or 404

- POST `/api/orders` (Authenticated users)
  - Headers: `Authorization: Bearer token-<userId>`
  - Body: `{ items: [{ productId, quantity, price }...], total }
  - Validates stock, creates order and order_items, updates product stock, returns created order (201)

- PUT `/api/orders/:id` (Admin only)
  - Body: `{ status }` — update order status

## Users
- GET `/api/users` (Admin only)
  - Returns: list of users with `id`, `email`, `role`

## Error handling
- 400: Bad request, e.g., invalid order items or insufficient stock
- 401: Unauthorized (missing or invalid token)
- 403: Forbidden (insufficient permissions)
- 404: Not found
- 500: Server error

## Notes
- Authentication is token-based for demo/seeding; replace with JWT or proper auth for production.
- Protect admin endpoints with proper role checks (`authorizeAdmin`).
