import { useState, useEffect } from 'react';
import { FaFilter } from 'react-icons/fa';
import JobCard from '../components/jobs/JobCard';
import JobFilters from '../components/jobs/JobFilters';
import api from '../services/api';

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await api.get('/jobs', { params: filters });
        setJobs(response.data.data);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [filters]);

  const handleFilter = (newFilters) => {
    // Clean up filters: remove empty values
    const cleaned = Object.fromEntries(
      Object.entries(newFilters).filter(([, v]) => v !== '' && v !== undefined && v !== null)
    );
    setFilters(cleaned);
    setShowFilters(false);
  };

  if (loading) {
    return (
      <div className="mx-auto px-4 py-8 pt-20 md:px-8">
        <div className="text-center py-12">
          <p className="text-lg">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 py-8 pt-20 md:px-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-debo-blue mb-2 md:mb-4">Job Openings</h1>
        <p className="text-gray-600">
          Browse through our current job openings and find the perfect match for your skills.
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-4 md:gap-8">
        {/* Filters - Mobile */}
        <div className="md:hidden w-full">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-secondary flex items-center"
          >
            <FaFilter className="mr-2" /> {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          {showFilters && (
            <div className="mt-4">
              <JobFilters onFilter={handleFilter} />
            </div>
          )}
        </div>
        {/* Filters - Desktop */}
        <div className="hidden md:block md:w-1/3 lg:w-1/4">
          <JobFilters onFilter={handleFilter} />
        </div>
        {/* Job Listings */}
        <div className="flex-1">
          {jobs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-xl shadow-md text-center border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No jobs found</h3>
              <p className="text-gray-500">
                Try adjusting your filters or check back later for new openings.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobsPage;