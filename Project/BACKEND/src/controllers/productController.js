const db = require('../config/db');

// Helper functions inside Product model can be replaced by direct queries here or imported from your Product model.
// For simplicity, I'll show direct queries here.

exports.getAllProducts = async (req, res) => {
  try {
    const [products] = await db.query('SELECT * FROM products ORDER BY created_at DESC');
    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products WHERE product_id = ?', [req.params.id]);
    const product = rows[0];
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      quantity,
      reorder_point
    } = req.body;

    const created_by = req.user.id;

    const insertQuery = `
      INSERT INTO products (name, description, price, quantity, reorder_point, created_by, created_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;

    const [result] = await db.query(insertQuery, [
      name,
      description,
      price,
      quantity,
      reorder_point,
      created_by
    ]);

    const [newProductRows] = await db.query('SELECT * FROM products WHERE product_id = ?', [result.insertId]);

    res.status(201).json({ success: true, data: newProductRows[0] });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const fields = [];
    const values = [];

    // Only update provided fields
    ['name', 'description', 'price', 'quantity', 'reorder_point'].forEach(field => {
      if (req.body[field] !== undefined) {
        fields.push(`${field} = ?`);
        values.push(req.body[field]);
      }
    });

    if (fields.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }

    values.push(productId);

    const updateQuery = `UPDATE products SET ${fields.join(', ')} WHERE product_id = ?`;
    const [result] = await db.query(updateQuery, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const [updatedRows] = await db.query('SELECT * FROM products WHERE product_id = ?', [productId]);
    res.json({ success: true, data: updatedRows[0] });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateInventory = async (req, res) => {
  try {
    const { quantity, reorder_point } = req.body;
    const productId = req.params.id;

    const updateQuery = `UPDATE products SET quantity = ?, reorder_point = ? WHERE product_id = ?`;
    const [result] = await db.query(updateQuery, [quantity, reorder_point, productId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const [updatedRows] = await db.query('SELECT * FROM products WHERE product_id = ?', [productId]);
    res.json({ success: true, data: updatedRows[0] });
  } catch (error) {
    console.error('Update inventory error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM products WHERE product_id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getLowStockProducts = async (req, res) => {
  try {
    const query = `
      SELECT * FROM products
      WHERE quantity <= reorder_point
      ORDER BY quantity ASC
    `;
    const [products] = await db.query(query);
    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Get low stock products error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
