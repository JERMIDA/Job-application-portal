import Application from '../models/Application.js';
import Job from '../models/Job.js';
import User from '../models/User.js';
import { sendApplicationNotification, sendFeedbackEmail } from '../utils/emailService.js';
import { GadaSystem } from '../utils/gadaSystem.js';
import pool from '../config/db.js';

export const createApplication = async (req, res, next) => {
  try {
    // Debug log incoming request data
    console.log('POST /api/applications req.body:', req.body);
    console.log('POST /api/applications req.file:', req.file);
    const jobId = req.body.jobId || req.body.job_id;
    if (!jobId) {
      return res.status(400).json({ error: 'Missing jobId. Please select a job before applying.' });
    }
    const resumePath = req.file ? `/uploads/resumes/${req.file.filename}` : req.body.resumePath;
    let skills = req.body.skills;
    // Accept skills as array, single string, or comma-separated string
    if (Array.isArray(skills)) {
      skills = skills.filter(s => s && s.toString().trim() !== '');
    } else if (typeof skills === 'string') {
      // Try to parse JSON array, fallback to comma split, fallback to single skill
      try {
        const parsed = JSON.parse(skills);
        if (Array.isArray(parsed)) {
          skills = parsed.filter(s => s && s.toString().trim() !== '');
        } else {
          skills = skills.split(',').map(s => s.trim()).filter(Boolean);
        }
      } catch {
        if (skills.includes(',')) {
          skills = skills.split(',').map(s => s.trim()).filter(Boolean);
        } else {
          skills = [skills.trim()];
        }
      }
    } else {
      skills = [];
    }
    if (!skills || !Array.isArray(skills) || skills.length === 0 || !skills[0]) {
      return res.status(400).json({ error: 'Skills are required and must be a non-empty list.' });
    }
    const experienceLevel = req.body.experienceLevel;

    // Check if the job exists and is open for applications
    let job;
    try {
      job = await Job.findById(jobId);
    } catch (err) {
      return res.status(404).json({ error: `Job not found for jobId: ${jobId}` });
    }
    if (!job) {
      return res.status(404).json({ error: `Job not found for jobId: ${jobId}` });
    }
    if (job.status === 'closed' || job.status === 'archived') {
      return res.status(403).json({ error: 'This job is not open for applications.' });
    }

    if (job.type === 'internship') {
      if (!experienceLevel || !GadaSystem.getLevelRequirements(experienceLevel)) {
        return res.status(400).json({ error: 'Valid Gada level required for internships.' });
      }

      if (job.min_gada_level) {
        const applicantLevel = GadaSystem.levels.findIndex(l => l.id === experienceLevel);
        const requiredLevel = GadaSystem.levels.findIndex(l => l.id === job.min_gada_level);
        if (applicantLevel < requiredLevel) {
          return res.status(400).json({ 
            error: `Applicant's level (${experienceLevel}) is below required level (${job.min_gada_level}) for this internship.`
          });
        }
      }
    }

    const existingApp = await Application.findByUserAndJob(req.user.id, jobId);
    if (existingApp) {
      return res.status(400).json({ error: 'You have already applied for this job.' });
    }

    // Gather profile info from application form if user profile is incomplete
    const user = await User.findById(req.user.id);
    let updateProfileFields = {};
    if (!user.education && req.body.education) updateProfileFields.education = req.body.education;
    if ((!user.skills || user.skills.length === 0) && skills && skills.length > 0) updateProfileFields.skills = skills;
    if (!user.resume_path && resumePath) updateProfileFields.resume_path = resumePath;
    if (Object.keys(updateProfileFields).length > 0) {
      await User.updateProfile(req.user.id, {
        name: user.name,
        phone: user.phone,
        address: user.address,
        education: updateProfileFields.education || user.education,
        experience: user.experience,
        skills: updateProfileFields.skills || user.skills,
        resume_path: updateProfileFields.resume_path || user.resume_path,
      });
    }

    if (!jobId) {
      return res.status(400).json({ error: 'Missing jobId. Please select a job before applying.' });
    }
    if (!resumePath) {
      return res.status(400).json({ error: 'Resume is required. Please upload your resume.' });
    }

    // AI Resume Parsing & Recommendations
    let parsedSkills = [];
    let aiRecommendations = [];
    try {
      const { parseResume, recommendGadaLevel } = await import('../utils/resumeParser.js');
      const { recommendSkills } = await import('../utils/aiProfileRecommender.js');
      let resumeText = '';
      if (resumePath) {
        // Use absolute path for uploaded resumes
        let parsePath = resumePath;
        if (req.file && req.file.filename) {
          const path = await import('path');
          parsePath = path.join(process.cwd(), 'uploads', 'resumes', req.file.filename);
        }
        try {
          resumeText = await parseResume(parsePath);
        } catch (e) {
          if (req.file && req.file.filename) {
            // Only log warning for new submissions
            console.warn('Resume parsing failed or file not found:', e);
          }
          // For old/missing files, just skip parsing silently
          resumeText = '';
        }
      }
      if (typeof resumeText !== 'string') resumeText = '';
      parsedSkills = resumeText ? recommendSkills(resumeText, skills) : [];

      // Recommend Gada level based on skills, experience, and certifications
      const recommendedLevel = recommendGadaLevel(skills, req.body.experience || 0, req.body.certifications || []);
      if (recommendedLevel) {
        aiRecommendations.push(`Recommended Gada Level: ${recommendedLevel}`);
      }

      if (parsedSkills.length > 0) {
        aiRecommendations.push(`Recommended Skills: ${parsedSkills.join(', ')}`);
      }
    } catch (err) {
      console.error('AI resume parsing failed:', err);
      aiRecommendations.push('AI parsing failed. Please review your resume manually.');
    }

    const application = await Application.create({
      userId: req.user.id,
      jobId,
      resumePath,
      coverLetter: req.body.coverLetter,
      experienceLevel: req.body.experienceLevel,
      skills,
      education: req.body.education,
      parsedSkills,
      aiRecommendations
    });

    // Fetch full user info for email notification
    const fullUser = await User.findById(req.user.id);
    try {
      await sendApplicationNotification({
        ...application,
        user: { name: fullUser.name, email: fullUser.email },
        job
      });
    } catch (err) {
      console.error('Email sending failed:', err);
      // Optionally: log to DB or monitoring, but do NOT throw
    }

    res.status(201).json({
      success: true,
      data: application
    });
  } catch (error) {
    next(error);
  }
};

