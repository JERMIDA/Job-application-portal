import pool from '../config/db.js';
import sendEmail from '../utils/emailService.js';
import { logAdminAction } from '../utils/auditLogger.js';
import fs from 'fs';
import Setting from '../models/Setting.js';
import User from '../models/User.js';
import Application from '../models/Application.js';

// List all users
export const listUsers = async (req, res, next) => {
  try {
    const [users] = await pool.query(
      `SELECT id, name, email, role FROM users`
    );
    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// Get statistics for dashboard
export const getStats = async (req, res, next) => {
  try {
    const [userCounts] = await pool.query(
      `SELECT role, COUNT(*) as count FROM users GROUP BY role`
    );
    const [applicationCounts] = await pool.query(
      `SELECT status, COUNT(*) as count FROM applications GROUP BY status`
    );
    const [jobCounts] = await pool.query(
      `SELECT COUNT(*) as count FROM jobs`
    );

    // Gada System Distribution
    const [gadaLevels] = await pool.query(
      `SELECT experience_level as _id, COUNT(*) as count FROM users WHERE role = 'intern' GROUP BY experience_level`
    );
    // Internship Status Breakdown
    const [unpaidInterns] = await pool.query(
      `SELECT COUNT(*) as count FROM users WHERE role = 'intern' AND status = 'unpaid'`
    );
    const [paidInterns] = await pool.query(
      `SELECT COUNT(*) as count FROM users WHERE role = 'intern' AND status = 'paid'`
    );
    const [fullTimeInterns] = await pool.query(
      `SELECT COUNT(*) as count FROM users WHERE role = 'intern' AND status = 'full-time'`
    );

    res.json({
      success: true,
      data: {
        totalJobs: jobCounts[0].count,
        totalApplications: applicationCounts.reduce((acc, cur) => acc + cur.count, 0),
        totalUsers: userCounts.reduce((acc, cur) => acc + cur.count, 0),
        pendingApplications: applicationCounts.find(a => a.status === 'submitted' || a.status === 'under review')?.count || 0,
        gadaLevels,
        unpaidInterns: unpaidInterns[0]?.count || 0,
        paidInterns: paidInterns[0]?.count || 0,
        fullTimeInterns: fullTimeInterns[0]?.count || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get dashboard metrics
export const getDashboardMetrics = async (req, res, next) => {
  try {
    const [userCounts] = await pool.query('SELECT role, COUNT(*) as count FROM users GROUP BY role');
    const [applicationCounts] = await pool.query('SELECT status, COUNT(*) as count FROM applications GROUP BY status');
    const [jobCounts] = await pool.query('SELECT COUNT(*) as count FROM jobs');

    res.json({
      success: true,
      data: {
        userCounts,
        applicationCounts,
        jobCounts: jobCounts[0].count,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get reports (example: applications by job)
export const getReports = async (req, res, next) => {
  try {
    // Total applications
    const [[{ totalApplications }]] = await pool.query(
      `SELECT COUNT(*) as totalApplications FROM applications`
    );
    // Active interns
    const [[{ activeInterns }]] = await pool.query(
      `SELECT COUNT(*) as activeInterns FROM users WHERE role = 'intern' AND status IN ('unpaid', 'paid')`
    );
    // Conversions (interns to full-time)
    const [[{ conversions }]] = await pool.query(
      `SELECT COUNT(*) as conversions FROM users WHERE role = 'intern' AND status = 'full-time'`
    );
    // Gada distribution
    const [gadaDistribution] = await pool.query(
      `SELECT experience_level as _id, COUNT(*) as count FROM users WHERE role = 'intern' GROUP BY experience_level`
    );
    // Monthly applications (last 12 months)
    const [monthlyApplications] = await pool.query(
      `SELECT DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as count FROM applications GROUP BY month ORDER BY month DESC LIMIT 12`
    );
    // Monthly conversions (last 12 months)
    const [monthlyConversions] = await pool.query(
      `SELECT DATE_FORMAT(updated_at, '%Y-%m') as month, COUNT(*) as count FROM users WHERE role = 'intern' AND status = 'full-time' GROUP BY month ORDER BY month DESC LIMIT 12`
    );
    res.json({
      applications: totalApplications,
      interns: activeInterns,
      conversions,
      gadaDistribution,
      monthlyApplications,
      monthlyConversions
    });
  } catch (error) {
    next(error);
  }
};

// Send interview invitation email
export const sendInterviewInvite = async (req, res, next) => {
  const { applicationId } = req.params;
  const { interviewDetails } = req.body;

  try {
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const user = await User.findById(application.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await sendEmail({
      to: user.email,
      subject: `Interview Invitation for ${application.jobTitle}`,
      html: `<p>Dear ${user.name},</p>
             <p>You are invited for an interview for the position of <strong>${application.jobTitle}</strong>.</p>
             <p>Details: ${interviewDetails}</p>
             <p>Best regards,<br/>DEBO Engineering</p>`
    });

    res.json({ success: true, message: 'Interview invitation sent successfully' });
  } catch (error) {
    next(error);
  }
};

// Exported 'sendFeedbackEmail' function
export const sendFeedbackEmail = async (req, res, next) => {
  const { applicationId } = req.params;
  const { feedback } = req.body;

  try {
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const user = await User.findById(application.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await sendEmail({
      to: user.email,
      subject: `Feedback for Your Application`,
      html: `<p>Dear ${user.name},</p>
             <p>${feedback}</p>
             <p>Best regards,<br/>DEBO Engineering</p>`
    });

    res.json({ success: true, message: 'Feedback email sent successfully' });
  } catch (error) {
    next(error);
  }
};

export const getInterns = async (req, res, next) => {
  try {
    const interns = await User.findByRole('intern');
    res.json({ success: true, data: interns });
  } catch (error) {
    next(error);
  }
};

export const updateInternStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const [userRows] = await pool.query(
      `SELECT * FROM users WHERE id = ? AND role = 'intern'`,
      [id]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ message: 'Intern not found' });
    }

    await pool.query(
      `UPDATE users SET status = ? WHERE id = ?`,
      [status, id]
    );

    await logAdminAction(req.user.id, 'Update Intern Status', `Changed intern ID ${id} status to ${status}`);

    res.json({
      success: true,
      message: 'Intern status updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validate role
    const validRoles = ['applicant', 'intern', 'admin', 'super-admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    // Prevent demoting the only super-admin
    if (role !== 'super-admin') {
      const [superAdmins] = await pool.query(
        `SELECT * FROM users WHERE role = 'super-admin'`
      );
      if (superAdmins.length === 1 && superAdmins[0].id === parseInt(id)) {
        return res.status(400).json({ message: 'Cannot demote the only super-admin' });
      }
    }

    const [userRows] = await pool.query(
      `SELECT * FROM users WHERE id = ?`,
      [id]
    );
    if (userRows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    await pool.query(
      `UPDATE users SET role = ? WHERE id = ?`,
      [role, id]
    );

    // Log admin action
    await logAdminAction(req.user.id, 'Update User Role', `Changed user ID ${id} role to ${role}`);

    res.json({
      success: true,
      message: 'User role updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const shortlistApplication = async (req, res, next) => {
  try {
    const { id } = req.params;

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.status !== 'under review') {
      return res.status(400).json({ message: 'Only applications under review can be shortlisted' });
    }

    const isUpdated = await Application.updateStatus(id, 'shortlisted');
    if (!isUpdated) {
      return res.status(500).json({ message: 'Failed to shortlist application' });
    }

    res.json({ success: true, message: 'Application shortlisted successfully' });
  } catch (error) {
    next(error);
  }
};

export const readFileSafely = async (req, res, next) => {
  try {
    const filePath = 'C:\\Users\\jerem\\Videos\\debo-engineering-job-portal\\backend\\test\\data\\05-versions-space.pdf';
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    const fileData = fs.readFileSync(filePath);
    res.json({ success: true, data: fileData.toString() });
  } catch (error) {
    next(error);
  }
};

export const updateInternLevelAndStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { experienceLevel, status } = req.body;
    if (!experienceLevel || !status) {
      return res.status(400).json({ message: 'Both experienceLevel and status are required' });
    }
    const updated = await User.updateGadaLevelAndStatus(id, experienceLevel, status);
    if (!updated) {
      return res.status(404).json({ message: 'Intern not found or not updated' });
    }
    await logAdminAction(req.user.id, 'Update Intern Gada Level/Status', `Changed intern ID ${id} to level ${experienceLevel} and status ${status}`);
    res.json({ success: true, message: 'Intern Gada level and status updated successfully' });
  } catch (error) {
    next(error);
  }
};

export const getInternProgressionHistory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const history = await User.getProgressionHistory(id);
    res.json({ history });
  } catch (error) {
    next(error);
  }
};

import { parseResume } from '../utils/resumeParser.js';
import { recommendSkills } from '../utils/aiProfileRecommender.js';

export const getResumeInsights = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!user.resume_path) {
      return res.status(404).json({ message: 'Resume not found for user' });
    }
    const resumeText = await parseResume(`./${user.resume_path}`);
    const extractedSkills = user.skills || [];
    const recommendations = recommendSkills(resumeText, extractedSkills);

    res.status(200).json({
      success: true,
      data: {
        skills: extractedSkills,
        recommendations,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get settings
export const getSettings = async (req, res, next) => {
  try {
    const settings = await Setting.getAll();
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

export const updateSetting = async (req, res, next) => {
  try {
    const { key, value } = req.body;
    if (!key || value === undefined) {
      return res.status(400).json({ message: 'Key and value are required' });
    }
    const updated = await Setting.update(key, value);
    if (!updated) {
      return res.status(500).json({ message: 'Failed to update setting' });
    }
    res.json({ success: true, message: 'Setting updated successfully' });
  } catch (error) {
    next(error);
  }
};

export const addSetting = async (req, res, next) => {
  try {
    const { key, value } = req.body;
    if (!key || value === undefined) {
      return res.status(400).json({ message: 'Key and value are required' });
    }
    // Check if setting already exists
    const existing = await Setting.get(key);
    if (existing !== null) {
      return res.status(409).json({ message: 'Setting already exists' });
    }
    const [result] = await pool.query('INSERT INTO settings (`key`, value) VALUES (?, ?)', [key, value]);
    if (result.affectedRows > 0) {
      res.json({ success: true, message: 'Setting added successfully' });
    } else {
      res.status(500).json({ message: 'Failed to add setting' });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteSetting = async (req, res, next) => {
  try {
    const { key } = req.params;
    if (!key) {
      return res.status(400).json({ message: 'Key is required' });
    }
    const [result] = await pool.query('DELETE FROM settings WHERE `key` = ?', [key]);
    if (result.affectedRows > 0) {
      res.json({ success: true, message: 'Setting deleted successfully' });
    } else {
      res.status(404).json({ message: 'Setting not found' });
    }
  } catch (error) {
    next(error);
  }
};

// Add a function to classify applicants
export const classifyApplicant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { gada_level, internship_type } = req.body;

    const [result] = await pool.query(
      `UPDATE applications SET gada_level = ?, internship_type = ? WHERE id = ?`,
      [gada_level, internship_type, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const updatedApplication = await Application.findById(id);
    res.status(200).json({ success: true, data: updatedApplication });
  } catch (error) {
    next(error);
  }
};

// Add internship status aggregation for admin dashboard
export const getInternshipStatusCounts = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT internship_type, COUNT(*) as count FROM applications GROUP BY internship_type`
    );
    // Format result as { Unpaid: X, Paid: Y, Full-time: Z }
    const counts = {
      Unpaid: 0,
      Paid: 0,
      'Full-time': 0
    };
    rows.forEach(row => {
      if (row.internship_type === 'Unpaid') counts.Unpaid = row.count;
      if (row.internship_type === 'Paid') counts.Paid = row.count;
      if (row.internship_type === 'Full-time') counts['Full-time'] = row.count;
    });
    console.log('Database query result:', rows);
    res.json({ success: true, data: counts });
  } catch (error) {
    next(error);
  }
};

// Classify interns into Gada-based levels
export const classifyIntern = async (req, res, next) => {
  const { userId, experienceLevel, internshipType } = req.body;

  if (!userId || !experienceLevel || !internshipType) {
    return res.status(400).json({ message: 'All fields are required: userId, experienceLevel, internshipType' });
  }

  try {
    const [result] = await pool.query(
      `UPDATE users SET experience_level = ?, status = ? WHERE id = ? AND role = 'intern'`,
      [experienceLevel, internshipType, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Intern not found or update failed' });
    }

    res.json({
      success: true,
      message: `Intern classified as ${experienceLevel} with ${internshipType} internship.`,
    });
  } catch (error) {
    next(error);
  }
};
