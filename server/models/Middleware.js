'use strict';
/**
 * Created by nbespalov on 23.08.2016.
 */
const mongoose = require('mongoose');

module.exports =  mongoose.model('Middleware', new mongoose.Schema({
    path: ''
}));