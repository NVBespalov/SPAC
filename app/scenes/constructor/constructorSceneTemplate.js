/**
 * Created by nickbespalov on 10.07.16.
 */
'use strict';
const h = require('snabbdom/h');
const lSPath = 'constructorScene';
const initialState = {};
const getPath = require('./../../../utils/objects').getPath;
const setPath = require('./../../../utils/objects').setPath;
const object = require('./../../../utils/objects').object;
const extend = require('extend');
const table = require('./../../widgets/table/table');
const tableStateAdaptor = require('./../../widgets/table/tableAdaptor');
const attributes = {
    "hidden": {
        type: 'radio',
        value: true,
        attribute: 'hidden',
        label: 'hidden'
    },
    "high": {
        type: 'number',
        value: 0,
        attribute: 'high',
        label: 'high'
    },
    "href": ["a", "area", "base", "link"],
    "hreflang": ["a", "area", "link"],
    "httpequiv": ["meta"],
    "icon": ["command"],
    "id": {
        type: 'text',
        value: '',
        attribute: 'id',
        label: 'id'
    },
    "ismap": ["img"],
    "itemprop": {
        type: 'text',
        value: '',
        attribute: 'itemprop',
        label: 'itemprop'
    },
    "keytype": ["keygen"],
    "kind": ["track"],
    "label": ["track"],
    "lang": {
        type: 'text',
        value: '',
        attribute: 'lang',
        label: 'lang'
    },
    "language": ["script"],
    "list": ["input"],
    "loop": ["audio", "bgsound", "marquee", "video"],
    "low": ["meter"],
    "manifest": ["html"],
    "max": ["input", "meter", "progress"],
    "maxlength": ["input", "textarea"],
    "media": ["a", "area", "link", "source", "style"],
    "method": ["form"],
    "min": ["input", "meter"],
    "multiple": ["input", "select"],
    "name": ["button", "form", "fieldset", "iframe", "input", "keygen", "object", "output", "select", "textarea", "map", "meta", "param"],
    "novalidate": ["form"],
    "open": ["details"],
    "optimum": ["meter"],
    "pattern": ["input"],
    "ping": ["a", "area"],
    "placeholder": ["input", "textarea"],
    "poster": ["video"],
    "preload": ["audio", "video"],
    "pubdate": ["time"],
    "radiogroup": ["command"],
    "readonly": ["input", "textarea"],
    "rel": ["a", "area", "link"],
    "required": ["input", "select", "textarea"],
    "reversed": ["ol"],
    "rows": ["textarea"],
    "rowspan": ["td", "th"],
    "sandbox": ["iframe"],
    "spellcheck": {
        type: 'radio',
        value: false,
        attribute: 'spellcheck',
        label: 'spellcheck'
    },
    "scope": ["th"],
    "scoped": ["style"],
    "seamless": ["iframe"],
    "selected": ["option"],
    "shape": ["a", "area"],
    "size": ["input", "select"],
    "sizes": ["link"],
    "span": ["col", "colgroup"],
    "src": ["audio", "embed", "iframe", "img", "input", "script", "source", "track", "video"],
    "srcdoc": ["iframe"],
    "srclang": ["track"],
    "srcset": ["img"],
    "start": ["ol"],
    "step": ["input"],
    "style": {
        type: 'select',
        value: [],
        attribute: 'style',
        label: 'style',
        options: [],
        multiple: true
    },
    "summary": ["table"],
    "tabindex": {
        type: 'number',
        value: 0,
        attribute: 'tabindex',
        label: 'tabindex'
    },
    "target": ["a", "area", "base", "form"],
    "title": {
        type: 'text',
        value: '',
        attribute: 'title',
        label: 'title'
    },
    "type": ["button", "input", "command", "embed", "object", "script", "source", "style", "menu"],
    "usemap": ["img", "input", "object"],
    "value": ["button", "option", "input", "li", "meter", "progress", "param"],
    "width": ["canvas", "embed", "iframe", "img", "input", "object", "video"],
    "wrap": ["textarea"],
    "border": ["img", "object", "table"],
    "buffered": ["audio", "video"],
    "challenge": ["keygen"],
    "charset": ["meta", "script"],
    "checked": ["command", "input"],
    "cite": ["blockquote", "del", "ins", "q"],
    "class": {
        _value: [],
        type: 'select',
        attribute: 'class',
        label: 'class',
        options: [],
        multiple: true,
        set value(val) {
            if (_.isString(val) && val) this._value = _.union(this._value, val.split(' '));
            else if (_.isArray(val) && val.length) this._value = _.union(this._value, val);
        },
        get value() {
            return this._value
        }
    },
    "code": ["applet"],
    "codebase": ["applet"],
    "color": ["basefont", "font", "hr"],
    "cols": ["textarea"],
    "colspan": ["td", "th"],
    "content": ["meta"],
    "contenteditable": {
        type: 'radio',
        value: true,
        attribute: 'contenteditable',
        label: 'contenteditable'
    },
    "contextmenu": {
        type: 'text',
        value: '',
        attribute: 'contextmenu',
        label: 'contextmenu'
    },
    "controls": ["audio", "video"],
    "coords": ["area"],
    "data": {
        type: 'select',
        _value: {},
        attribute: 'data',
        label: 'data',
        options: [],
        multiple: true,
        get value() {
            return $.extend({}, this._value)
        },
        set value(val) {
            _.extend(this._value, val)
        }
    },
    "datetime": ["del", "ins", "time"],
    "default": ["track"],
    "defer": ["script"],
    "dir": {
        type: 'text',
        value: '',
        attribute: 'dir',
        label: 'dir'
    },
    "dirname": ["input", "textarea"],
    "disabled": ["button", "command", "fieldset", "input", "keygen", "optgroup", "option", "select", "textarea"],
    "download": ["a", "area"],
    "draggable": {
        type: 'radio',
        value: false,
        attribute: 'draggable',
        label: 'draggable'
    },
    "dropzone": {
        type: 'select',
        value: '',
        attribute: 'dropzone',
        label: 'dropzone',
        options: ['', 'copy', 'move', 'link'],
        multiple: false
    },
    "enctype": ["form"],
    "for": ["label", "output"],
    "form": ["button", "fieldset", "input", "keygen", "label", "meter", "object", "output", "progress", "select", "textarea"],
    "formaction": ["input", "button"],
    "headers": ["td", "th"],
    "height": ["canvas", "embed", "iframe", "img", "input", "object", "video"],
    "accept": ["form", "input"],
    "acceptcharset": ["form"],
    "accesskey": {
        type: 'text',
        value: '',
        attribute: 'accesskey',
        label: 'accesskey'
    },
    "action": ["form"],
    "align": ["applet", "caption", "col", "colgroup", "hr", "iframe", "img", "table", "tbody", "td", "tfoot", "", "th", "thead", "tr"],
    "alt": ["applet", "area", "img", "input"],
    "async": ["script"],
    "autocomplete": ["form", "input"],
    "autofocus": ["button", "input", "keygen", "select", "textarea"],
    "autoplay": ["audio", "video"],
    "autosave": ["input"],
    "bgcolor": ["body", "col", "colgroup", "marquee", "table", "tbody", "tfoot", "td", "th", "tr"]
};
require('./../../widgets/form/materialForm/styles/materialForm.scss');
module.exports = function render(subject$, state) {

    function makeFormInputForDataKey(data, key) {
        const value = getPath(data, key);
        return h('div.form-group', [
            h('input', {
                class: {'has-value': value ? true : false},
                props: {required: true, name: key, type: 'text', value: value}
            }),
            h('span', {class: {highlight: true}}),
            h('span', {class: {bar: true}}),
            h('label', [key])
        ]);
    }
    function makeFormFromDataObj(obj) {
        return h('form.materialForm', Object.keys(obj).map(makeFormInputForDataKey.bind(null, obj)))
    }

    return h('div', {class: {'scene-constructor': true}}, [
        h('div.Grid.Grid--gutters', {}, [
            h('div.Grid-cell.scene-preview', [
                h('div.Grid-cell', [table(subject$, tableStateAdaptor.dataToTableState(state.data))])
            ]),
            h('div.Grid-cell.u-1of3', [h('h1', ['Table Template Editor']), makeFormFromDataObj({dataSource: '/users'})])

        ])
    ]);
};