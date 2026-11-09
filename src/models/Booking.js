const { randomUUID } = require('crypto');

class Booking {
    constructor({
        id = randomUUID(),
        clientId,
        freelancerId,
        gigId,
        amount,
        status = 'pending',
        createdAt = new Date().toISOString(),
        updatedAt = new Date().toISOString()
    }) {
        this.id = id;
        this.clientId = clientId;
        this.freelancerId = freelancerId;
        this.gigId = gigId;
        this.amount = Number(amount);
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    toPublicJSON() {
        return {
            id: this.id,
            clientId: this.clientId,
            freelancerId: this.freelancerId,
            gigId: this.gigId,
            amount: this.amount,
            status: this.status,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

module.exports = Booking;
