const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');

// All routes are protected
router.use(auth);

// Product routes
router.get('/', productController.getAllProducts);
router.get('/low-stock', productController.getLowStockProducts);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.put('/:id/inventory', productController.updateInventory);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
