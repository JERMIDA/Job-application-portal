import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { register } from '../../services/authService';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'applicant', // Add role field
  });
  const [loading, setLoading] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [showAdminOptions, setShowAdminOptions] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleInviteCodeChange = (e) => {
    setInviteCode(e.target.value);
    // Example: Only show admin/super-admin if code matches
    if (e.target.value === 'DEBO-SUPERADMIN-2025') {
      setShowAdminOptions(true);
    } else {
      setShowAdminOptions(false);
      setFormData(f => ({ ...f, role: 'applicant' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Invalid email format');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role, // Send role to backend
      });
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md w-full sm:w-11/12 md:w-10/12 lg:w-8/12">
      <h2 className="text-2xl font-bold text-center text-debo-blue mb-6">Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div className="mb-4 relative">
          <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
            className="w-full px-3 py-2 border rounded-md pr-10"
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
        <div className="mb-6 relative">
          <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">Confirm Password</label>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength="6"
            className="w-full px-3 py-2 border rounded-md pr-10"
          />
          <button
            type="button"
            tabIndex={-1}
            className="absolute right-3 top-9 text-gray-500 hover:text-debo-blue focus:outline-none"
            onClick={() => setShowConfirmPassword((v) => !v)}
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <div className="mb-4">
          <label htmlFor="inviteCode" className="block text-gray-700 mb-2">Invite Code (required for Admin/Super Admin)</label>
          <input
            type="text"
            id="inviteCode"
            name="inviteCode"
            value={inviteCode}
            onChange={handleInviteCodeChange}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Enter invite code if you have one"
          />
          <div className="text-xs text-gray-500 mt-1">Leave blank to register as Applicant.</div>
        </div>
        <div className="mb-4">
          <label htmlFor="role" className="block text-gray-700 mb-2">Role</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            disabled={!showAdminOptions}
          >
            <option value="applicant">Applicant</option>
            {showAdminOptions && <option value="admin">Admin</option>}
            {showAdminOptions && <option value="super-admin">Super Admin</option>}
          </select>
          <div className="text-xs text-gray-500 mt-1">Only use Super Admin for initial setup or if you have permission.</div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <div className="mt-4 text-center">
        <p className="text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-debo-light-blue hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;