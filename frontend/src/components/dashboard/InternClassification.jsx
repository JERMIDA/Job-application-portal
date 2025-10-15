import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';

const InternClassification = () => {
  const [formData, setFormData] = useState({
    userId: '',
    experienceLevel: '',
    internshipType: '',
  });
  const [internStatus, setInternStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.patch('/admin/interns/classify', formData);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to classify intern.');
    }
  };

  useEffect(() => {
    const fetchInternStatus = async () => {
      try {
        const response = await api.get(`/admin/interns/${formData.userId}/status`);
        setInternStatus(response.data);
      } catch (error) {
        console.error('Failed to fetch intern status:', error);
        toast.error('Failed to fetch intern status');
      }
    };

    if (formData.userId) {
      fetchInternStatus();
    }
  }, [formData.userId]);

  // Enhanced responsiveness
  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto sm:max-w-full sm:p-4">
      <h2 className="text-2xl font-bold mb-4 text-center sm:text-lg">Classify Intern</h2>
      {internStatus && (
        <div className="mb-4">
          <p className="text-sm sm:text-xs"><strong>Current Level:</strong> {internStatus.experienceLevel}</p>
          <p className="text-sm sm:text-xs"><strong>Internship Type:</strong> {internStatus.internshipType}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="userId" className="block text-gray-700 text-sm sm:text-xs">Intern ID</label>
          <input
            type="text"
            id="userId"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 sm:px-2 sm:py-1"
            required
          />
        </div>
        <div>
          <label htmlFor="experienceLevel" className="block text-gray-700 text-sm sm:text-xs">Experience Level</label>
          <select
            id="experienceLevel"
            name="experienceLevel"
            value={formData.experienceLevel}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 sm:px-2 sm:py-1"
            required
          >
            <option value="">Select Level</option>
            <option value="beginner">Beginner</option>
            <option value="early beginner">Early Beginner</option>
            <option value="junior developer">Junior Developer</option>
            <option value="mid-level developer">Mid-Level Developer</option>
            <option value="senior developer">Senior Developer</option>
            <option value="tech lead">Tech Lead</option>
            <option value="expert developer">Expert Developer</option>
            <option value="master developer">Master Developer</option>
          </select>
        </div>
        <div>
          <label htmlFor="internshipType" className="block text-gray-700 text-sm sm:text-xs">Internship Type</label>
          <select
            id="internshipType"
            name="internshipType"
            value={formData.internshipType}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 sm:px-2 sm:py-1"
            required
          >
            <option value="">Select Type</option>
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
            <option value="full-time">Full-Time</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 sm:px-2 sm:py-1"
        >
          Classify Intern
        </button>
      </form>
    </div>
  );
};

export default InternClassification;
