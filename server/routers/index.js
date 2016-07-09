'use strict';
const authRouter = require('./authentication');
module.exports = function routerBootstrap (app) {
    app.use('/auth', authRouter);
};
