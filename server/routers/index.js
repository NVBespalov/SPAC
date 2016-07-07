'use strict';
const authRouter = require('./Auth');
module.exports = function routerBootstrap (app) {
    app.use('/auth', authRouter);
};
