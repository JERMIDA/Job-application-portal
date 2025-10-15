import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import useAuth from '../../hooks/useAuth';

const JobForm = ({ job: initialJob, onSuccess, onCancel }) => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: [''],
    responsibilities: [''],
    benefits: [''],
    location: '',
    type: 'full-time',
    experienceLevel: '',
    deadline: '',
    isInternship: false,
    minGadaLevel: '',
    internshipDuration: '', // NEW
    stipendRange: '', // NEW
    category: '',
    skills: [''],
  });
  const [loading, setLoading] = useState(false);

  // Defensive: Prevent crash if initialJob is undefined or malformed
  useEffect(() => {
    if (initialJob && typeof initialJob === 'object') {
      setFormData({
        title: initialJob.title || '',
        description: initialJob.description || '',
        requirements: Array.isArray(initialJob.requirements)
          ? initialJob.requirements
          : typeof initialJob.requirements === 'string' && initialJob.requirements.length > 0
            ? initialJob.requirements.split(',').map(s => s.trim())
            : [''],
        responsibilities: Array.isArray(initialJob.responsibilities)
          ? initialJob.responsibilities
          : typeof initialJob.responsibilities === 'string' && initialJob.responsibilities.length > 0
            ? initialJob.responsibilities.split(',').map(s => s.trim())
            : [''],
        benefits: Array.isArray(initialJob.benefits)
          ? initialJob.benefits
          : typeof initialJob.benefits === 'string' && initialJob.benefits.length > 0
            ? initialJob.benefits.split(',').map(s => s.trim())
            : [''],
        location: initialJob.location || '',
        type: initialJob.type || 'full-time',
        experienceLevel: initialJob.experienceLevel || '',
        deadline: initialJob.deadline ? initialJob.deadline.split('T')[0] : '',
        isInternship: !!initialJob.isInternship,
        minGadaLevel: initialJob.minGadaLevel || '',
        internshipDuration: initialJob.internshipDuration || '', // NEW
        stipendRange: initialJob.stipendRange || '', // NEW
        category: initialJob.category || '',
        skills: Array.isArray(initialJob.skills)
          ? initialJob.skills
          : typeof initialJob.skills === 'string' && initialJob.skills.length > 0
            ? initialJob.skills.split(',').map(s => s.trim())
            : [''],
      });
    }
  }, [initialJob]);

  const developerLevels = [
    'Beginner',
    'Early Beginner',
    'Junior Developer',
    'Mid-Level Developer',
    'Senior Developer',
    'Tech Lead',
    'Expert Developer',
    'Master Developer',
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleArrayChange = (field, index, value) => {
    const newArray = Array.isArray(formData[field]) ? [...formData[field]] : [];
    newArray[index] = value;
    setFormData({
      ...formData,
      [field]: newArray,
    });
  };

  const addArrayField = (field) => {
    setFormData({
      ...formData,
      [field]: Array.isArray(formData[field]) ? [...formData[field], ''] : [''],
    });
  };

  const removeArrayField = (field, index) => {
    const newArray = Array.isArray(formData[field]) ? [...formData[field]] : [];
    newArray.splice(index, 1);
    setFormData({
      ...formData,
      [field]: newArray,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Backend expects arrays for requirements, responsibilities, benefits.
    // Ensure all required fields are present and not empty.
    const payload = {
      ...formData,
      requirements: Array.isArray(formData.requirements) ? formData.requirements.filter(Boolean) : [],
      responsibilities: Array.isArray(formData.responsibilities) ? formData.responsibilities.filter(Boolean) : [],
      benefits: Array.isArray(formData.benefits) ? formData.benefits.filter(Boolean) : [],
      minGadaLevel: formData.minGadaLevel || '',
      internshipDuration: formData.internshipDuration || '', // NEW
      stipendRange: formData.stipendRange || '', // NEW
      title: formData.title.trim(),
      description: formData.description.trim(),
      location: formData.location.trim(),
      experienceLevel: formData.experienceLevel,
      deadline: formData.deadline,
      type: formData.type,
      isInternship: !!formData.isInternship,
    };

    // Validation: Required fields
    if (
      !payload.title ||
      !payload.description ||
      !payload.deadline ||
      !payload.experienceLevel ||
      payload.requirements.length === 0 ||
      payload.responsibilities.length === 0
    ) {
      toast.error('Please fill in all required fields.');
      setLoading(false);
      return;
    }
    // For internships, minGadaLevel is required
    if (payload.isInternship && !payload.minGadaLevel) {
      toast.error('Minimum Gada Level is required for internships.');
      setLoading(false);
      return;
    }

    // If backend expects strings for requirements/responsibilities/benefits, convert arrays to strings:
    // Uncomment the following lines if your backend expects comma-separated strings:
    // payload.requirements = payload.requirements.join(',');
    // payload.responsibilities = payload.responsibilities.join(',');
    // payload.benefits = payload.benefits.join(',');

    // --- DEBUG: Log payload before sending to backend ---
    console.log('Job update payload:', payload);

    try {
      let response;
      if (initialJob && (initialJob.id || initialJob._id)) {
        const jobId = initialJob.id || initialJob._id;
        response = await api.put(`/jobs/${jobId}`, payload, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        toast.success('Job updated successfully');
      } else {
        response = await api.post('/jobs', payload, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        toast.success('Job created successfully');
      }

      if (onSuccess) {
        onSuccess(response.data.data || response.data);
      } else {
        navigate('/admin');
      }
    } catch (error) {
      // Show backend error message or a generic one
      // Log the full backend error for debugging
      console.error('Job update error:', error.response?.data || error);

      // Try to show the most specific backend error message
      const backendMsg =
        error.response?.data?.message ||
        error.response?.data?.error?.message ||
        error.response?.data?.error ||
        (initialJob ? 'Failed to update job' : 'Failed to create job');

      toast.error(`Error: ${backendMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 md:p-10 max-w-2xl mx-auto space-y-6 border border-gray-100">
      <div className="grid grid-cols-1 gap-6 mb-6">
        <div>
          <label htmlFor="title" className="block text-gray-700 mb-2">Job Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full"
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-gray-700 mb-2">Job Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Requirements</label>
          {formData.requirements.map((req, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                value={req}
                onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                className="flex-grow"
                required={index === 0}
              />
              {formData.requirements.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayField('requirements', index)}
                  className="ml-2 btn btn-danger px-2 py-1"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayField('requirements')}
            className="btn btn-secondary mt-2"
          >
            Add Requirement
          </button>
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Responsibilities</label>
          {formData.responsibilities.map((resp, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                value={resp}
                onChange={(e) => handleArrayChange('responsibilities', index, e.target.value)}
                className="flex-grow"
              />
              {formData.responsibilities.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayField('responsibilities', index)}
                  className="ml-2 btn btn-danger px-2 py-1"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayField('responsibilities')}
            className="btn btn-secondary mt-2"
          >
            Add Responsibility
          </button>
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Benefits</label>
          {formData.benefits.map((benefit, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                value={benefit}
                onChange={(e) => handleArrayChange('benefits', index, e.target.value)}
                className="flex-grow"
              />
              {formData.benefits.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayField('benefits', index)}
                  className="ml-2 btn btn-danger px-2 py-1"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayField('benefits')}
            className="btn btn-secondary mt-2"
          >
            Add Benefit
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="location" className="block text-gray-700 mb-2">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          
          <div>
            <label htmlFor="type" className="block text-gray-700 mb-2">Job Type</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full"
            >
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="experienceLevel" className="block text-gray-700 mb-2">Developer Level</label>
            <select
              id="experienceLevel"
              name="experienceLevel"
              value={formData.experienceLevel}
              onChange={handleChange}
              required
              className="w-full"
            >
              <option value="">Select Developer Level</option>
              {developerLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="deadline" className="block text-gray-700 mb-2">Application Deadline</label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isInternship"
            name="isInternship"
            checked={formData.isInternship}
            onChange={handleChange}
            className="mr-2"
          />
          <label htmlFor="isInternship" className="text-gray-700">This is an internship position</label>
        </div>
        {formData.isInternship && (
          <>
            <div>
              <label htmlFor="minGadaLevel" className="block text-gray-700 mb-2">Minimum Gada Level</label>
              <select
                id="minGadaLevel"
                name="minGadaLevel"
                value={formData.minGadaLevel}
                onChange={handleChange}
                required
                className="w-full"
              >
                <option value="">Select Minimum Gada Level</option>
                {developerLevels.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="internshipDuration" className="block text-gray-700 mb-2">Internship Duration (weeks)</label>
              <input
                type="number"
                id="internshipDuration"
                name="internshipDuration"
                min="1"
                value={formData.internshipDuration}
                onChange={handleChange}
                className="w-full"
                required
              />
            </div>
            <div>
              <label htmlFor="stipendRange" className="block text-gray-700 mb-2">Stipend Range</label>
              <input
                type="text"
                id="stipendRange"
                name="stipendRange"
                value={formData.stipendRange}
                onChange={handleChange}
                className="w-full"
                placeholder="$200 - $400/month"
                required
              />
            </div>
          </>
        )}
        <div>
          <label htmlFor="category" className="block text-gray-700 mb-2">Category</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Skills</label>
          {formData.skills.map((skill, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                value={skill}
                onChange={(e) => handleArrayChange('skills', index, e.target.value)}
                className="flex-grow"
              />
              {formData.skills.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayField('skills', index)}
                  className="ml-2 btn btn-danger px-2 py-1"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayField('skills')}
            className="btn btn-secondary mt-2"
          >
            Add Skill
          </button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
        >
          {loading 
            ? (initialJob ? 'Updating...' : 'Creating...') 
            : (initialJob ? 'Update Job' : 'Create Job')}
        </button>
      </div>
    </form>
  );
};

export default JobForm;