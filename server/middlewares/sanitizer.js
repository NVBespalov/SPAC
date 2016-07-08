/**
 * Created by nbespalov on 08.07.2016.
 */
module.exports = function sanitizer(req,res, next) {
    req.sanitizeBody();
    next();
};