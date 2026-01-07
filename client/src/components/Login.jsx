import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border-2 border-cyan-200 p-8">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-cyan-200 rounded-lg focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-opacity-50 transition-all input-field"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-cyan-200 rounded-lg focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-opacity-50 transition-all input-field"
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <p className="text-red-600 font-bold bg-red-50 p-3 rounded-lg">{error}</p>}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-400 to-blue-400 text-white py-3 rounded-lg font-bold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Login
          </button>
        </form>
        <p className="text-center text-gray-600 mt-6">
          Demo: admin@example.com / admin123 or customer@example.com / customer123
        </p>
      </div>
    </div>
  );
};

export default Login;
