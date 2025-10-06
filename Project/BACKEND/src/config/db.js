const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'crams',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to MySQL database');
    connection.release();
  } catch (err) {
    console.error('Error connecting to MySQL:', err.message);
  }
})();

module.exports = {
  // Return the native mysql2 shape so callers can destructure: const [rows] = await db.query(...)
  query: async (text, params) => {
    return pool.query(text, params);
  },
  // Provide a helper for transactional work: const conn = await db.getConnection()
  getConnection: async () => {
    return pool.getConnection();
  },
  pool
};
