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
export const INTERN_CLASSIFICATION_TEMPLATE = (user, newLevel) => ({
    subject: `DEBO Engineering: You've been classified as ${newLevel}`,
    body: `
      <div style="font-family: Arial, sans-serif; color: #003366;">
        <img src="https://apply.deboengineering.com/debo-logo.png" alt="DEBO Logo" width="150">
        <h2>Dear ${user.name},</h2>
        <p>After reviewing your application, we've classified you as:</p>
        <div style="background: #f0f7ff; padding: 15px; border-left: 4px solid #3399FF; margin: 10px 0;">
          <h3 style="margin: 0; color: #003366;">
            ${GADA_LEVELS.find(l => l.id === newLevel)?.name}
          </h3>
        </div>
        <p>This classification determines your internship path at DEBO Engineering.</p>
        <p>Next steps will be communicated by our HR team.</p>
        <p style="margin-top: 30px;">
          <strong>DEBO Engineering HR</strong><br>
          <a href="mailto:hr@deboengineering.com">hr@deboengineering.com</a>
        </p>
      </div>
    `
  });