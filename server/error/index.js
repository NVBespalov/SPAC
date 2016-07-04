/**
 * Created by nickbespalov on 19.06.16.
 */
const HttpError = require('./HttpError'), errorHandler = require('errorhandler');

module.exports = function(app) {
    app.use(function (err, req, res, next) {
        if (err instanceof HttpError) {
            res.sendHttpError(err)
        } else {
            if(app.get('env') === 'development') {
                errorHandler()(err, req, res, next);
            } else {
                res.sendHttpError(new HttpError(500));
            }
        }

    });
};