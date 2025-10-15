import { Link } from 'react-router-dom';
import { FaBriefcase, FaMapMarkerAlt, FaCalendarAlt, FaUserTie } from 'react-icons/fa';

const JobCard = ({ job }) => {
  // Use job.id if available, otherwise fallback to job._id
  const jobId = job.id || job._id;

  // Debug: Log jobId to verify what is being passed
  // Remove or comment out in production
  // console.log('JobCard jobId:', jobId);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 border border-gray-100 flex flex-col h-full">
      <div className="p-4 md:p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg md:text-xl font-bold text-debo-blue">{job.title}</h3>
            <p className="text-gray-600 mt-1">{job.company || 'DEBO Engineering'}</p>
          </div>
          {job.isInternship && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold shadow-sm">
              Internship
            </span>
          )}
        </div>

        <div className="mt-2 flex-grow">
          <p className="text-gray-700 line-clamp-3">{job.description}</p>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <div className="flex items-center text-gray-600">
            <FaBriefcase className="mr-2" />
            <span>{job.experienceLevel || 'Any'}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <FaMapMarkerAlt className="mr-2" />
            <span>{job.location || 'Remote'}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <FaUserTie className="mr-2" />
            <span>{job.type || 'Full-time'}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <FaCalendarAlt className="mr-2" />
            <span>Apply by: {new Date(job.deadline).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      <div className="mt-4 p-4 md:p-6 flex justify-between items-center">
        <span className="text-xs text-gray-400">
          {(() => {
            const postedDate = job.createdAt || job.created_at;
            if (postedDate) {
              const d = new Date(postedDate);
              return isNaN(d) ? '' : `Posted ${d.toLocaleDateString()}`;
            }
            return '';
          })()}
        </span>
        <Link
          to={jobId ? `/jobs/${jobId}` : "#"}
          className="btn btn-primary px-4 py-2 text-sm shadow hover:scale-105 transition"
          onClick={() => console.log('Navigating to job details for jobId:', jobId)}
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default JobCard;