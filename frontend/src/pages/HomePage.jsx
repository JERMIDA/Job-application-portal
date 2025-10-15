import { Link } from 'react-router-dom';
import { FaSearch, FaBriefcase, FaUserGraduate, FaChartLine } from 'react-icons/fa';
import JobCard from '../components/jobs/JobCard';
import useAuth from '../hooks/useAuth';
import { useState, useEffect } from 'react';
import api from '../services/api';

const HomePage = () => {
  const { auth } = useAuth();
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      try {
        const response = await api.get('/jobs', { params: { limit: 5 } });
        setFeaturedJobs(response.data.data);
      } catch (error) {
        console.error('Failed to fetch featured jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedJobs();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8">
        <p>Loading featured jobs...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 py-8 pt-20 md:px-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-debo-blue to-debo-light-blue text-white rounded-2xl p-6 md:p-12 mb-10 shadow-lg">
        <div className="max-w-3xl mx-auto text-center ">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Find Your Dream Job at DEBO Engineering</h1>
          <p className="text-lg md:text-xl mb-8">
            Join our team of talented engineers and grow your career with exciting opportunities.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/jobs"
              className="btn btn-primary inline-flex items-center justify-center"
            >
              <FaSearch className="mr-2" /> Browse Jobs
            </Link>
            {!auth.user && (
              <Link
                to="/register"
                className="btn btn-secondary inline-flex items-center justify-center"
              >
                <FaUserGraduate className="mr-2" /> Register Now
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-center mb-8 text-debo-blue">Why Join DEBO Engineering?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center">
            <div className="bg-blue-100 text-blue-600 rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mx-auto mb-4">
              <FaBriefcase size={20} md:size={24} />
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-2">Career Growth</h3>
            <p className="text-gray-600 text-sm md:text-base">
              Opportunities to advance through our Gada system classification for continuous learning and progression.
            </p>
          </div>
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center">
            <div className="bg-green-100 text-green-600 rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mx-auto mb-4">
              <FaUserGraduate size={20} md:size={24} />
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-2">Learning Culture</h3>
            <p className="text-gray-600 text-sm md:text-base">
              We invest in your development with training programs, mentorship, and challenging projects.
            </p>
          </div>
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center">
            <div className="bg-yellow-100 text-yellow-600 rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mx-auto mb-4">
              <FaChartLine size={20} md:size={24} />
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-2">Impactful Work</h3>
            <p className="text-gray-600 text-sm md:text-base">
              Contribute to meaningful projects that solve real-world engineering challenges.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-debo-blue">Featured Job Openings</h2>
          <Link to="/jobs" className="text-debo-light-blue hover:underline">
            View All Jobs
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {featuredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;