/**
 * Created by nickbespalov on 07.07.16.
 */
const User = require('mongoose').model('User'), HTTPError = require('./../error/HttpError');
/**
 * @function sessionRegenerate
 * @desc Regenerate session for a newly logged-on user
 * @param user
 * @param req
 * @param next
 */
function sessionRegenerate(user, req, next) {
    req.session.user = user;
    req.session.regenerate(function onRegenerateSession(err) {
        req.session.user = user;
        next(err);
    });
}
/**
 * @function loadUser
 * @desc Method loads user`s data to new regenerated session, if authenticated
 * @param req
 * @param res
 * @param next
 */
function loadUser(req, res, next) {
    var conditions = {email: req.body.email.toLowerCase()};
    User.findOne(conditions, function (err, user) {
        if (err) {
            return next(err);
        } else if (!user) {
            return next(new HTTPError('There was an error with your E-Mail/Password combination. Please try again.'));
        } else if (user.authenticate(req.body.password)) {
            sessionRegenerate(user, req, next);
        } else {
            req.session.user = undefined;
            next(new HTTPError('There was an error with your E-Mail/Password combination. Please try again.'));
        }
    })
}
/**
 *  if authorized
 *
 */
function isAuthorized (req, res, next) {
    if (!req.session.user) {
        return next(new HTTPError('Un authorized'));
    }
    next();
}

module.exports = {
    loadUser: loadUser,
    isAuthorized: isAuthorized
};