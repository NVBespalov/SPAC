'use strict';
/**
 * Created by nbespalov on 23.08.2016.
 */
const mongoose = require('mongoose');

module.exports =  mongoose.model('Endpoint',  new mongoose.Schema({
    path: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    middleware: [{type:mongoose.Schema.Types.ObjectId}]
}));