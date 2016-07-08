/**
 * Created by nickbespalov on 04.07.16.
 */
'use strict';
const User =  require('mongoose').model('User'),
    HttpError = require('./../error/HttpError');


module.exports = {
    /**
     * Expect user object in req.session, 400 if have not
     * response public view of user
     * @param req
     * @param res
     */
    signin: function authSignIn(req, res) {
        if (req.session && req.session.user) {
            return res.json({
                data: req.session.user
            });
        }
        return res.status(400).end();
    },

    /**
     * register new user
     * required email, password, RequestCode
     * using RequestCode find group where user want to connect
     *
     *
     * @param req
     * @param res
     * @param next
     */
    signup: function authSignUp(req, res, next) {

        var user = new User(req.body);
        user.save(function (err) {
            if (err) {
                return next(err);
            }
            res.json({data: req.body});
        });
    },

    /**
     * @method signout
     * @param req
     * @param res
     * @returns {*}
     */
    signout: function authSignOut(req, res, next) {
        if (req.session && req.session.user) {
            return req.session.destroy(function onSessionDestroy() {
                res.json({data:{}});
            });
        }
        next(new Error('User not logged in'))
    }

};