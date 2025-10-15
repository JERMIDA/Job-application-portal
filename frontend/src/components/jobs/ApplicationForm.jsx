import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';
import api from '../../services/api';
import { getProfile } from '../../services/authService';

const ApplicationForm = ({ job }) => {
  const { auth } = useAuth();
  const { id: urlJobId } = useParams();
  const [formData, setFormData] = useState({
    resume: null,
    coverLetter: '',
    experienceLevel: '',
    applicantSelectedLevel: '',
    skills: '',
    education: '',
  });
  const [loading, setLoading] = useState(false);
  const [profileComplete, setProfileComplete] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!auth?.token) return;
      try {
        const res = await api.get('/auth/profile', {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        setProfile(res.data.user || res.data);
        setFormData(prev => ({
          ...prev,
          education: res.data.user?.education || '',
          skills: Array.isArray(res.data.user?.skills) ? res.data.user.skills.join(', ') : (res.data.user?.skills || ''),
        }));
      } catch {
        toast.error('Could not load profile.');
      }
    };
    fetchProfile();
  }, [auth?.token]);

  useEffect(() => {
    const checkProfile = async () => {
      if (!auth?.token) return;
      try {
        const profile = await getProfile();
        const required = ['name', 'email', 'education', 'experience', 'skills', 'resume_path'];
        setProfileComplete(required.every(field => profile.user && profile.user[field] && profile.user[field].toString().trim() !== ''));
      } catch {
        setProfileComplete(false);
      }
    };
    checkProfile();
  }, [auth?.token]);

  function handleChange(e) {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!profileComplete) {
      toast.error('Please complete your profile before applying.');
      return;
    }
    if (!formData.resume || !formData.coverLetter || !formData.skills) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    try {
      // Debug: log job prop
      console.log('ApplicationForm job prop:', job);
      let jobId = job && (job.id || job._id);
      if (!jobId && urlJobId) {
        jobId = urlJobId;
        console.log('Falling back to jobId from URL param:', urlJobId);
      }
      console.log('Resolved jobId to append:', jobId);
      const data = new FormData();
      data.append('coverLetter', formData.coverLetter || '');
      data.append('skills', formData.skills || '');
      data.append('education', formData.education || '');
      if (job && job.is_internship) {
        const experienceLevel = formData.applicantSelectedLevel || formData.experienceLevel || '';
        data.append('experienceLevel', experienceLevel);
        data.append('applicantSelectedLevel', formData.applicantSelectedLevel || '');
      } else {
        data.append('experienceLevel', formData.experienceLevel || '');
      }
      if (formData.resume) {
        data.append('resume', formData.resume);
      }
      if (jobId) {
        data.append('jobId', jobId);
      }
      // Debug: log all FormData entries
      for (let pair of data.entries()) {
        console.log('FormData:', pair[0], pair[1]);
      }
      await api.post('/applications', data, {
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Application submitted!');
    } catch {
      toast.error('Failed to submit application. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  if (!job) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-700">Loading job details...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 md:p-10 rounded-xl shadow-md max-w-3xl mx-auto border border-gray-100 overflow-y-auto" style={{ minHeight: '60vh', maxHeight: '90vh' }}>
      <h3 className="text-2xl font-bold text-debo-blue mb-6 text-center">Apply for {job.title}</h3>
      {!profileComplete && <p className="error">Please complete your profile before applying.</p>}
  <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="skills" className="block text-gray-700 mb-2 font-semibold">Skills</label>
          <textarea
            id="skills"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            required
            rows="3"
            placeholder="List your relevant skills separated by commas"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-debo-blue"
          />
          <div className="text-xs text-gray-500 mt-1">Separate skills with commas, e.g. React, JavaScript, Node.js</div>
        </div>

        {(job.type === 'internship' || job.is_internship === true || job.is_internship === 1) ? (
          <div>
            <label htmlFor="applicantSelectedLevel" className="block text-gray-700 mb-2 font-semibold">Gada Level (Experience Level)</label>
            <select
              id="applicantSelectedLevel"
              name="applicantSelectedLevel"
              value={formData.applicantSelectedLevel}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-debo-blue"
            >
              <option value="">Select your Gada Level</option>
              <option value="Beginner">Beginner</option>
              <option value="Junior Developer">Junior Developer</option>
              <option value="Mid-Level Developer">Mid-Level Developer</option>
              <option value="Senior Developer">Senior Developer</option>
              <option value="Tech Lead">Tech Lead</option>
              <option value="Expert Developer">Expert Developer</option>
            </select>
            <div className="text-xs text-gray-500 mt-1">Required for internship applications.</div>
          </div>
        ) : null}
        <div>
          <label htmlFor="education" className="block text-gray-700 mb-2 font-semibold">Education</label>
          <textarea
            id="education"
            name="education"
            value={formData.education}
            onChange={handleChange}
            required
            rows="3"
            placeholder="Your educational background"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-debo-blue"
          />
          <div className="text-xs text-gray-500 mt-1">Include your highest degree and relevant certifications.</div>
        </div>
        <div>
          <label htmlFor="coverLetter" className="block text-gray-700 mb-2 font-semibold">Cover Letter</label>
          <textarea
            id="coverLetter"
            name="coverLetter"
            value={formData.coverLetter}
            onChange={handleChange}
            required
            rows="5"
            placeholder="Why are you a good fit for this position?"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-debo-blue"
          />
          <div className="text-xs text-gray-500 mt-1">Briefly explain why you are a great fit for this job.</div>
        </div>
        <div>
          <label htmlFor="resume" className="block text-gray-700 mb-2 font-semibold">Resume (PDF only)</label>
          <input
            type="file"
            id="resume"
            name="resume"
            onChange={handleChange}
            required={!profile?.resume_path}
            accept=".pdf"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-debo-blue"
          />
          {profile?.resume_path && (
            <div className="text-xs text-gray-500 mt-1">Current resume: <a href={profile.resume_path} target="_blank" rel="noopener noreferrer" className="underline text-blue-700">View</a></div>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full py-3 text-lg font-semibold hover:bg-debo-light-blue transition-colors duration-300"
        >
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
};

export default ApplicationForm;
