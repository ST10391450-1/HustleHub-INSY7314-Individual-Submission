const { randomUUID } = require('crypto');

class Transaction {
    constructor({
        id = randomUUID(),
        bookingId,
        clientId,
        freelancerId,
        gigId,
        amount,
        status = 'simulated',
        paymentMethod = 'simulation',
        createdAt = new Date().toISOString(),
        completedAt = null
    }) {
        this.id = id;
        this.bookingId = bookingId;
        this.clientId = clientId;
        this.freelancerId = freelancerId;
        this.gigId = gigId;
        this.amount = Number(amount);
        this.status = status;
        this.paymentMethod = paymentMethod;
        this.createdAt = createdAt;
        this.completedAt = completedAt;
    }

    toPublicJSON() {
        return {
            id: this.id,
            bookingId: this.bookingId,
            clientId: this.clientId,
            freelancerId: this.freelancerId,
            gigId: this.gigId,
            amount: this.amount,
            status: this.status,
            paymentMethod: this.paymentMethod,
            createdAt: this.createdAt,
            completedAt: this.completedAt
        };
    }
}

module.exports = Transaction;