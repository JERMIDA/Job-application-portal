import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';
import { login } from '../../services/authService';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const response = await login(formData);
      setAuth({
        user: response.user,
        token: response.token,
      });
      localStorage.setItem('token', response.token); // Ensure token is saved for job apply
      // Redirect to intended page if present
      const redirectUrl = localStorage.getItem('redirectAfterLogin');
      if (redirectUrl) {
        localStorage.removeItem('redirectAfterLogin');
        navigate(redirectUrl);
      } else {
        navigate(response.user.role === 'admin' ? '/admin' : '/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg w-full sm:w-11/12 md:w-10/12 lg:w-8/12 border border-gray-100">
      <h2 className="text-3xl font-extrabold text-center text-debo-blue mb-6 tracking-tight">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2 font-semibold">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-debo-light-blue focus:border-debo-blue transition"
          />
        </div>
        <div className="mb-6 relative">
          <label htmlFor="password" className="block text-gray-700 mb-2 font-semibold">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-debo-light-blue focus:border-debo-blue transition pr-10"
          />
          <button
            type="button"
            tabIndex={-1}
            className="absolute right-3 top-9 text-gray-500 hover:text-debo-blue focus:outline-none"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full text-lg py-2 mt-2 shadow-md hover:scale-105 transition-transform duration-150"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <div className="mt-6 text-center flex flex-col gap-2">
        <button
          type="button"
          onClick={() => navigate('/forgot-password')}
          className="text-debo-light-blue hover:underline font-semibold w-fit mx-auto px-2 py-1 rounded transition-colors duration-150 hover:bg-debo-light-blue/10 focus:outline-none"
        >
          Forgot password?
        </button>
        <p className="text-gray-600 mt-2">
          Don't have an account?{' '}
          <a href="/register" className="text-debo-light-blue hover:underline font-semibold">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;