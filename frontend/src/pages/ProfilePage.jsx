import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuth from '../hooks/useAuth';
import api from '../services/api';

const ProfilePage = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    education: '',
    experience: '',
    skills: '',
  });
  const [recommendedSkills, setRecommendedSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/auth/profile', {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        const user = response.data.user || response.data;
        // Ensure skills is always a comma-separated string for the form
        let skillsString = '';
        if (Array.isArray(user.skills)) {
          skillsString = user.skills.join(', ');
        } else if (typeof user.skills === 'string') {
          try {
            // Try to parse stringified array
            const arr = JSON.parse(user.skills);
            if (Array.isArray(arr)) {
              skillsString = arr.join(', ');
            } else {
              skillsString = user.skills;
            }
          } catch {
            skillsString = user.skills;
          }
        }
        setFormData({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          address: user.address || '',
          education: user.education || '',
          experience: user.experience || '',
          skills: skillsString,
          resume_path: user.resume_path || '',
        });
        setRecommendedSkills(user.recommendedSkills || []);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        toast.error('Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [auth.token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      resume: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation
    if (!formData.name.trim()) {
      toast.error('Full Name is required.');
      return;
    }
    if (!formData.email.trim()) {
      toast.error('Email is required.');
      return;
    }
    if (!formData.education.trim()) {
      toast.error('Education is required.');
      return;
    }
    if (!formData.experience.trim()) {
      toast.error('Experience is required.');
      return;
    }
    const skillsArr = formData.skills.split(',').map(s => s.trim()).filter(Boolean);
    if (skillsArr.length === 0) {
      toast.error('Please enter at least one skill.');
      return;
    }
    if (!formData.resume_path && !formData.resume) {
      toast.error('Please upload your resume.');
      return;
    }
    setLoading(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('address', formData.address);
      data.append('education', formData.education);
      data.append('experience', formData.experience);
      data.append('skills', JSON.stringify(skillsArr));
      if (formData.resume) {
        data.append('resume', formData.resume);
      }
      const res = await api.put('/auth/profile', data, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Profile updated successfully');
      setRecommendedSkills(res.data.recommendedSkills || []);
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Add a helper for user-friendly skills input
  const handleSkillsChange = (e) => {
    // Allow comma or enter to separate skills
    setFormData({
      ...formData,
      skills: e.target.value.replace(/\n/g, ', '),
    });
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 py-8 pt-20 md:px-8 max-w-3xl bg-white p-4 md:p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-debo-blue mb-4 md:mb-6">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="md:grid md:grid-cols-2 md:gap-6">
        <div className="mb-4 md:mb-6">
          <div>
            <label htmlFor="name" className="block text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full"
              disabled
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-gray-700 mb-2">Phone</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-gray-700 mb-2">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full"
            />
          </div>
        </div>
        <div className="mb-6">
          <label htmlFor="education" className="block text-gray-700 mb-2">Education</label>
          <textarea
            id="education"
            name="education"
            value={formData.education}
            onChange={handleChange}
            rows="3"
            className="w-full"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="experience" className="block text-gray-700 mb-2">Experience</label>
          <textarea
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            rows="3"
            className="w-full"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="skills" className="block text-gray-700 mb-2">Skills <span className="text-xs text-gray-500">(comma or enter separated)</span></label>
          <textarea
            id="skills"
            name="skills"
            value={formData.skills}
            onChange={handleSkillsChange}
            rows="3"
            className="w-full"
            placeholder="e.g. JavaScript, React, Node.js"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="resume" className="block text-gray-700 mb-2">Upload Resume (PDF or Image)</label>
          <input
            type="file"
            id="resume"
            name="resume"
            accept=".pdf,image/*"
            onChange={handleFileChange}
            className={`w-full ${formData.resume_path ? 'hidden' : ''}`}
          />
          {formData.resume_path && (
            <div className="mt-2 text-sm text-gray-600">
              Current Resume: <a href={`http://localhost:3000${formData.resume_path}`} target="_blank" rel="noopener noreferrer" className="underline text-blue-700">View</a>
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
      {recommendedSkills.length > 0 && (
        <div className="mb-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
          <h4 className="font-bold text-blue-800 mb-2">AI-Recommended Skills from Resume</h4>
          <ul className="list-disc pl-6 text-blue-700">
            {recommendedSkills.map((skill, idx) => (
              <li key={idx}>{skill}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;