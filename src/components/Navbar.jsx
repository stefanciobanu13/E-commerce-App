import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <NavLink to="/" className="text-xl font-bold">
          Galero
        </NavLink>
        <div className="flex space-x-4">
          <NavLink to="/" className="hover:underline">
            Home
          </NavLink>
          <NavLink to="/cart" className="hover:underline">
            Cart ({cart.length})
          </NavLink>
          {user?.role === 'admin' && (
            <NavLink to="/add-product" className="hover:underline">
              Add Product
            </NavLink>
          )}
          {user ? (
            <div className="flex items-center space-x-2">
              <span>{user.email}</span>
              <button onClick={logout} className="hover:underline">
                Logout
              </button>
            </div>
          ) : (
            <NavLink to="/login" className="hover:underline">
              Login
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;