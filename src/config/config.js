const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

//region Environment Configuration

dotenv.config({
    path: path.resolve(process.cwd(), '.env')
});

//endregion

//region Configuration Validation

function getRequiredValue(name) {
    const value = process.env[name];

    if (!value || value.trim() === '') {
        throw new Error(`Missing required environment variable: ${name}`);
    }

    return value.trim();
}

function getBooleanValue(name, defaultValue) {
    const value = process.env[name];

    if (value === undefined) {
        return defaultValue;
    }

    if (value.toLowerCase() === 'true') {
        return true;
    }

    if (value.toLowerCase() === 'false') {
        return false;
    }

    throw new Error(`${name} must be either true or false.`);
}

/*
 * Functionality for validating numeric environment values.
 */
function getNumberValue(name, defaultValue) {
    const value = process.env[name];

    if (value === undefined) {
        return defaultValue;
    }

    const number = Number(value);

    if (!Number.isInteger(number)) {
        throw new Error(`${name} must be a valid integer.`);
    }

    return number;
}

//endregion

//region Application Settings

const nodeEnv = process.env.NODE_ENV || 'development';

const port = getNumberValue('PORT', 3000);

const httpsEnabled = getBooleanValue('HTTPS_ENABLED', true);

const bcryptSaltRounds = getNumberValue('BCRYPT_SALT_ROUNDS', 12);

const jwtSecret = getRequiredValue('JWT_SECRET');

const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1h';

const enumerationSafeRegistration = getBooleanValue(
    'ENUMERATION_SAFE_REGISTRATION',
    true
);

const dataFilePath = path.resolve(
    process.cwd(),
    getRequiredValue('DATA_FILE_PATH')
);

const mongoUri = getRequiredValue('MONGO_URI');

const sslKeyPath = path.resolve(
    process.cwd(),
    getRequiredValue('SSL_KEY_PATH')
);

const sslCertPath = path.resolve(
    process.cwd(),
    getRequiredValue('SSL_CERT_PATH')
);

//endregion

//region Security Validation

if (!/^[a-fA-F0-9]{128,}$/.test(jwtSecret)) {
    throw new Error(
        'JWT_SECRET must contain at least 128 hexadecimal characters.'
    );
}

if (bcryptSaltRounds < 10 || bcryptSaltRounds > 15) {
    throw new Error(
        'BCRYPT_SALT_ROUNDS must be between 10 and 15.'
    );
}

if (port < 1 || port > 65535) {
    throw new Error('PORT must be between 1 and 65535.');
}

if (nodeEnv === 'production' && !httpsEnabled) {
    throw new Error(
        'HTTPS must be enabled when NODE_ENV is production.'
    );
}

if (httpsEnabled) {
    if (!fs.existsSync(sslKeyPath)) {
        throw new Error(`SSL private key not found: ${sslKeyPath}`);
    }

    if (!fs.existsSync(sslCertPath)) {
        throw new Error(`SSL certificate not found: ${sslCertPath}`);
    }
}

//endregion

//region Configuration Export

const config = Object.freeze({
    environment: nodeEnv,
    port,

    https: {
        enabled: httpsEnabled,
        keyPath: sslKeyPath,
        certificatePath: sslCertPath
    },

    authentication: {
        jwtSecret,
        jwtExpiresIn
    },

    security: {
        bcryptSaltRounds,
        enumerationSafeRegistration
    },

    storage: {
        dataFilePath
    },
    database: {
        mongoUri
    }
});

module.exports = config;

//endregion
