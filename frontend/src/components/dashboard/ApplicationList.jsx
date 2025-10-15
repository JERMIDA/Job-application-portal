import { useState, useEffect } from 'react';
import ApplicationDetailModal from './ApplicationDetailModal';
import { FaSearch } from 'react-icons/fa';
import api from '../../services/api';
import useAuth from '../../hooks/useAuth';
import { toast } from 'react-toastify';

const ApplicationList = () => {
  const { auth } = useAuth();
  const [applications, setApplications] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalApp, setModalApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [jobFilter, setJobFilter] = useState('');
  const [selectedApplications, setSelectedApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await api.get('/admin/applications', {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        const appList = Array.isArray(response.data.data) ? response.data.data : [];
        setApplications(appList);
      } catch (error) {
        console.error('Failed to fetch applications:', error);
        toast.error('Failed to fetch applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [auth.token]);

  // For demo: fallback if resumeParsed/gadaRecommendation not present
  const withParsed = applications.map(app => ({
    ...app,
    resumeParsed: app.resumeParsed || { skills: app.user?.skills ? app.user.skills.split(',') : [], education: [], experience: app.user?.experienceLevel || 0, text: '' },
    gadaRecommendation: app.gadaRecommendation || app.user?.gadaLevel || 'N/A',
  }));

  const filteredApplications = withParsed.filter(app => {
    const applicantName = (app.applicantName || app.user?.name || '').toLowerCase();
    const jobTitle = (app.job?.title || '').toLowerCase();
    const statusMatch = !statusFilter || (app.status === statusFilter);
    const jobMatch = !jobFilter || (app.job?.title === jobFilter);
    const searchMatch = applicantName.includes(searchTerm.toLowerCase()) ||
      jobTitle.includes(searchTerm.toLowerCase());
    return statusMatch && jobMatch && searchMatch;
  });

  const sendInterviewInvite = async (applicationId) => {
    try {
      const response = await api.post(`/admin/applications/${applicationId}/interview-invite`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send interview invite.');
    }
  };

  const sendFeedbackEmail = async (applicationId, feedback) => {
    try {
      const response = await api.post(`/admin/applications/${applicationId}/feedback`, { feedback }, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send feedback email.');
    }
  };

  const handleSelectApplication = (id) => {
    setSelectedApplications((prev) =>
      prev.includes(id) ? prev.filter((appId) => appId !== id) : [...prev, id]
    );
  };

  const handleBulkAction = async (action) => {
    if (selectedApplications.length === 0) {
      toast.error('No applications selected');
      return;
    }

    try {
      const response = await api.patch('/admin/applications/bulk-update', {
        applicationIds: selectedApplications,
        status: action,
      }, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      toast.success(response.data.message);
      setSelectedApplications([]);
      // Refresh applications
      const updatedApplications = await api.get('/admin/applications', {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setApplications(updatedApplications.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to perform bulk action.');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading applications...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white w-full">
      <main className="flex-1 flex flex-col justify-between container max-w-full w-full mx-auto px-1 md:px-4">
        <div className="rounded-xl shadow-md border border-gray-100 w-full min-w-0 overflow-x-auto">
          <div className="p-2 md:p-4 border-b border-gray-200 w-full min-w-0">
            <h3 className="text-xl font-bold text-debo-blue">Applications</h3>
            <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4 min-w-0">
              <div className="flex flex-col md:flex-row gap-2 flex-grow">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="pl-10 w-full border rounded-md px-3 py-2"
                    placeholder="Search applications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="border rounded-md px-3 py-2 text-sm"
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="submitted">Submitted</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
                <select
                  className="border rounded-md px-3 py-2 text-sm"
                  value={jobFilter}
                  onChange={e => setJobFilter(e.target.value)}
                >
                  <option value="">All Jobs</option>
                  {Array.from(new Set(applications.map(app => app.job?.title).filter(Boolean))).map(title => (
                    <option key={title} value={title}>{title}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={() => handleBulkAction('interview')}
                >
                  Send Interview Invites
                </button>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  onClick={() => handleBulkAction('feedback')}
                >
                  Send Feedback Emails
                </button>
              </div>
            </div>
          </div>
          <div className="w-full">
            <div className="flex justify-between items-center mb-4">
              <div>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2"
                  onClick={() => handleBulkAction('shortlisted')}
                >
                  Shortlist Selected
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={() => handleBulkAction('rejected')}
                >
                  Reject Selected
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full md:min-w-[900px] w-full bg-white rounded-lg shadow-md text-sm md:text-base">
                <thead>
                  <tr>
                    <th className="px-2 md:px-6 py-3">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedApplications(applications.map((app) => app.id));
                          } else {
                            setSelectedApplications([]);
                          }
                        }}
                        checked={selectedApplications.length === applications.length}
                      />
                    </th>
                    <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                    <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                    <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="hidden md:table-cell px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                    <th className="hidden md:table-cell px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skills</th>
                    <th className="hidden md:table-cell px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Education</th>
                    <th className="hidden md:table-cell px-2 md:px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Gada AI</th>
                    <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((app) => (
                    <tr key={app.id} className="border-b last:border-b-0">
                      <td className="px-2 md:px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedApplications.includes(app.id)}
                          onChange={() => handleSelectApplication(app.id)}
                        />
                      </td>
                      <td className="px-2 md:px-6 py-4 whitespace-nowrap flex items-center gap-3">
                        {app.user?.name || 'N/A'}
                        <span className="block md:hidden text-xs text-gray-400">{app.user?.email || ''}</span>
                      </td>
                      <td className="px-2 md:px-6 py-4 whitespace-nowrap">
                        {app.job?.title || 'N/A'}
                        <span className="block md:hidden text-xs text-gray-400">{app.job?.category || ''}</span>
                      </td>
                      <td className="px-2 md:px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          app.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          app.status === 'shortlisted' ? 'bg-yellow-100 text-yellow-900' :
                          app.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {app.status ? app.status.charAt(0).toUpperCase() + app.status.slice(1) : 'N/A'}
                        </span>
                      </td>
                      <td className="hidden md:table-cell px-2 md:px-6 py-4 whitespace-nowrap">
                        {app.resumeParsed?.experience || 'N/A'}
                      </td>
                      <td className="hidden md:table-cell px-2 md:px-6 py-4 whitespace-nowrap">
                        {app.resumeParsed?.skills?.length ? app.resumeParsed.skills.join(', ') : 'N/A'}
                      </td>
                      <td className="hidden md:table-cell px-2 md:px-6 py-4 whitespace-nowrap">
                        {app.resumeParsed?.education?.length ? app.resumeParsed.education.join('; ') : 'N/A'}
                      </td>
                      <td className="hidden md:table-cell px-2 md:px-6 py-4 whitespace-nowrap">
                        <span className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs font-semibold">
                          {app.gadaRecommendation || 'N/A'}
                        </span>
                      </td>
                      <td className="px-2 md:px-6 py-4 whitespace-nowrap flex flex-col md:flex-row gap-2">
                        <button
                          className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 text-xs md:text-sm"
                          onClick={() => sendInterviewInvite(app.id)}
                        >
                          Interview
                        </button>
                        <button
                          className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 text-xs md:text-sm"
                          onClick={() => sendFeedbackEmail(app.id, 'Your application has been reviewed.')}
                        >
                          Feedback
                        </button>
                        <button
                          className="bg-gray-200 text-gray-700 px-3 py-2 rounded hover:bg-gray-300 text-xs md:text-sm"
                          onClick={() => { setModalApp(app); setModalOpen(true); }}
                        >
                          Details
                        </button>
                        {app.resume_path && (
                          <a
                            href={app.resume_path.startsWith('/') ? app.resume_path : `/uploads/resumes/${app.resume_path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-indigo-500 text-white px-3 py-2 rounded hover:bg-indigo-600 text-xs md:text-sm text-center"
                            style={{ minWidth: 80 }}
                          >
                            View Resume
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <ApplicationDetailModal isOpen={modalOpen} onClose={() => setModalOpen(false)} application={modalApp} />
    </div>
  );
};

export default ApplicationList;
