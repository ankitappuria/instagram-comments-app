const ApiResponse = require('../utils/ApiResponse');

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json(
    ApiResponse.error(err.message, err.code || 'INTERNAL_ERROR')
  );
};

module.exports = errorHandler;