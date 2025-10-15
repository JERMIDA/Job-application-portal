import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../services/api';
import useAuth from '../../hooks/useAuth';
import JobForm from './JobForm';

const JobManagement = () => {
  const { auth } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [sortByApplicants, setSortByApplicants] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        let jobsData = [];
        const response = await api.get('/admin/jobs-with-applicant-count', {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        jobsData = response.data.data || response.data;
        if (sortByApplicants) {
          jobsData = [...jobsData].sort((a, b) => sortByApplicants === 'desc' ? b.applicantCount - a.applicantCount : a.applicantCount - b.applicantCount);
        }
        setJobs(jobsData);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
        toast.error('Failed to fetch jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [auth.token, sortByApplicants]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await api.delete(`/jobs/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        setJobs(jobs.filter(job => job.id !== id));
        toast.success('Job deleted successfully');
      } catch (error) {
        console.error('Failed to delete job', error);
        toast.error('Failed to delete job');
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/jobs/${id}/status`, { status: newStatus }, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setJobs(jobs.map(job => 
        job.id === id ? { ...job, status: newStatus } : job
      ));
      toast.success(`Job status updated to ${newStatus}`);
    } catch (error) {
      console.error('Failed to update job status', error);
      toast.error('Failed to update job status');
    }
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setShowForm(true);
  };

  const handleFormSubmit = (updatedJob) => {
    if (editingJob) {
      setJobs(jobs.map(job => job.id === updatedJob.id ? updatedJob : job));
      setEditingJob(null);
    } else {
      setJobs([...jobs, updatedJob]);
    }
    setShowForm(false);
  };

  if (loading) {
    return <div className="text-center py-8">Loading jobs...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden max-w-5xl mx-auto border border-gray-100">
      <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h3 className="text-xl font-bold text-debo-blue">Manage Job Postings</h3>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => {
              setEditingJob(null);
              setShowForm(true);
            }}
            className="btn btn-primary flex items-center justify-center md:justify-start px-4 py-2 text-sm md:text-base"
          >
            <FaPlus className="mr-2" /> Add Job
          </button>
          <button
            className="btn btn-secondary px-4 py-2 text-sm md:text-base"
            onClick={() => setSortByApplicants(sortByApplicants === 'desc' ? 'asc' : 'desc')}
          >
            Sort by Applicants {sortByApplicants === 'desc' ? '↓' : '↑'}
          </button>
        </div>
      </div>
      {showForm ? (
        <div className="p-6">
          <JobForm 
            job={editingJob} 
            onSuccess={handleFormSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingJob(null);
            }}
          />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applications
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interview Sent</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-blue-50 transition">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{job.title}</div>
                      <div className="text-xs text-gray-500">
                        {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {job.type}
                      </span>
                      {job.isInternship && (
                        <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Internship
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        job.status === 'active' ? 'bg-green-100 text-green-800' :
                        job.status === 'closed' ? 'bg-yellow-100 text-yellow-800' :
                        job.status === 'archived' ? 'bg-gray-200 text-gray-700' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {job.status ? job.status.charAt(0).toUpperCase() + job.status.slice(1) : 'Unknown'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {job.applicantCount > 0 ? (
                        <button
                          className={`font-bold px-2 py-1 rounded ${job.applicantCount > 10 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}
                          title="View applicants"
                          onClick={() => toast.info(`Show applicants for job: ${job.title}`)}
                        >
                          {job.applicantCount}
                        </button>
                      ) : (
                        <span className="text-gray-400 italic" title="No applicants yet">No applicants</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {/* Interview sent status: show Yes if any application for this job has interview_info */}
                      {Array.isArray(job.applications) && job.applications.some(app => app.interview_info) ? (
                        <span className="px-2 py-1 rounded bg-green-100 text-green-800">Yes</span>
                      ) : (
                        <span className="px-2 py-1 rounded bg-gray-100 text-gray-800">No</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        {job.status !== 'active' && (
                          <button
                            onClick={() => handleStatusChange(job.id, 'active')}
                            className="text-green-600 hover:text-green-900"
                            aria-label="Set job active"
                          >
                            Set Active
                          </button>
                        )}
                        {job.status !== 'closed' && (
                          <button
                            onClick={() => handleStatusChange(job.id, 'closed')}
                            className="text-yellow-600 hover:text-yellow-900"
                            aria-label="Set job closed"
                          >
                            Set Closed
                          </button>
                        )}
                        {job.status !== 'archived' && (
                          <button
                            onClick={() => handleStatusChange(job.id, 'archived')}
                            className="text-gray-600 hover:text-gray-900"
                            aria-label="Archive job"
                          >
                            Archive
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEdit(job)}
                          className="text-blue-600 hover:text-blue-900"
                          aria-label="Edit job"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(job.id)}
                          className="text-red-600 hover:text-red-900"
                          aria-label="Delete job"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-3 text-center text-gray-500">
                    No jobs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default JobManagement;
