import { useState, useEffect } from 'react';
import { FaUsers, FaBriefcase, FaFileAlt, FaChartBar } from 'react-icons/fa';
import api from '../../services/api';
import useAuth from '../../hooks/useAuth';
import { 
  FaUserGraduate, 
  FaUserTie, 
  FaUserNinja, 
  FaUserShield,
  FaUserAstronaut,
  FaUserCog,
  FaUserSecret,
  FaUserAlt
} from 'react-icons/fa';

const GADA_LEVELS = [
  { id: 'beginner', name: 'Beginner', icon: FaUserGraduate },
  { id: 'early-beginner', name: 'Early Beginner', icon: FaUserAlt },
  { id: 'junior-developer', name: 'Junior Developer', icon: FaUserTie },
  { id: 'mid-level-developer', name: 'Mid-Level Developer', icon: FaUserNinja },
  { id: 'senior-developer', name: 'Senior Developer', icon: FaUserShield },
  { id: 'tech-lead', name: 'Tech Lead', icon: FaUserCog },
  { id: 'expert-developer', name: 'Expert Developer', icon: FaUserAstronaut },
  { id: 'master-developer', name: 'Master Developer', icon: FaUserSecret }
];

const AdminPanel = () => {
  const { auth } = useAuth();
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    totalUsers: 0,
    pendingApplications: 0,
    gadaLevels: [], // Added for Gada System Distribution
    unpaidInterns: 0, // Added for Internship Status Breakdown
    paidInterns: 0, // Added for Internship Status Breakdown
    fullTimeInterns: 0, // Added for Internship Status Breakdown
  });
  const [loading, setLoading] = useState(true);
  const gadaDistribution = stats.gadaLevels?.reduce((acc, level) => {
    acc[level._id] = level.count || 0; // Ensure count is defined
    return acc;
  }, {});
// filepath: c:\Users\jerem\Videos\debo-engineering-job-portal\frontend\src\components\dashboard\AdminPanel.jsx
useEffect(() => {
  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats', {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setStats(response.data.data); // Ensure response structure matches backend
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchStats();
}, [auth.token]);

  if (loading) {
    return <div className="text-center py-8">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8 px-2 md:px-0 max-w-7xl mx-auto w-full">
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <FaBriefcase size={24} />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm">Total Jobs</h3>
              <p className="text-2xl font-bold">{stats.totalJobs}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <FaFileAlt size={24} />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm">Total Applications</h3>
              <p className="text-2xl font-bold">{stats.totalApplications}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <FaUsers size={24} />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm">Total Users</h3>
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <FaChartBar size={24} />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm">Pending Applications</h3>
              <p className="text-2xl font-bold">{stats.pendingApplications}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gada System Distribution */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-md border border-gray-100">
        <h3 className="text-lg font-semibold text-debo-blue mb-4">
          Gada System Distribution
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 md:gap-4">
          {GADA_LEVELS.map(level => {
            const Icon = level.icon;
            return (
              <div key={level.id} className="text-center p-3 rounded-lg bg-gray-50 hover:bg-debo-light-blue hover:text-white transition">
                <div className="flex justify-center mb-2">
                  <Icon className="text-debo-blue" size={24} />
                </div>
                <h4 className="text-sm font-medium text-gray-700">{level.name}</h4>
                <p className="text-xl font-bold">
                  {gadaDistribution?.[level.id] || 0}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Internship Status Breakdown */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-md border border-gray-100">
        <h3 className="text-lg font-semibold text-debo-blue mb-4">
          Internship Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800">Unpaid Interns</h4>
            <p className="text-2xl font-bold text-blue-600">
              {stats.unpaidInterns || 0}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-green-800">Paid Interns</h4>
            <p className="text-2xl font-bold text-green-600">
              {stats.paidInterns || 0}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-purple-800">Converted to Full-time</h4>
            <p className="text-2xl font-bold text-purple-600">
              {stats.fullTimeInterns || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;