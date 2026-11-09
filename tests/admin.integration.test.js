const request = require('supertest');
const app = require('../src/app');
const { generateToken } = require('../src/utils/jwtUtils');

describe('GET /api/admin/dashboard', () => {

    test('should reject requests without a JWT', async () => {
        const response = await request(app)
            .get('/api/admin/dashboard');

        expect(response.status).toBe(401);
        expect(response.body.error.code).toBe(
            'AUTHENTICATION_REQUIRED'
        );
    });

    test('should reject clients accessing the admin dashboard', async () => {
        const clientToken = generateToken({
            id: 'client-test-user',
            role: 'client'
        });

        const response = await request(app)
            .get('/api/admin/dashboard')
            .set('Authorization', `Bearer ${clientToken}`);

        expect(response.status).toBe(403);
        expect(response.body.error.code).toBe(
            'INSUFFICIENT_PERMISSIONS'
        );
    });

    test('should allow administrators to access the dashboard', async () => {
        const adminToken = generateToken({
            id: 'admin-test-user',
            role: 'admin'
        });

        const response = await request(app)
            .get('/api/admin/dashboard')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe(
            'Administrator access granted.'
        );
    });

});