const bcrypt = require('bcryptjs');
const db = require('./src/config/db');

// Create or update an ADMIN user safely. Supports env overrides for credentials.
(async () => {
  try {
    const username = process.env.ADMIN_USERNAME || 'admin';
    const full_name = process.env.ADMIN_FULL_NAME || 'System Admin';
    const email = process.env.ADMIN_EMAIL || 'admin@example.com';
    const password = process.env.ADMIN_PASSWORD || 'Admin@123';
    const role = 'ADMIN';

    const [existing] = await db.query('SELECT user_id FROM users WHERE username = ?', [username]);

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    if (existing.length > 0) {
      const userId = existing[0].user_id;
      await db.query(
        'UPDATE users SET full_name = ?, email = ?, password_hash = ?, role = ? WHERE user_id = ?',
        [full_name, email, password_hash, role, userId]
      );
      const [rows] = await db.query('SELECT user_id, username, full_name, email, role FROM users WHERE user_id = ?', [userId]);
      console.log('Admin user updated:', rows[0]);
    } else {
      const insertSql = `
        INSERT INTO users (username, full_name, email, password_hash, role, created_at)
        VALUES (?, ?, ?, ?, ?, NOW())
      `;
      const [result] = await db.query(insertSql, [username, full_name, email, password_hash, role]);
      const [rows] = await db.query('SELECT user_id, username, full_name, email, role FROM users WHERE user_id = ?', [result.insertId]);
      console.log('Admin user created:', rows[0]);
    }
  } catch (e) {
    console.error('Error creating/updating admin:', e);
    process.exitCode = 1;
  } finally {
    await db.pool.end();
  }
})();