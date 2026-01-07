import { useState, useEffect } from 'react';
import { useAlert } from '../contexts/AlertContext.jsx';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showAlert } = useAlert();

  useEffect(() => {
    const token = localStorage.getItem('token');
    Promise.all([
      fetch('/api/orders', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
      fetch('/api/me', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()).catch(() => null),
      fetch('/api/users', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()).catch(() => []),
    ])
      .then(([ordersData, me, usersData]) => {
        // map user emails
        const usersMap = (usersData || []).reduce((acc, u) => ({ ...acc, [u.id]: u }), {});
        setOrders((ordersData || []).map((o) => ({ ...o, user: usersMap[o.user_id] })));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const updateStatus = async (orderId, status) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (res.ok) {
      setOrders((prev) => prev.map((o) => (o.id === orderId ? data : o)));
      showAlert('Order updated', 'success');
    } else {
      showAlert(data.message || 'Failed to update order', 'error');
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Orders</h2>
      {orders.length === 0 ? (
        <div className="text-gray-500">No orders found</div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border p-4 rounded-lg bg-white shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold">Order #{order.id}</p>
                  <p className="text-gray-600">User: {order.user?.email || order.user_id}</p>
                  <p className="text-gray-600">Placed: {new Date(order.created_at).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">Total: ${order.total.toFixed(2)}</p>
                  <select value={order.status} onChange={(e) => updateStatus(order.id, e.target.value)} className="mt-2 px-3 py-2 rounded-lg border">
                    <option value="pending">pending</option>
                    <option value="shipped">shipped</option>
                    <option value="delivered">delivered</option>
                    <option value="canceled">canceled</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <p className="font-semibold">Items:</p>
                <ul className="list-disc ml-6 mt-2">
                  {order.items.map((it, idx) => (
                    <li key={idx}>{`Product ${it.productId} — qty ${it.quantity}`}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
