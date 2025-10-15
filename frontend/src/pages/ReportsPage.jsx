import { FaFileAlt, FaChartBar, FaUsers, FaBriefcase } from 'react-icons/fa';
import useAuth from '../hooks/useAuth';
import api from '../services/api';
import { useState, useEffect } from 'react';

const ReportsPage = () => {
  const { auth } = useAuth();
  const [reportData, setReportData] = useState({
    applications: 0,
    interns: 0,
    conversions: 0,
    gadaDistribution: [],
    monthlyApplications: [],
    monthlyConversions: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await api.get('/admin/reports', {
          headers: { Authorization: `Bearer ${auth.token}` }
        });
        setReportData({
          applications: response.data.applications,
          interns: response.data.interns,
          conversions: response.data.conversions,
          gadaDistribution: response.data.gadaDistribution,
          monthlyApplications: response.data.monthlyApplications,
          monthlyConversions: response.data.monthlyConversions
        });
      } catch (error) {
        console.error('Failed to fetch reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [auth.token]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">Loading reports...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <FaFileAlt className="text-debo-blue text-3xl mr-3" />
        <h1 className="text-2xl font-bold text-debo-blue">DEBO Engineering Reports</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-2">
            <FaBriefcase className="text-debo-light-blue mr-2" />
            <h3 className="text-lg font-semibold">Applications</h3>
          </div>
          <p className="text-3xl font-bold">{reportData.applications}</p>
          <p className="text-sm text-gray-500">Total applications</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-2">
            <FaUsers className="text-debo-light-blue mr-2" />
            <h3 className="text-lg font-semibold">Active Interns</h3>
          </div>
          <p className="text-3xl font-bold">{reportData.interns}</p>
          <p className="text-sm text-gray-500">Currently in program</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-2">
            <FaChartBar className="text-debo-light-blue mr-2" />
            <h3 className="text-lg font-semibold">Conversions</h3>
          </div>
          <p className="text-3xl font-bold">{reportData.conversions}</p>
          <p className="text-sm text-gray-500">To full-time</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100">
        <h3 className="text-lg font-semibold text-debo-blue mb-4">
          Gada Level Distribution
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {reportData.gadaDistribution.map((level) => (
            <div key={level._id} className="border border-gray-200 p-4 rounded-lg">
              <h4 className="font-medium text-center">{level._id}</h4>
              <p className="text-2xl font-bold text-center text-debo-blue">
                {level.count}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-debo-blue mb-4">
            Monthly Applications
          </h3>
          {/* Placeholder for chart - would integrate with Chart.js in real implementation */}
          <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
            <pre className="text-xs text-gray-500 text-left">{JSON.stringify(reportData.monthlyApplications, null, 2)}</pre>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-debo-blue mb-4">
            Conversion Rates
          </h3>
          {/* Placeholder for chart */}
          <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
            <pre className="text-xs text-gray-500 text-left">{JSON.stringify(reportData.monthlyConversions, null, 2)}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage; // Ensure this line exists