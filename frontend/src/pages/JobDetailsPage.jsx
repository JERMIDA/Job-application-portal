import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { FaMapMarkerAlt, FaUserTie, FaCalendarAlt, FaListUl, FaCheckCircle, FaGift, FaLayerGroup, FaClock, FaMoneyBillWave } from 'react-icons/fa';

const JobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Log the id from useParams
    console.log('JobDetailsPage - useParams id:', id);

    // Defensive fix: Don't fetch if id is undefined or empty
    if (!id || id === 'undefined') {
      setError('Job ID is missing. Please check the URL.');
      setLoading(false);
      return;
    }
    const fetchJob = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/jobs/${id}`);
        setJob(response.data.data);
      } catch (error) {
        console.error('Failed to fetch job details:', error);
        if (error.response?.status === 404) {
          setError('Job not found. Redirecting to jobs page...');
          setTimeout(() => navigate('/jobs'), 3000);
        } else {
          setError('Failed to fetch job details. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="mx-auto px-4 py-8 pt-20 md:px-8">
        <div className="text-center py-12">
          <p className="text-lg">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto px-4 py-8 pt-20 md:px-8">
        <div className="text-center py-12">
          <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-2">Error</h3>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="mx-auto px-4 py-8 pt-20 md:px-8">
        <div className="text-center py-12">
          <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-2">Job not found</h3>
          <p className="text-gray-500">The job you are looking for does not exist or has been removed.</p>
        </div>
      </div>
    );
  }

  // Parse JSON fields if needed
  let requirements = [];
  let responsibilities = [];
  let benefits = [];
  let skills = [];
  try { requirements = job.requirements ? JSON.parse(job.requirements) : []; } catch { requirements = job.requirements ? [job.requirements] : []; }
  if (!Array.isArray(requirements)) requirements = requirements ? [requirements] : [];
  try { responsibilities = job.responsibilities ? JSON.parse(job.responsibilities) : []; } catch { responsibilities = job.responsibilities ? [responsibilities] : []; }
  if (!Array.isArray(responsibilities)) responsibilities = responsibilities ? [responsibilities] : [];
  try { benefits = job.benefits ? JSON.parse(job.benefits) : []; } catch { benefits = job.benefits ? [job.benefits] : []; }
  if (!Array.isArray(benefits)) benefits = benefits ? [benefits] : [];
  try { skills = job.skills ? JSON.parse(job.skills) : []; } catch { skills = job.skills ? [job.skills] : []; }
  if (!Array.isArray(skills)) skills = skills ? [skills] : [];

  return (
    <div className="mx-auto px-4 py-8 pt-20 md:px-8 max-w-3xl">
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-10 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div className="w-full">
            <h1 className="text-2xl md:text-3xl font-bold text-debo-blue mb-1">{job.title}</h1>
            <div className="flex flex-col md:flex-row items-start md:items-center text-gray-600 text-sm mb-2">
              <div className="flex items-center mr-4 mb-1 md:mb-0">
                <FaMapMarkerAlt className="mr-2" />
                <span>{job.location || 'Remote'}</span>
              </div>
              <div className="flex items-center mr-4 mb-1 md:mb-0">
                <FaUserTie className="mr-2" />
                <span>{job.type || 'N/A'}</span>
              </div>
              <div className="flex items-center">
                <FaCalendarAlt className="mr-2" />
                <span>Apply by: {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>
            <div className="flex items-center text-xs text-gray-400">
              <FaClock className="mr-1" />
              Posted {job.created_at ? new Date(job.created_at).toLocaleDateString() : 'N/A'}
            </div>
          </div>
          {job.is_internship ? (
            <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-semibold shadow-sm mt-2 md:mt-0">
              Internship
            </span>
          ) : null}
        </div>
        <p className="text-gray-700 mb-6 text-base md:text-lg">{job.description}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
          <div>
            <h3 className="font-semibold text-debo-blue mb-2 flex items-center"><FaListUl className="mr-2" />Requirements</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              {requirements.length > 0 ? requirements.map((req, i) => <li key={i}>{req}</li>) : <li>No requirements listed.</li>}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-debo-blue mb-2 flex items-center"><FaCheckCircle className="mr-2" />Responsibilities</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              {responsibilities.length > 0 ? responsibilities.map((res, i) => <li key={i}>{res}</li>) : <li>No responsibilities listed.</li>}
            </ul>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
          <div>
            <h3 className="font-semibold text-debo-blue mb-2 flex items-center"><FaGift className="mr-2" />Benefits</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              {benefits.length > 0 ? benefits.map((ben, i) => <li key={i}>{ben}</li>) : <li>No benefits listed.</li>}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-debo-blue mb-2 flex items-center"><FaLayerGroup className="mr-2" />Skills</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              {skills.length > 0 ? skills.map((skill, i) => <li key={i}>{skill}</li>) : <li>No skills listed.</li>}
            </ul>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
          <div>
            <h3 className="font-semibold text-debo-blue mb-2 flex items-center"><FaUserTie className="mr-2" />Experience Level</h3>
            <p className="text-gray-700">{job.experience_level || 'Any'}</p>
          </div>
          <div>
            <h3 className="font-semibold text-debo-blue mb-2 flex items-center"><FaCalendarAlt className="mr-2" />Deadline</h3>
            <p className="text-gray-700">{job.deadline ? new Date(job.deadline).toLocaleDateString() : 'N/A'}</p>
          </div>
        </div>
        {job.is_internship ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-debo-blue mb-2 flex items-center"><FaClock className="mr-2" />Internship Duration</h3>
              <p className="text-gray-700">{job.internship_duration ? `${job.internship_duration} weeks` : 'N/A'}</p>
            </div>
            <div>
              <h3 className="font-semibold text-debo-blue mb-2 flex items-center"><FaMoneyBillWave className="mr-2" />Stipend Range</h3>
              <p className="text-gray-700">{job.stipend_range || 'N/A'}</p>
            </div>
          </div>
        ) : null}
        {job.min_gada_level && (
          <div className="mb-6">
            <h3 className="font-semibold text-debo-blue mb-2 flex items-center"><FaLayerGroup className="mr-2" />Minimum Gada Level</h3>
            <p className="text-gray-700">{job.min_gada_level}</p>
          </div>
        )}
        {job.is_internship && job.stipend_range && (
          <div className="mb-6 text-sm text-gray-500 flex items-center">
            <FaMoneyBillWave className="mr-2" />
            <span><b>Stipend Range:</b> {job.stipend_range} <span className="ml-2">(This is the expected pay range for the internship, usually per month or for the full duration.)</span></span>
          </div>
        )}
        <div className="mt-8 flex justify-center">
          {job.status === 'closed' || job.status === 'archived' ? (
            <button
              className="btn btn-secondary px-8 py-3 text-lg font-semibold rounded-full cursor-not-allowed opacity-60"
              disabled
            >
              Closed
            </button>
          ) : (
            <button
              className="btn btn-primary px-8 py-3 text-lg font-semibold shadow hover:scale-105 transition rounded-full"
              onClick={() => {
                const jobId = job.id || job._id;
                const token = localStorage.getItem('token');
                if (!token) {
                  // Save intended URL and redirect to login
                  localStorage.setItem('redirectAfterLogin', `/jobs/${jobId}/apply`);
                  navigate('/login');
                } else if (jobId) {
                  navigate(`/jobs/${jobId}/apply`);
                }
              }}
              disabled={job.deadline && new Date(job.deadline) < new Date()}
            >
              Apply Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;