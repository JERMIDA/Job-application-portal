import { useState, useEffect } from 'react';
import api from '../../services/api';
import useAuth from '../../hooks/useAuth';

const InternProgressionHistory = ({ userId }) => {
  const { auth } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get(`/admin/interns/${userId}/progression`, {
          headers: { Authorization: `Bearer ${auth.token}` }
        });
        setHistory(res.data.history || []);
      } catch {
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchHistory();
  }, [userId, auth.token]);

  if (loading) return <div className="text-center py-2">Loading progression...</div>;
  if (!history.length) return <div className="text-center text-gray-500">No progression history.</div>;

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h4 className="font-semibold mb-2">Intern Progression History</h4>
      <ul className="list-disc pl-6">
        {history.map((h, i) => (
          <li key={i}>{h.level} - {new Date(h.date).toLocaleString()}</li>
        ))}
      </ul>
    </div>
  );
};

export default InternProgressionHistory;
