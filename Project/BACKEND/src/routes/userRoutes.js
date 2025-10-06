const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// All routes are protected and require admin role
router.use(auth);

// Admin routes
router.get('/admin/users', userController.getAllUsers);
router.post('/admin/users', userController.createUser);
router.put('/admin/users/:id', userController.updateUser);
router.delete('/admin/users/:id', userController.deleteUser);

module.exports = router; 