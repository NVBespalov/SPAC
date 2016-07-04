'use strict';
var agentsRouter = require('./Agents'), agentsComponentsRouter = require('./Components'), log = require('./Logs'), users = require('./Users');

module.exports = function (app) {
    agentsRouter(app);
    agentsComponentsRouter(app);
    log(app);
    users(app);
};
