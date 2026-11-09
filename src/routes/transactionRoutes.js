
const express = require('express');
const authenticate = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const {
    getFreelancerIncome
} = require('../controllers/TransactionController');

const router = express.Router();
router.get(
    '/income',
    authenticate,
    authorizeRoles('freelancer'),
    getFreelancerIncome
);
module.exports = router;