export const getApplicationById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserApplications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const [applications] = await pool.query(
      `SELECT a.*, 
              j.id as job_id, j.title as job_title, j.type as job_type,
              DATE_FORMAT(a.created_at, '%Y-%m-%dT%H:%i:%sZ') as createdAt
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       WHERE a.user_id = ?`,
      [userId]
    );
    // Attach job object for frontend compatibility
    const applicationsWithJob = applications.map(app => ({
      ...app,
      job: {
        id: app.job_id,
        title: app.job_title,
        type: app.job_type,
      }
    }));
    res.status(200).json({
      success: true,
      count: applicationsWithJob.length,
      data: applicationsWithJob,
    });
  } catch (error) {
    next(error);
  }
};

// Update application status and send feedback email
const allowedStatusTransitions = {
  submitted: ['under review', 'rejected'],
  'under review': ['shortlisted', 'rejected'],
  shortlisted: ['interview', 'rejected'],
  interview: ['accepted', 'rejected'],
  accepted: [],
  rejected: []
};

import { logAdminAction } from '../utils/auditLogger.js';

export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, feedback } = req.body;

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (!allowedStatusTransitions[application.status].includes(status)) {
      return res.status(400).json({ message: `Invalid status transition from ${application.status} to ${status}` });
    }

    const isUpdated = await Application.updateStatus(id, status);
    if (!isUpdated) {
      return res.status(500).json({ message: 'Failed to update application status' });
    }

    if (feedback) {
      await sendFeedbackEmail(application.user_email, feedback);
    }

    // Always send status update notification to applicant
    try {
      // Fetch user and job info (if not already in application)
      const user = application.user_email
        ? { name: application.user_name || '', email: application.user_email }
        : await User.findById(application.user_id);
      const job = application.job_id 
        ? await Job.findById(application.job_id)
        : null;
      await sendApplicationNotification({
        ...application,
        user,
        job,
        newStatus: status,
      });
    } catch (err) {
      console.error('Status update email failed:', err);
    }

    // Log admin action
    await logAdminAction(req.user.id, 'Update Application Status', `Changed application ID ${id} status to ${status}`);

    const updatedApplication = await Application.findById(id);
    res.status(200).json({
      success: true,
      data: updatedApplication,
    });
  } catch (error) {
    next(error);
  }
};

