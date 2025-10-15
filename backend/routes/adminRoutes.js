import { getJobsWithApplicantCount } from '../controllers/jobController.js';
import express from 'express';
import { protect, admin, superAdmin } from '../middlewares/authMiddleware.js';
import {
  getInterns,
  updateInternStatus,
  getStats,
  getReports,
  sendInterviewInvite,
  listUsers,
  updateUserRole,
  updateSetting,
  shortlistApplication,
  updateInternLevelAndStatus,
  getSettings,
  addSetting,
  deleteSetting,
  classifyApplicant,
  getInternshipStatusCounts,
  classifyIntern,
  sendFeedbackEmail
} from '../controllers/adminController.js';
import { getAllApplications, updateApplicationStatus, bulkUpdateApplicationStatus } from '../controllers/applicationController.js';
import { getResumeInsights } from '../controllers/adminController.js';
import { getEmailTemplates, createEmailTemplate, updateEmailTemplate, deleteEmailTemplate } from '../controllers/emailTemplateController.js';
import { getSettings as getSuperAdminSettings, updateSettings as updateSuperAdminSettings } from '../controllers/superAdminController.js';

const router = express.Router();

router.use(protect);
router.get('/jobs-with-applicant-count', admin, getJobsWithApplicantCount); // Jobs with applicant count

// Middleware to allow access for admin or super-admin roles
const allowAdminOrSuperAdmin = (req, res, next) => {
  if (req.user?.role === 'admin' || req.user?.role === 'super-admin') return next();
  return res.status(403).json({ message: 'Not authorized as admin or super-admin' });
};

// Admin-only routes
router.get('/interns', admin, getInterns);
router.patch('/interns/:id', admin, updateInternStatus);
router.patch('/interns/:id/classify', admin, updateInternLevelAndStatus);
router.get('/stats', admin, getStats);
router.get('/reports', admin, getReports);
router.post('/interview-invite', admin, sendInterviewInvite);
router.patch('/applications/:id/shortlist', admin, shortlistApplication);
router.get('/applications', admin, getAllApplications);
router.patch('/applications/:id', admin, updateApplicationStatus);
router.patch('/applications/:id/classify', admin, classifyApplicant);
router.patch('/interns/classify', admin, classifyIntern);
router.patch('/applications/bulk-update', admin, bulkUpdateApplicationStatus);

// Super Admin routes for user role management
router.get('/users', superAdmin, listUsers);
router.get('/users/:id/resume-insights', allowAdminOrSuperAdmin, getResumeInsights);
router.patch('/users/:id/role', superAdmin, updateUserRole);
router.patch('/settings', superAdmin, updateSetting); // Update system settings
router.get('/settings', superAdmin, getSettings);
router.post('/settings', superAdmin, addSetting); // Add new system setting
router.delete('/settings/:key', superAdmin, deleteSetting); // Delete system setting

// Super Admin routes for email templates management
router.get('/email-templates', superAdmin, getEmailTemplates);
router.post('/email-templates', superAdmin, createEmailTemplate);
router.patch('/email-templates/:id', superAdmin, updateEmailTemplate);
router.delete('/email-templates/:id', superAdmin, deleteEmailTemplate);

// Add route for internship status counts
router.get('/internship-status-counts', admin, getInternshipStatusCounts);

// Super Admin routes for system settings management
router.get('/settings', getSuperAdminSettings);
router.patch('/settings', updateSuperAdminSettings);

// Added routes for interview invites and feedback emails
router.post('/applications/:id/interview-invite', admin, sendInterviewInvite);
router.post('/applications/:id/feedback', admin, sendFeedbackEmail);

export default router;
