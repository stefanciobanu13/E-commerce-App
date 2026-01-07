import { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useAlert } from '../contexts/AlertContext.jsx';
import { useNavigate } from 'react-router-dom';

const ProductList = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        setAllProducts(data);
        setLoading(false);
      });
  }, []);

  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !category || product.category === category;
    const matchesMinPrice = !minPrice || product.price >= parseFloat(minPrice);
    const matchesMaxPrice = !maxPrice || product.price <= parseFloat(maxPrice);
    return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const categories = [...new Set(allProducts.map(p => p.category))];

  const handleAddToCart = (product) => {
    // addToCart will show an in-app alert if stock is exceeded or on success
    addToCart(product);
  };

  const { showAlert } = useAlert();

  const handleDelete = async (id) => {
    if (!confirm('Delete product?')) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      setAllProducts(allProducts.filter(p => p.id !== id));
      showAlert('Product deleted', 'success');
    } else {
      showAlert('Failed to delete', 'error');
    }
  };

  if (loading) return <div className="text-center py-8 text-2xl text-blue-400 font-semibold"><span className="animate-pulse">Loading...</span></div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Our Collection</h1>
      
      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-4 bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl shadow-md">
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-3 border-2 border-cyan-200 rounded-lg focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-opacity-50 transition-all input-field"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-3 border-2 border-cyan-200 rounded-lg focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-opacity-50 transition-all input-field"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="px-4 py-3 border-2 border-cyan-200 rounded-lg focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-opacity-50 transition-all input-field"
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="px-4 py-3 border-2 border-cyan-200 rounded-lg focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-opacity-50 transition-all input-field"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedProducts.map((product, index) => (
          <div key={product.id} className="product-card border-2 border-cyan-100 p-6 rounded-xl bg-white overflow-hidden" style={{ animationDelay: `${index * 0.05}s` }}>
            <div className="relative overflow-hidden rounded-lg mb-4 h-48 bg-gradient-to-br from-cyan-100 to-blue-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
              />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h2>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
            <div className="flex items-center justify-between mb-4">
              <p className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">${product.price}</p>
              <p className="text-sm font-semibold text-cyan-600 bg-cyan-100 px-3 py-1 rounded-full">{product.stock > 0 ? 'In stock' : 'Out of stock'}</p>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleAddToCart(product)}
                className="btn-primary flex-1 px-4 py-2 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                disabled={!user || user.role !== 'customer' || product.stock <= 0}
              >
                Add to Cart
              </button>
              {user?.role === 'admin' && (
                <>
                  <button
                    onClick={() => navigate(`/edit-product/${product.id}`)}
                    className="bg-amber-400 text-gray-800 px-3 py-2 rounded-lg font-semibold hover:bg-amber-500 hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-400 text-white px-3 py-2 rounded-lg font-semibold hover:bg-red-500 hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-4 items-center">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-400 text-white rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
          >
            ← Prev
          </button>
          <span className="px-6 py-3 font-bold text-lg text-gray-700 bg-gray-100 rounded-lg">Page <span className="text-cyan-500">{page}</span> of <span className="text-blue-500">{totalPages}</span></span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-400 text-white rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;
