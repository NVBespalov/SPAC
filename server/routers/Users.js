'use strict';
var express = require('express'), router = express.Router(),
   crypto = require('crypto'), User = require('mongoose').model('User');
function findUser (req, res, next) {
    var query = {email: req.body.email.toLowerCase()};
    User.findOne(query, function (err, doc) {
        if (err) {
            return next(err);
        }
        if (!doc) {
            return next(new Error('There was an error with your E-Mail/Password combination. Please try again.'));
        }
        
        if (doc.authenticate(req.body.password)) {
            sessionRegenerate(doc, req, next);
        } else {
            req.session.user = undefined;
            next(new Error('There was an error with your E-Mail/Password combination. Please try again.'));
        }
    })
}
var sessionRegenerate = function (user, req, next) {
    req.session.user = user;
    next();
};
router.post('/signin', findUser, require('./../controllers/auth.controller').signin);
router.post('/signup', require('./../controllers/auth.controller').signup);
router.post('/signout', require('./../controllers/auth.controller').signout);

module.exports = function (app) {
    app.use('/auth', router);
};