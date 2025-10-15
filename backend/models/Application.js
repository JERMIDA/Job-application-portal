import pool from '../config/db.js';

class Application {
  static async create({
    userId,
    jobId,
    resumePath,
    coverLetter,
    experienceLevel,
    skills,
    education,
    gadaLevel = 'Beginner',
    internshipType = 'Unpaid'
  }) {
    const [result] = await pool.query(
      `INSERT INTO applications SET ?`,
      {
        user_id: userId,
        job_id: jobId,
        resume_path: resumePath,
        cover_letter: coverLetter,
        experience_level: experienceLevel,
        skills: JSON.stringify(skills), // store as JSON
        education,
        gada_level: gadaLevel,
        internship_type: internshipType,
        status: 'submitted'
      }
    );
    return this.findById(result.insertId);
  }

  static async findByUserAndJob(userId, jobId) {
    const [rows] = await pool.query(
      `SELECT a.*, j.title as job_title, j.is_internship
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       WHERE a.user_id = ? AND a.job_id = ?`,
      [userId, jobId]
    );
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await pool.query(
      `SELECT a.*, 
       u.name as user_name, u.email as user_email,
       j.title as job_title, j.is_internship
       FROM applications a
       JOIN users u ON a.user_id = u.id
       JOIN jobs j ON a.job_id = j.id
       WHERE a.id = ?`,
      [id]
    );
    // Parse interview_info if present
    if (rows[0] && rows[0].interview_info) {
      try { rows[0].interview_info = JSON.parse(rows[0].interview_info); } catch { /* ignore parse error */ }
    }
    return rows[0];
  }

  static async updateStatus(id, status) {
    // Fetch current statusHistory
    const [rows] = await pool.query(
      `SELECT status_history FROM applications WHERE id = ?`, [id]
    );
    let history = [];
    if (rows[0] && rows[0].status_history) {
      try { history = JSON.parse(rows[0].status_history); } catch (e) {console.error(e);}
    }
    history.push({ status, date: new Date().toISOString() });
    const [result] = await pool.query(
      `UPDATE applications SET status = ?, status_history = ? WHERE id = ?`,
      [status, JSON.stringify(history), id]
    );
    return result.affectedRows > 0;
  }

  static async findByJobId(jobId) {
    const [rows] = await pool.query(
      `SELECT a.*, u.name as user_name, u.email as user_email
       FROM applications a
       JOIN users u ON a.user_id = u.id
       WHERE a.job_id = ?`,
      [jobId]
    );
    return rows;
  }
}

export default Application;