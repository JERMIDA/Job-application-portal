import { useState, useEffect } from 'react';
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
import api from '../../services/api';
import useAuth from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import InternProgressionHistory from './InternProgressionHistory';

const GADA_LEVELS = [
  { id: 'beginner', name: 'Beginner', icon: FaUserGraduate, color: 'blue' },
  { id: 'early-beginner', name: 'Early Beginner', icon: FaUserAlt, color: 'light-blue' },
  { id: 'junior-developer', name: 'Junior Developer', icon: FaUserTie, color: 'green' },
  { id: 'mid-level-developer', name: 'Mid-Level Developer', icon: FaUserNinja, color: 'teal' },
  { id: 'senior-developer', name: 'Senior Developer', icon: FaUserShield, color: 'purple' },
  { id: 'tech-lead', name: 'Tech Lead', icon: FaUserCog, color: 'yellow' },
  { id: 'expert-developer', name: 'Expert Developer', icon: FaUserAstronaut, color: 'orange' },
  { id: 'master-developer', name: 'Master Developer', icon: FaUserSecret, color: 'red' }
];

const ClassificationSystem = () => {
  const { auth } = useAuth();
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showProgressionModal, setShowProgressionModal] = useState(false);
  const [progressionUserId, setProgressionUserId] = useState(null);


  useEffect(() => {
  const fetchInterns = async () => {
    try {
      const response = await api.get('/admin/interns', {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setInterns(response.data.data); // Ensure response structure matches backend
    } catch (error) {
      console.error('Failed to fetch interns:', error);
      toast.error('Failed to fetch interns');
    } finally {
      setLoading(false);
    }
  };

  fetchInterns();
}, [auth.token]);
 

  const filteredInterns = interns.filter(intern => {
    const matchesLevel = selectedLevel === 'all' || intern.experienceLevel === selectedLevel;
    const matchesStatus = statusFilter === 'all' || intern.status === statusFilter;
    // Show all if internshipType is missing, otherwise filter
    const matchesInternshipType = !intern.internshipType || ['Unpaid','Paid','Full-Time'].includes(intern.internshipType);
    return matchesLevel && matchesStatus && matchesInternshipType;
  });

  const updateInternLevelAndStatus = async (id, experienceLevel, status, internshipType) => {
    try {
      await api.patch(
        `/admin/interns/${id}/classify`,
        { experienceLevel, status, internshipType },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      setInterns(interns.map(intern =>
        intern._id === id ? { ...intern, experienceLevel, status, internshipType } : intern
      ));
      toast.success('Intern Gada level, status, and internship type updated');
    } catch {
      toast.error('Failed to update intern classification');
    }
  };

  const getLevelIcon = (levelId) => {
    const level = GADA_LEVELS.find(l => l.id === levelId);
    if (!level) return <FaUserAlt className="text-gray-500" size={20} />;
    const Icon = level.icon;
    return <Icon className={`text-${level.color}-500`} size={20} />;
  };

  const openProgressionModal = (userId) => {
    setProgressionUserId(userId);
    setShowProgressionModal(true);
  };

  const closeProgressionModal = () => {
    setShowProgressionModal(false);
    setProgressionUserId(null);
  };

  if (loading) return <div className="text-center py-8">Loading interns...</div>;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-debo-blue">Gada System Classification</h3>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">Filter by Level</label>
            <select
              className="w-full"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
            >
              <option value="all">All Levels</option>
              {GADA_LEVELS.map(level => (
                <option key={level.id} value={level.id}>{level.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Filter by Status</label>
            <select
              className="w-full"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="unpaid">Unpaid Internship</option>
              <option value="paid">Paid Internship</option>
              <option value="full-time">Full-time Employment</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Intern</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gada Level</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skills</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredInterns.length > 0 ? (
              filteredInterns.map((intern) => (
                <tr key={intern._id} className="hover:bg-blue-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        {intern.user.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{intern.user.name}</div>
                        <div className="text-sm text-gray-500">{intern.user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getLevelIcon(intern.experienceLevel)}
                      <span className="ml-2">
                        {GADA_LEVELS.find(l => l.id === intern.experienceLevel)?.name || 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 line-clamp-2">{intern.skills}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      intern.status === 'paid' ? 'bg-green-100 text-green-800' :
                      intern.status === 'unpaid' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {intern.status === 'paid' ? 'Paid Internship' : 
                       intern.status === 'unpaid' ? 'Unpaid Internship' : 'Not Classified'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-col gap-2">
                      <select
                        className="border rounded-md px-2 py-1 text-sm mb-1"
                        value={intern.experienceLevel || ''}
                        onChange={e => updateInternLevelAndStatus(intern._id, e.target.value, intern.status)}
                      >
                        <option value="">Select Level</option>
                        {GADA_LEVELS.map(level => (
                          <option key={level.id} value={level.id}>{level.name}</option>
                        ))}
                      </select>
                      <select
                        className="border rounded-md px-2 py-1 text-sm"
                        value={intern.status || ''}
                        onChange={e => updateInternLevelAndStatus(intern._id, intern.experienceLevel, e.target.value)}
                      >
                        <option value="">Select Status</option>
                        <option value="unpaid">Unpaid Internship</option>
                        <option value="paid">Paid Internship</option>
                        <option value="full-time">Full-time Employment</option>
                      </select>
                      <button className="text-blue-600 hover:underline ml-2" onClick={() => openProgressionModal(intern._id)}>View Progression</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No interns found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showProgressionModal && progressionUserId && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
            <h3 className="text-lg font-bold mb-4">Intern Progression History</h3>
            <InternProgressionHistory userId={progressionUserId} />
            <div className="flex justify-end mt-4">
              <button className="btn btn-secondary" onClick={closeProgressionModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassificationSystem;