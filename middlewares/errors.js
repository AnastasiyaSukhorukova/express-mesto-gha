const { defaultErrorMessage } = require('../constants/constants');

module.exports = (err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500 ? defaultErrorMessage : message,
    });

  next();
};
