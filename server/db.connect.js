'use strict';
var config = require('config');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var options = config.get('dbConfig.options');
var uri = 'mongodb://' + config.get('dbConfig.host') + ':' + config.get('dbConfig.port') + '/' + config.get('dbConfig.dbName');
var db = mongoose.connect(uri, options);
require('./models/index.js');
module.exports = db;