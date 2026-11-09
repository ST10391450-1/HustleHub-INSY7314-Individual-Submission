const { body, param, validationResult } = require('express-validator');

const createGigValidator = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Gig title is required.')
        .isLength({ min: 5, max: 100 })
        .withMessage('Gig title must be between 5 and 100 characters.'),

    body('description')
        .trim()
        .notEmpty()
        .withMessage('Gig description is required.')
        .isLength({ min: 20, max: 2000 })
        .withMessage('Gig description must be between 20 and 2000 characters.'),

    body('category')
        .trim()
        .notEmpty()
        .withMessage('Gig category is required.')
        .isLength({ max: 50 })
        .withMessage('Gig category cannot exceed 50 characters.'),

    body('price')
        .isFloat({ min: 1, max: 1000000 })
        .withMessage('Price must be between 1 and 1,000,000.'),

    body('deliveryDays')
        .isInt({ min: 1, max: 365 })
        .withMessage('Delivery time must be between 1 and 365 days.')
];

const updateGigValidator = [
    body('title')
        .optional()
        .trim()
        .isLength({ min: 5, max: 100 })
        .withMessage('Gig title must be between 5 and 100 characters.'),

    body('description')
        .optional()
        .trim()
        .isLength({ min: 20, max: 2000 })
        .withMessage('Gig description must be between 20 and 2000 characters.'),

    body('category')
        .optional()
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Gig category must be between 1 and 50 characters.'),

    body('price')
        .optional()
        .isFloat({ min: 1, max: 1000000 })
        .withMessage('Price must be between 1 and 1,000,000.'),

    body('deliveryDays')
        .optional()
        .isInt({ min: 1, max: 365 })
        .withMessage('Delivery time must be between 1 and 365 days.')
];

const gigIdValidator = [
    param('id')
        .isUUID()
        .withMessage('A valid gig ID is required.')
];

const validateGigRequest = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: {
                code: 'GIG_VALIDATION_ERROR',
                message: 'Please check the submitted gig information.',
                details: errors.array().map(error => ({
                    field: error.path,
                    message: error.msg
                }))
            }
        });
    }

    next();
};

module.exports = {
    createGigValidator,
    updateGigValidator,
    gigIdValidator,
    validateGigRequest
};