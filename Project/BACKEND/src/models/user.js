const db = require('../config/db');
const bcrypt = require('bcryptjs');

const VALID_ROLES = ['ADMIN', 'SALES_STAFF', 'INVENTORY_STAFF'];

class User {
  static async findByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = $1';
    const result = await db.query(query, [username]);
    return result.rows[0];
  }

  static async countAdmins() {
    const query = 'SELECT COUNT(*) as count FROM users WHERE role = $1';
    const result = await db.query(query, ['ADMIN']);
    return parseInt(result.rows[0].count);
  }

  static async create(userData) {
    const { username, full_name, email, password, role } = userData;
    
    // Validate role
    if (!VALID_ROLES.includes(role)) {
      throw new Error(`Invalid role. Must be one of: ${VALID_ROLES.join(', ')}`);
    }
    
    // Check for admin limit
    if (role === 'ADMIN') {
      const adminCount = await this.countAdmins();
      if (adminCount > 0) {
        throw new Error('Only one admin user is allowed in the system');
      }
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    
    const query = `
      INSERT INTO users (username, full_name, email, password_hash, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING user_id, username, full_name, email, role
    `;
    
    const values = [username, full_name, email, password_hash, role];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async updateProfile(userId, userData) {
    const { full_name, email, role } = userData;
    
    // If role is being updated, validate it
    if (role) {
      if (!VALID_ROLES.includes(role)) {
        throw new Error(`Invalid role. Must be one of: ${VALID_ROLES.join(', ')}`);
      }

      // Check current user role
      const currentUser = await db.query('SELECT role FROM users WHERE user_id = $1', [userId]);
      const isCurrentlyAdmin = currentUser.rows[0]?.role === 'ADMIN';
      
      // If changing to admin, check admin limit
      if (!isCurrentlyAdmin && role === 'ADMIN') {
        const adminCount = await this.countAdmins();
        if (adminCount > 0) {
          throw new Error('Only one admin user is allowed in the system');
        }
      }
      
      // Prevent removing the last admin
      if (isCurrentlyAdmin && role !== 'ADMIN') {
        const adminCount = await this.countAdmins();
        if (adminCount <= 1) {
          throw new Error('Cannot remove the last admin from the system');
        }
      }
    }
    
    const query = `
      UPDATE users
      SET full_name = $1, 
          email = $2
          ${role ? ', role = $4' : ''}
      WHERE user_id = $3
      RETURNING user_id, username, full_name, email, role
    `;
    
    const values = [full_name, email, userId];
    if (role) values.push(role);
    
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async changePassword(userId, currentPassword, newPassword) {
    // Get user with current password
    const userQuery = 'SELECT password_hash FROM users WHERE user_id = $1';
    const userResult = await db.query(userQuery, [userId]);
    const user = userResult.rows[0];
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      throw new Error('Current password is incorrect');
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(newPassword, salt);
    
    // Update password
    const updateQuery = 'UPDATE users SET password_hash = $1 WHERE user_id = $2';
    await db.query(updateQuery, [password_hash, userId]);
    
    return { message: 'Password updated successfully' };
  }
}

module.exports = User; 