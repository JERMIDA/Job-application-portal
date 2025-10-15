import pool from '../config/db.js';

class Job {
  static async countApplicants(jobId) {
    const [rows] = await pool.query(
      `SELECT COUNT(*) as applicantCount FROM applications WHERE job_id = ?`,
      [jobId]
    );
    return rows[0]?.applicantCount || 0;
  }

  static validateJobData({ skills, experienceLevel }) {
    if (!Array.isArray(skills)) {
      throw new Error('Skills must be an array');
    }
    if (typeof experienceLevel !== 'string') {
      throw new Error('Experience level must be a string');
    }
  }

  static async create({
    title,
    description,
    requirements,
    responsibilities,
    benefits,
    location,
    type,
    experienceLevel,
    deadline,
    isInternship,
    minGadaLevel,
    internshipDuration,
    stipendRange,
    category,
    skills,
    createdBy,
    status = 'active' // default to active
  }) {
    if (!title || !description || !location || !type || !experienceLevel || !skills || skills.length === 0) {
      throw new Error('All required fields must be provided.');
    }

    this.validateJobData({ skills, experienceLevel });

    const [result] = await pool.query(
      `INSERT INTO jobs SET ?`,
      {
        title,
        description,
        requirements: JSON.stringify(requirements),
        responsibilities: JSON.stringify(responsibilities),
        benefits: JSON.stringify(benefits),
        location,
        type,
        experience_level: experienceLevel,
        deadline,
        is_internship: isInternship,
        min_gada_level: minGadaLevel,
        internship_duration: internshipDuration,
        stipend_range: stipendRange,
        category,
        skills: JSON.stringify(skills),
        created_by: createdBy,
        status
      }
    );
    return this.findById(result.insertId);
  }

  static async findById(id) {
    if (!id) {
      throw new Error('Job ID is required.');
    }

    const jobId = parseInt(id, 10);
    if (!Number.isFinite(jobId) || jobId <= 0) {
      throw new Error(`Invalid Job ID: ${id}`);
    }

  const sql = `SELECT *, 
     JSON_UNQUOTE(requirements) as requirements,
     JSON_UNQUOTE(responsibilities) as responsibilities,
     JSON_UNQUOTE(benefits) as benefits,
     JSON_UNQUOTE(skills) as skills,
     status
     FROM jobs WHERE id = ?`;
    const [rows] = await pool.query(sql, [jobId]);
    if (rows.length === 0) {
      throw new Error(`Job with ID ${jobId} not found.`);
    }
    return rows[0];
  }

  static async update(id, updates) {
    if (!id) {
      throw new Error('Job ID is required.');
    }

    const jobId = parseInt(id, 10);
    if (!Number.isFinite(jobId) || jobId <= 0) {
      throw new Error(`Invalid Job ID: ${id}`);
    }

    // Map camelCase keys to snake_case for database compatibility
    const mappedUpdates = Object.entries(updates).reduce((acc, [key, value]) => {
      const dbKey = key === 'experienceLevel' ? 'experience_level'
                  : key === 'isInternship' ? 'is_internship'
                  : key === 'minGadaLevel' ? 'min_gada_level'
                  : key === 'internshipDuration' ? 'internship_duration'
                  : key === 'stipendRange' ? 'stipend_range'
                  : key === 'status' ? 'status'
                  : key;

      // Serialize JSON fields
      if (['requirements', 'responsibilities', 'benefits', 'skills'].includes(dbKey) && Array.isArray(value)) {
        acc[dbKey] = JSON.stringify(value);
      } else {
        acc[dbKey] = value;
      }

      return acc;
    }, {});

    const [result] = await pool.query(
      `UPDATE jobs SET ? WHERE id = ?`,
      [mappedUpdates, jobId]
    );

    if (result.affectedRows === 0) {
      throw new Error(`Job with ID ${jobId} not found or no changes made.`);
    }

    return this.findById(jobId);
  }

  static async delete(id, force = false) {
    if (!id) {
      throw new Error('Job ID is required.');
    }

    const jobId = parseInt(id, 10);
    if (!Number.isFinite(jobId) || jobId <= 0) {
      throw new Error(`Invalid Job ID: ${id}`);
    }

    if (force) {
      const [result] = await pool.query(
        `DELETE FROM jobs WHERE id = ?`,
        [jobId]
      );
      if (result.affectedRows === 0) {
        throw new Error(`Job with ID ${jobId} not found.`);
      }
      return { success: true, message: `Job with ID ${jobId} permanently deleted.` };
    } else {
      // Soft delete: set status to archived
      const [result] = await pool.query(
        `UPDATE jobs SET status = 'archived' WHERE id = ?`,
        [jobId]
      );
      if (result.affectedRows === 0) {
        throw new Error(`Job with ID ${jobId} not found.`);
      }
      return { success: true, message: `Job with ID ${jobId} archived (status set to archived).` };
    }
  }
}

export default Job;
