import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();

  return (
    <nav className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-500 text-white p-4 shadow-xl sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <NavLink to="/" className="text-2xl font-bold hover:scale-110 transition-transform duration-300 flex items-center gap-2">
          <span className="text-white drop-shadow-lg">✨</span>
          <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">Galero</span>
        </NavLink>
        <div className="flex space-x-6 items-center">
          <NavLink 
            to="/" 
            className="hover:scale-110 transition-transform duration-300 font-semibold text-white drop-shadow-md hover:text-blue-100"
          >
            Home
          </NavLink>
          <NavLink 
            to="/cart" 
            className="hover:scale-110 transition-transform duration-300 font-semibold text-white drop-shadow-md hover:text-blue-100 flex items-center gap-1"
          >
            🛒 Cart <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">{cart.length}</span>
          </NavLink>
          {user?.role === 'admin' && (
            <NavLink 
              to="/admin" 
              className="hover:scale-110 transition-transform duration-300 font-semibold text-white drop-shadow-md hover:text-blue-100"
            >
              ⚙️ Admin
            </NavLink>
          )}
          {user ? (
            <div className="flex items-center space-x-4 border-l-2 border-white pl-6">
              <span className="text-sm font-medium bg-blue-300 bg-opacity-30 px-3 py-1 rounded-full">{user.email}</span>
              <button 
                onClick={logout} 
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                Logout
              </button>
            </div>
          ) : (
            <NavLink 
              to="/login" 
              className="bg-white text-cyan-600 font-semibold px-4 py-2 rounded-lg hover:bg-blue-100 transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              Login
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;