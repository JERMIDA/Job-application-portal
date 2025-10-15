import { useState, useEffect } from 'react';
import api from '../../../services/api';
import { toast } from 'react-toastify';

export default function JobManagement() {
  const [jobs, setJobs] = useState([]);
  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    requirements: '',
    responsibilities: '',
    benefits: '',
    type: 'internship',
    minGadaLevel: 'beginner',
    department: '',
    location: '',
    skills: '',
    applicationDeadline: ''
  });
  const [editingJobId, setEditingJobId] = useState(null);
  const [editingJobData, setEditingJobData] = useState({});

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const auth = JSON.parse(localStorage.getItem('auth')) || {};
        const response = await api.get('/jobs', {
          headers: {
            Authorization: `Bearer ${auth.token || ''}`,
          },
        });
        setJobs(response.data.data || response.data);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
        toast.error('Failed to fetch jobs');
      }
    };
    fetchJobs();
  }, []);

  const handleCreateJob = async (e) => {
    e.preventDefault();
    // Convert comma-separated fields to arrays
    const payload = {
      ...newJob,
      requirements: typeof newJob.requirements === 'string' ? newJob.requirements.split(',').map(s => s.trim()).filter(Boolean) : [],
      responsibilities: typeof newJob.responsibilities === 'string' ? newJob.responsibilities.split(',').map(s => s.trim()).filter(Boolean) : [],
      benefits: typeof newJob.benefits === 'string' ? newJob.benefits.split(',').map(s => s.trim()).filter(Boolean) : [],
      skills: typeof newJob.skills === 'string' ? newJob.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
    };
    if (!payload.title || !payload.description || !payload.minGadaLevel || payload.requirements.length === 0 || payload.skills.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }
    try {
      const auth = JSON.parse(localStorage.getItem('auth')) || {};
      const { data } = await api.post('/jobs', payload, {
        headers: {
          Authorization: `Bearer ${auth.token || ''}`,
        },
      });
      setJobs([...jobs, data.data || data]);
      setNewJob({
        title: '',
        description: '',
        requirements: '',
        responsibilities: '',
        benefits: '',
        type: 'internship',
        minGadaLevel: 'beginner',
        department: '',
        location: '',
        skills: '',
        applicationDeadline: ''
      });
      toast.success('Job created successfully');
    } catch (error) {
      console.error('Error creating job:', error);
      toast.error('Failed to create job');
    }
  };

  const handleEditClick = (job) => {
    setEditingJobId(job.id);
    setEditingJobData({ ...job });
  };

  const handleEditChange = (e) => {
    setEditingJobData({
      ...editingJobData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveEdit = async () => {
    // Convert comma-separated fields to arrays
    const payload = {
      ...editingJobData,
      requirements: typeof editingJobData.requirements === 'string' ? editingJobData.requirements.split(',').map(s => s.trim()).filter(Boolean) : [],
      responsibilities: typeof editingJobData.responsibilities === 'string' ? editingJobData.responsibilities.split(',').map(s => s.trim()).filter(Boolean) : [],
      benefits: typeof editingJobData.benefits === 'string' ? editingJobData.benefits.split(',').map(s => s.trim()).filter(Boolean) : [],
      skills: typeof editingJobData.skills === 'string' ? editingJobData.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
    };

    try {
      const auth = JSON.parse(localStorage.getItem('auth')) || {};
      const { data } = await api.put(`/jobs/${editingJobId}`, payload, {
        headers: {
          Authorization: `Bearer ${auth.token || ''}`,
        },
      });
      setJobs(jobs.map(job => (job.id === editingJobId ? data.data || data : job)));
      setEditingJobId(null);
      setEditingJobData({});
      toast.success('Job updated successfully');
    } catch (error) {
      console.error('Error updating job:', error);
      toast.error('Failed to update job');
    }
  };

  const handleDeleteJob = async (id) => {
    try {
      const auth = JSON.parse(localStorage.getItem('auth')) || {};
      await api.delete(`/jobs/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.token || ''}`,
        },
      });
      setJobs(jobs.filter(job => job.id !== id));
      toast.success('Job deleted successfully');
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Failed to delete job');
    }
  };

  return (
    <div className="job-management space-y-6 w-full max-w-7xl mx-auto px-2 md:px-0">
      <h2 className="text-lg font-semibold">Job Management</h2>
      <form onSubmit={handleCreateJob} className="space-y-4 bg-white rounded-xl shadow-md p-4 md:p-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Job Title"
            value={newJob.title}
            onChange={e => setNewJob({ ...newJob, title: e.target.value })}
            className="p-2 border rounded w-full"
            required
            name="title"
          />
          <select
            value={newJob.type}
            onChange={e => setNewJob({ ...newJob, type: e.target.value })}
            className="p-2 border rounded w-full"
            name="type"
          >
            <option value="internship">Internship</option>
            <option value="full-time">Full-time</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <textarea
            placeholder="Job Description"
            value={newJob.description}
            onChange={e => setNewJob({ ...newJob, description: e.target.value })}
            className="p-2 border rounded w-full"
            required
            name="description"
          />
          <textarea
            placeholder="Requirements (comma separated)"
            value={newJob.requirements}
            onChange={e => setNewJob({ ...newJob, requirements: e.target.value })}
            className="p-2 border rounded w-full"
            required
            name="requirements"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <textarea
            placeholder="Responsibilities (comma separated)"
            value={newJob.responsibilities}
            onChange={e => setNewJob({ ...newJob, responsibilities: e.target.value })}
            className="p-2 border rounded w-full"
            name="responsibilities"
          />
          <textarea
            placeholder="Benefits (comma separated)"
            value={newJob.benefits}
            onChange={e => setNewJob({ ...newJob, benefits: e.target.value })}
            className="p-2 border rounded w-full"
            name="benefits"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Department"
            value={newJob.department}
            onChange={e => setNewJob({ ...newJob, department: e.target.value })}
            className="p-2 border rounded w-full"
            name="department"
          />
          <input
            type="text"
            placeholder="Location"
            value={newJob.location}
            onChange={e => setNewJob({ ...newJob, location: e.target.value })}
            className="p-2 border rounded w-full"
            name="location"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Skills (comma separated)"
            value={newJob.skills}
            onChange={e => setNewJob({ ...newJob, skills: e.target.value })}
            className="p-2 border rounded w-full"
            name="skills"
          />
          <select
            value={newJob.minGadaLevel}
            onChange={e => setNewJob({ ...newJob, minGadaLevel: e.target.value })}
            className="p-2 border rounded w-full"
            name="minGadaLevel"
            required
          >
            <option value="beginner">Beginner</option>
            <option value="early-beginner">Early Beginner</option>
            <option value="junior-developer">Junior Developer</option>
            <option value="mid-level-developer">Mid-Level Developer</option>
            <option value="senior-developer">Senior Developer</option>
            <option value="tech-lead">Tech Lead</option>
            <option value="expert-developer">Expert Developer</option>
            <option value="master-developer">Master Developer</option>
          </select>
        </div>
        <input
          type="date"
          placeholder="Application Deadline"
          value={newJob.applicationDeadline}
          onChange={e => setNewJob({ ...newJob, applicationDeadline: e.target.value })}
          className="p-2 border rounded w-full"
          name="applicationDeadline"
        />
        <button
          type="submit"
          className="bg-debo-blue text-white px-4 py-2 rounded hover:bg-debo-lightblue"
        >
          Create Job
        </button>
      </form>
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Current Job Postings</h3>
        <div className="space-y-4">
          {jobs.map(job => (
            <div key={job.id} className="border rounded-lg p-4 bg-white shadow hover:shadow-lg transition">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                {editingJobId === job.id ? (
                  <>
                    <input
                      type="text"
                      name="title"
                      value={editingJobData.title}
                      onChange={handleEditChange}
                      className="p-1 border rounded w-1/3"
                    />
                    <select
                      name="type"
                      value={editingJobData.type}
                      onChange={handleEditChange}
                      className="p-1 border rounded w-1/3"
                    >
                      <option value="internship">Internship</option>
                      <option value="full-time">Full-time</option>
                    </select>
                    <textarea
                      name="description"
                      value={editingJobData.description}
                      onChange={handleEditChange}
                      className="p-1 border rounded w-full mt-2"
                    />
                    <textarea
                      name="requirements"
                      value={editingJobData.requirements}
                      onChange={handleEditChange}
                      className="p-1 border rounded w-full mt-2"
                    />
                    <textarea
                      name="responsibilities"
                      value={editingJobData.responsibilities}
                      onChange={handleEditChange}
                      className="p-1 border rounded w-full mt-2"
                    />
                    <textarea
                      name="benefits"
                      value={editingJobData.benefits}
                      onChange={handleEditChange}
                      className="p-1 border rounded w-full mt-2"
                    />
                    <input
                      type="text"
                      name="department"
                      value={editingJobData.department}
                      onChange={handleEditChange}
                      className="p-1 border rounded w-1/3 mt-2"
                    />
                    <input
                      type="text"
                      name="location"
                      value={editingJobData.location}
                      onChange={handleEditChange}
                      className="p-1 border rounded w-1/3 mt-2"
                    />
                    <input
                      type="text"
                      name="skills"
                      value={editingJobData.skills}
                      onChange={handleEditChange}
                      className="p-1 border rounded w-full mt-2"
                    />
                    <select
                      name="minGadaLevel"
                      value={editingJobData.minGadaLevel}
                      onChange={handleEditChange}
                      className="p-1 border rounded w-1/3 mt-2"
                      required
                    >
                      <option value="beginner">Beginner</option>
                      <option value="early-beginner">Early Beginner</option>
                      <option value="junior-developer">Junior Developer</option>
                      <option value="mid-level-developer">Mid-Level Developer</option>
                      <option value="senior-developer">Senior Developer</option>
                      <option value="tech-lead">Tech Lead</option>
                      <option value="expert-developer">Expert Developer</option>
                      <option value="master-developer">Master Developer</option>
                    </select>
                    <input
                      type="date"
                      name="applicationDeadline"
                      value={editingJobData.applicationDeadline}
                      onChange={handleEditChange}
                      className="p-1 border rounded w-1/3 mt-2"
                    />
                    <button
                      onClick={handleSaveEdit}
                      className="bg-green-500 text-white px-2 py-1 rounded mt-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingJobId(null)}
                      className="bg-gray-300 text-black px-2 py-1 rounded ml-2 mt-2"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <h4 className="font-medium">{job.title}</h4>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditClick(job)}
                        className="text-debo-blue hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {editingJobId && (
        <div className="edit-job-modal">
          <h3>Edit Job</h3>
          <input
            type="text"
            name="title"
            placeholder="Job Title"
            value={editingJobData.title}
            onChange={handleEditChange}
          />
          <textarea
            name="description"
            placeholder="Job Description"
            value={editingJobData.description}
            onChange={handleEditChange}
          ></textarea>
          {/* Add other fields here */}
          <button onClick={handleSaveEdit}>Save</button>
          <button onClick={() => setEditingJobId(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
}
