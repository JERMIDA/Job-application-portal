import { 
    FaUserGraduate, 
    FaUserTie, 
    FaUserNinja, 
    FaUserShield,
    FaUserAstronaut,
    FaUserCog,
    FaUserSecret,
    FaUserAlt
  } from 'react-icons/fa';
  
  const GADA_LEVELS = [
    { id: 'beginner', name: 'Beginner', icon: FaUserGraduate },
    { id: 'early-beginner', name: 'Early Beginner', icon: FaUserAlt },
    { id: 'junior-developer', name: 'Junior Developer', icon: FaUserTie },
    { id: 'mid-level-developer', name: 'Mid-Level Developer', icon: FaUserNinja },
    { id: 'senior-developer', name: 'Senior Developer', icon: FaUserShield },
    { id: 'tech-lead', name: 'Tech Lead', icon: FaUserCog },
    { id: 'expert-developer', name: 'Expert Developer', icon: FaUserAstronaut },
    { id: 'master-developer', name: 'Master Developer', icon: FaUserSecret }
  ];
  
const LevelProgressionRules = () => {
    const progressionRules = [
      { from: 'beginner', to: ['early-beginner'], minDuration: '4 weeks' },
      { from: 'early-beginner', to: ['junior-developer'], minDuration: '8 weeks' },
      // ... all progression rules
      { from: 'expert-developer', to: ['master-developer'], minDuration: '6 months' }
    ];
  
    return (
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="font-bold text-debo-blue mb-3">Gada Progression Rules</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Current Level</th>
                <th className="px-4 py-2 text-left">Can Progress To</th>
                <th className="px-4 py-2 text-left">Minimum Duration</th>
              </tr>
            </thead>
            <tbody>
              {progressionRules.map((rule, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-2 border-b">
                    {GADA_LEVELS.find(l => l.id === rule.from)?.name}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {rule.to.map(level => 
                      GADA_LEVELS.find(l => l.id === level)?.name
                    ).join(', ')}
                  </td>
                  <td className="px-4 py-2 border-b">{rule.minDuration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

export default LevelProgressionRules;