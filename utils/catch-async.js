// pass error to global error handler if an error occurs in async function
const catchAsyncError = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(err => next(err));
  };
};

export default catchAsyncError;
