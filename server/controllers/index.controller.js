'use strict';
/**
 * Created by nickbespalov on 07.08.16.
 */
const toHTML = require('snabbdom-to-html');
const patch = require('snabbdom').init([
    require('snabbdom/modules/class'),
    require('snabbdom/modules/props'),
    require('snabbdom/modules/attributes'),
    require('snabbdom/modules/style'),
    require('snabbdom/modules/eventlisteners'),
    require('snabbdom/modules/dataset')
]);

const h = require('snabbdom/h');
module.exports = {
    index: function (req, res) {
        res.render('home', {body: toHTML(h('h1', {}, 'Hello, World!')), data: '["a", "b"]'} );
    }

};