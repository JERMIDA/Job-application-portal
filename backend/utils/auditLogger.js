import AuditLog from '../models/AuditLog.js';

/**
 * Logs an admin action to the audit log.
 * @param {number} userId - ID of the user performing the action.
 * @param {string} action - Description of the action.
 * @param {string} details - Additional details about the action.
 */
export async function logAdminAction(userId, action, details = '') {
  try {
    await AuditLog.create({ userId, action, details });
  } catch (error) {
    console.error('Failed to log admin action:', error);
  }
}
