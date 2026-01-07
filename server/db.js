import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5433,
  database: process.env.DB_NAME || 'ecommerce_db',
});

// Initialize database schema on startup
export const initializeDatabase = async () => {
  try {
    console.log('Starting database initialization...');
    const client = await pool.connect();
    try {
      // Create users table
      await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'customer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create products table
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        description TEXT,
        image TEXT,
        stock INTEGER DEFAULT 0,
        category VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create carts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS carts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create cart_items table
    await client.query(`
      CREATE TABLE IF NOT EXISTS cart_items (
        id SERIAL PRIMARY KEY,
        cart_id INTEGER NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
        product_id INTEGER NOT NULL REFERENCES products(id),
        quantity INTEGER NOT NULL,
        UNIQUE(cart_id, product_id)
      )
    `);

    // Create orders table
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        total DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create order_items table
    await client.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER NOT NULL REFERENCES products(id),
        quantity INTEGER NOT NULL,
        price DECIMAL(10, 2) NOT NULL
      )
    `);

    console.log('Database tables initialized successfully');
    } catch (err) {
      console.error('Error initializing database:', err.message);
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Fatal error during database initialization:', err.message);
    throw err;
  }
};

// Seed initial data
export const seedDatabase = async () => {
  const client = await pool.connect();
  try {
    // Check if users exist
    const usersResult = await client.query('SELECT COUNT(*) FROM users');
    if (parseInt(usersResult.rows[0].count) > 0) {
      console.log('Database already seeded');
      return;
    }

    // Insert seed users
    await client.query(
      `INSERT INTO users (email, password, role) VALUES 
       ('admin@example.com', 'admin123', 'admin'),
       ('customer@example.com', 'customer123', 'customer')`
    );

    const products = [
      { name: 'Classic Cotton T-Shirt', price: 24.99, description: 'Comfortable everyday cotton t-shirt available in multiple colors', stock: 50, category: 'Clothing' },
      { name: 'Denim Jeans', price: 59.99, description: 'Classic blue denim jeans with perfect fit', stock: 35, category: 'Clothing' },
      { name: 'Winter Jacket', price: 129.99, description: 'Warm and stylish winter jacket with insulation', stock: 20, category: 'Clothing' },
      { name: 'Sports Running Shoes', price: 89.99, description: 'Lightweight running shoes with cushioning for comfort', stock: 25, category: 'Footwear' },
      { name: 'Casual Sneakers', price: 74.99, description: 'Trendy casual sneakers perfect for everyday wear', stock: 40, category: 'Footwear' },
    ];

    for (const product of products) {
      await client.query(
        'INSERT INTO products (name, price, description, stock, category) VALUES ($1, $2, $3, $4, $5)',
        [product.name, product.price, product.description, product.stock, product.category]
      );
    }

    console.log('Database seeded with initial data');
  } catch (err) {
    console.error('Error seeding database:', err.message);
  } finally {
    client.release();
  }
};

export default pool;
