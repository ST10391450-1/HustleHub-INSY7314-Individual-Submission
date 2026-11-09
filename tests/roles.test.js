const {
    USER_ROLES,
    authorizeRoles
} = require('../src/middleware/roleMiddleware');

describe('Role-Based Access Control', () => {

    test('should define all three required roles', () => {
        expect(USER_ROLES.CLIENT).toBe('client');
        expect(USER_ROLES.FREELANCER).toBe('freelancer');
        expect(USER_ROLES.ADMIN).toBe('admin');
    });

    test('should allow a client when client access is permitted', () => {
        const req = { user: { role: 'client' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn();

        authorizeRoles(USER_ROLES.CLIENT)(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    test('should allow a freelancer when freelancer access is permitted', () => {
        const req = { user: { role: 'freelancer' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn();

        authorizeRoles(USER_ROLES.FREELANCER)(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
    });

    test('should allow an admin when admin access is permitted', () => {
        const req = { user: { role: 'admin' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn();

        authorizeRoles(USER_ROLES.ADMIN)(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
    });

    test('should reject users without authentication', () => {
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn();

        authorizeRoles(USER_ROLES.ADMIN)(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    test('should reject users with insufficient permissions', () => {
        const req = { user: { role: 'client' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn();

        authorizeRoles(USER_ROLES.ADMIN)(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            error: {
                code: 'INSUFFICIENT_PERMISSIONS',
                message: 'You do not have permission to access this resource.'
            }
        });
        expect(next).not.toHaveBeenCalled();
    });

});