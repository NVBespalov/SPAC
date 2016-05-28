/**
 * Created by nickbespalov on 20.05.16.
 */
process.env.NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
var Webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('./../config/webpack.config.js');
var path = require('path');
var bundleStart = null;
var compiler = Webpack(webpackConfig);

var config = require('config');

compiler.plugin('compile', function() {
    console.info('Bundling...');
    bundleStart = Date.now();
});

compiler.plugin('done', function() {
    console.info('Bundled in ' + (Date.now() - bundleStart) + 'ms!');
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
    console.info('Webpack dev-server proxy listening at http://%s:%s', config.get('server.host'),config.get('webpack.port'));
    console.info('Bundling project, please wait...');
});