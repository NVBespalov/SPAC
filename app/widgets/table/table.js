const extend = require('extend');
const h = require('snabbdom/h');
'use strict';
/**
 * Created by nbespalov on 17.08.2016.
 */
const initialState = {
    body: [],
    handlers: {},
    header: []
};
module.exports =  function makeTableFromData(subject$, state) {
    const cState = extend(true, {}, initialState, state);
    return h('table.table-widget', [
        h('thead', cState.header.map(function(header){
            return h('tr', header.map(function (hI) {
                return h('th', [hI])
            }));
        })),
        h('tbody',cState.body.map(function (row) {
            return h('tr', row.map(function(column) {
                return h('td', [column])
            }))
        }))
    ])
};