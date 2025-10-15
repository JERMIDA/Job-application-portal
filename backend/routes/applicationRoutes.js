import express from 'express';
import { protect, admin } from '../middlewares/authMiddleware.js';
import { createApplication, getApplicationById, getUserApplications, updateApplicationStatus, trackApplicationStatus, getApplicationsByJob, classifyIntern } from '../controllers/applicationController.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Multer setup for resume upload
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
const upload = multer({ storage });

router.route('/')
  .post(protect, upload.single('resume'), createApplication)
  .get(protect, getUserApplications); // <-- This line is needed

router.route('/:id')
  .get(protect, getApplicationById)
  .patch(protect, updateApplicationStatus);

router.get('/:id/status', protect, trackApplicationStatus);

router.get('/job/:jobId', protect, admin, getApplicationsByJob);

router.get('/interns/:id/classify', admin, classifyIntern); // Classify interns

export default router;
