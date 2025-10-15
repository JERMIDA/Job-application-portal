import pool from '../config/db.js';

export const getEmailTemplates = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM email_templates');
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
};

export const createEmailTemplate = async (req, res, next) => {
  try {
    const { name, subject, body } = req.body;
    if (!name || !subject || !body) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    await pool.query('INSERT INTO email_templates (name, subject, body) VALUES (?, ?, ?)', [name, subject, body]);
    res.status(201).json({ success: true, message: 'Template created' });
  } catch (error) {
    next(error);
  }
};

export const updateEmailTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, subject, body } = req.body;
    await pool.query('UPDATE email_templates SET name=?, subject=?, body=? WHERE id=?', [name, subject, body, id]);
    res.json({ success: true, message: 'Template updated' });
  } catch (error) {
    next(error);
  }
};

export const deleteEmailTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM email_templates WHERE id=?', [id]);
    res.json({ success: true, message: 'Template deleted' });
  } catch (error) {
    next(error);
  }
};
