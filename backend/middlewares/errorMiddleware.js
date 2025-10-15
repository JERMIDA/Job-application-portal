export const errorHandler = (err, req, res) => {
  console.error(err.stack);

  // Default error structure
  const errorResponse = {
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
      code: err.code || 500,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }
  };

  // Specific handling for different error types
  if (err.name === 'ValidationError') {
    errorResponse.error.code = 400;
    errorResponse.error.message = err.message;
    errorResponse.error.details = err.errors;
  }

  // MySQL errors
  if (err.code === 'ER_DUP_ENTRY') {
    errorResponse.error.code = 409;
    errorResponse.error.message = 'Duplicate entry detected';
  } else if (err.code && typeof err.code === 'string' && err.code.startsWith('ER_')) {
    errorResponse.error.code = 400; // Map MySQL errors to HTTP 400 Bad Request
    errorResponse.error.message = 'Database query error';
  }

  // Handle unexpected errors like ESOCKET
  if (err.code === 'ESOCKET') {
    errorResponse.error.code = 500; // Map ESOCKET to HTTP 500 Internal Server Error
    errorResponse.error.message = 'Socket error occurred';
  }

  // Ensure the status code is valid
  const statusCode = Number.isInteger(errorResponse.error.code) ? errorResponse.error.code : 500;

  res.status(statusCode).json(errorResponse);
};

export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Not Found - ${req.originalUrl}`,
  });
};