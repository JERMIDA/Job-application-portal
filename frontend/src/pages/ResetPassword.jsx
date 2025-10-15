import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, password });
      setSuccess(true);
      toast.success('Password reset successful! You can now log in.');
      setTimeout(() => navigate('/login'), 2000);
    } catch {
      toast.error('Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg mt-20">
      <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>
      {success ? (
        <div className="text-green-600 text-center">Password reset! Redirecting to login...</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="password"
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Enter new password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
