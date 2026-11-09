const jwt = require('jsonwebtoken');
const config = require('../config/config');

//region Token Generation

function generateToken(user) {
    return jwt.sign(
        {
            role: user.role
        },
        config.authentication.jwtSecret,
        {
            subject: user.id,
            expiresIn: config.authentication.jwtExpiresIn,
            algorithm: 'HS256'
        }
    );
}

//endregion

//region Token Verification

function verifyToken(token) {
    return jwt.verify(
        token,
        config.authentication.jwtSecret,
        {
            algorithms: ['HS256']
        }
    );
}

//endregion

//region Exports

module.exports = {
    generateToken,
    verifyToken
};

//endregion
