/**
 * Created by nickbespalov on 19.06.16.
 */
const HttpError = require('./../error/HttpError'), errorHandler = require('errorhandler');

module.exports = function HTTPErrorHandler(app) {
    app.use(function (err, req, res, next) {
        if (err instanceof HttpError) {
            res.sendHttpError(err);
        } else {
            if(app.get('env') === 'development') {
                errorHandler()(err, req, res, next);
            } else {
                next(err);
            }
        }

    });
};