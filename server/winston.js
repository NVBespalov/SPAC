"use strict";

var winston = require('winston');
var config = require('config');


module.exports = function (module) {
    return loggerBuilder(module.filename);
};

// Return the last folder name in the path and the calling
// module's filename.
var getLabel = function (filename) {
    var parts = filename.split(/\/|\\/);
    return parts[parts.length - 2] + '/' + parts.pop();
};

function loggerBuilder(filename) {
    return new winston.Logger({
        level: config.get('logger.level'),
        exitOnError: false,
        transports: [
            new (winston.transports.Console)({
                label: getLabel(filename),
                json: config.get('logger.json'),
                colorize: config.get('logger.colorize'),
                timestamp: config.get('logger.timestamp')
            })
        ]
    });
}