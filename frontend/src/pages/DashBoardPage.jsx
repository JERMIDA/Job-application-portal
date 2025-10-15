import { useState, useEffect } from 'react';
import { FaUser, FaBriefcase, FaFileAlt, FaClock } from 'react-icons/fa';
import api from '../services/api';
import useAuth from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';

const DashboardPage = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAppModal, setShowAppModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, applicationsRes] = await Promise.all([
          api.get('/auth/profile', {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }),
          api.get('/applications', {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }),
        ]);
        // Fix: handle both {user, ...} and flat user object
        const user = profileRes.data.user || profileRes.data;
        setProfile(user);
        setApplications(applicationsRes.data.data || []);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [auth.token]);

  const openAppModal = (app) => {
    setSelectedApp(app);
    setShowAppModal(true);
  };

  const closeAppModal = () => {
    setShowAppModal(false);
    setSelectedApp(null);
  };

  // Debug: Show missing fields if profile is incomplete
  const requiredFields = ['name', 'email', 'education', 'experience', 'skills', 'resume_path'];
  const isFieldMissing = (field) => {
    const value = profile?.[field];
    if (field === 'skills') {
      if (!value) return true;

      // If it's an array
      if (Array.isArray(value)) {
        return value.length === 0 || value.every(s => !s || s.toString().trim() === '');
      }

      // If it's a stringified array
      if (typeof value === 'string' && value.trim().startsWith('[')) {
        try {
          const arr = JSON.parse(value);
          return !Array.isArray(arr) || arr.length === 0 || arr.every(s => !s || s.toString().trim() === '');
        } catch {
          return true;
        }
      }

      // If it's a comma-separated string or plain string
      if (typeof value === 'string') {
        return value.split(',').map(s => s.trim()).filter(Boolean).length === 0;
      }

      // Otherwise, treat as missing
      return true;
    }
    return !value || value.toString().trim() === '';
  };

  const missingFields = requiredFields.filter(isFieldMissing);

  // Profile completeness logic
  const isProfileComplete = requiredFields.every(field => !isFieldMissing(field));

  // Debug: Show actual skills value for troubleshooting


  if (profile && profile.completed !== isProfileComplete) {
    // Update profile.completed for UI consistency
    setProfile(prev => prev ? { ...prev, completed: isProfileComplete } : prev);
  }

  if (loading) {
    return (
      <div className="mx-auto px-4 py-8 pt-20 md:px-8">
        <div className="text-center py-12">
          <p className="text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 py-8 pt-20 md:px-8">
      <h1 className="text-2xl font-bold text-debo-blue mb-6 md:mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <FaUser size={20} />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm">Profile Status</h3>
              <p className="text-xl font-bold">
                {profile?.completed ? 'Complete' : 'Incomplete'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <FaFileAlt size={20} />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm">Applications</h3>
              <p className="text-xl font-bold">{applications.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <FaBriefcase size={20} />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm">Active Jobs</h3>
              <p className="text-xl font-bold">
                {applications.filter(app => app.status === 'accepted').length}
              </p>
            </div>
          </div>
        </div>

      </div>
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-debo-blue">Your Profile</h3>
          {profile && profile.completed === false && missingFields.length > 0 && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 my-4 rounded">
              <strong>Profile incomplete.</strong> Please fill in the following fields:<br />
              <ul className="list-disc pl-6">
                {missingFields.map(f => (
                  <li key={f}>{f.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Full Name</h4>
              <p className="text-gray-900">{profile?.name || 'Not provided'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Email</h4>
              <p className="text-gray-900">{profile?.email}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Phone</h4>
              <p className="text-gray-900">{profile?.phone || 'Not provided'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Address</h4>
              <p className="text-gray-900">{profile?.address || 'Not provided'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Education</h4>
              <p className="text-gray-900">{profile?.education || 'Not provided'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Experience</h4>
              <p className="text-gray-900">{profile?.experience || 'Not provided'}</p>
            </div>
          </div>
          <div className="mt-6">
            <button
              className="btn btn-primary"
              onClick={() => navigate('/profile/edit')}
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-debo-blue">Your Applications</h3>
        </div>
        <div className="overflow-x-auto rounded-lg border border-gray-200 mb-8">
          <table className="min-w-full divide-y divide-gray-200 text-sm md:text-base">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                <th scope="col" className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Applied On</th>
                <th scope="col" className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.length > 0 ? (
                applications.map((application) => (
                  <tr key={application._id || application.id} className="hover:bg-blue-50 transition">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{application.job?.title || 'Job Title Not Available'}</div>
                      <div className="text-xs text-gray-500">{application.job?.company || 'DEBO Engineering'}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-debo-blue ${
                          application.status === 'accepted' ? 'bg-green-200 text-green-900' :
                          application.status === 'rejected' ? 'bg-red-200 text-red-900' :
                          application.status === 'shortlisted' ? 'bg-yellow-200 text-yellow-900' :
                          'bg-gray-200 text-gray-900'
                        }`}
                        tabIndex={0}
                        aria-label={`Application status: ${application.status.replace('-', ' ')}`}
                      >
                        {application.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs md:text-sm text-gray-500">
                      {new Date(application.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs md:text-sm font-medium flex flex-col md:flex-row gap-2 md:gap-0">
                      <Link
                        to={application.job && (application.job._id || application.job.id) && Number(application.job._id || application.job.id) > 0 ? `/jobs/${application.job._id || application.job.id}` : "#"}
                        className="text-debo-light-blue hover:text-debo-blue mr-0 md:mr-4 py-2 px-3 rounded focus:outline-none focus:ring-2 focus:ring-debo-blue"
                        aria-label="View Job Details"
                        tabIndex={0}
                      >
                        View Job
                      </Link>
                      <a
                        href="#"
                        className="text-debo-light-blue hover:text-debo-blue py-2 px-3 rounded focus:outline-none focus:ring-2 focus:ring-debo-blue"
                        aria-label="View Application Details"
                        tabIndex={0}
                        onClick={e => { e.preventDefault(); openAppModal(application); }}
                      >
                        View Details
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-4 py-4 text-center text-gray-500">
                    You haven't applied to any jobs yet. 
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showAppModal && selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
            <h3 className="text-lg font-bold mb-4">Application Details</h3>
            <div className="mb-2"><strong>Job:</strong> {selectedApp.job?.title || 'N/A'}</div>
            <div className="mb-2"><strong>Status:</strong> {selectedApp.status}</div>
            <div className="mb-2"><strong>Applied On:</strong> {selectedApp.createdAt ? new Date(selectedApp.createdAt).toLocaleString() : 'N/A'}</div>
            <div className="mb-2"><strong>Feedback:</strong> {selectedApp.feedback || 'No feedback yet.'}</div>
            <div className="mb-2"><strong>Interview Info:</strong> {
              (() => {
                let info = selectedApp.interview_info;
                if (!info) return 'No interview scheduled.';
                // If info is a string, try to parse it
                if (typeof info === 'string') {
                  try {
                    info = JSON.parse(info);
                  } catch {
                    // If not JSON, show as plain text
                    return info;
                  }
                }
                if (typeof info === 'object' && info !== null) {
                  return (
                    <div className="space-y-1">
                      {info.interviewDate && <div><b>Date:</b> {info.interviewDate}</div>}
                      {info.interviewTime && <div><b>Time:</b> {info.interviewTime}</div>}
                      {info.location && <div><b>Location:</b> {info.location}</div>}
                      {info.additionalInfo && <div><b>Info:</b> {info.additionalInfo}</div>}
                    </div>
                  );
                }
                return 'No interview scheduled.';
              })()
            }</div>
            <div className="mb-2"><strong>Status Timeline:</strong></div>
            {selectedApp.status_history ? (   
          <div className="mb-2 pl-2 border-l-2 border-debo-blue">
                {(Array.isArray(selectedApp.status_history) ? selectedApp.status_history : (() => {
                  try { return JSON.parse(selectedApp.status_history); } catch { return []; }
                })()).map((h, i) => (
                  <div key={i} className="relative pb-4">
                    <div className="absolute -left-3 top-1.5 w-2.5 h-2.5 bg-debo-blue rounded-full border-2 border-white"></div>
                    <div className="ml-4">
                      <span className="text-xs font-bold capitalize text-debo-blue">{h.status.replace('-', ' ')}</span>
                      <span className="ml-2 text-xs text-gray-500">{new Date(h.date).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mb-2 text-sm text-gray-500">No status history available.</div>
            )}
            {/* Add more fields as needed, e.g., status history if available */}
            <div className="flex justify-end mt-4">
              <button className="btn btn-secondary" onClick={closeAppModal}>Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default DashboardPage;