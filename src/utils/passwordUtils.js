const bcrypt = require('bcrypt');
const config = require('../config/config');

//region Password Policy

const COMMON_PASSWORDS = new Set([
    'password',
    'password123',
    'password1234',
    '12345678',
    '123456789',
    'qwerty123',
    'letmein123',
    'admin123',
    'welcome123',
    'iloveyou123',
    'changeme123'
]);

function validatePassword(password, email) {
    const errors = [];

    if (typeof password !== 'string') {
        return ['Password must be a string.'];
    }

    if (password.length < 8) {
        errors.push('Password must contain at least 8 characters.');
    }

    if (password.length > 128) {
        errors.push('Password cannot exceed 128 characters.');
    }

    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain a lowercase letter.');
    }

    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain an uppercase letter.');
    }

    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain a digit.');
    }

    if (COMMON_PASSWORDS.has(password.toLowerCase())) {
        errors.push('Password is too common.');
    }

    if (typeof email === 'string' && email.includes('@')) {
        const emailName = email
            .split('@')[0]
            .toLowerCase()
            .trim();

        if (emailName.length >= 3 &&
            password.toLowerCase().includes(emailName)) {
            errors.push('Password cannot contain your email name.');
        }
    }

    return errors;
}

//endregion

//region Password Hashing

async function hashPassword(password) {
    return bcrypt.hash(
        password,
        config.security.bcryptSaltRounds
    );
}

async function comparePassword(password, passwordHash) {
    return bcrypt.compare(password, passwordHash);
}

//endregion

//region Exports

module.exports = {
    validatePassword,
    hashPassword,
    comparePassword
};

//endregion
