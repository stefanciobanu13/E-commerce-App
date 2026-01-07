import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AddProducts = () => {
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    stock: '',
    category: '',
  });
  const [errors, setErrors] = useState({});
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user || user.role !== 'admin') {
    return <div className="text-center py-8 text-red-600 font-bold text-xl">Access denied</div>;
  }

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.price || isNaN(form.price) || form.price <= 0)
      newErrors.price = 'Valid price is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.image.trim()) newErrors.image = 'Image URL is required';
    if (!form.stock || isNaN(form.stock) || form.stock < 0)
      newErrors.stock = 'Valid stock is required';
    if (!form.category.trim()) newErrors.category = 'Category is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const token = localStorage.getItem('token');
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
      }),
    });

    if (res.ok) {
      alert('Product added');
      navigate('/');
    } else {
      alert('Failed to add product');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border-2 border-cyan-200 p-8">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Add New Product</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Product Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-cyan-200 rounded-lg focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-opacity-50 transition-all input-field"
                placeholder="e.g., Blue T-Shirt"
                required
              />
              {errors.name && <p className="text-red-600 text-sm font-bold mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Price</label>
              <input
                name="price"
                type="number"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-cyan-200 rounded-lg focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-opacity-50 transition-all input-field"
                placeholder="29.99"
                required
              />
              {errors.price && <p className="text-red-600 text-sm font-bold mt-1">{errors.price}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Stock</label>
              <input
                name="stock"
                type="number"
                value={form.stock}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-cyan-200 rounded-lg focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-opacity-50 transition-all input-field"
                placeholder="50"
                required
              />
              {errors.stock && <p className="text-red-600 text-sm font-bold mt-1">{errors.stock}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-cyan-200 rounded-lg focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-opacity-50 transition-all input-field"
                placeholder="Clothing/Footwear"
                required
              />
              {errors.category && <p className="text-red-600 text-sm font-bold mt-1">{errors.category}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-cyan-200 rounded-lg focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-opacity-50 transition-all input-field h-24"
              placeholder="Product description..."
              required
            />
            {errors.description && <p className="text-red-600 text-sm font-bold mt-1">{errors.description}</p>}
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Image URL</label>
            <input
              name="image"
              value={form.image}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-cyan-200 rounded-lg focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-opacity-50 transition-all input-field"
              placeholder="https://..."
              required
            />
            {errors.image && <p className="text-red-600 text-sm font-bold mt-1">{errors.image}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-400 to-blue-400 text-white py-3 rounded-lg font-bold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProducts;