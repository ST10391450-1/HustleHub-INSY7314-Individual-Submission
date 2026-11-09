const Gig = require('../models/Gig');
const GigDocument = require('../models/mongoose/Gig');



class GigRepository {

    async initialise() {
        return true;
    }

    async getAll() {
        const gigs = await GigDocument.find().lean();

        return gigs.map(gig => this.toDomainModel(gig));
    }

    async findById(id) {
        const gig = await GigDocument.findById(id).lean();

        return gig ? this.toDomainModel(gig) : null;
    }

    async findByFreelancerId(freelancerId) {
        const gigs = await GigDocument.find({
            freelancerId
        }).lean();

        return gigs.map(gig => this.toDomainModel(gig));
    }

    async create(gigData) {
        const gig = await GigDocument.create({
            freelancerId: gigData.freelancerId,
            title: gigData.title,
            description: gigData.description,
            category: gigData.category,
            price: gigData.price,
            deliveryDays: gigData.deliveryDays,
            status: gigData.status || 'active'
        });

        return this.toDomainModel(gig.toObject());
    }

    async update(id, updates) {
        const allowedFields = [
            'title',
            'description',
            'category',
            'price',
            'deliveryDays',
            'status'
        ];

        const safeUpdates = {};

        for (const field of allowedFields) {
            if (updates[field] !== undefined) {
                safeUpdates[field] = updates[field];
            }
        }

        const gig = await GigDocument.findByIdAndUpdate(
            id,
            {
                $set: safeUpdates
            },
            {
                new: true,
                runValidators: true
            }
        ).lean();

        return gig ? this.toDomainModel(gig) : null;
    }

    async delete(id) {
        const gig = await GigDocument.findByIdAndDelete(id);

        return gig ? this.toDomainModel(gig.toObject()) : null;
    }

    toDomainModel(gig) {
        return new Gig({
            id: gig._id,
            freelancerId: gig.freelancerId,
            title: gig.title,
            description: gig.description,
            category: gig.category,
            price: gig.price,
            deliveryDays: gig.deliveryDays,
            status: gig.status,
            createdAt: gig.createdAt instanceof Date
                ? gig.createdAt.toISOString()
                : gig.createdAt,
            updatedAt: gig.updatedAt instanceof Date
                ? gig.updatedAt.toISOString()
                : gig.updatedAt
        });
    }
}
module.exports = GigRepository;