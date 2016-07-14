/**
 * Created by nickbespalov on 10.07.16.
 */
'use strict';
require('./styles/materialForm.js.scss');

const h = require('snabbdom/h');

const extend = require('extend');
const getPath = require('./../../../../utils/objects').getPath;


const renderForm = function renderForm(state, overrides) {

    const changeHandler = getPath(overrides, 'formFieldsHandlers.text');

    function renderTextInputElement(data, key) {

        return h('div', {class: {'form-group': true}}, [
            h('input', {
                class: {'has-value': data ? true : false},
                props: {required: true, name: key, type: 'text', value: data || ''},
                on: {keyup: changeHandler, paste: changeHandler, change: changeHandler}
            }),
            h('span', {class: {highlight: true}}),
            h('span', {class: {bar: true}}),
            h('label', [key])
        ])
    }

    function renderPasswordInputElement(data, key) {

        return h('div', {class: {'form-group': true}}, [
            h('input', {
                class: {'has-value': data ? true : false},
                props: {required: true, name: key, type: 'password', value: data || ''},
                on: {keyup: changeHandler, paste: changeHandler, change: changeHandler}
            }),
            h('span', {class: {highlight: true}}),
            h('span', {class: {bar: true}}),
            h('label', [key])
        ])
    }

    function renderFormElement(key) {
        const elmValue = getPath(state, key);
        let result;
        if (key === 'password') {
            result = renderPasswordInputElement(elmValue, key);
        } else if (typeof elmValue === 'string' || elmValue === null) {
            result = renderTextInputElement(elmValue, key);
        }
        return result;
    }
    
    return h('form', getPath(overrides, 'form'),
        Object.keys(state)
            .map(renderFormElement)
            .concat([h('div.operations', [h('input', {props: {type: 'submit'}})])])
    );
};

module.exports = renderForm;



