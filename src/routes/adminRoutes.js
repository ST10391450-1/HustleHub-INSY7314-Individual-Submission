
const express = require('express');
const authenticate = require('../middleware/authMiddleware');
const {
    USER_ROLES,
    authorizeRoles
} = require('../middleware/roleMiddleware');

const router = express.Router();
router.get(
    '/dashboard',
    authenticate,
    authorizeRoles(USER_ROLES.ADMIN),
    (req, res) => {
        return res.status(200).json({
            success: true,
            message: 'Administrator access granted.'
        });
    }
);

module.exports = router;