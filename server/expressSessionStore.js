"use strict";
var mongoose = require('mongoose')
    , session = require('express-session')
    , config = require('config')
    , MongoStore = require('connect-mongo')(session)
    , crypto = require('crypto');

function genid (req){
    if (req.session && req.session.user) {
        var id = req.session.user._id.toString();
        return id + '_' + (new Date()).getTime();
    } else {
        return crypto.createHash("md5").update(((new Date()).getTime()).toString()).digest("hex");
    }
}

module.exports = function ExpressMongoStore (app) {
    var mongodbStoreCfg = Object.assign({}, {mongooseConnection: mongoose.connection}, config.get('mongoStore'));
    var sessionCfg  = Object.assign({}, {store: new MongoStore(mongodbStoreCfg), genid: genid}, config.get('session'));
    app.use(session(sessionCfg));
};
