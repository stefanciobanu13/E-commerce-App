import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';

const AdminDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('products');

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">Admin Dashboard</h1>
      <div className="flex gap-4 mb-6">
        <button onClick={() => setTab('products')} className={`px-4 py-2 rounded-lg font-semibold ${tab === 'products' ? 'bg-cyan-400 text-white' : 'bg-gray-100'}`}>Products</button>
        <button onClick={() => setTab('orders')} className={`px-4 py-2 rounded-lg font-semibold ${tab === 'orders' ? 'bg-cyan-400 text-white' : 'bg-gray-100'}`}>Orders</button>
      </div>

      {tab === 'products' ? <AdminProducts /> : <AdminOrders />}
    </div>
  );
};

export default AdminDashboard;
