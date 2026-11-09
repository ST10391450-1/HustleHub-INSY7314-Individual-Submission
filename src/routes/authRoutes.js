const express = require('express');
const allowFields = require('../middleware/allowFields');

const {
    register,
    login
} = require('../controllers/AuthController');

const {
    registerValidator,
    loginValidator,
    validateRequest
} = require('../validators/authValidators');

const router = express.Router();

//region Authentication Endpoints

router.post(
    '/register',
    allowFields(['fullName', 'email', 'password', 'role']),
    registerValidator,
    validateRequest,
    register
);

router.post(
    '/login',
    allowFields(['email', 'password']),
    loginValidator,
    validateRequest,
    login
);

//endregion

module.exports = router;