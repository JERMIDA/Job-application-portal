import { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';

const ResumeInsights = ({ userId }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await api.get(`/admin/users/${userId}/resume-insights`);
        setInsights(res.data.data);
      } catch {
        toast.error('Failed to load resume insights');
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchInsights();
  }, [userId]);

  if (loading) return <div className="text-center py-4">Loading resume insights...</div>;
  if (!insights) return <div className="text-center py-4 text-gray-500">No resume insights available.</div>;

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h4 className="font-semibold mb-2">Resume Insights</h4>
      <div className="mb-2">
        <strong>Extracted Skills:</strong>
        <ul className="list-disc pl-6">
          {insights.skills && insights.skills.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      </div>
      <div className="mb-2">
        <strong>AI Recommendations:</strong>
        <ul className="list-disc pl-6">
          {insights.recommendations && insights.recommendations.map((r, i) => <li key={i}>{r}</li>)}
        </ul>
      </div>
      {/* Add more insights as needed */}
    </div>
  );
};

export default ResumeInsights;
