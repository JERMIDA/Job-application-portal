import pool from '../config/db.js';

class Setting {
  static async getAll() {
    const [rows] = await pool.query('SELECT * FROM settings');
    return rows;
  }

  static async get(key) {
    const [rows] = await pool.query('SELECT value FROM settings WHERE `key` = ?', [key]);
    if (rows.length === 0) return null;
    return rows[0].value;
  }

  static async update(key, value) {
    const [result] = await pool.query(
      'INSERT INTO settings (`key`, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = ?',
      [key, value, value]
    );
    return result.affectedRows > 0;
  }
}

export default Setting;
