'use strict';
/**
 * Created by nickbespalov on 07.08.16.
 */
const toHTML = require('snabbdom-to-html');
const h = require('snabbdom/h');
module.exports = {
    index: function (req, res) {
        res.render('home', {body: toHTML(h('h1', {}, 'Hello, World!')), data: '["a", "b"]'} );
    }

};