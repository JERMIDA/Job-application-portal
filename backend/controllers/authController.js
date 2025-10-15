import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { jwtConfig } from '../config/auth.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { parseResume } from '../utils/resumeParser.js';
import { recommendSkills } from '../utils/aiProfileRecommender.js';
import crypto from 'crypto';
import sendEmail from '../utils/emailService.js';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(process.cwd(), 'uploads', 'resumes');
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${req.user.id}_${Date.now()}${ext}`);
  },
});
export const upload = multer({ storage });

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role = 'applicant' } = req.body; // Default role to 'applicant'

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const user = await User.create({ name, email, password, role });

    const token = jwt.sign({ id: user.id, role: user.role }, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn,
    });

    res
      .cookie(jwtConfig.cookieName, token, jwtConfig.cookieOptions)
      .status(201)
      .json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await User.comparePasswords(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn,
    });

    res.cookie(jwtConfig.cookieName, token, jwtConfig.cookieOptions).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get user profile
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// Update user profile
export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address, education, experience, skills } = req.body;
    let resume_path = null;
    let extractedSkills = null;
    let recommendedSkills = [];

    console.log('UpdateProfile: received skills:', skills);

    if (req.file) {
      resume_path = `/uploads/resumes/${req.file.filename}`;
      try {
        const resumeText = await parseResume(req.file.path);
        extractedSkills = extractSkillsFromText(resumeText);
        recommendedSkills = recommendSkills(resumeText, extractedSkills);
      } catch (error) {
        console.error(`Resume parsing failed: ${error.message}`);
      }
    }

    // Merge user-provided skills and extracted skills (if both exist)
    let mergedSkills = [];
    let userSkillsArr = [];
    if (skills) {
      if (Array.isArray(skills)) {
        userSkillsArr = skills;
      } else if (typeof skills === 'string') {
        try {
          const parsed = JSON.parse(skills);
          if (Array.isArray(parsed)) {
            userSkillsArr = parsed;
          } else {
            userSkillsArr = skills.split(',').map(s => s.trim()).filter(Boolean);
          }
        } catch {
          userSkillsArr = skills.split(',').map(s => s.trim()).filter(Boolean);
        }
      }
    }
    if (extractedSkills && extractedSkills.length > 0) {
      mergedSkills = Array.from(new Set([...userSkillsArr, ...extractedSkills]));
    } else {
      mergedSkills = userSkillsArr;
    }

    const updated = await User.updateProfile(req.user.id, {
      name,
      phone,
      address,
      education,
      experience,
      skills: mergedSkills,
      resume_path,
    });

    console.log('UpdateProfile: update result:', updated);

    if (!updated) {
      return res.status(400).json({ message: 'Failed to update profile' });
    }

    const user = await User.findById(req.user.id);
    console.log('UpdateProfile: updated user skills:', user.skills);

    res.status(200).json({ success: true, user, recommendedSkills });
  } catch (error) {
    next(error);
  }
};

// Forgot Password
export const forgotPassword = async (req, res, next) => {
  try {
    console.log('Forgot password request body:', req.body); // Add this line
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });
    const user = await User.findByEmail(email);
    if (!user) return res.status(200).json({ message: 'If your email exists, a reset link has been sent.' });
    const token = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = Date.now() + 1000 * 60 * 60; // 1 hour
    await User.saveResetToken(user.id, token, tokenExpiry);
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${token}`;
    await sendEmail({
      to: user.email,
      subject: 'Password Reset',
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.</p>`
    });
    res.status(200).json({ message: 'If your email exists, a reset link has been sent.' });
  } catch (error) {
    next(error);
  }
};

// Reset Password
export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ message: 'Token and password are required' });
    const user = await User.findByResetToken(token);
    if (!user || user.reset_token_expiry < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    await User.updatePassword(user.id, password);
    await User.clearResetToken(user.id);
    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    next(error);
  }
};

// Simple skill extraction function: extract keywords from resume text matching a predefined skill list
function extractSkillsFromText(text) {
  if (!text) return [];
  const skillsList = ['JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'SQL', 'AWS', 'Docker', 'Kubernetes'];
  const foundSkills = [];
  const lowerText = text.toLowerCase();
  for (const skill of skillsList) {
    if (lowerText.includes(skill.toLowerCase())) {
      foundSkills.push(skill);
    }
  }
  return foundSkills;
  
}
