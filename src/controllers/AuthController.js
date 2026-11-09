
const { randomBytes } = require('crypto');

const UserRepository = require('../repositories/UserRepository');
const config = require('../config/config');

const {
    validatePassword,
    hashPassword,
    comparePassword
} = require('../utils/passwordUtils');

const { generateToken } = require('../utils/jwtUtils');

//region Controller Initialisation

const userRepository = new UserRepository();

const dummyPasswordHash = hashPassword(
    randomBytes(32).toString('hex')
);

//endregion

//region User Registration

async function register(req, res, next) {
    try {
        const { fullName, email, password } = req.body;

        // Only client and freelancer roles are permitted.
        const allowedRoles = ['client', 'freelancer'];

        const role = allowedRoles.includes(req.body.role)
            ? req.body.role
            : 'client';

        const passwordErrors = validatePassword(password, email);

        if (passwordErrors.length > 0) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'PASSWORD_POLICY_VIOLATION',
                    message: 'The password does not meet the security requirements.',
                    details: passwordErrors
                }
            });
        }

        const passwordHash = await hashPassword(password);

        let created = false;

        try {
            await userRepository.create({
                fullName: fullName.trim(),
                email: email.toLowerCase().trim(),
                passwordHash,
                role
            });

            created = true;
        } catch (error) {
            if (error.code !== 'DUPLICATE_EMAIL') {
                throw error;
            }
        }

        if (config.security.enumerationSafeRegistration) {
            return res.status(202).json({
                success: true,
                message: 'Registration request processed. You can now attempt to sign in.'
            });
        }

        // Demonstration mode: intentionally reveals whether the email exists.
        if (!created) {
            return res.status(409).json({
                success: false,
                error: {
                    code: 'EMAIL_ALREADY_REGISTERED',
                    message: 'An account with this email address already exists.'
                }
            });
        }

        return res.status(201).json({
            success: true,
            message: 'Account created successfully.'
        });
    } catch (error) {
        next(error);
    }
}

//endregion

//region User Login

async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        const user = await userRepository.findByEmail(
            email.toLowerCase().trim()
        );

        const passwordHash = user
            ? user.passwordHash
            : await dummyPasswordHash;

        const passwordMatches = await comparePassword(
            password,
            passwordHash
        );

        if (!user || !passwordMatches) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'INVALID_CREDENTIALS',
                    message: 'Invalid email address or password.'
                }
            });
        }

        const token = generateToken(user);

        return res.status(200).json({
            success: true,
            message: 'Login successful.',
            data: {
                token,
                user: user.toPublicJSON()
            }
        });
    } catch (error) {
        next(error);
    }
}

//endregion

module.exports = {
    register,
    login
};
