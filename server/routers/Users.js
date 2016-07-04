'use strict';
var express = require('express'), path = require('path'), router = express.Router(),
    getPath = require('deep').getPath, crypto = require('crypto'), HttpError = require('./../error/HttpError');


function encryptPassword(password, salt) {
    return crypto.createHmac('sha1', salt).update(password).digest('hex');
}
function makeSalt() {
    return Math.round((new Date().valueOf() * Math.random())) + '';
}

router.post('/login', function (req, res, next) {
    const blackList = ['hashedPassword', 'salt'];
    user.hashedPassword === encryptPassword(getPath(req, 'body.password'), getPath(user, 'salt') + '') ?
        res.json(omit(user, blackList))
        :
        next(new HttpError(403, res.__('Wrong password')))
});
router.post('/register', function (req, res, next) {
    var salt = makeSalt();
    const user = {
        salt: salt,
        hashedPassword: encryptPassword(getPath(req, 'body.password'), salt),
        email: getPath(req, 'body.email')
    };
    sqlliteCrudFactory
        .create({db: db, tableName: 'users', values: user})
        .then(res.json.bind(res))
        .catch(next)
});
module.exports = function (app) {
    app.use('/users', router);
};