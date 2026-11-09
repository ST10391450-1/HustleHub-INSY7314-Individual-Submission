const { verifyToken } = require('../utils/jwtUtils');

//region Authentication

function authenticate(req, res, next) {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            error: {
                code: 'AUTHENTICATION_REQUIRED',
                message: 'A valid bearer token is required.'
            }
        });
    }

    const token = authorization.substring(7).trim();

    if (!token) {
        return res.status(401).json({
            success: false,
            error: {
                code: 'AUTHENTICATION_REQUIRED',
                message: 'A valid bearer token is required.'
            }
        });
    }

    try {
        const decoded = verifyToken(token);

        if (
            typeof decoded.sub !== 'string' ||
            typeof decoded.role !== 'string'
        ) {
            throw new Error('Invalid token claims.');
        }

        req.user = {
            userId: decoded.sub,
            role: decoded.role
        };

        next();
    } catch {
        return res.status(401).json({
            success: false,
            error: {
                code: 'INVALID_TOKEN',
                message: 'The authentication token is invalid or expired.'
            }
        });
    }
}

//endregion

module.exports = authenticate;
