/**
 * Created by nickbespalov on 10.07.16.
 */
'use strict';
require('./styles/fromWidget.scss');

const Observable = require('rxjs/rx').Observable;
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
    let result = {};
    let fieldResult = {};
    fieldResult[e.target.name] = e.target.value;
    result[e.target.closest('form').name] = fieldResult;
    return result;
}

function handleFromEventValue(e) {
    return formFieldsHandlers[e.target.type](e);
}

function auth(subject$, state) {
    getJSON$({
        url: `/auth/${getPath(state, 'currentFormType') === 'signIn' ? 'signin' : 'signup'}`,
        method: 'POST',
        data: getPath(state, getPath(state, 'currentFormType'))
    })
        .subscribe(function onAuthSuccess(r) {
            getPath(state, 'currentFormType') === 'signIn' ? subject$.next({session: r.data}) : subject$.next({currentFormType: 'signIn'});
        }, function onAuthError(r) {
            subject$.next({error: r})
        });
}

function renderSignInBody(subject$, state) {
    return [
        h('div', {class: {'form-group': true}}, [
            h('input', {
                class: {'has-value': getPath(state, 'signIn.email') ? true : false},
                props: {required: true, name: 'email', type: 'text', value: getPath(state, 'signIn.email') || ''}
            }),
            h('span', {class: {highlight: true}}),
            h('span', {class: {bar: true}}),
            h('label', ['Email'])
        ]),
        h('div', {class: {'form-group': true}}, [
            h('input', {
                class: {'has-value': getPath(state, 'signIn.password') ? true : false},
                props: {required: true, name: 'password', type: 'password', value: getPath(state, 'signIn.password') || ''}
            }),
            h('span', {class: {highlight: true}}),
            h('span', {class: {bar: true}}),
            h('label', ['Password'])
        ])];
}

function renderSignUpBody(subject$, state) {
    return [
        h('div', {class: {'form-group': true}}, [
            h('input', {
                class: {'has-value': getPath(state, 'signUp.firstName') ? true : false},
                props: {required: true, name: 'firstName', type: 'text', value: getPath(state, 'signUp.firstName') || ''}
            }),
            h('span', {class: {highlight: true}}),
            h('span', {class: {bar: true}}),
            h('label', ['First Name'])
        ]),
        h('div', {class: {'form-group': true}}, [
            h('input', {
                class: {'has-value': getPath(state, 'signUp.lastName') ? true : false},
                props: {required: true, name: 'lastName', type: 'text', value: getPath(state, 'signUp.lastName') || ''}
            }),
            h('span', {class: {highlight: true}}),
            h('span', {class: {bar: true}}),
            h('label', ['Last Name'])
        ]),
        h('div', {class: {'form-group': true}}, [
            h('input', {
                class: {'has-value': getPath(state, 'signUp.displayName') ? true : false},
                props: {required: true, name: 'displayName', type: 'text', value: getPath(state, 'signUp.displayName') || ''}
            }),
            h('span', {class: {highlight: true}}),
            h('span', {class: {bar: true}}),
            h('label', ['Display Name'])
        ]),
        h('div', {class: {'form-group': true}}, [
            h('input', {
                class: {'has-value': getPath(state, 'signUp.email') ? true : false},
                props: {required: true, name: 'email', type: 'email', value: getPath(state, 'signUp.email') || ''}
            }),
            h('span', {class: {highlight: true}}),
            h('span', {class: {bar: true}}),
            h('label', ['Email'])
        ]),
        h('div', {class: {'form-group': true}}, [
            h('input', {
                class: {'has-value': getPath(state, 'signUp.password') ? true : false},
                props: {required: true, name: 'password', type: 'password', value: getPath(state, 'signUp.password') || ''}
            }),
            h('span', {class: {highlight: true}}),
            h('span', {class: {bar: true}}),
            h('label', ['Password'])
        ])];
}

// function signOut(subject$, state) {
//     Observable.fromPromise(xhr({
//         url: `/auth/signout`,
//         method: 'POST'
//     }))
//         .subscribe(
//             function onAuthSignOutSuccess() {subject$.next({session: null});},
//             function onAuthError() {debugger}
//         );
// }

const render = function render (subject$, state) {
    return h('form', {
        class: {},
        on: {
            submit: function onAuthSubmit (e) {
                e.preventDefault();
                auth(subject$, state);
                return false;
            }
        }
    });
}

const FormWidget = module.exports = function AuthenticateWidget($container, initialState) {
    const defaultState = {};
    const subject$ = new Subject();

    const currentState = initialState || defaultState;
    const onChange$ = Observable.fromEvent($container, 'change').map(handleFromEventValue); //.takeUntil(Rx.Observable.timer(5000))
    const onPaste$ = Observable.fromEvent($container, 'paste').map(handleFromEventValue);
    const onKeyup$ = Observable.fromEvent($container, 'keyup').map(handleFromEventValue);

    let tree;

    this.formChanges$ = Observable.merge(onChange$, onPaste$, onKeyup$).subscribe(subject$.next.bind(subject$));

    this.state = subject$
        .startWith(currentState)
        .scan(function processNextState (prev, next) {
            return extend(true, {}, prev, next);
        });
    
    this.state$ = this.state.subscribe(function processStateChanges (state) {
        if (tree) {
            tree = patch(tree, render(this, state));
        } else {
            tree = patch($container, render(this, state));
        }
    }, function() {}, function(){$container.innerHTML = ''});
};

FormWidget.prototype = {
    dispose: function AuthenticateWidgetDisposal () {
        this.state$.complete();
        this.formChanges$.complete();
    }
};