const path = require('path'), inherit = require('./../../utils/Object').inherit, http = require('http');
function HttpError (status, message) {
    Error.apply(this, arguments);
    Error.captureStackTrace(this, HttpError);
    this.status = status;
    this.message = message || http.STATUS_CODES(status) || 'Error';
}

inherit(HttpError, Error);

HttpError.prototype.name = 'HttpError';
module.exports = HttpError;