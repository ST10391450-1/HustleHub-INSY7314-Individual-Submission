const Transaction = require('../models/Transaction');
const TransactionDocument = require('../models/mongoose/Transaction');

class TransactionRepository {

    async initialise() {
        return true;
    }

    async getAll() {
        const transactions = await TransactionDocument.find().lean();

        return transactions.map(transaction =>
            this.toDomainModel(transaction)
        );
    }

    async findById(id) {
        const transaction = await TransactionDocument.findById(id).lean();

        return transaction
            ? this.toDomainModel(transaction)
            : null;
    }

    async findByBookingId(bookingId) {
        const transaction = await TransactionDocument.findOne({
            bookingId
        }).lean();

        return transaction
            ? this.toDomainModel(transaction)
            : null;
    }

    async findByClientId(clientId) {
        const transactions = await TransactionDocument.find({
            clientId
        }).lean();

        return transactions.map(transaction =>
            this.toDomainModel(transaction)
        );
    }

    async findByFreelancerId(freelancerId) {
        const transactions = await TransactionDocument.find({
            freelancerId
        }).lean();

        return transactions.map(transaction =>
            this.toDomainModel(transaction)
        );
    }

    async create(transactionData) {
        try {
            const transaction = await TransactionDocument.create({
                bookingId: transactionData.bookingId,
                clientId: transactionData.clientId,
                freelancerId: transactionData.freelancerId,
                gigId: transactionData.gigId,
                amount: transactionData.amount,
                status: transactionData.status || 'simulated',
                paymentMethod: transactionData.paymentMethod || 'simulation'
            });

            return this.toDomainModel(transaction.toObject());
        } catch (error) {
            if (error.code === 11000) {
                const duplicateError = new Error(
                    'A transaction already exists for this booking.'
                );

                duplicateError.code = 'DUPLICATE_BOOKING_TRANSACTION';

                throw duplicateError;
            }

            throw error;
        }
    }

        async updateStatusByBookingId(bookingId, status) {
        const updateFields = { status };

        if (status === 'completed') {
            updateFields.completedAt = new Date();
        }

        const transaction = await TransactionDocument.findOneAndUpdate(
            { bookingId },
            {
                $set: updateFields
            },
            {
                new: true,
                runValidators: true
            }
        ).lean();

        return transaction
            ? this.toDomainModel(transaction)
            : null;
    }
    toDomainModel(transaction) {
        return new Transaction({
            id: transaction._id,
            bookingId: transaction.bookingId,
            clientId: transaction.clientId,
            freelancerId: transaction.freelancerId,
            gigId: transaction.gigId,
            amount: transaction.amount,
            status: transaction.status,
            paymentMethod: transaction.paymentMethod,
            createdAt: transaction.createdAt instanceof Date
                ? transaction.createdAt.toISOString()
                : transaction.createdAt,
            completedAt: transaction.completedAt
                ? transaction.completedAt instanceof Date
                    ? transaction.completedAt.toISOString()
                    : transaction.completedAt
                : null
        });
    }
}

module.exports = TransactionRepository;