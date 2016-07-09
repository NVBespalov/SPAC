const inherits = require('util').inherits, http = require('http');
const HttpValidationError = function HttpValidationError (status, message, errors) {
    Error.apply(this, arguments);
    Error.captureStackTrace(this, HttpValidationError);
    this.status = status;
    this.errors = errors;
    this.message = message || http.STATUS_CODES[status] || 'Error';
};

inherits(HttpValidationError, Error);

HttpValidationError.prototype.name = 'HttpValidationError';
module.exports = HttpValidationError;