const UserRepository = require('../repositories/UserRepository');

//region Controller Initialisation

const userRepository = new UserRepository();

//endregion

//region User Profile

async function getMe(req, res, next) {
    try {
        const user = await userRepository.findById(req.user.userId);

        if (!user) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'USER_NOT_FOUND',
                    message: 'The authenticated account could not be found.'
                }
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                user: user.toPublicJSON()
            }
        });
    } catch (error) {
        next(error);
    }
}

//endregion

module.exports = {
    getMe
};
