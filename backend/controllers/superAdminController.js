import pool from '../config/db.js';

export const getSettings = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM settings');
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const { key, value } = req.body;
    await pool.query('UPDATE settings SET value = ? WHERE key = ?', [value, key]);
    res.status(200).json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    next(error);
  }
};
