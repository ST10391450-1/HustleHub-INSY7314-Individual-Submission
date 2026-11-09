
const GigDocument = require('../src/models/mongoose/Gig');
const GigRepository = require('../src/repositories/GigRepository');

jest.mock('../src/models/mongoose/Gig', () => ({
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    create: jest.fn()
}));

const gigData = {
    _id: 'gig-123',
    freelancerId: 'freelancer-123',
    title: 'Website Development',
    description: 'Professional website development services.',
    category: 'Development',
    price: 1500,
    deliveryDays: 5,
    status: 'active',
    createdAt: new Date('2026-11-01T10:00:00.000Z'),
    updatedAt: new Date('2026-11-02T10:00:00.000Z')
};

let repository;

describe('GigRepository', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        repository = new GigRepository();
    });

    test('should initialise successfully', async () => {
        await expect(repository.initialise()).resolves.toBe(true);
    });

    test('should retrieve all gigs', async () => {
        GigDocument.find.mockReturnValue({
            lean: jest.fn().mockResolvedValue([gigData])
        });

        const result = await repository.getAll();

        expect(GigDocument.find).toHaveBeenCalledTimes(1);
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe(gigData._id);
    });

    test('should return an empty array when no gigs exist', async () => {
        GigDocument.find.mockReturnValue({
            lean: jest.fn().mockResolvedValue([])
        });

        const result = await repository.getAll();

        expect(result).toEqual([]);
    });

    test('should find a gig by ID', async () => {
        GigDocument.findById.mockReturnValue({
            lean: jest.fn().mockResolvedValue(gigData)
        });

        const result = await repository.findById('gig-123');

        expect(GigDocument.findById).toHaveBeenCalledWith('gig-123');
        expect(result.id).toBe('gig-123');
    });

    test('should return null when a gig ID does not exist', async () => {
        GigDocument.findById.mockReturnValue({
            lean: jest.fn().mockResolvedValue(null)
        });

        const result = await repository.findById('missing-id');

        expect(result).toBeNull();
    });

    test('should find gigs by freelancer ID', async () => {
        GigDocument.find.mockReturnValue({
            lean: jest.fn().mockResolvedValue([gigData])
        });

        const result = await repository.findByFreelancerId(
            'freelancer-123'
        );

        expect(GigDocument.find).toHaveBeenCalledWith({
            freelancerId: 'freelancer-123'
        });

        expect(result).toHaveLength(1);
    });

    test('should create a gig with the default active status', async () => {
        GigDocument.create.mockResolvedValue({
            toObject: () => gigData
        });

        const result = await repository.create({
            freelancerId: 'freelancer-123',
            title: 'Website Development',
            description: 'Professional website development services.',
            category: 'Development',
            price: 1500,
            deliveryDays: 5
        });

        expect(GigDocument.create).toHaveBeenCalledWith({
            freelancerId: 'freelancer-123',
            title: 'Website Development',
            description: 'Professional website development services.',
            category: 'Development',
            price: 1500,
            deliveryDays: 5,
            status: 'active'
        });

        expect(result.id).toBe('gig-123');
    });

    test('should create a gig with a supplied status', async () => {
        GigDocument.create.mockResolvedValue({
            toObject: () => ({
                ...gigData,
                status: 'inactive'
            })
        });

        const result = await repository.create({
            freelancerId: 'freelancer-123',
            title: 'Website Development',
            description: 'Professional website development services.',
            category: 'Development',
            price: 1500,
            deliveryDays: 5,
            status: 'inactive'
        });

        expect(GigDocument.create).toHaveBeenCalledWith(
            expect.objectContaining({
                status: 'inactive'
            })
        );

        expect(result.status).toBe('inactive');
    });

    test('should update a gig using allowed fields', async () => {
        GigDocument.findByIdAndUpdate.mockReturnValue({
            lean: jest.fn().mockResolvedValue({
                ...gigData,
                title: 'Updated Website Development'
            })
        });

        const result = await repository.update('gig-123', {
            title: 'Updated Website Development',
            price: 2000
        });

        expect(GigDocument.findByIdAndUpdate).toHaveBeenCalledWith(
            'gig-123',
            {
                $set: {
                    title: 'Updated Website Development',
                    price: 2000
                }
            },
            {
                new: true,
                runValidators: true
            }
        );

        expect(result.id).toBe('gig-123');
    });

    test('should exclude fields that are not allowed during updates', async () => {
        GigDocument.findByIdAndUpdate.mockReturnValue({
            lean: jest.fn().mockResolvedValue(gigData)
        });

        await repository.update('gig-123', {
            title: 'Updated title',
            freelancerId: 'another-freelancer',
            _id: 'another-id',
            createdAt: new Date()
        });

        expect(GigDocument.findByIdAndUpdate).toHaveBeenCalledWith(
            'gig-123',
            {
                $set: {
                    title: 'Updated title'
                }
            },
            {
                new: true,
                runValidators: true
            }
        );
    });

    test('should update all supported gig fields', async () => {
        GigDocument.findByIdAndUpdate.mockReturnValue({
            lean: jest.fn().mockResolvedValue(gigData)
        });

        await repository.update('gig-123', {
            title: 'New title',
            description: 'New description',
            category: 'Design',
            price: 2500,
            deliveryDays: 7,
            status: 'inactive'
        });

        expect(GigDocument.findByIdAndUpdate).toHaveBeenCalledWith(
            'gig-123',
            {
                $set: {
                    title: 'New title',
                    description: 'New description',
                    category: 'Design',
                    price: 2500,
                    deliveryDays: 7,
                    status: 'inactive'
                }
            },
            {
                new: true,
                runValidators: true
            }
        );
    });

    test('should return null when updating a missing gig', async () => {
        GigDocument.findByIdAndUpdate.mockReturnValue({
            lean: jest.fn().mockResolvedValue(null)
        });

        const result = await repository.update('missing-id', {
            title: 'Updated title'
        });

        expect(result).toBeNull();
    });

    test('should delete a gig successfully', async () => {
        GigDocument.findByIdAndDelete.mockResolvedValue({
            toObject: () => gigData
        });

        const result = await repository.delete('gig-123');

        expect(GigDocument.findByIdAndDelete)
            .toHaveBeenCalledWith('gig-123');

        expect(result.id).toBe('gig-123');
    });

    test('should return null when deleting a missing gig', async () => {
        GigDocument.findByIdAndDelete.mockResolvedValue(null);

        const result = await repository.delete('missing-id');

        expect(result).toBeNull();
    });

    test('should convert Date objects to ISO strings', () => {
        const result = repository.toDomainModel(gigData);

        expect(result.createdAt)
            .toBe('2026-11-01T10:00:00.000Z');

        expect(result.updatedAt)
            .toBe('2026-11-02T10:00:00.000Z');
    });

    test('should preserve date strings when converting a gig', () => {
        const result = repository.toDomainModel({
            ...gigData,
            createdAt: '2026-11-01T10:00:00.000Z',
            updatedAt: '2026-11-02T10:00:00.000Z'
        });

        expect(result.createdAt)
            .toBe('2026-11-01T10:00:00.000Z');

        expect(result.updatedAt)
            .toBe('2026-11-02T10:00:00.000Z');
    });

});