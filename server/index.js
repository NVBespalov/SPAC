'use strict';
var express = require('express'), app = express(), config = require('config'), bodyParser = require('body-parser'),
    logger = require('./winston')(module), compression = require('compression'), winston = require('winston'),
    http = require('http'), swig = require('swig');

process.env.NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';

logger.info("==================");
logger.info(process.env.NODE_ENV);
logger.info("==================");



app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(compression());

new winston.Logger({
    level: 'error',
    exitOnError: false,
    transports: [
        new (winston.transports.Console)({
            json: config.get('logger.json'),
            colorize: config.get('logger.colorize'),
            timestamp: config.get('logger.timestamp'),
            handleExceptions: true,
            humanReadableUnhandledException: true
        })
    ]
});

// http requests logger
// should be before routers init
require('./request-logger.js')(app);

// template engine init
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/../views');

// static path init
app.use(express.static('public'));

// db init and models
require('./db.connect');

// Express MongoDB session init
require('./express.store.js')(app);

// Bundle front-end (development)
process.env.NODE_ENV === 'development' ? require('./bundle.js')(app) : void 0;

// server init
app.server = http.createServer(app);
app.server.listen(config.get('server.port'), config.get('server.host'), function () {
    var host = app.server.address().address;
    var port = app.server.address().port;
    logger.info('Listening at http://%s:%s', host, port);
});

// including all routers
require('../routers')(app);


module.exports = app.server;