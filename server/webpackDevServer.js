/**
 * Created by nickbespalov on 20.05.16.
 */
const path = require('path');
process.env.NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
process.env.NODE_CONFIG_DIR = process.env.NODE_CONFIG_DIR ? process.env.NODE_CONFIG_DIR : path.resolve(__dirname + './../../config');

const Webpack = require('webpack'), WebpackDevServer = require('webpack-dev-server'),
    webpackConfig = require('./../../config/webpack.config.js'), compiler = Webpack(webpackConfig),
    config = require('config'), i18n = require('./localizer')();

console.info("==================");
console.info(i18n.__('webpack server is running in env', process.env.NODE_ENV));
console.info("==================");
new WebpackDevServer(compiler, config.get('webpack.server')).listen(config.get('webpack.port'), config.get('server.host'), function () {
    console.info(i18n.__('webpack proxy'), config.get('server.host'), config.get('webpack.port'));
    console.info(i18n.__('building project'));
});