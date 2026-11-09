const { randomUUID } = require('crypto');

class Gig {
    constructor({
        id = randomUUID(),
        freelancerId,
        title,
        description,
        category,
        price,
        deliveryDays,
        status = 'active',
        createdAt = new Date().toISOString(),
        updatedAt = new Date().toISOString()
    }) {
        this.id = id;
        this.freelancerId = freelancerId;
        this.title = title.trim();
        this.description = description.trim();
        this.category = category.trim();
        this.price = Number(price);
        this.deliveryDays = Number(deliveryDays);
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    toPublicJSON() {
        return {
            id: this.id,
            freelancerId: this.freelancerId,
            title: this.title,
            description: this.description,
            category: this.category,
            price: this.price,
            deliveryDays: this.deliveryDays,
            status: this.status,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

module.exports = Gig;