const bcrypt = require('bcryptjs');
const db = require('./src/config/db');

async function updateUserPassword() {
  try {
    const password = 'password123';
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const query = `
      UPDATE users 
      SET password_hash = ?
      WHERE username = ?
    `;

    const values = [password_hash, 'test_user'];
    const result = await db.query(query, values);

    if (result.affectedRows === 0) {
      console.log('User not found');
    } else {
      const user = await db.query(
        `SELECT user_id, username, full_name, email, role FROM users WHERE username = ?`,
        ['test_user']
      );
      console.log('User password updated successfully:', user[0]);
    }
    process.exit(0);
  } catch (error) {
    console.error('Error updating user:', error);
    process.exit(1);
  }
}

updateUserPassword();
