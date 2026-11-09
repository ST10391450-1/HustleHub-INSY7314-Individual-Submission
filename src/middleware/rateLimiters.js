const { rateLimit } = require('express-rate-limit');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        error: {
            code: 'AUTH_RATE_LIMIT_EXCEEDED',
            message: 'Too many authentication attempts. Please try again later.'
        }
    }
});

const bookingLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        error: {
            code: 'BOOKING_RATE_LIMIT_EXCEEDED',
            message: 'Too many booking requests. Please try again later.'
        }
    }
});

module.exports = {
    authLimiter,
    bookingLimiter
};
