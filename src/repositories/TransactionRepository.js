
const fs = require('fs/promises');
const path = require('path');
const Transaction = require('../models/Transaction');

class TransactionRepository {
    constructor(filePath = path.join(__dirname, '../../data/transactions.json')) {
        this.filePath = filePath;
        this.writeQueue = Promise.resolve();
    }

    async initialise() {
        await fs.mkdir(path.dirname(this.filePath), {
            recursive: true
        });

        try {
            await fs.access(this.filePath);
        } catch {
            await fs.writeFile(this.filePath, '[]', 'utf8');
        }
    }

    async getAll() {
        await this.initialise();

        const fileContent = await fs.readFile(this.filePath, 'utf8');
        const transactions = JSON.parse(fileContent);

        return transactions.map(
            transaction => new Transaction(transaction)
        );
    }

    async findById(transactionId) {
        const transactions = await this.getAll();

        return transactions.find(
            transaction => transaction.id === transactionId
        ) || null;
    }

    async findByBookingId(bookingId) {
        const transactions = await this.getAll();

        return transactions.find(
            transaction => transaction.bookingId === bookingId
        ) || null;
    }

    async findByClientId(clientId) {
        const transactions = await this.getAll();

        return transactions.filter(
            transaction => transaction.clientId === clientId
        );
    }

    async findByFreelancerId(freelancerId) {
        const transactions = await this.getAll();

        return transactions.filter(
            transaction => transaction.freelancerId === freelancerId
        );
    }

    async create(transactionData) {
        const operation = this.writeQueue.then(async () => {
            const transactions = await this.getAll();

            const existingTransaction = transactions.find(
                transaction => transaction.bookingId === transactionData.bookingId
            );

            if (existingTransaction) {
                const error = new Error(
                    'A transaction already exists for this booking.'
                );

                error.code = 'DUPLICATE_BOOKING_TRANSACTION';
                throw error;
            }

            const transaction = new Transaction(transactionData);

            transactions.push(transaction);

            await this.saveAll(transactions);

            return transaction;
        });

        this.writeQueue = operation.catch(() => {});

        return operation;
    }

    async updateStatusByBookingId(bookingId, status) {
        const operation = this.writeQueue.then(async () => {
            const transactions = await this.getAll();

            const transactionIndex = transactions.findIndex(
                transaction => transaction.bookingId === bookingId
            );

            if (transactionIndex === -1) {
                return null;
            }

            const existingTransaction = transactions[transactionIndex];

            transactions[transactionIndex] = new Transaction({
                ...existingTransaction.toPublicJSON(),
                status
            });

            await this.saveAll(transactions);

            return transactions[transactionIndex];
        });

        this.writeQueue = operation.catch(() => {});

        return operation;
    }

    async saveAll(transactions) {
        const temporaryFile = `${this.filePath}.tmp`;

        await fs.writeFile(
            temporaryFile,
            JSON.stringify(
                transactions.map(transaction => transaction.toPublicJSON()),
                null,
                4
            ),
            'utf8'
        );

        await fs.rename(temporaryFile, this.filePath);
        }
}
module.exports = TransactionRepository;
