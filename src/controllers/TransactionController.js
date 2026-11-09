
const TransactionRepository = require('../repositories/TransactionRepository');
const BookingRepository = require('../repositories/BookingRepository');
const { calculateEstimatedTax } = require('../utils/taxCalculator');

const transactionRepository = new TransactionRepository();
const bookingRepository = new BookingRepository();

const TAX_YEAR_START = new Date('2026-03-01T00:00:00.000Z');
const TAX_YEAR_END = new Date('2027-03-01T00:00:00.000Z');

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
        const taxYearTransactions = completedTransactions.filter(
            transaction => {
                if (!transaction.completedAt) {
                    return false;
                }

                const completionDate = new Date(transaction.completedAt);

                return (
                    completionDate >= TAX_YEAR_START &&
                    completionDate < TAX_YEAR_END
                );
            }
        );

        const totalIncome = taxYearTransactions.reduce(
            (total, transaction) => total + transaction.amount,
            0
        );

        const taxEstimate = calculateEstimatedTax(totalIncome);

        const lifetimeIncome = completedTransactions.reduce(
            (total, transaction) => total + transaction.amount,
            0
        );

        return res.status(200).json({
            success: true,
            message: 'Freelancer income and tax estimate retrieved successfully.',
            data: {
                totalIncome,
                lifetimeIncome,
                transactionCount: transactionsWithBookings.length,
                completedTransactionCount: completedTransactions.length,
                taxYearCompletedTransactionCount: taxYearTransactions.length,
                taxYearStart: TAX_YEAR_START.toISOString(),
                taxYearEnd: new Date(
                    TAX_YEAR_END.getTime() - 1
                ).toISOString(),
                ...taxEstimate,
                transactions: transactionsWithBookings
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getFreelancerIncome };