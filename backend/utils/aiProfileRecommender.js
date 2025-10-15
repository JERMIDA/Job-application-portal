/**
 * Simple AI-assisted profile recommender utility.
 * Analyzes resume text and existing skills to recommend additional skills or profile improvements.
 */

const skillKeywords = [
  'JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'SQL', 'AWS', 'Docker', 'Kubernetes',
  'TypeScript', 'GraphQL', 'MongoDB', 'Express', 'Redux', 'HTML', 'CSS', 'Sass', 'Git', 'CI/CD'
];

/**
 * Recommend skills based on resume text and existing skills.
 * @param {string} resumeText - Parsed resume text.
 * @param {string[]} existingSkills - Array of existing skills.
 * @returns {string[]} Array of recommended skills.
 */
export function recommendSkills(resumeText, existingSkills = []) {
  if (!resumeText) return [];

  const lowerText = resumeText.toLowerCase();
  const existingSkillsLower = existingSkills.map(s => s.toLowerCase());

  const recommended = skillKeywords.filter(skill => {
    const skillLower = skill.toLowerCase();
    return lowerText.includes(skillLower) && !existingSkillsLower.includes(skillLower);
  });

  return recommended;
}
