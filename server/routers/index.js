'use strict';
const authRouter = require('./authentication');
module.exports = function routerBootstrap (app) {
    app.use(require('../middlewares/sanitizer'));
    app.use('/auth', authRouter);
};
