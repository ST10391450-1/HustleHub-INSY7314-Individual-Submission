const express = require('express');

const authenticate = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const allowFields = require('../middleware/allowFields');
const { bookingLimiter } = require('../middleware/rateLimiters');

const {
    createBooking,
    getMyClientBookings,
    getMyFreelancerBookings,
    updateBookingStatus,
    updateClientBookingStatus
} = require('../controllers/BookingController');

const {
    createBookingValidator,
    bookingIdValidator,
    updateBookingStatusValidator,
    updateClientBookingStatusValidator,
    validateBookingRequest
} = require('../validators/bookingValidators');

const router = express.Router();

router.post(
    '/',
    authenticate,
    authorizeRoles('client'),
    bookingLimiter,
    allowFields(['gigId']),
    createBookingValidator,
    validateBookingRequest,
    createBooking
);

router.get(
    '/mine/client',
    authenticate,
    authorizeRoles('client'),
    getMyClientBookings
);

router.get(
    '/mine/freelancer',
    authenticate,
    authorizeRoles('freelancer'),
    getMyFreelancerBookings
);

router.patch(
    '/:id/status',
    authenticate,
    authorizeRoles('freelancer'),
    bookingIdValidator,
    allowFields(['status']),
    updateBookingStatusValidator,
    validateBookingRequest,
    updateBookingStatus
);

router.patch(
    '/:id/client-status',
    authenticate,
    authorizeRoles('client'),
    bookingIdValidator,
    allowFields(['status']),
    updateClientBookingStatusValidator,
    validateBookingRequest,
    updateClientBookingStatus
);

module.exports = router;
