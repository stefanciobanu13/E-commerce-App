import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, 'db.json');
let db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

const saveDb = () => {
 fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
};

// Products endpoints
app.get('/products', (req, res) => {
 res.json(db.products);
});

app.get('/api/products', (req, res) => {
 res.json(db.products);
});

app.get('/products/:id', (req, res) => {
 const id = parseInt(req.params.id);
 const product = db.products.find(p => p.id === id);
 if (!product) return res.status(404).json({ message: 'Product not found' });
 res.json(product);
});

app.get('/api/products/:id', (req, res) => {
 const id = parseInt(req.params.id);
 const product = db.products.find(p => p.id === id);
 if (!product) return res.status(404).json({ message: 'Product not found' });
 res.json(product);
});

app.post('/products', (req, res) => {
 const auth = req.headers.authorization;
 if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
 const token = auth.split(' ')[1];
 const userId = token.replace('token-', '');
 const user = db.users.find(u => u.id == userId);
 if (!user || user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

 const newProduct = { id: Date.now(), ...req.body };
 db.products.push(newProduct);
 saveDb();
 res.status(201).json(newProduct);
});

app.post('/api/products', (req, res) => {
 const auth = req.headers.authorization;
 if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
 const token = auth.split(' ')[1];
 const userId = token.replace('token-', '');
 const user = db.users.find(u => u.id == userId);
 if (!user || user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

 const newProduct = { id: Date.now(), ...req.body };
 db.products.push(newProduct);
 saveDb();
 res.status(201).json(newProduct);
});

app.put('/products/:id', (req, res) => {
 const auth = req.headers.authorization;
 if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
 const token = auth.split(' ')[1];
 const userId = token.replace('token-', '');
 const user = db.users.find(u => u.id == userId);
 if (!user || user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

 const id = parseInt(req.params.id);
 const index = db.products.findIndex(p => p.id === id);
 if (index === -1) return res.status(404).json({ message: 'Product not found' });
 db.products[index] = { ...db.products[index], ...req.body };
 saveDb();
 res.json(db.products[index]);
});

app.put('/api/products/:id', (req, res) => {
 const auth = req.headers.authorization;
 if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
 const token = auth.split(' ')[1];
 const userId = token.replace('token-', '');
 const user = db.users.find(u => u.id == userId);
 if (!user || user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

 const id = parseInt(req.params.id);
 const index = db.products.findIndex(p => p.id === id);
 if (index === -1) return res.status(404).json({ message: 'Product not found' });
 db.products[index] = { ...db.products[index], ...req.body };
 saveDb();
 res.json(db.products[index]);
});

app.delete('/products/:id', (req, res) => {
 const auth = req.headers.authorization;
 if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
 const token = auth.split(' ')[1];
 const userId = token.replace('token-', '');
 const user = db.users.find(u => u.id == userId);
 if (!user || user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

 const id = parseInt(req.params.id);
 const index = db.products.findIndex(p => p.id === id);
 if (index === -1) return res.status(404).json({ message: 'Product not found' });
 db.products.splice(index, 1);
 saveDb();
 res.status(204).send();
});

app.delete('/api/products/:id', (req, res) => {
 const auth = req.headers.authorization;
 if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
 const token = auth.split(' ')[1];
 const userId = token.replace('token-', '');
 const user = db.users.find(u => u.id == userId);
 if (!user || user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

 const id = parseInt(req.params.id);
 const index = db.products.findIndex(p => p.id === id);
 if (index === -1) return res.status(404).json({ message: 'Product not found' });
 db.products.splice(index, 1);
 saveDb();
 res.status(204).send();
});

app.post('/login', (req, res) => {
 const { email, password } = req.body;
 const user = db.users.find(u => u.email === email && u.password === password);
 if (!user) return res.status(401).json({ message: 'Invalid credentials' });
 res.json({ accessToken: `token-${user.id}`, user });
});

app.post('/api/login', (req, res) => {
 const { email, password } = req.body;
 const user = db.users.find(u => u.email === email && u.password === password);
 if (!user) return res.status(401).json({ message: 'Invalid credentials' });
 res.json({ accessToken: `token-${user.id}`, user });
});

app.get('/me', (req, res) => {
 const auth = req.headers.authorization;
 if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
 const token = auth.split(' ')[1];
 const userId = token.replace('token-', '');
 const user = db.users.find(u => u.id == userId);
 if (!user) return res.status(401).json({ message: 'Invalid token' });
 res.json(user);
});

app.get('/api/me', (req, res) => {
 const auth = req.headers.authorization;
 if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
 const token = auth.split(' ')[1];
 const userId = token.replace('token-', '');
 const user = db.users.find(u => u.id == userId);
 if (!user) return res.status(401).json({ message: 'Invalid token' });
 res.json(user);
});

app.listen(3001, () => {
 console.log('Server running on port 3001');
});