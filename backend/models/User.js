import pool from '../config/db.js';
import bcrypt from 'bcrypt';

// User roles
export const USER_ROLES = {
  APPLICANT: 'applicant',
  INTERN: 'intern',
  RECRUITER: 'recruiter',
  HR_MANAGER: 'hr_manager',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super-admin',
};

class User {
  static async create({ name, email, password, role = USER_ROLES.APPLICANT, phone, address, education, experience, skills, resume_path }) {
    const hashedPassword = await bcrypt.hash(password, 12);
    const [result] = await pool.query(
  `INSERT INTO users (name, email, password, role, phone, address, education, experience, skills, resume_path) 
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  [name, email, hashedPassword, role, phone || null, address || null, education || null, experience || null, skills ? JSON.stringify(skills) : null, resume_path || null]
    );
    return this.findById(result.insertId);
  }

  static async findByEmail(email) {
    const [rows] = await pool.query(
      `SELECT * FROM users WHERE email = ?`,
      [email]
    );
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await pool.query(
      `SELECT id, name, email, role, experience_level, status, phone, address, education, experience, skills, resume_path
       FROM users WHERE id = ?`,
      [id]
    );
    if (rows[0] && rows[0].skills) {
      rows[0].skills = JSON.parse(rows[0].skills);
    }
    return rows[0];
  }

  static async findByRole(role) {
    const [rows] = await pool.query(
      `SELECT id, name, email, role, experience_level, status, phone, address, education, experience, skills, resume_path
       FROM users WHERE role = ?`,
      [role]
    );
    rows.forEach(row => {
      if (row.skills) {
        row.skills = JSON.parse(row.skills);
      }
    });
    return rows;
  }

  static async updateProfile(id, { name, phone, address, education, experience, skills, resume_path }) {
    // Defensive: always ensure skills is an array
    let skillsArr = [];
    if (Array.isArray(skills)) {
      skillsArr = skills.filter(s => s && s.toString().trim() !== '');
    } else if (typeof skills === 'string') {
      try {
        const parsed = JSON.parse(skills);
        if (Array.isArray(parsed)) {
          skillsArr = parsed.filter(s => s && s.toString().trim() !== '');
        } else {
          skillsArr = skills.split(',').map(s => s.trim()).filter(Boolean);
        }
      } catch {
        skillsArr = skills.split(',').map(s => s.trim()).filter(Boolean);
      }
    }
    const skillsStr = skillsArr.length > 0 ? JSON.stringify(skillsArr) : null;
    const [result] = await pool.query(
      `UPDATE users SET name = ?, phone = ?, address = ?, education = ?, experience = ?, skills = ?, resume_path = ? WHERE id = ?`,
      [name, phone, address, education, experience, skillsStr, resume_path, id]
    );
    return result.affectedRows > 0;
  }

  static async updateGadaLevelAndStatus(id, experienceLevel, status) {
    const [result] = await pool.query(
      `UPDATE users SET experience_level = ?, status = ? WHERE id = ? AND role = 'intern'`,
      [experienceLevel, status, id]
    );
    return result.affectedRows > 0;
  }

  static async comparePasswords(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }

  static async getProgressionHistory(id) {
    const [rows] = await pool.query(
      `SELECT progression_history FROM users WHERE id = ?`, [id]
    );
    if (rows[0] && rows[0].progression_history) {
      try { return JSON.parse(rows[0].progression_history); } catch (e) {console.error(e);}
    }
    return [];
  }

  static async saveResetToken(id, token, expiry) {
    await pool.query(
      'UPDATE users SET reset_token=?, reset_token_expiry=? WHERE id=?',
      [token, expiry, id]
    );
  }

  static async findByResetToken(token) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE reset_token=?',
      [token]
    );
    return rows[0];
  }

  static async updatePassword(id, password) {
    const hashedPassword = await bcrypt.hash(password, 12);
    await pool.query(
      'UPDATE users SET password=? WHERE id=?',
      [hashedPassword, id]
    );
  }

  static async clearResetToken(id) {
    await pool.query(
      'UPDATE users SET reset_token=NULL, reset_token_expiry=NULL WHERE id=?',
      [id]
    );
  }
}

export default User;
