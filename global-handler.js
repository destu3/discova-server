// general error handling
const globalErrorHandler = async (err, req, res, next) => {
  const status = 'error';
  const statusCode = 500;

  if (err.isOperational) {
    res
      .status(err.statusCode)
      .json({ status: err.status, message: err.message, name: err.name });
  } else {
    console.log(err);
    res
      .status(statusCode)
      .json({ status, message: err.message, name: err.name });
  }
};

export default globalErrorHandler;
