const { param, body, validationResult } = require('express-validator');

const createBookingValidator = [
    body('gigId')
        .trim()
        .notEmpty()
        .withMessage('A gig ID is required.')
        .isUUID()
        .withMessage('The gig ID must be a valid UUID.')
];

const bookingIdValidator = [
    param('id')
        .isUUID()
        .withMessage('The booking ID must be a valid UUID.')
];

const updateBookingStatusValidator = [
    body('status')
        .trim()
        .notEmpty()
        .withMessage('A booking status is required.')
        .isIn(['accepted', 'rejected', 'submitted'])
        .withMessage('The requested freelancer booking status is invalid.')
];

const updateClientBookingStatusValidator = [
    body('status')
        .trim()
        .notEmpty()
        .withMessage('A booking status is required.')
        .isIn(['completed', 'revision_requested'])
        .withMessage('The requested client booking status is invalid.')
];

const validateBookingRequest = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: {
                code: 'VALIDATION_ERROR',
                message: 'The booking request contains invalid information.',
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
    createBookingValidator,
    bookingIdValidator,
    updateBookingStatusValidator,
    updateClientBookingStatusValidator,
    validateBookingRequest
};