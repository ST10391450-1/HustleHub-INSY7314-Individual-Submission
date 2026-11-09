
const fs = require('fs/promises');
const path = require('path');
const Booking = require('../models/Booking');

class BookingRepository {
    constructor(filePath = path.join(__dirname, '../../data/bookings.json')) {
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
        const bookings = JSON.parse(fileContent);

        return bookings.map(booking => new Booking(booking));
    }

    async findById(bookingId) {
        const bookings = await this.getAll();

        return bookings.find(
            booking => booking.id === bookingId
        ) || null;
    }

    async findByClientId(clientId) {
        const bookings = await this.getAll();

        return bookings.filter(
            booking => booking.clientId === clientId
        );
    }

    async findByFreelancerId(freelancerId) {
        const bookings = await this.getAll();

        return bookings.filter(
            booking => booking.freelancerId === freelancerId
        );
    }

    async create(bookingData) {
        const operation = this.writeQueue.then(async () => {
            const bookings = await this.getAll();

            const booking = new Booking(bookingData);

            bookings.push(booking);

            await this.saveAll(bookings);

            return booking;
        });

        this.writeQueue = operation.catch(() => {});

        return operation;
    }

    async update(bookingId, updates) {
        const operation = this.writeQueue.then(async () => {
            const bookings = await this.getAll();

            const bookingIndex = bookings.findIndex(
                booking => booking.id === bookingId
            );

            if (bookingIndex === -1) {
                return null;
            }

            const existingBooking = bookings[bookingIndex];

            bookings[bookingIndex] = new Booking({
                ...existingBooking,
                status: updates.status ?? existingBooking.status,
                updatedAt: new Date().toISOString()
            });

            await this.saveAll(bookings);

            return bookings[bookingIndex];
        });

        this.writeQueue = operation.catch(() => {});

        return operation;
    }

    async saveAll(bookings) {
        const temporaryFile = `${this.filePath}.tmp`;

        await fs.writeFile(
            temporaryFile,
            JSON.stringify(
                bookings.map(booking => booking.toPublicJSON()),
                null,
                4
            ),
            'utf8'
        );

        await fs.rename(temporaryFile, this.filePath);
    }

    async delete(bookingId) {
        const operation = this.writeQueue.then(async () => {
            const bookings = await this.getAll();

            const filteredBookings = bookings.filter(
                booking => booking.id !== bookingId
            );

            if (filteredBookings.length === bookings.length) {
                return false;
            }

            await this.saveAll(filteredBookings);

            return true;
        });

        this.writeQueue = operation.catch(() => {});

        return operation;
    }
}

module.exports = BookingRepository;
