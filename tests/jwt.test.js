
const {
    generateToken,
    verifyToken
} = require('../src/utils/jwtUtils');

describe('JWT Authentication', () => {

    const testUser = {
        id: '123e4567-e89b-42d3-a456-426614174000',
        role: 'client'
    };

    test('should generate a valid JWT', () => {
        const token = generateToken(testUser);

        expect(typeof token).toBe('string');
        expect(token.split('.')).toHaveLength(3);
    });

    test('should include the user UUID and role', () => {
        const token = generateToken(testUser);

        const decoded = verifyToken(token);

        expect(decoded.sub).toBe(testUser.id);
        expect(decoded.role).toBe(testUser.role);
    });

    test('should reject an invalid token', () => {
        expect(() => {
            verifyToken('invalid.token.value');
        }).toThrow();
    });

    test('should reject an expired token', () => {
        const jwt = require('jsonwebtoken');
        const config = require('../src/config/config');

        const expiredToken = jwt.sign(
            { role: 'client' },
            config.authentication.jwtSecret,
            {
                subject: testUser.id,
                expiresIn: -1,
                algorithm: 'HS256'
            }
        );

        expect(() => {
            verifyToken(expiredToken);
        }).toThrow();
    });
});
