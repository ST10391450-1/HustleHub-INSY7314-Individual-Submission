const BookingRepository = require('../repositories/BookingRepository');
const TransactionRepository = require('../repositories/TransactionRepository');
const GigRepository = require('../repositories/GigRepository');

const bookingRepository = new BookingRepository();
const transactionRepository = new TransactionRepository();
const gigRepository = new GigRepository();

const createBooking = async (req, res, next) => {
    let booking = null;

    try {
        const { gigId } = req.body;

        const gig = await gigRepository.findById(gigId);

        if (!gig || gig.status !== 'active') {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'GIG_NOT_FOUND',
                    message: 'The requested gig is unavailable.'
                }
            });
        }

        if (gig.freelancerId === req.user.userId) {
            return res.status(403).json({
                success: false,
                error: {
                    code: 'OWN_GIG_BOOKING',
                    message: 'You cannot book your own gig.'
                }
            });
        }

        booking = await bookingRepository.create({
            clientId: req.user.userId,
            freelancerId: gig.freelancerId,
            gigId: gig.id,
            amount: gig.price,
            status: 'pending'
        });

        try {
            const transaction = await transactionRepository.create({
                bookingId: booking.id,
                clientId: booking.clientId,
                freelancerId: booking.freelancerId,
                gigId: booking.gigId,
                amount: booking.amount,
                status: 'simulated',
                paymentMethod: 'simulation'
            });

            return res.status(201).json({
                success: true,
                message: 'Booking created successfully.',
                data: {
                    booking: booking.toPublicJSON(),
                    transaction: transaction.toPublicJSON()
                }
            });
        } catch (transactionError) {
            try {
                await bookingRepository.delete(booking.id);
            } catch (rollbackError) {
                transactionError.rollbackFailed = true;
            }

            throw transactionError;
        }
    } catch (error) {
        next(error);
    }
};

const getMyClientBookings = async (req, res, next) => {
    try {
        const bookings = await bookingRepository.findByClientId(
            req.user.userId
        );

        return res.status(200).json({
            success: true,
            message: 'Your bookings were retrieved successfully.',
            data: bookings.map(booking => booking.toPublicJSON())
        });
    } catch (error) {
        next(error);
    }
};

const getMyFreelancerBookings = async (req, res, next) => {
    try {
        const bookings = await bookingRepository.findByFreelancerId(
            req.user.userId
        );

        return res.status(200).json({
            success: true,
            message: 'Your incoming bookings were retrieved successfully.',
            data: bookings.map(booking => booking.toPublicJSON())
        });
    } catch (error) {
        next(error);
    }
};

const updateBookingStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const booking = await bookingRepository.findById(id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'BOOKING_NOT_FOUND',
                    message: 'The requested booking could not be found.'
                }
            });
        }

        if (booking.freelancerId !== req.user.userId) {
            return res.status(403).json({
                success: false,
                error: {
                    code: 'BOOKING_ACCESS_DENIED',
                    message: 'You cannot manage this booking.'
                }
            });
        }

        const allowedTransitions = {
            pending: ['accepted', 'rejected'],
            accepted: ['submitted'],
            revision_requested: ['submitted'],
            rejected: [],
            submitted: [],
            completed: []
        };

        if (!allowedTransitions[booking.status]?.includes(status)) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'INVALID_BOOKING_TRANSITION',
                    message: 'This freelancer booking status transition is not permitted.'
                }
            });
        }

        const updatedBooking = await bookingRepository.update(id, {
            status
        });

        return res.status(200).json({
            success: true,
            message: status === 'submitted'
                ? 'Completed work submitted to the client for approval.'
                : 'Booking status updated successfully.',
            data: updatedBooking.toPublicJSON()
        });
    } catch (error) {
        next(error);
    }
};

const updateClientBookingStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const booking = await bookingRepository.findById(id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'BOOKING_NOT_FOUND',
                    message: 'The requested booking could not be found.'
                }
            });
        }

        if (booking.clientId !== req.user.userId) {
            return res.status(403).json({
                success: false,
                error: {
                    code: 'BOOKING_ACCESS_DENIED',
                    message: 'You cannot approve or request changes to this booking.'
                }
            });
        }

        if (booking.status !== 'submitted') {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'BOOKING_NOT_SUBMITTED',
                    message: 'This booking has not been submitted for client approval.'
                }
            });
        }

        const transaction = await transactionRepository.findByBookingId(id);

        if (!transaction) {
            return res.status(409).json({
                success: false,
                error: {
                    code: 'BOOKING_TRANSACTION_NOT_FOUND',
                    message: 'The transaction associated with this booking could not be found.'
                }
            });
        }

        const updatedBooking = await bookingRepository.update(id, {
            status
        });

        if (!updatedBooking) {
            return res.status(500).json({
                success: false,
                error: {
                    code: 'BOOKING_UPDATE_FAILED',
                    message: 'The booking could not be updated.'
                }
            });
        }

        if (status === 'completed') {
            try {
                const updatedTransaction =
                    await transactionRepository.updateStatusByBookingId(
                        id,
                        'completed'
                    );

                if (!updatedTransaction) {
                    throw new Error('The booking transaction could not be updated.');
                }
            } catch (transactionError) {
                await bookingRepository.update(id, {
                    status: 'submitted'
                });

                throw transactionError;
            }
        }

        return res.status(200).json({
            success: true,
            message: status === 'completed'
                ? 'Work approved successfully. The simulated transaction is now completed.'
                : 'Changes requested successfully. The freelancer can revise and resubmit the work.',
            data: updatedBooking.toPublicJSON()
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createBooking,
    getMyClientBookings,
    getMyFreelancerBookings,
    updateBookingStatus,
    updateClientBookingStatus
};
