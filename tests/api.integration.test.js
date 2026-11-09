
const os = require('os');
const path = require('path');
const fs = require('fs/promises');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const request = require('supertest');
dotenv.config({
    path: path.resolve(process.cwd(), '.env'),
    quiet: true
});

const testDataFile = path.join(
    os.tmpdir(),
    `hustlehub-api-tests-${process.pid}.json`
);

const mongoUsername = encodeURIComponent(
    process.env.MONGO_ROOT_USERNAME
);

const mongoPassword = encodeURIComponent(
    process.env.MONGO_ROOT_PASSWORD
);

process.env.NODE_ENV = 'test';
process.env.DATA_FILE_PATH = testDataFile;

process.env.MONGO_URI =
    `mongodb://${mongoUsername}:${mongoPassword}` +
    '@127.0.0.1:27017/hustlehub_test?authSource=admin';

const { connectDatabase, disconnectDatabase } =
    require('../src/config/database');

const app = require('../src/app');

const testUser = {
    fullName: 'Integration Test User',
    email: 'integration-test@hustlehub.co.za',
    password: 'HustleHub123'
};

let authToken = null;

jest.setTimeout(15000);

beforeAll(async () => {
    await fs.rm(testDataFile, { force: true });
    await fs.writeFile(testDataFile, '[]', 'utf8');

    await connectDatabase();
    await mongoose.connection.dropDatabase();
});

afterAll(async () => {
    try {
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.dropDatabase();
        }

        await disconnectDatabase();
    } finally {
        await fs.rm(testDataFile, { force: true });
    }
});
describe('POST /api/auth/register', () => {
    test('should register a new user successfully', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send(testUser);

        expect(response.status).toBe(202);
        expect(response.body.success).toBe(true);
    });
});

describe('POST /api/auth/login', () => {
    test('should authenticate valid credentials and return a JWT', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: testUser.email,
                password: testUser.password
            });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.token).toBeDefined();

        authToken = response.body.data.token;
    });

    test('should reject an incorrect password', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: testUser.email,
                password: 'WrongPassword123'
            });

        expect(response.status).toBe(401);
        expect(response.body.error.code).toBe('INVALID_CREDENTIALS');
    });

    test('should reject an unknown email address', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'unknown@hustlehub.co.za',
                password: 'WrongPassword123'
            });

        expect(response.status).toBe(401);
        expect(response.body.error.code).toBe('INVALID_CREDENTIALS');
    });
});

describe('GET /api/users/me', () => {
    test('should reject requests without a JWT', async () => {
        const response = await request(app)
            .get('/api/users/me');

        expect(response.status).toBe(401);
        expect(response.body.error.code).toBe('AUTHENTICATION_REQUIRED');
    });

    test('should return the authenticated user profile', async () => {
        const response = await request(app)
            .get('/api/users/me')
            .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body.data.user.email).toBe(testUser.email);
        expect(response.body.data.user.role).toBe('client');
        expect(response.body.data.user.passwordHash).toBeUndefined();
    });
});
