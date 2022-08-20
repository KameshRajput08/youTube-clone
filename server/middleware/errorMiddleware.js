export const errorHandler = (err, req, res, next) => {
  const statusCode = err.status ? err.status : 500;

console.log(err)

  res.status(statusCode);
  res.json({
    success: false,
    message: err.message || message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export const createError = (status, message) => {
  const err = new Error();
  err.status = status;
  err.message = message;
  return err;
};
