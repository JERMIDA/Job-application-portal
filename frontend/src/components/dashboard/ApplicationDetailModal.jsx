import React from 'react';

const ApplicationDetailModal = ({ isOpen, onClose, application }) => {
  if (!isOpen || !application) return null;
  const { user, job, resumeParsed, gadaRecommendation } = application;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-bold mb-2">Application Details</h2>
        <div className="mb-2">
          <span className="font-semibold">Applicant:</span> {user?.name || 'N/A'}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Job Title:</span> {job?.title || 'N/A'}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Gada Recommendation:</span> <span className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs font-semibold">{gadaRecommendation || 'N/A'}</span>
        </div>
        <div className="mb-2">
          <span className="font-semibold">Parsed Skills:</span> {resumeParsed?.skills?.length ? resumeParsed.skills.join(', ') : 'N/A'}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Parsed Education:</span> {resumeParsed?.education?.length ? resumeParsed.education.join('; ') : 'N/A'}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Parsed Experience:</span> {resumeParsed?.experience || 'N/A'} years
        </div>
        <div className="mb-2">
          <span className="font-semibold">Resume Text:</span>
          <div className="max-h-32 overflow-y-auto border rounded p-2 text-xs bg-gray-50 mt-1">{resumeParsed?.text || 'N/A'}</div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailModal;
