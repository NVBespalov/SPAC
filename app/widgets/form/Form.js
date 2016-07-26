/**
 * Created by nickbespalov on 10.07.16.
 */
'use strict';
require('./styles/fromWidget.scss');

const Observable = require('rxjs/Rx').Observable;
const Subject = require('rxjs/rx').Subject;
const h = require('snabbdom/h');
const getJSON$ = require('./../../../utils/XHR').getJSON$;
const extend = require('extend');
const getPath = require('./../../../utils/objects').getPath;

const patch = require('snabbdom').init([
    require('snabbdom/modules/class'),
    require('snabbdom/modules/props'),
    require('snabbdom/modules/attributes'),
    require('snabbdom/modules/style'),
    require('snabbdom/modules/eventlisteners'),
    require('snabbdom/modules/dataset')
]);
const formFieldsHandlers = {text: textFieldHandler, email: textFieldHandler, password: textFieldHandler};



function textFieldHandler(e) {
    let fieldResult = {};
    fieldResult[e.target.name] = e.target.value;
    fieldResult[e.target.name] = e.target.value;
    return fieldResult;
}

function handleFromEventValue(e) {
    return formFieldsHandlers[e.target.type](e);
}

const renderTextInputElm = function renderTextInputElm(data, key) {
    return  h('div', {class: {'form-group': true}}, [
        h('input', {
            class: {'has-value': data ? true : false},
            props: {required: true, name: key, type: 'text', value: data || ''}
        }),
        h('span', {class: {highlight: true}}),
        h('span', {class: {bar: true}}),
        h('label', [key])
    ])
};

const renderPasswordInputElm = function renderTextInputElm(data, key) {
    return  h('div', {class: {'form-group': true}}, [
        h('input', {
            class: {'has-value': data ? true : false},
            props: {required: true, name: key, type: 'password', value: data || ''}
        }),
        h('span', {class: {highlight: true}}),
        h('span', {class: {bar: true}}),
        h('label', [key])
    ])
};
const renderFormElm = function renderFormElement (state, key) {
    const elmValue = getPath(state, key);
    let result;
    if(key === 'password'){
        result = renderPasswordInputElm(elmValue, key);
    } else if (typeof elmValue === 'string' || elmValue === null) {
        result = renderTextInputElm(elmValue, key);
    }
    return result;
};
const render = function renderForm (subject$, state, overrides) {
    return h('form', {
            class: {},
            on: {
                submit: function (e) {
                    if(getPath(overrides, 'onSubmit')) {
                        e.preventDefault();
                        getPath(overrides, 'onSubmit')(subject$, state)
                    }
                }
            }
        },
        Object.keys(state).map(renderFormElm.bind(null, state)).concat([h('div.operations', [h('input', {props: {type:'submit'}})])])
    );
};



module.exports = function () {
    
}

const AuthenticateWidget = module.exports = function AuthenticateWidget($container, initialState, overrides) {
    const defaultState = {};
    const subject$ = new Subject();
    const ctx = this;
    const currentState = initialState || defaultState;
   


    this.formChanges$ = Observable.merge(onChange$, onPaste$, onKeyup$).subscribe(subject$.next.bind(subject$));

    this.state = subject$
        .startWith(currentState)
        .scan(function processNextState (prev, next) {
            return extend(true, {}, prev, next);
        });
    
    this.state$ = this.state.subscribe(function processStateChanges (state) {
        if (ctx.tree) {
            var newVNode = render(this, state, overrides);
            patch(ctx.tree, newVNode);
            ctx.tree = newVNode;
        } else {
            ctx.tree = patch($container, render(this, state, overrides));
        }
    });
};

AuthenticateWidget.prototype = {
    dispose: function AuthenticateWidgetDisposal () {
        this.state$.complete();
        this.formChanges$.complete();
        this.tree.elm.parentElement.removeChild(this.tree.elm);
    }
};