const db = require('../config/db');

class Product {
  static async findAll() {
    const query = `
      SELECT p.*, i.total_quantity, i.reorder_point
      FROM skus p
      LEFT JOIN inventory i ON p.sku_id = i.sku_id
      ORDER BY p.sku_code
    `;
    const result = await db.query(query);
    return result.rows;
  }

  static async findById(skuId) {
    const query = `
      SELECT p.*, i.total_quantity, i.reorder_point
      FROM skus p
      LEFT JOIN inventory i ON p.sku_id = i.sku_id
      WHERE p.sku_id = $1
    `;
    const result = await db.query(query, [skuId]);
    return result.rows[0];
  }

  static async create(productData) {
    const { sku_code, fabric_type, color, pattern, price_per_meter, created_by } = productData;
    
    // Start a transaction
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');
      
      // Insert into skus table
      const skuQuery = `
        INSERT INTO skus (sku_code, fabric_type, color, pattern, price_per_meter, created_by)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING sku_id
      `;
      const skuValues = [sku_code, fabric_type, color, pattern, price_per_meter, created_by];
      const skuResult = await client.query(skuQuery, skuValues);
      const skuId = skuResult.rows[0].sku_id;
      
      // Insert into inventory table with default values
      const inventoryQuery = `
        INSERT INTO inventory (sku_id, total_quantity, reorder_point)
        VALUES ($1, 0, 10)
      `;
      await client.query(inventoryQuery, [skuId]);
      
      await client.query('COMMIT');
      
      // Return the created product
      return this.findById(skuId);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async update(skuId, productData) {
    const { fabric_type, color, pattern, price_per_meter } = productData;
    
    const query = `
      UPDATE skus
      SET fabric_type = $1, color = $2, pattern = $3, price_per_meter = $4
      WHERE sku_id = $5
      RETURNING *
    `;
    
    const values = [fabric_type, color, pattern, price_per_meter, skuId];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async updateInventory(skuId, quantity, reorderPoint) {
    const query = `
      UPDATE inventory
      SET total_quantity = $1, reorder_point = $2
      WHERE sku_id = $3
      RETURNING *
    `;
    
    const values = [quantity, reorderPoint, skuId];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async delete(skuId) {
    // Start a transaction
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');
      
      // Delete from inventory first (due to foreign key constraint)
      await client.query('DELETE FROM inventory WHERE sku_id = $1', [skuId]);
      
      // Delete from skus
      await client.query('DELETE FROM skus WHERE sku_id = $1', [skuId]);
      
      await client.query('COMMIT');
      return { message: 'Product deleted successfully' };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async getLowStock() {
    const query = `
      SELECT p.*, i.total_quantity, i.reorder_point
      FROM skus p
      JOIN inventory i ON p.sku_id = i.sku_id
      WHERE i.total_quantity <= i.reorder_point
      ORDER BY i.total_quantity
    `;
    const result = await db.query(query);
    return result.rows;
  }
}

module.exports = Product; 