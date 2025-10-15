import React, { useEffect } from 'react';
import useAuth from '../../hooks/useAuth';

const RestrictedApplicationPage = () => {
  const { auth } = useAuth();

  useEffect(() => {
    if (auth?.role !== 'admin' && auth?.role !== 'super-admin') {
      window.location.href = '/'; // Redirect non-admin users
    }
  }, [auth]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Access Restricted</h1>
        <p className="text-gray-700 mb-6">
          Admins and Super Admins are not allowed to apply for jobs.
        </p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => window.location.href = '/'}
        >
          Go Back to Home
        </button>
      </div>
    </div>
  );
};

export default RestrictedApplicationPage;