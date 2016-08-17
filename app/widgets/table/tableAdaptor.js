'use strict';
/**
 * Created by nbespalov on 17.08.2016.
 */
const size = require('../../../utils/objects').size;
module.exports = {
    dataToTableState: function (data) {
        var maxKeysSize = data.reduce(function (m, data) {
            return m[0] && size(m[0]) < size(data) ? [data] : (m[0] && m || [data]);
        },[])[0];

        return {
            header: [Object.keys(maxKeysSize)],
            body: data.map(function (row) {
                return Object.keys(row).map(function (k) {return row[k]});
            })
        }
    }
};
function makeTableFromData(data) {
    return h('table.table-widget', [
        h('thead', [makeTHChildrenFromDataObj(getPath(data, '[0]'))]),
        h('tbody', makeTBodyChildrenFromData(data))
    ])
}

var headerSelectionPath = 'table.selection.*';

function objectToH(o) {

    function arrayToH(map) {
        if (map && map.length === 0) return [];
        return map.map(objectToH);
    }

    if (typeof o === 'string') return o;
    if (typeof o === 'number') return o;
    if (typeof o === 'object') return h(getPath(o, 'tagName'), getPath(o, 'dataObject'), arrayToH(getPath(o, 'children')));
}

function keyToTh(dataObj, key) {
    const value = getPath(dataObj, key);
    return h('th', {class: {text: typeof value === 'string', number: typeof value === 'number'}}, [key]);
}

function processSelection(checked, m, k) {
    return extend(m, object([k], [checked ? 0 : 1]));
}

function selectionIsEqualsTo(condition, nextState, k) {
    return getPath(nextState, `table.selection.${k}`) === condition
}

function onClickSelectOperation(rowIndex, checked) {
    let result = {};
    result[rowIndex] = checked ? 0 : 1;
    result = rowIndex === '*' ? Object.keys(getPath(state, 'table.data')).reduce(processSelection.bind(null, checked), result) : result;
    let nextState = extend(true, {}, state, {table: {selection: result}});
    var selectionKeys = Object.keys(getPath(nextState, 'table.selection'));
    var lastSelected = selectionKeys.filter(selectionIsEqualsTo.bind(null, 1, nextState));
    lastSelected.length === 1 && getPath(nextState, headerSelectionPath) === 1 ? setPath(nextState, headerSelectionPath, 0) : undefined;
    subject$.next({constructor: nextState});
}

function makeSelectOperation(tagName, rowIndex) {
    const checked = getPath(state, `table.selection.${rowIndex}`) === 1;
    return h(tagName, {class: {'select': true}}, [
        h('div', {class: {checkbox: true, checked: !!checked}}, [
            h('div', {
                class: {icon: true, pressed: false}, on: {
                    click: onClickSelectOperation.bind(null, rowIndex, checked)
                }
            }, [
                h('div.ripple'),
                h('div.check-mark', {style: {display: checked ? 'block' : 'none'}})
            ])
        ])
    ]);
}

function makeTHChildrenFromDataObj(dataObj) {
    const selectOperation = makeSelectOperation('th', '*');
    const children = Object.keys(dataObj).map(keyToTh.bind(null, dataObj));
    return h('tr', [selectOperation].concat(children));
}

function objectKeyToTd(object, key) {
    var value = getPath(object, key);
    return h('td', {class: {text: typeof value === 'string', number: typeof value === 'number'}}, [value]);
}

function objectToTr(object, index) {
    const selectOperation = makeSelectOperation('td', index);
    var children = Object.keys(object).map(objectKeyToTd.bind(null, object));
    return h('tr', {class: {selected: getPath(state, `table.selection.${index}`)}}, [selectOperation].concat(children));
}

function makeTBodyChildrenFromData(data) {
    return data.map(objectToTr);
}