const Booking = require('../models/Booking');
const BookingDocument = require('../models/mongoose/Booking');

//region Booking Repository

class BookingRepository {

    async initialise() {
        return true;
    }

    async getAll() {
        const bookings = await BookingDocument.find().lean();

        return bookings.map(booking => this.toDomainModel(booking));
    }

    async findById(id) {
        const booking = await BookingDocument.findById(id).lean();

        return booking ? this.toDomainModel(booking) : null;
    }

    async findByClientId(clientId) {
        const bookings = await BookingDocument.find({
            clientId
        }).lean();

        return bookings.map(booking => this.toDomainModel(booking));
    }

    async findByFreelancerId(freelancerId) {
        const bookings = await BookingDocument.find({
            freelancerId
        }).lean();

        return bookings.map(booking => this.toDomainModel(booking));
    }

    async create(bookingData) {
        const booking = await BookingDocument.create({
            clientId: bookingData.clientId,
            freelancerId: bookingData.freelancerId,
            gigId: bookingData.gigId,
            amount: bookingData.amount,
            status: bookingData.status || 'pending'
        });

        return this.toDomainModel(booking.toObject());
    }

    async update(id, updates) {
        const booking = await BookingDocument.findByIdAndUpdate(
            id,
            {
                $set: {
                    status: updates.status,
                    updatedAt: new Date()
                }
            },
            {
                new: true,
                runValidators: true
            }
        ).lean();

        return booking ? this.toDomainModel(booking) : null;
    }

    async delete(id) {
        const booking = await BookingDocument.findByIdAndDelete(id);

        return booking ? this.toDomainModel(booking.toObject()) : null;
    }

    toDomainModel(booking) {
        return new Booking({
            id: booking._id,
            clientId: booking.clientId,
            freelancerId: booking.freelancerId,
            gigId: booking.gigId,
            amount: booking.amount,
            status: booking.status,
            createdAt: booking.createdAt instanceof Date
                ? booking.createdAt.toISOString()
                : booking.createdAt,
            updatedAt: booking.updatedAt instanceof Date
                ? booking.updatedAt.toISOString()
                : booking.updatedAt
        });
    }
}

module.exports = BookingRepository;