import pool from '../config/db.js';

class AuditLog {
  static async create({ userId, action, details }) {
    const [result] = await pool.query(
      `INSERT INTO audit_logs (user_id, action, details, created_at) VALUES (?, ?, ?, NOW())`,
      [userId, action, details]
    );
    return result.insertId;
  }

  static async findAll() {
    const [rows] = await pool.query(
      `SELECT id, user_id, action, details, created_at FROM audit_logs ORDER BY created_at DESC`
    );
    return rows;
  }
}

export default AuditLog;
