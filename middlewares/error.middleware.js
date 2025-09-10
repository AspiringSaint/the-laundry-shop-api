const errorHandler = (error, request, response, next) => {
    const status = error.statusCode ? error.statusCode : 500;

    response.status(status).json(
        {
            message: error.message || 'Internal Server Error',
            isError: true
        }
    )
};

module.exports = errorHandler;