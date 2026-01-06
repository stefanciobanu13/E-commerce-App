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
    return <div className="text-center py-8">Access denied</div>;
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
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Add Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Price</label>
          <input
            name="price"
            type="number"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          {errors.price && <p className="text-red-600 text-sm">{errors.price}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          {errors.description && <p className="text-red-600 text-sm">{errors.description}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Image URL</label>
          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          {errors.image && <p className="text-red-600 text-sm">{errors.image}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Stock</label>
          <input
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          {errors.stock && <p className="text-red-600 text-sm">{errors.stock}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Category</label>
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          {errors.category && <p className="text-red-600 text-sm">{errors.category}</p>}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProducts;