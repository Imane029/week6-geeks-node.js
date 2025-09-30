const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// Register
router.post('/register', UserController.register);

// Login
router.post('/login', UserController.login);

// Get all users
router.get('/', UserController.getAll);

// Get user by id
router.get('/:id', UserController.getById);

// Update user
router.put('/:id', UserController.update);

module.exports = router;
