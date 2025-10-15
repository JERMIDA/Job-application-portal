import mysql from 'mysql2/promise';
import { env } from './env.js';

const pool = mysql.createPool({
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+00:00'
});

// Test connection on startup
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log('Connected to MySQL database');
    conn.release();
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
})();

export default pool;