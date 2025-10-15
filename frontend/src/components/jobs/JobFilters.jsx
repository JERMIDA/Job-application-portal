import { useState } from 'react';

const JobFilters = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    experienceLevel: '', // Developer level
    isInternship: false,
    category: '', // New category filter
    status: '', // Job status filter
  });

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
    setFilters({
      ...filters,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleReset = () => {
    setFilters({
      search: '',
      type: '',
      experienceLevel: '',
      isInternship: false,
      category: '',
      status: '',
    });
    onFilter({});
        <div>
          <label htmlFor="status" className="block text-gray-700 mb-2 text-sm font-medium">Job Status</label>
          <select
            id="status"
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-debo-blue text-sm"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
            <option value="archived">Archived</option>
          </select>
        </div>
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-md border border-gray-100">
      <h3 className="text-lg font-semibold text-debo-blue mb-4">Filter Jobs</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="search" className="block text-gray-700 mb-2 text-sm font-medium">Search</label>
          <input
            type="text"
            id="search"
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="Job title or keywords"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-debo-blue text-sm"
          />
        </div>
        <div>
          <label htmlFor="type" className="block text-gray-700 mb-2 text-sm font-medium">Job Type</label>
          <select
            id="type"
            name="type"
            value={filters.type}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-debo-blue text-sm"
          >
            <option value="">All Types</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
        </div>
        <div>
          <label htmlFor="experienceLevel" className="block text-gray-700 mb-2 text-sm font-medium">Developer Level</label>
          <select
            id="experienceLevel"
            name="experienceLevel"
            value={filters.experienceLevel}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-debo-blue text-sm"
          >
            <option value="">All Levels</option>
            {developerLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            id="isInternship"
            name="isInternship"
            checked={filters.isInternship}
            onChange={handleChange}
            className="mr-2 h-5 w-5 text-debo-blue focus:ring-debo-blue rounded border-gray-300"
          />
          <label htmlFor="isInternship" className="text-gray-700 text-sm font-medium">Internship Only</label>
        </div>
        <div>
          <label htmlFor="category" className="block text-gray-700 mb-2 text-sm font-medium">Category</label>
          <input
            type="text"
            id="category"
            name="category"
            value={filters.category || ''}
            onChange={handleChange}
            placeholder="e.g. Software, HR, Marketing"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-debo-blue text-sm"
          />
        </div>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <button type="submit" className="btn btn-primary flex-1 text-sm">
            Apply Filters
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="btn btn-secondary flex-1 text-sm"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobFilters;