'use strict';
const path = require('path');
process.env.NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
process.env.NODE_CONFIG_DIR = process.env.NODE_CONFIG_DIR ? process.env.NODE_CONFIG_DIR : path.resolve(__dirname + './../config');
const express = require('express'), app = express(), config = require('config'), bodyParser = require('body-parser'),
    compression = require('compression'), https = require('https'), http = require('http'), fs = require('fs'),
    serverKey = __dirname + '/server.key', serverCert = __dirname + '/server.crt',
    i18n = require('./localizer')(app), logger = require('morgan'), helmet = require('helmet');

console.info("==================");
console.info(i18n.__('express running in env', process.env.NODE_ENV));
console.info("==================");

app.use(require('./error/sendHttpError'));
app.use(helmet());
app.use(express.static(path.resolve(__dirname, './../public')));

require('./db.connect');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(compression({}));

require('./expressSessionStore')(app);

if (process.env.NODE_ENV === 'development') {
    app.use(logger('dev'));
    http.createServer(app).listen(config.get('server.httpPort'), config.get('server.host'), function () {
        console.info(i18n.__('express server running on', config.get('server.host'), config.get('server.httpPort')));
    });
    app.all('/build/*', function (req, res) { // Redirect to webpack dev server to acquire the frontend app (development ONLY!!!)
        const proxy = require('http-proxy').createProxyServer();
        proxy.web(req, res, {
            target: 'http://localhost:' + config.get('webpack.port')
        });
        proxy.on('error', function (err, req, res) {
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            });
            res.end('Something went wrong. And we are reporting a custom error message.');
        });
    });
} else if(process.env.NODE_ENV === 'production') {
    if (!fs.existsSync(serverKey) || !fs.existsSync(serverCert)) {
        console.info('\n(Copy paste the below commands one by one)\n');
        console.info('openssl genrsa -des3 -passout pass:x -out '+__dirname+'/server.pass.key 2048 \n');
        console.info('openssl rsa -passin pass:x -in '+__dirname+'/server.pass.key -out '+__dirname+'/server.key \n');
        console.info('rm '+__dirname+'/server.pass.key \n');
        console.info('openssl req -new -key '+__dirname+'/server.key -out '+__dirname+'/server.csr');
        console.info('openssl x509 -req -days 365 -in '+__dirname+'/server.csr -signkey '+__dirname+'/server.key -out '+__dirname+'/server.crt\n\n');
        process.exit();
    }
    app.set('trust proxy', 1);
    var options = {
        key: fs.readFileSync(serverKey),
        cert: fs.readFileSync(serverCert)
    };
    https.createServer(options, app).listen(config.get('server.httpsPort'), config.get('server.host'), function () {
        console.info('Backend https server is listening at https://%s:%s', config.get('server.host'),  config.get('server.httpsPort'));
    });
}

require('./routers')(app);
require('./error/index')(app);