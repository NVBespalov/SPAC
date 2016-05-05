"use strict";
var mongoose = require('mongoose')
    , session = require('express-session')
    , config = require('config')
    , MongoStore = require('connect-mongo')(session)
    , crypto = require('crypto');

var genid = function(req){
    if (req.session && req.session.user) {
        var id = req.session.user._id.toString();
        return id + '_' + (new Date()).getTime();
    } else {
        return crypto.createHash("md5")
            .update(((new Date()).getTime()).toString())
            .digest("hex");
    }
};

module.exports = function (app) {
    var mongoStoreCfg = {mongooseConnection: mongoose.connection};
    Object.assign(mongoStoreCfg, config.get('mongoStore'));

    var sessionCfg = {store: new MongoStore(mongoStoreCfg)};
    Object.assign(sessionCfg, {
        secret: 'secret',
        resave: false,
        saveUninitialized: false,
        genid: genid
    });
    app.use(session(sessionCfg));

};
