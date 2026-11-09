
const { body, validationResult } = require('express-validator');

//region Registration Validation

const registerValidator = [
    body('fullName')
        .trim()
        .notEmpty()
        .withMessage('Full name is required.')
        .bail()
        .isLength({ min: 2, max: 80 })
        .withMessage('Full name must be between 2 and 80 characters.'),

    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email address is required.')
        .bail()
        .isEmail()
        .withMessage('A valid email address is required.')
        .normalizeEmail(),

    body('password')
        .notEmpty()
        .withMessage('Password is required.')
        .bail()
        .isString()
        .withMessage('Password must be a string.')
        .bail()
        .isLength({ min: 8, max: 128 })
        .withMessage('Password must be between 8 and 128 characters.'),

    body('role')
        .optional()
        .isIn(['client', 'freelancer'])
        .withMessage('Account type must be client or freelancer.')
];

//endregion

//region Login Validation

const loginValidator = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email address is required.')
        .bail()
        .isEmail()
        .withMessage('A valid email address is required.')
        .normalizeEmail(),

    body('password')
        .notEmpty()
        .withMessage('Password is required.')
        .bail()
        .isString()
        .withMessage('Password must be a string.')
];

//endregion

//region Validation Result Handling

function validateRequest(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: {
                code: 'VALIDATION_ERROR',
                message: 'The supplied information is invalid.',
                details: errors.array().map(error => ({
                    field: error.path,
                    message: error.msg
                }))
            }
        });
    }

    next();
}

//endregion

module.exports = {
    registerValidator,
    loginValidator,
    validateRequest
};
