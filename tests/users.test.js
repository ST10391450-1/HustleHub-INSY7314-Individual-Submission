
const User = require('../src/models/User');

describe('User Model', () => {
    test('should generate a UUID when creating a user', () => {
        const user = new User({
            fullName: 'Test User',
            email: 'TEST@example.com',
            passwordHash: 'hashed-password'
        });

        expect(user.id).toBeDefined();

        expect(user.id).toMatch(
            /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        );
    });

    test('should normalise email addresses', () => {
        const user = new User({
            fullName: 'Test User',
            email: 'TEST@EXAMPLE.COM',
            passwordHash: 'hashed-password'
        });

        expect(user.email).toBe('test@example.com');
    });

    test('should assign the default client role', () => {
        const user = new User({
            fullName: 'Test User',
            email: 'test@example.com',
            passwordHash: 'hashed-password'
        });

        expect(user.role).toBe('client');
    });

    test('should not expose passwordHash in public serialization', () => {
        const user = new User({
            fullName: 'Test User',
            email: 'test@example.com',
            passwordHash: 'secret-hash'
        });

        const publicUser = user.toPublicJSON();

        expect(publicUser.passwordHash).toBeUndefined();
        expect(publicUser.email).toBe('test@example.com');
    });
});
