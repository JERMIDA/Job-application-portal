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
export const validateInternshipApplication = (application, job) => {
  const errors = [];

  // Validate job data
  if (!job || !job.minGadaLevel) {
    errors.push('Job data is incomplete or invalid.');
    return errors;
  }

  // Gada level validation
  const applicantLevelIndex = GADA_LEVELS.findIndex(l => l.id === application.experienceLevel);
  const requiredLevelIndex = GADA_LEVELS.findIndex(l => l.id === job.minGadaLevel);

  if (applicantLevelIndex === -1) {
    errors.push(`Invalid applicant level: ${application.experienceLevel}`);
  } else if (applicantLevelIndex < requiredLevelIndex) {
    errors.push(`Applicant's level (${application.experienceLevel}) is below required level (${job.minGadaLevel})`);
  }

  // Document validation
  if (!application.resume) {
    errors.push('Resume is required.');
  }

  // Education validation for certain levels
  if (['mid-level-developer', 'senior-developer', 'tech-lead'].includes(job.minGadaLevel)) {
    if (!application.education || application.education.length < 50) {
      errors.push('Detailed education background is required for this level.');
    }
  }

  return errors.length === 0 ? null : errors;
};