const db = require('../config/db');
const bcrypt = require('bcryptjs');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const query = `
      SELECT user_id, username, full_name, email, role, created_at, last_login
      FROM users
      ORDER BY created_at DESC
    `;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new user
// @route   POST /api/admin/users
// @access  Private/Admin
exports.createUser = async (req, res) => {
  try {
    const { username, full_name, email, password, role } = req.body;

    if (!username || !full_name || !email || !password || !role) {
      return res.status(400).json({
        message: 'All fields are required',
        details: {
          username: !username ? 'Username is required' : null,
          full_name: !full_name ? 'Full name is required' : null,
          email: !email ? 'Email is required' : null,
          password: !password ? 'Password is required' : null,
          role: !role ? 'Role is required' : null
        }
      });
    }

    // Check if username already exists
    const [existingUsers] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Insert new user
    const insertQuery = `
      INSERT INTO users (username, full_name, email, password_hash, role)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(insertQuery, [username, full_name, email, password_hash, role]);

    // Return the created user
    const [newUserRows] = await db.query('SELECT user_id, username, full_name, email, role FROM users WHERE user_id = ?', [result.insertId]);
    res.status(201).json(newUserRows[0]);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, fullName, email, password, role } = req.body;

    const [userRows] = await db.query('SELECT * FROM users WHERE user_id = ?', [id]);
    if (userRows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const fields = [];
    const values = [];

    if (username) {
      fields.push('username = ?');
      values.push(username);
    }
    if (fullName) {
      fields.push('full_name = ?');
      values.push(fullName);
    }
    if (email) {
      fields.push('email = ?');
      values.push(email);
    }
    if (role) {
      fields.push('role = ?');
      values.push(role);
    }
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);
      fields.push('password_hash = ?');
      values.push(password_hash);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    const updateQuery = `UPDATE users SET ${fields.join(', ')} WHERE user_id = ?`;
    values.push(id);

    await db.query(updateQuery, values);

    const [updatedUserRows] = await db.query('SELECT user_id, username, full_name, email, role FROM users WHERE user_id = ?', [id]);
    res.json(updatedUserRows[0]);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const { id } = req.params;

    const [userRows] = await connection.query('SELECT * FROM users WHERE user_id = ?', [id]);
    if (userRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'User not found' });
    }

    const [skuCountRows] = await connection.query('SELECT COUNT(*) AS count FROM skus WHERE created_by = ?', [id]);
    const skuCount = skuCountRows[0].count;

    if (skuCount > 0) {
      const [adminRows] = await connection.query('SELECT user_id FROM users WHERE role = ? AND user_id != ? LIMIT 1', ['STORE_MANAGER', id]);
      if (adminRows.length === 0) {
        await connection.rollback();
        return res.status(409).json({
          message: 'Cannot delete user as they have created products and no other admin is available to transfer them to',
          code: '23503'
        });
      }

      const adminId = adminRows[0].user_id;

      // Reassign SKUs to admin
      await connection.query('UPDATE skus SET created_by = ? WHERE created_by = ?', [adminId, id]);
    }

    // Delete user
    await connection.query('DELETE FROM users WHERE user_id = ?', [id]);

    await connection.commit();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Delete user error:', error);
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({
        message: 'Cannot delete user as they have created products in the system',
        code: error.code,
        detail: error.sqlMessage
      });
    }
    res.status(500).json({ message: 'Server error' });
  } finally {
    connection.release();
  }
};
