const express = require('express');

const authenticate = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const allowFields = require('../middleware/allowFields');

const {
    getActiveGigs,
    getMyGigs,
    getGigById,
    createGig,
    updateGig,
    deleteGig
} = require('../controllers/GigController');

const {
    createGigValidator,
    updateGigValidator,
    gigIdValidator,
    validateGigRequest
} = require('../validators/gigValidators');

const { authLimiter } = require('../middleware/rateLimiters');

const router = express.Router();

router.get('/', getActiveGigs);
router.get('/mine',
    authenticate,
    authorizeRoles('freelancer'),
    getMyGigs
);

router.get('/:id',
    gigIdValidator,
    validateGigRequest,
    getGigById
);

router.post('/',
    authenticate,
    authorizeRoles('freelancer'),
    authLimiter,
    allowFields([
        'title',
        'description',
        'category',
        'price',
        'deliveryDays'
    ]),
    createGigValidator,
    validateGigRequest,
    createGig
);

router.put('/:id',
    authenticate,
    authorizeRoles('freelancer'),
    gigIdValidator,
    allowFields([
        'title',
        'description',
        'category',
        'price',
        'deliveryDays'
    ]),
    updateGigValidator,
    validateGigRequest,
    updateGig
);

router.delete('/:id',
    authenticate,
    authorizeRoles('freelancer'),
    gigIdValidator,
    validateGigRequest,
    deleteGig
);

module.exports = router;