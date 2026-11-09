
const BookingDocument = require('../src/models/mongoose/Booking');
const BookingRepository = require('../src/repositories/BookingRepository');

jest.mock('../src/models/mongoose/Booking', () => ({
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    create: jest.fn()
}));

//region Booking Repository Test Data

const bookingData = {
    _id: 'booking-123',
    clientId: 'client-123',
    freelancerId: 'freelancer-123',
    gigId: 'gig-123',
    amount: 1500,
    status: 'pending',
    createdAt: new Date('2026-11-01T10:00:00.000Z'),
    updatedAt: new Date('2026-11-02T10:00:00.000Z')
};

let repository;

describe('BookingRepository', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        repository = new BookingRepository();
    });

    test('should initialise successfully', async () => {
        await expect(repository.initialise()).resolves.toBe(true);
    });

    test('should retrieve all bookings', async () => {
        BookingDocument.find.mockReturnValue({
            lean: jest.fn().mockResolvedValue([bookingData])
        });

        const result = await repository.getAll();

        expect(BookingDocument.find).toHaveBeenCalledTimes(1);
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe(bookingData._id);
    });

    test('should return an empty array when no bookings exist', async () => {
        BookingDocument.find.mockReturnValue({
            lean: jest.fn().mockResolvedValue([])
        });

        const result = await repository.getAll();

        expect(result).toEqual([]);
    });

    test('should find a booking by ID', async () => {
        BookingDocument.findById.mockReturnValue({
            lean: jest.fn().mockResolvedValue(bookingData)
        });

        const result = await repository.findById('booking-123');

        expect(BookingDocument.findById)
            .toHaveBeenCalledWith('booking-123');

        expect(result.id).toBe('booking-123');
    });

    test('should return null when a booking ID does not exist', async () => {
        BookingDocument.findById.mockReturnValue({
            lean: jest.fn().mockResolvedValue(null)
        });

        const result = await repository.findById('missing-id');

        expect(result).toBeNull();
    });

    test('should find bookings by client ID', async () => {
        BookingDocument.find.mockReturnValue({
            lean: jest.fn().mockResolvedValue([bookingData])
        });

        const result = await repository.findByClientId('client-123');

        expect(BookingDocument.find)
            .toHaveBeenCalledWith({ clientId: 'client-123' });

        expect(result).toHaveLength(1);
    });

    test('should find bookings by freelancer ID', async () => {
        BookingDocument.find.mockReturnValue({
            lean: jest.fn().mockResolvedValue([bookingData])
        });

        const result = await repository.findByFreelancerId(
            'freelancer-123'
        );

        expect(BookingDocument.find)
            .toHaveBeenCalledWith({
                freelancerId: 'freelancer-123'
            });

        expect(result).toHaveLength(1);
    });

    test('should create a booking with the default pending status', async () => {
        BookingDocument.create.mockResolvedValue({
            toObject: () => bookingData
        });

        const result = await repository.create({
            clientId: 'client-123',
            freelancerId: 'freelancer-123',
            gigId: 'gig-123',
            amount: 1500
        });

        expect(BookingDocument.create).toHaveBeenCalledWith({
            clientId: 'client-123',
            freelancerId: 'freelancer-123',
            gigId: 'gig-123',
            amount: 1500,
            status: 'pending'
        });

        expect(result.id).toBe('booking-123');
    });

    test('should create a booking with a supplied status', async () => {
        BookingDocument.create.mockResolvedValue({
            toObject: () => ({
                ...bookingData,
                status: 'confirmed'
            })
        });

        const result = await repository.create({
            clientId: 'client-123',
            freelancerId: 'freelancer-123',
            gigId: 'gig-123',
            amount: 1500,
            status: 'confirmed'
        });

        expect(BookingDocument.create).toHaveBeenCalledWith(
            expect.objectContaining({
                status: 'confirmed'
            })
        );

        expect(result.status).toBe('confirmed');
    });

    test('should update a booking successfully', async () => {
        BookingDocument.findByIdAndUpdate.mockReturnValue({
            lean: jest.fn().mockResolvedValue({
                ...bookingData,
                status: 'confirmed'
            })
        });

        const result = await repository.update('booking-123', {
            status: 'confirmed'
        });

        expect(BookingDocument.findByIdAndUpdate).toHaveBeenCalledWith(
            'booking-123',
            expect.objectContaining({
                $set: expect.objectContaining({
                    status: 'confirmed',
                    updatedAt: expect.any(Date)
                })
            }),
            {
                new: true,
                runValidators: true
            }
        );

        expect(result.status).toBe('confirmed');
    });

    test('should return null when updating a missing booking', async () => {
        BookingDocument.findByIdAndUpdate.mockReturnValue({
            lean: jest.fn().mockResolvedValue(null)
        });

        const result = await repository.update('missing-id', {
            status: 'confirmed'
        });

        expect(result).toBeNull();
    });

    test('should delete a booking successfully', async () => {
        BookingDocument.findByIdAndDelete.mockResolvedValue({
            toObject: () => bookingData
        });

        const result = await repository.delete('booking-123');

        expect(BookingDocument.findByIdAndDelete)
            .toHaveBeenCalledWith('booking-123');

        expect(result.id).toBe('booking-123');
    });

    test('should return null when deleting a missing booking', async () => {
        BookingDocument.findByIdAndDelete.mockResolvedValue(null);

        const result = await repository.delete('missing-id');

        expect(result).toBeNull();
    });

    test('should convert Date objects to ISO strings', () => {
        const result = repository.toDomainModel(bookingData);

        expect(result.createdAt)
            .toBe('2026-11-01T10:00:00.000Z');

        expect(result.updatedAt)
            .toBe('2026-11-02T10:00:00.000Z');
    });

    test('should preserve date strings when converting a booking', () => {
        const result = repository.toDomainModel({
            ...bookingData,
            createdAt: '2026-11-01T10:00:00.000Z',
            updatedAt: '2026-11-02T10:00:00.000Z'
        });

        expect(result.createdAt)
            .toBe('2026-11-01T10:00:00.000Z');

        expect(result.updatedAt)
            .toBe('2026-11-02T10:00:00.000Z');
    });

});