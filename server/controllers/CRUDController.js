'use strict';
/**
 * Created by nbespalov on 23.08.2016.
 */
const Observable = require('rxjs/Rx').Observable;
module.exports = {
    get: function (model, req, res, next) {
        const Model = require('mongoose').model(model);
        Observable.fromPromise(req.params._id ? Model.findOne({_id:req.params._id}) : Model.find())
            .subscribe(function (doc) {
                if (req.xhr || req.headers.accept.indexOf('json') > -1) {
                    res.json(doc);
                } else {
                    res.render('home', {body: doc, data: JSON.stringify(doc)});
                }
            }, next);
    },
    put: function (model, req, res, next) {
        const Model = require('mongoose').model(model);
        Observable.findAndUpdate(Model.findOneAndUpdate({_id:req.params._id}, {$set:req.body}))
            .subscribe(function (doc) {
                res.json(doc);
            }, next);
    },
    post: function (model, req, res, next) {
        const Model = require('mongoose').model(model);
        Observable.findAndUpdate(Model.findOneAndUpdate({_id:req.params._id}, {$set:req.body}, {upsert: true}))
            .subscribe(function (doc) {
                res.json(doc);
            }, next);
    },
    delete: function (model, req, res, next) {
        const Model = require('mongoose').model(model);
        Observable.findAndRemove(Model.findOneAndUpdate({_id:req.params._id}, {$set:req.body}, {upsert: true}))
            .subscribe(function (doc) {
                res.json(doc);
            }, next);
    },
    patch: function (model, req, res, next) {
        const Model = require('mongoose').model(model);
        Observable.findAndUpdate(Model.findOneAndUpdate({_id:req.params._id}, {$set:req.body}))
            .subscribe(function (doc) {
                res.json(doc);
            }, next);
    }
};