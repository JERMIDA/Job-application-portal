import { FaBook, FaUserGraduate, FaChartLine } from 'react-icons/fa';
import LevelProgressionRules from '../components/dashboard/LevelProgressionRules'; // Ensure correct import
import useAuth from '../hooks/useAuth';

const RulesPage = () => {
  const { auth } = useAuth();

  return (
    <div className="mx-auto px-4 py-8 md:px-8">
      {auth.user && (
        <p className="text-gray-500 mb-4">
          Welcome, {auth.user.name}! Here are the rules for DEBO Engineering.
        </p>
      )}
      <div className="flex items-center mb-6 md:mb-8">
        <FaBook className="text-debo-blue text-2xl md:text-3xl mr-3" />
        <h1 className="text-xl md:text-2xl font-bold text-debo-blue">DEBO Engineering Rules</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <FaUserGraduate className="text-debo-light-blue mr-3" />
            <h3 className="text-lg font-semibold">Gada System</h3>
          </div>
          <p className="text-gray-600">
            The 8-level classification system for interns and developers at DEBO Engineering.
          </p>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <FaChartLine className="text-debo-light-blue mr-3" />
            <h3 className="text-lg font-semibold">Progression Rules</h3>
          </div>
          <p className="text-gray-600">
            Requirements and minimum durations for moving between levels.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden p-4 md:p-6">
        <LevelProgressionRules />
      </div>

      <div className="mt-6 md:mt-8 bg-white p-4 md:p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-debo-blue mb-4">Administration Guidelines</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm md:text-base">
          <li>Only HR administrators can modify level assignments</li>
          <li>Minimum duration at each level must be respected</li>
          <li>All changes must be documented in the system</li>
          <li>Monthly review meetings for level progression</li>
        </ul>
      </div>
    </div>
  );
};

export default RulesPage;