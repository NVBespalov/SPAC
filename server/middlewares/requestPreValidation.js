/**
 * Created by nbespalov on 08.07.2016.
 */
const HTTPError = require('./../error/HttpError'), HTTPValidationError = require('./../error/HttpValidationError');
function signInPreValidation(req, res, next) {
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email does not appear to be valid').isEmail();
    var errors = req.validationErrors();
    if (errors) {
        next(new HTTPValidationError(409, errors));
    } else {
        next();
    }
}
function signUpPreValidation(req, res, next) {
    req.sanitizeBody();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email does not appear to be valid').isEmail();
    var errors = req.validationErrors();
    if (errors) {
        next(new HTTPValidationError(409, errors));
    } else {
        next();
    }
}
module.exports = {
    signIn: signInPreValidation,
    signUp: signUpPreValidation
};
