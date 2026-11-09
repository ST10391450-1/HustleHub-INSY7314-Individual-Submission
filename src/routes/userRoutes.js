const express = require('express');

const authenticate = require('../middleware/authMiddleware');
const { getMe } = require('../controllers/UserController');

const router = express.Router();

router.get('/me', authenticate, getMe);

module.exports = router;