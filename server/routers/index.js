'use strict';
const authRouter = require('./authentication');
const indexRouter = require('./indexRouter');
const Endpoint = require('mongoose').model('Endpoint');
const Middleware = require('mongoose').model('Middleware');
const Observable = require('rxjs/Rx').Observable;
const methods = ['get', 'post', 'put', 'delete', 'patch'];
const CRUDController = require('./../controllers/CRUDController.js');

module.exports = function routerBootstrap (app) {
    // app.use('/', indexRouter);
    // app.use('/auth', authRouter);
    // Middleware.update({}, {path:'auth'}, {upsert: true}).exec(function () {
    //     Middleware.findOne({path:'auth'},function (err, middleware) {
    //         Endpoint.update({_id:'57bbe32dd6903ab533ab719b'}, {$set: {path: '/user', model: 'User'}, $addToSet:{
    //             middleware: middleware._id
    //         }}, {upsert: true}).exec();
    //     })
    //
    // });
    Observable.from(Observable.fromPromise(Endpoint.find()))
        .subscribe(function (endpoints) {
            endpoints.forEach(function (endpoint) {
                methods.map(m=>app[m](endpoint.path, CRUDController[m].bind(null, endpoint.model)));
                app.get(`${endpoint.path}/:_id`, methods['get']);
            });
        }, function (err) {
            debugger
        })
};
