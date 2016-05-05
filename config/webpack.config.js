'use strict';
var Webpack = require('webpack'), path = require('path'), buildPath = path.resolve(__dirname, './../public/', 'build'),
    mainPath = path.resolve(__dirname, './../app', 'index.js'), config = require('config'),
    nodeModulesPath = path.resolve(__dirname, 'node_modules');
var webpackConfig = {
    entry: [
        mainPath
    ],
    output: {
        path: buildPath,
        filename: 'bundle.js',
        publicPath: '/build/'
    },
    module: {
        loaders: [
            { test: /\.ejs$/, loader: "ejs-loader?variable=data" },
            { test: /\.json$/, loader: 'json-loader'},
            { test: /\.sass$/, loader: "style!css!sass?indentedSyntax" },
            { test: /\.scss$/, loaders: ["style", "css", "sass"]},
            { test: /\.js$/, loader: 'babel', exclude: nodeModulesPath }
        ]
    },
    plugins: [
        new Webpack.optimize.DedupePlugin(),
        new Webpack.optimize.UglifyJsPlugin({compress: {warnings: false}})
    ]
};
if (process.env.NODE_ENV === 'development') {
    webpackConfig.plugins.push(new Webpack.HotModuleReplacementPlugin());
    webpackConfig.devtool = 'eval';
    webpackConfig.entry.push('webpack/hot/dev-server');
    webpackConfig.entry.push('webpack-dev-server/client?http://localhost:' + config.get('webpack.port'))
}
module.exports = webpackConfig;