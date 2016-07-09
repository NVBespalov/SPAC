/**
 * Created by nickbespalov on 19.06.16.
 */
const MongooseValidationError = require('mongoose/lib/error/validation');

module.exports = function HTTPErrorHandler(app) {
    app.use(function (err, req, res, next) {
        if (err instanceof MongooseValidationError) {
            err.status = 400;
        }
        res.sendHttpError(err);
    });
};