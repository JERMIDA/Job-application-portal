import { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('Password reset link sent! Check your email.');
    } catch {
      toast.error('Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg mt-20">
      <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>
      {sent ? (
        <div className="text-green-600 text-center">If your email exists, a reset link has been sent.</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
