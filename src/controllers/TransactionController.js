const TransactionRepository = require('../repositories/TransactionRepository');
const BookingRepository = require('../repositories/BookingRepository');

const transactionRepository = new TransactionRepository();
const bookingRepository = new BookingRepository();

const getFreelancerIncome = async (req, res, next) => {
    try {
        const transactions =
            await transactionRepository.findByFreelancerId(req.user.userId);

        const transactionsWithBookings = await Promise.all(
            transactions.map(async transaction => {
                const booking = await bookingRepository.findById(
                    transaction.bookingId
                );

                return {
                    ...transaction.toPublicJSON(),
                    bookingStatus: booking?.status || 'unknown'
                };
            })
        );

        const completedTransactions = transactionsWithBookings.filter(
            transaction =>
                transaction.bookingStatus === 'completed' &&
                transaction.status === 'completed'
        );

        const totalIncome = completedTransactions.reduce(
            (total, transaction) => total + transaction.amount,
            0
        );

        return res.status(200).json({
            success: true,
            message: 'Freelancer income retrieved successfully.',
            data: {
                totalIncome,
                transactionCount: transactionsWithBookings.length,
                completedTransactionCount: completedTransactions.length,
                transactions: transactionsWithBookings
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getFreelancerIncome
};
