
const os = require('os');
const path = require('path');
const fs = require('fs/promises');
const request = require('supertest');

//region Test Environment Configuration
const testDataFile = path.join(
    os.tmpdir(),
    `hustlehub-api-tests-${process.pid}.json`
);

process.env.DATA_FILE_PATH = testDataFile;

const app = require('../src/app');

const testUser = {
    fullName: 'Integration Test User',
    email: 'integration-test@hustlehub.co.za',
    password: 'HustleHub123'
};

let authToken = null;
//endregion

//region Integration Test Setup
beforeAll(async () => {
    await fs.rm(testDataFile, { force: true });
    await fs.writeFile(testDataFile, '[]', 'utf8');
});

afterAll(async () => {
    await fs.rm(testDataFile, { force: true });
});
//endregion

//region Registration Tests
describe('POST /api/auth/register', () => {
    test('should register a new user successfully', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send(testUser);

        expect(response.status).toBe(202);
        expect(response.body.success).toBe(true);
    });
});
//endregion

//region Login Tests
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
//endregion

//region Protected Profile Tests
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
//endregion
