// wrapper function that adds catch to each async function and handles errors by sending them to global error handling middleware
export function catchAsync(fn) {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
}
