"use strict";
var config = require('config');
var mongoose = require('mongoose');
var options = config.get('dbConfig.options');
var uri = 'mongodb://' + config.get('dbConfig.host') + ':' + config.get('dbConfig.port') + '/' + config.get('dbConfig.dbName');
var logger = require('../server/winston')(module);
logger.info(uri);
var db = mongoose.connect(uri, options);


// include all models
//require('../models');

module.exports = db;