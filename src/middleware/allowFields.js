function allowFields(allowedFields) {
    return function (req, res, next) {
        req.body = req.body || {};

        if (
            typeof req.body !== 'object' ||
            Array.isArray(req.body)
        ) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'INVALID_REQUEST_BODY',
                    message: 'The request body must be a JSON object.'
                }
            });
        }

        const unexpectedFields = Object.keys(req.body).filter(
            field => !allowedFields.includes(field)
        );

        if (unexpectedFields.length > 0) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'UNEXPECTED_FIELDS',
                    message: 'The request contains unsupported fields.'
                }
            });
        }

        next();
    };
}

module.exports = allowFields;