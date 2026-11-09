//region Error Handling

function errorHandler(error, req, res, next) {
    if (res.headersSent) {
        return next(error);
    }

    const statusCode =
        Number.isInteger(error.statusCode) &&
        error.statusCode >= 400 &&
        error.statusCode <= 599
            ? error.statusCode
            : 500;

    const safeMessages = {
        400: 'The request could not be processed.',
        401: 'Authentication is required.',
        403: 'You are not authorised to perform this action.',
        404: 'The requested resource was not found.',
        413: 'The request body is too large.',
        429: 'Too many requests. Please try again later.'
    };

    console.error(JSON.stringify({
        level: 'error',
        timestamp: new Date().toISOString(),
        method: req.method,
        path: req.path,
        statusCode,
        errorName: error.name,
        errorCode: error.code || 'INTERNAL_SERVER_ERROR',
        errorMessage: error.message,
        errorType: error.type
    }));

    return res.status(statusCode).json({
        success: false,
        error: {
            code: statusCode >= 500
                ? 'INTERNAL_SERVER_ERROR'
                : error.code || 'REQUEST_ERROR',
            message: statusCode >= 500
                ? 'An unexpected server error occurred.'
                : safeMessages[statusCode] || 'The request could not be processed.'
        }
    });
}

//endregion

module.exports = errorHandler;
