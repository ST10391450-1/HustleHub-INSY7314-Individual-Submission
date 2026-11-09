
const {
    validatePassword,
    hashPassword,
    comparePassword
} = require('../src/utils/passwordUtils');

describe('Password Security', () => {

    test('should accept a strong password', () => {
        const errors = validatePassword(
            'SecurePass123',
            'user@example.com'
        );

        expect(errors).toHaveLength(0);
    });

    test('should reject passwords shorter than 8 characters', () => {
        const errors = validatePassword(
            'Abc123',
            'user@example.com'
        );

        expect(errors).toContain(
            'Password must contain at least 8 characters.'
        );
    });

    test('should reject passwords without uppercase letters', () => {
        const errors = validatePassword(
            'securepass123',
            'user@example.com'
        );

        expect(errors).toContain(
            'Password must contain an uppercase letter.'
        );
    });

    test('should reject passwords without lowercase letters', () => {
        const errors = validatePassword(
            'SECUREPASS123',
            'user@example.com'
        );

        expect(errors).toContain(
            'Password must contain a lowercase letter.'
        );
    });

    test('should reject passwords without digits', () => {
        const errors = validatePassword(
            'SecurePassword',
            'user@example.com'
        );

        expect(errors).toContain(
            'Password must contain a digit.'
        );
    });

    test('should reject common passwords', () => {
        const errors = validatePassword(
            'Password123',
            'user@example.com'
        );

        expect(errors).toContain('Password is too common.');
    });

    test('should reject passwords containing the email name', () => {
        const errors = validatePassword(
            'Thomas12345',
            'thomas@example.com'
        );

        expect(errors).toContain(
            'Password cannot contain your email name.'
        );
    });

    test('should reject passwords exceeding 128 characters', () => {
        const errors = validatePassword(
            'A'.repeat(129) + '1a',
            'user@example.com'
        );

        expect(errors).toContain(
            'Password cannot exceed 128 characters.'
        );
    });

    test('should hash passwords instead of storing plaintext', async () => {
        const password = 'SecurePass123';

        const hash = await hashPassword(password);

        expect(hash).not.toBe(password);
        expect(hash).toMatch(/^\$2[aby]\$12\$/);
    });

    test('should correctly compare a password with its hash', async () => {
        const password = 'SecurePass123';

        const hash = await hashPassword(password);

        await expect(
            comparePassword(password, hash)
        ).resolves.toBe(true);

        await expect(
            comparePassword('WrongPassword123', hash)
        ).resolves.toBe(false);
    });
});
