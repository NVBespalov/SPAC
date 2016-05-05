'use strict';
var Webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('./../config/webpack.config.js');
var path = require('path');
var config = require('config');
var logger = require('./winston')(module);
module.exports = function (app) {

    app.all('/build/*', function (req, res) {
        require('http-proxy').createProxyServer().web(req, res, {
            target: 'http://localhost:'+ config.get('webpack.port')
        });
    });

    var bundleStart = null;
    var compiler = Webpack(webpackConfig);

    compiler.plugin('compile', function() {
        logger.info('Bundling...');
        bundleStart = Date.now();
    });

    compiler.plugin('done', function() {
        logger.info('Bundled in ' + (Date.now() - bundleStart) + 'ms!');
    });

    var bundler = new WebpackDevServer(compiler, {
        publicPath: '/build/',
        hot: true,
        quiet: false,
        noInfo: false,
        stats: {
            colors: true
        }
    });

    bundler.listen(config.get('webpack.port'), 'localhost', function () {
        logger.info('Webpack dev-server proxy listening at http://%s:%s', config.get('server.host'),config.get('webpack.port'));
        logger.info('Bundling project, please wait...');
    });

};