export const trackApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json({
      success: true,
      status: application.status,
    });
  } catch (error) {
    next(error);
  }
};

export const getApplicationsByJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const applications = await Application.findByJobId(jobId);
    if (!applications || applications.length === 0) {
      return res.status(404).json({ message: 'No applications found for this job' });
    }

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

export const classifyIntern = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user || user.role !== 'intern') {
      return res.status(404).json({ message: 'Intern not found' });
    }

    const level = GadaSystem.getLevelRequirements(user.experience_level);
    if (!level) {
      return res.status(400).json({ message: 'Invalid experience level' });
    }

    const classification = level.minDuration < 16 ? 'Unpaid Internship' : 'Paid Internship';
    res.json({ success: true, classification });
  } catch (error) {
    next(error);
  }
};

export const getAllApplications = async (req, res, next) => {
  try {
    const [applications] = await pool.query(
      `SELECT a.*, 
              u.id as user_id, u.name as user_name, u.email as user_email, u.role as user_role,
              j.id as job_id, j.title as job_title, j.type as job_type, j.is_internship,
              DATE_FORMAT(a.created_at, '%Y-%m-%dT%H:%i:%sZ') as createdAt
       FROM applications a
       JOIN users u ON a.user_id = u.id
       JOIN jobs j ON a.job_id = j.id
       ORDER BY a.created_at DESC`
    );
    // Attach user and job objects for frontend compatibility, and enrich with resume parsing and Gada AI
    const { parseResume, recommendGadaLevel } = await import('../utils/resumeParser.js');
    const applicationsWithDetails = await Promise.all(applications.map(async app => {
      let resumeParsed = { skills: [], education: [], experience: 0, text: '' };
      let gadaRecommendation = 'N/A';
      if (app.resume_path) {
        try {
          resumeParsed = await parseResume(app.resume_path);
          gadaRecommendation = recommendGadaLevel(resumeParsed.skills, resumeParsed.experience);
        } catch (e) {
          // fallback to N/A
        }
      }
      return {
        ...app,
        resume_path: app.resume_path, // Ensure resume_path is present
        user: {
          id: app.user_id,
          name: app.user_name,
          email: app.user_email,
          role: app.user_role,
        },
        job: {
          id: app.job_id,
          title: app.job_title,
          type: app.job_type,
          isInternship: !!app.is_internship,
        },
        createdAt: app.createdAt,
        resumeParsed,
        gadaRecommendation,
      };
    }));
    res.status(200).json({
      success: true,
      count: applicationsWithDetails.length,
      data: applicationsWithDetails,
    });
  } catch (error) {
    next(error);
  }
};

// Bulk update application statuses
export const bulkUpdateApplicationStatus = async (req, res, next) => {
  try {
    const { applicationIds, status, feedback } = req.body;

    if (!Array.isArray(applicationIds) || applicationIds.length === 0) {
      return res.status(400).json({ message: 'Application IDs are required and must be an array' });
    }

    const applications = await Application.findByIds(applicationIds);
    if (!applications || applications.length === 0) {
      return res.status(404).json({ message: 'No applications found for the provided IDs' });
    }

    const invalidTransitions = applications.filter(
      (app) => !allowedStatusTransitions[app.status].includes(status)
    );

    if (invalidTransitions.length > 0) {
      return res.status(400).json({
        message: 'Some applications have invalid status transitions',
        invalidApplications: invalidTransitions.map((app) => app.id),
      });
    }

    await Promise.all(
      applications.map(async (app) => {
        await Application.updateStatus(app.id, status);
        if (feedback) {
          await sendFeedbackEmail(app.user_email, feedback);
        }
        await sendApplicationNotification({
          ...app,
          newStatus: status,
        });
      })
    );

    await logAdminAction(
      req.user.id,
      'Bulk Update Application Status',
      `Updated statuses for application IDs: ${applicationIds.join(', ')}`
    );

    res.status(200).json({
      success: true,
      message: 'Application statuses updated successfully',
    });
  } catch (error) {
    next(error);
  }
};