const USER_ROLES = Object.freeze({
    CLIENT: 'client',
    FREELANCER: 'freelancer',
    ADMIN: 'admin'
});

function authorizeRoles(...allowedRoles) {
    return function (req, res, next) {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'AUTHENTICATION_REQUIRED',
                    message: 'Authentication is required.'
                }
            });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: {
                    code: 'INSUFFICIENT_PERMISSIONS',
                    message: 'You do not have permission to access this resource.'
                }
            });
        }

        next();
    };
}

module.exports = {
    USER_ROLES,
    authorizeRoles
};