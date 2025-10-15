import { updateJobStatus } from '../controllers/jobController.js';
import express from 'express';
import { protect, admin, restrictJobApplication } from '../middlewares/authMiddleware.js';
import { validateJobUpdate } from '../middlewares/validationMiddleware.js';
import { 
  createJob, 
  getJobs,
  getJobById,
  updateJob,
  deleteJob
} from '../controllers/jobController.js';


const router = express.Router();
// PATCH /jobs/:id/status - update job status (admin, recruiter, hr_manager)
router.patch('/:id/status', protect, admin, updateJobStatus);

router.route('/')
  .get(getJobs) // Fetch all jobs
  .post(protect, admin, createJob); // Create a new job

router.route('/:id')
  .get(getJobById)
  .put(protect, admin, validateJobUpdate, updateJob)
  .delete(protect, admin, deleteJob)
  .all((req, res) => {
    res.status(405).json({
      success: false,
      message: `Method ${req.method} not allowed on this route`,
    });
  });

router.route('/:id/apply')
  .post(protect, restrictJobApplication, (req, res) => {
    res.status(200).json({ message: 'Job application submitted successfully' });
  });

export default router;