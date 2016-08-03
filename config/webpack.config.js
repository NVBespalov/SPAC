'use strict';
var Webpack = require('webpack'), path = require('path'), buildPath = path.resolve(__dirname, './../public/', 'build'),
    mainPath = path.resolve(__dirname, './../app', 'index.js'), config = require('config'),
    nodeModulesPath = path.resolve(__dirname, 'node_modules'), pJOSN = require('./../package.json');

var webpackConfig = {
    entry: [
        mainPath
    ],
    output: {
        path: buildPath,
        filename: 'bundle.js',
        publicPath: config.get('webpack.server.publicPath')
    },
    module: {
        loaders: [
            {test: /\.json$/, loader: 'json-loader'},
            {test: /\.sass$/, loader: "style!css!sass?indentedSyntax"},
            {test: /\.scss$/, loaders: ["style", "css", "sass"]},
            {test: /\.js$/, loader: 'babel', exclude: nodeModulesPath, query: {presets: ['es2015']}},
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?limit=10000&minetype=application/font-woff"
            },
            {test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader"}
        ]
    },
    plugins: [
        new Webpack.optimize.DedupePlugin(),
        new Webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}),
        new Webpack.DefinePlugin({
                VERSION: JSON.stringify(pJOSN.version),
                BROWSER_SUPPORTS_HTML5: true,
                ENVIRONMENT: process.env.NODE_ENV
            }
        )
    ]
};
if (process.env.NODE_ENV === 'development') {
    webpackConfig.plugins.push(new Webpack.HotModuleReplacementPlugin());
    webpackConfig.devtool = 'eval';
    webpackConfig.entry.push('webpack/hot/dev-server');
    webpackConfig.entry.push('webpack-dev-server/client?http://localhost:' + config.get('webpack.port'))
}
module.exports = webpackConfig;