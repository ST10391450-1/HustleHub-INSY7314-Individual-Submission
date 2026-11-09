
const fs = require('fs/promises');
const path = require('path');

const User = require('../models/User');
const config = require('../config/config');

class UserRepository {

    //region Repository Initialisation

    constructor(filePath = config.storage.dataFilePath) {
        this.filePath = path.resolve(filePath);
        this.writeQueue = Promise.resolve();
    }

    async initialise() {
        const directory = path.dirname(this.filePath);

        await fs.mkdir(directory, { recursive: true });

        try {
            await fs.writeFile(this.filePath, '[]', {
                flag: 'wx',
                encoding: 'utf8'
            });
        } catch (error) {
            if (error.code !== 'EEXIST') {
                throw error;
            }
        }
    }

    //endregion

    //region User Retrieval

    async getAll() {
        const contents = await fs.readFile(this.filePath, 'utf8');
        const users = JSON.parse(contents);

        if (!Array.isArray(users)) {
            throw new Error('User data file contains invalid data.');
        }

        return users.map(user => new User(user));
    }

    async findByEmail(email) {
        const normalisedEmail = email.trim().toLowerCase();
        const users = await this.getAll();

        return users.find(user => user.email === normalisedEmail) || null;
    }

    async findById(id) {
        const users = await this.getAll();

        return users.find(user => user.id === id) || null;
    }

    //endregion

    //region User Storage

    async saveAll(users) {
        const temporaryPath =
            `${this.filePath}.${process.pid}.${Date.now()}.tmp`;

        try {
            await fs.writeFile(
                temporaryPath,
                JSON.stringify(users, null, 4),
                {
                    encoding: 'utf8',
                    flag: 'wx'
                }
            );

            await fs.rename(temporaryPath, this.filePath);
        } catch (error) {
            await fs.unlink(temporaryPath).catch(() => {});
            throw error;
        }
    }
    async create(userData) {
        const operation = this.writeQueue.then(async () => {
            const users = await this.getAll();

            const email = userData.email.trim().toLowerCase();

            const existingUser = users.find(
                user => user.email === email
            );

            if (existingUser) {
                const error = new Error('User already exists.');
                error.code = 'DUPLICATE_EMAIL';
                throw error;
            }

            const allowedRoles = ['client', 'freelancer'];

            const role = allowedRoles.includes(userData.role)
                ? userData.role
                : 'client';

            const user = new User({
                fullName: userData.fullName,
                email,
                passwordHash: userData.passwordHash,
                role
            });

            users.push(user);

            await this.saveAll(users);

            return user;
        });

        this.writeQueue = operation.catch(() => {});

        return operation;
    }

    //endregion
}

module.exports = UserRepository;
