const inherits = require('util').inherits, http = require('http');
const HttpError = function HttpError (status, message) {
    Error.apply(this, arguments);
    Error.captureStackTrace(this, HttpError);
    this.status = status;
    this.message = message || http.STATUS_CODES[status] || 'Error';
};

inherits(HttpError, Error);

HttpError.prototype.name = 'HttpError';
module.exports = HttpError;