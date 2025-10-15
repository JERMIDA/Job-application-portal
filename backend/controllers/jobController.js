// Update only the status of a job (admin/recruiter/HR only)
export const updateJobStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowedStatuses = ['active', 'closed', 'archived'];
    if (!id) {
      return res.status(400).json({ message: 'Job ID is required' });
    }
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid or missing status' });
    }
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    const updatedJob = await Job.update(id, { status });
    res.json({
      success: true,
      data: updatedJob,
    });
  } catch (error) {
    next(error);
  }
};
import Job from '../models/Job.js';
import pool from '../config/db.js';

export const createJob = async (req, res, next) => {
  try {
    // Normalize keys for frontend/backend compatibility
    const body = {
      ...req.body,
      minGadaLevel: req.body.minGadaLevel || req.body.min_gada_level,
      isInternship: req.body.isInternship ?? req.body.is_internship,
      applicationDeadline: req.body.applicationDeadline || req.body.deadline,
      requirements: req.body.requirements || [],
      responsibilities: req.body.responsibilities || [],
      benefits: req.body.benefits || [],
      skills: req.body.skills || [],
    };
    // DEBO-specific validation
    if (body.isInternship && !body.minGadaLevel) {
      return res.status(400).json({ 
        message: 'Minimum Gada level is required for internships' 
      });
    }

    Job.validateJobData({ skills: body.skills, experienceLevel: body.experienceLevel });

    const job = await Job.create({
      ...body,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      data: job
    });
  } catch (error) {
    next(error);
  }
};

export const getJobs = async (req, res, next) => {
  try {
    let query = 'SELECT * FROM jobs';
    const params = [];
    const { type, experienceLevel, isInternship, skills, category, status } = req.query;

    // Helper to add WHERE/AND
    const addWhereOrAnd = () => (params.length === 0 && !query.includes('WHERE')) ? ' WHERE ' : ' AND ';

    if (type) {
      query += addWhereOrAnd() + 'type = ?';
      params.push(type);
    }

    if (experienceLevel) {
      query += addWhereOrAnd() + 'experience_level = ?';
      params.push(experienceLevel);
    }

    if (isInternship === 'true') {
      query += addWhereOrAnd() + 'is_internship = TRUE';
    }

    if (category) {
      query += addWhereOrAnd() + 'category = ?';
      params.push(category);
    }

    if (skills) {
      query += addWhereOrAnd() + 'JSON_CONTAINS(skills, ?)';
      params.push(JSON.stringify(skills.split(',')));
    }

    if (status) {
      query += addWhereOrAnd() + 'status = ?';
      params.push(status);
    }

    const [jobs] = await pool.query(query, params);

    const jobsWithApplicantCounts = await Promise.all(
      jobs.map(async (job) => {
        const applicantCount = await Job.countApplicants(job.id);
        return { ...job, applicantCount };
      })
    );

    res.json({
      success: true,
      count: jobs.length,
      data: jobsWithApplicantCounts,
    });
  } catch (error) {
    next(error);
  }
};

export const getJobById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'Job ID is required' });
    }
    
    const job = await Job.findById(id);
    console.log('getJobById - Job.findById result:', job);
    if (!job) {
      console.log('getJobById - Job not found for id:', id);
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    console.error('getJobById - Error:', error);
    next(error);
  }
};

export const editJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!id) {
      return res.status(400).json({ message: 'Job ID is required' });
    }

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Normalize update fields for database
    const updateFields = { ...updates };
    if (updateFields.minGadaLevel !== undefined) {
      updateFields.min_gada_level = updateFields.minGadaLevel;
      delete updateFields.minGadaLevel;
    }
    // Remove any fields not present in the jobs table
    delete updateFields.internshipDuration;
    delete updateFields.stipendRange;
    await pool.query('UPDATE jobs SET ? WHERE id = ?', [updateFields, id]);

    const updatedJob = await Job.findById(id);

    res.status(200).json({
      success: true,
      data: updatedJob,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { force } = req.query;

    if (!id) {
      return res.status(400).json({ message: 'Job ID is required' });
    }

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (force === 'true') {
      await Job.delete(id);
      return res.json({
        success: true,
        message: 'Job permanently deleted',
      });
    } else {
      // Soft delete: set status to archived
      const updatedJob = await Job.update(id, { status: 'archived' });
      return res.json({
        success: true,
        message: 'Job archived (status set to archived)',
        data: updatedJob,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getJobsWithApplicantCount = async (req, res, next) => {
  try {
    const query = `
      SELECT j.*, COUNT(a.id) AS applicantCount
      FROM jobs j
      LEFT JOIN applications a ON a.job_id = j.id
      GROUP BY j.id
    `;
    const [jobs] = await pool.query(query);
    res.json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

export const updateJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!id) {
      return res.status(400).json({ message: 'Job ID is required' });
    }

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const updatedJob = await Job.update(id, updates);

    res.json({
      success: true,
      data: updatedJob,
    });
  } catch (error) {
    next(error);
  }
};
