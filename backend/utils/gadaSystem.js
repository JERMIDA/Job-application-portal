function GadaSystem() { }

GadaSystem.levels = [
  { id: 'beginner', name: 'Beginner', minDuration: 4, privileges: ['basic-training'] },
  { id: 'early-beginner', name: 'Early Beginner', minDuration: 8, privileges: ['project-access'] },
  { id: 'junior-developer', name: 'Junior Developer', minDuration: 12, privileges: ['code-review'] },
  { id: 'mid-level-developer', name: 'Mid-Level Developer', minDuration: 16, privileges: ['mentorship'] },
  { id: 'senior-developer', name: 'Senior Developer', minDuration: 20, privileges: ['architecture'] },
  { id: 'tech-lead', name: 'Tech Lead', minDuration: 24, privileges: ['team-lead'] },
  { id: 'expert-developer', name: 'Expert Developer', minDuration: 28, privileges: ['research'] },
  { id: 'master-developer', name: 'Master Developer', minDuration: 32, privileges: ['strategy'] }
];

GadaSystem.canProgress = function(currentLevel, targetLevel) {
  const currentIndex = GadaSystem.levels.findIndex(l => l.id === currentLevel);
  const targetIndex = GadaSystem.levels.findIndex(l => l.id === targetLevel);
  return targetIndex === currentIndex + 1;
}

GadaSystem.getLevelRequirements = function(levelId) {
  return GadaSystem.levels.find(level => level.id === levelId);
}

GadaSystem.validateLevelAssignment = function(user, targetLevel) {
  const currentLevel = user.experience_level;

  if (!currentLevel && targetLevel !== 'beginner') {
    return { valid: false, reason: 'New interns must start at Beginner level' };
  }

  if (currentLevel && !GadaSystem.canProgress(currentLevel, targetLevel)) {
    return { valid: false, reason: `Cannot progress directly from ${currentLevel} to ${targetLevel}` };
  }

  return { valid: true };
}

GadaSystem.getAllLevels = function() {
  return GadaSystem.levels;
}

export { GadaSystem };