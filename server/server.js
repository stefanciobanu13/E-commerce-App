import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pool, { initializeDatabase, seedDatabase } from './db.js';
import { fileURLToPath } from 'url';
import path from 'path';

const app = express();
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json());

// Serve frontend static files when available (production)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDistPath));
// Health check endpoint used by hosts for liveness/readiness probes
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// If no API route matched and a client build exists, serve index.html for client-side routing
app.get('*', (req, res, next) => {
  // If the request looks like an API call, skip
  if (req.path.startsWith('/api')) return next();
  // Serve index.html if it exists
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      next();
    }
  });
});


const authenticateToken = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const token = auth.split(' ')[1];
  const userId = parseInt(token.replace('token-', ''));
  req.userId = userId;
  next();
};

const authorizeAdmin = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT role FROM users WHERE id = $1', [req.userId]);
    if (result.rows.length === 0 || result.rows[0].role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Endpoints for authentication
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query(
      'SELECT id, email, role FROM users WHERE email = $1 AND password = $2',
      [email, password]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const user = result.rows[0];
    res.json({ accessToken: `token-${user.id}`, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/me', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, role FROM users WHERE id = $1', [req.userId]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Edpoints for products
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/products', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { name, price, description, image, stock, category } = req.body;
    const result = await pool.query(
      'INSERT INTO products (name, price, description, image, stock, category) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, price, description, image, stock, category]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/products/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { name, price, description, image, stock, category } = req.body;
    const result = await pool.query(
      'UPDATE products SET name = $1, price = $2, description = $3, image = $4, stock = $5, category = $6 WHERE id = $7 RETURNING *',
      [name, price, description, image, stock, category, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/products/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpoints for orders
app.get('/api/orders', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT o.id, o.user_id, o.total, o.status, o.created_at,
             json_agg(json_build_object('productId', oi.product_id, 'quantity', oi.quantity, 'price', oi.price)) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/orders/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT o.id, o.user_id, o.total, o.status, o.created_at,
             json_agg(json_build_object('productId', oi.product_id, 'quantity', oi.quantity, 'price', oi.price)) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.id = $1
      GROUP BY o.id
    `, [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/orders', authenticateToken, async (req, res) => {
  const client = await pool.connect();
  try {
    const { items, total } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Invalid order items' });
    }

    await client.query('BEGIN');

    // Validation for stock 
    for (const item of items) {
      const result = await client.query('SELECT stock, name FROM products WHERE id = $1', [item.productId]);
      if (result.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({ message: `Product ${item.productId} not found` });
      }
      if (item.quantity > result.rows[0].stock) {
        await client.query('ROLLBACK');
        return res.status(400).json({ message: `Not enough stock for ${result.rows[0].name}` });
      }
    }

    // Adjust the stock and create the order
    const orderResult = await client.query(
      'INSERT INTO orders (user_id, total, status) VALUES ($1, $2, $3) RETURNING id',
      [req.userId, total, 'pending']
    );
    const orderId = orderResult.rows[0].id;

    for (const item of items) {
      await client.query('UPDATE products SET stock = stock - $1 WHERE id = $2', [item.quantity, item.productId]);

      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [orderId, item.productId, item.quantity, item.price]
      );
    }

    await client.query('COMMIT');

    const newOrder = await pool.query('SELECT * FROM orders WHERE id = $1', [orderId]);
    res.status(201).json(newOrder.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: err.message });
  } finally {
    client.release();
  }
});

app.put('/api/orders/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const result = await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpoints for the users table
app.get('/api/users', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, role FROM users');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// start up run 
const startServer = async () => {
  try {
    await initializeDatabase();
    await seedDatabase();
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();

export default app;
