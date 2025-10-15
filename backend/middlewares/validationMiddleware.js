import { body, validationResult } from 'express-validator';

export const validateJobCreation = [
  body('title').notEmpty().withMessage('Job title is required'),
  body('description').notEmpty().withMessage('Job description is required'),
  body('experienceLevel').notEmpty().withMessage('Experience level is required'),
  body('deadline').isISO8601().withMessage('Valid application deadline is required'),
  body('requirements').isArray({ min: 1 }).withMessage('At least one requirement is required'),
  body('responsibilities').isArray({ min: 1 }).withMessage('At least one responsibility is required'),
  body('benefits').isArray({ min: 1 }).withMessage('At least one benefit is required'),
  body('skills').isArray({ min: 1 }).withMessage('At least one skill is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const validateApplicationCreation = [
  body('jobId').optional().isInt().withMessage('Valid job ID is required'),
  body('job_id').optional().isInt().withMessage('Valid job ID is required'),
  body('experienceLevel').optional().isString(),
  body('skills').optional().isArray(),
  body('education').optional().isString(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const validateJobUpdate = [
  body('requirements').optional().isArray().withMessage('Requirements must be an array'),
  body('responsibilities').optional().isArray().withMessage('Responsibilities must be an array'),
  body('benefits').optional().isArray().withMessage('Benefits must be an array'),
  body('skills').optional().isArray().withMessage('Skills must be an array'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
