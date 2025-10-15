import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/auth.js';
import { USER_ROLES } from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.cookies?.[jwtConfig.cookieName]) {
    token = req.cookies[jwtConfig.cookieName];
  } else if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized to access this route' });
  }

  try {
    const decoded = jwt.verify(token, jwtConfig.secret);
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};


// Accepts admin, recruiter, hr_manager, or super-admin
export const admin = (req, res, next) => {
  const allowed = [USER_ROLES.ADMIN, USER_ROLES.RECRUITER, USER_ROLES.HR_MANAGER, USER_ROLES.SUPER_ADMIN];
  if (!allowed.includes(req.user?.role)) {
    return res.status(403).json({ message: 'Not authorized as admin or HR' });
  }
  next();
};


export const superAdmin = (req, res, next) => {
  if (req.user?.role !== USER_ROLES.SUPER_ADMIN) {
    return res.status(403).json({ message: 'Not authorized as super admin' });
  }
  next();
};


// Flexible role-based access for any combination of roles
export const roleBasedAccess = (roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return res.status(403).json({ message: 'Not authorized for this role' });
  }
  next();
};


export const restrictJobApplication = (req, res, next) => {
  // Only applicants and interns can apply
  const forbidden = [USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.RECRUITER, USER_ROLES.HR_MANAGER];
  if (forbidden.includes(req.user?.role)) {
    return res.status(403).json({ message: 'Only applicants and interns can apply for jobs' });
  }
  next();
};