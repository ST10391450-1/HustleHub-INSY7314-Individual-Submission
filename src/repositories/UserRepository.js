const User = require('../models/User');
const UserDocument = require('../models/mongoose/User');


class UserRepository {


    async initialise() {
        return true;
    }


    async getAll() {
        const users = await UserDocument.find().lean();

        return users.map(user => this.toDomainModel(user));
    }

    async findByEmail(email) {
        const normalisedEmail = email.trim().toLowerCase();

        const user = await UserDocument.findOne({
            email: normalisedEmail
        }).lean();

        return user ? this.toDomainModel(user) : null;
    }

   
    async findById(id) {
        const user = await UserDocument.findById(id).lean();

        return user ? this.toDomainModel(user) : null;
    }


    async create(userData) {
        const allowedRoles = ['client', 'freelancer'];

        const role = allowedRoles.includes(userData.role)
            ? userData.role
            : 'client';

        try {
            const user = await UserDocument.create({
                fullName: userData.fullName,
                email: userData.email.trim().toLowerCase(),
                passwordHash: userData.passwordHash,
                role
            });

            return this.toDomainModel(user.toObject());
        } catch (error) {
            if (error.code === 11000) {
                const duplicateError = new Error('User already exists.');
                duplicateError.code = 'DUPLICATE_EMAIL';

                throw duplicateError;
            }

            throw error;
        }
    }
    toDomainModel(user) {
        return new User({
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            passwordHash: user.passwordHash,
            role: user.role,
            createdAt: user.createdAt instanceof Date
                ? user.createdAt.toISOString()
                : user.createdAt,
            updatedAt: user.updatedAt instanceof Date
                ? user.updatedAt.toISOString()
                : user.updatedAt
        });
    }
}
module.exports = UserRepository;