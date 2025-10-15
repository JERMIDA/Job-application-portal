import { useState } from 'react';
import { FaUsers, FaBriefcase, FaFileAlt, FaChartBar, FaPlus } from 'react-icons/fa';
import AdminPanel from '../components/dashboard/AdminPanel';
import ApplicationList from '../components/dashboard/ApplicationList';
import ClassificationSystem from '../components/dashboard/ClassificationSystem';
import JobForm from '../components/jobs/JobForm';
import JobManagement from '../components/jobs/JobManagement';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showJobForm, setShowJobForm] = useState(false);

  // Fix: When "Create New Job" is open, hide tab content and show JobForm only.
  // When JobForm is closed, return to the previously active tab.
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminPanel />;
      case 'jobs':
        return <JobManagement />;
      case 'applications':
        return <ApplicationList />;
      case 'classification':
        return <ClassificationSystem />;
      default:
        return <AdminPanel />;
    }
  };

  return (
    <div className="mx-auto px-2 md:px-8 py-8 pt-20 w-full min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row gap-4 md:gap-8 w-full max-w-7xl mx-auto">
        <aside className="w-full md:w-64 bg-white rounded-lg shadow-md p-2 md:p-4 h-fit mb-4 md:mb-0">
          <h2 className="text-lg md:text-xl font-bold text-debo-blue mb-4 md:mb-6">Admin Dashboard</h2>
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                activeTab === 'dashboard'
                  ? 'bg-debo-light-blue text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FaChartBar className="mr-3" /> Dashboard
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                activeTab === 'jobs'
                  ? 'bg-debo-light-blue text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FaBriefcase className="mr-3" /> Job Management
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                activeTab === 'applications'
                  ? 'bg-debo-light-blue text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FaFileAlt className="mr-3" /> Applications
            </button>
            <button
              onClick={() => setActiveTab('classification')}
              className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                activeTab === 'classification'
                  ? 'bg-debo-light-blue text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FaUsers className="mr-3" /> Intern Classification
            </button>
            <button
              onClick={() => setShowJobForm(true)}
              className="w-full text-left px-4 py-2 rounded-md flex items-center text-gray-700 hover:bg-gray-100 mt-4"
            >
              <FaPlus className="mr-3" /> Create New Job
            </button>
          </nav>
        </aside>
        {/* Main Content */}
        <main className="flex-1 w-full">
          {showJobForm ? (
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl font-bold text-debo-blue">Create New Job</h2>
                <button
                  onClick={() => setShowJobForm(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
              <JobForm onSuccess={() => {
                setShowJobForm(false);
                // Optionally refresh job list or switch tab here
              }} />
            </div>
          ) : (
            renderTabContent()
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;