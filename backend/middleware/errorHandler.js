const errorHandler = (err, req, res, next) => {
  // Creating the defaul error response
  const errorResponse = {
    status: "error",
    message: err.message || "Something went wrong",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  };

  // Handling Mongoose validation errors
  if (err.name === "ValidationError") {
    err.statusCode = 400;
    errorResponse.message = Object.values(err.errors)
      .map((error) => error.message)
      .join(". ");
  }

  // Handling JWT Errors
  if (err.name === "JsonWebTokenError") {
    err.statusCode = 401;
    errorResponse.message = "Invalid Token";
  }

  // Setting status code
  const statusCode = err.statusCode || 500;

  // Logging the error in development
  if (process.env.NODE_ENV === "development") {
    console.log(`[${new Date().toISOString()}] ${statusCode} - ${err.message}`);
    console.error(err.stack);
  }

  // Sending response
  res.status(statusCode).json(errorResponse);
};

export default errorHandler;
