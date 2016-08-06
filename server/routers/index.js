'use strict';
const authRouter = require('./authentication');
const indexRouter = require('./indexRouter');
module.exports = function routerBootstrap (app) {
    app.use('/', indexRouter);
    app.use('/auth', authRouter);
};
