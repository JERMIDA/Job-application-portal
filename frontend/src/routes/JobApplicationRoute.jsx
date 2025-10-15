import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ApplicationFormWrapper from '../components/jobs/ApplicationFormWrapper';
import api from '../services/api';

const JobApplicationRoute = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await api.get(`/jobs/${id}`);
        setJob(response.data);
      } catch (error) {
        console.error('Failed to fetch job details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) {
    return <div className="text-center py-8">Loading job details...</div>;
  }

  if (!job) {
    return <div className="text-center py-8">Job not found.</div>;
  }

  // Ensure job object always has an 'id' property (handle job.data from API)
  const jobData = job.data || job;
  const jobWithId = jobData.id ? jobData : { ...jobData, id: jobData._id || id };
  return <ApplicationFormWrapper job={jobWithId} />;
};

export default JobApplicationRoute;
