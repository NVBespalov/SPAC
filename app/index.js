'use strict';
require('./styles/index.scss');

const Observable = require('rxjs/rx').Observable;
const Subject = require('rxjs/rx').Subject;
const h = require('snabbdom/h');
const xhr = require('./../utils/XHR').xhr;
const extend = require('extend');
const getPath = require('./../utils/objects').getPath;
const patch = require('snabbdom').init([
    require('snabbdom/modules/class'),
    require('snabbdom/modules/props'),
    require('snabbdom/modules/attributes'),
    require('snabbdom/modules/style'),
    require('snabbdom/modules/eventlisteners'),
    require('snabbdom/modules/dataset')
]);
const formFieldsHandlers = {text: textFieldHandler, email: textFieldHandler, password: textFieldHandler};
const initialState = {
    session: null,
    signIn: {},
    signUp: {},
    currentFormType: 'signIn'
};

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
    Observable.fromPromise(xhr({
        url: `/auth/${getPath(state, 'currentFormType') === 'signIn' ? 'signin' : 'signup'}`,
        method: 'POST',
        data: getPath(state, getPath(state, 'currentFormType'))
    }))
        .subscribe(function onAuthSuccess(r) {
            debugger
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

function signOut(subject$, state) {
    Observable.fromPromise(xhr({
        url: `/auth/signout`,
        method: 'POST'
    }))
        .subscribe(
            function onAuthSignOutSuccess() {subject$.next({session: null});},
            function onAuthError() {debugger}
        );
}

function render(subject$, state) {
    if (state.session === null) {
        return h('div', {class: {container: true, modal: true}}, [
            h('form', {
                class: {
                    'sign-in': getPath(state, 'currentFormType') === 'signIn',
                    'sign-up': state.currentFormType === 'signUp'
                },
                props: {name: getPath(state, 'currentFormType')},
                on: {
                    submit: function onAuthSubmit (e) {
                        e.preventDefault();
                        auth(subject$, state);
                        return false;
                    }
                }
            }, [
                h('div', {class: {header: true}}, [
                    getPath(state, 'currentFormType') === 'signIn' ? 'Sign In' : 'Sign Up',
                    h('div', {class: {'form-type-toggle': true, row: true}}, [
                        'or you can',
                        h('div', {
                            class: {'change-form-type': true}, on: {
                                click: function onClickChangeType() {
                                    subject$.next({currentFormType: getPath(state, 'currentFormType') === 'signIn' ? 'signUp' : 'signIn'});
                                }
                            }
                        }, [getPath(state, 'currentFormType') === 'signIn' ? 'Sign Up' : 'Sign In'])
                    ])
                ]),
                h('div', {class: {body: true}}, getPath(state, 'currentFormType') === 'signIn' ? renderSignInBody(subject$, state) : renderSignUpBody(subject$, state)),
                h('div', {class: {messages: true}}, [getPath(state, 'error.message') || '']),
                h('div', {class: {operations: true}}, [
                    h('input', {props: {type: 'submit'}})
                ])
            ])
        ]);
    } else {
        signOut(subject$, state);
        return [];
    }
}

Observable.fromEvent(document, 'DOMContentLoaded')
    .map(e=> e.target.body.appendChild(document.createElement('div')))
    .subscribe(function onDOMLoaded($container) {

        const subject$ = new Subject();
        const currentState = localStorage.getItem('state') && JSON.parse(localStorage.getItem('state')) || initialState;
        const change$ = Observable.fromEvent($container, 'change').map(handleFromEventValue);
        const paste$ = Observable.fromEvent($container, 'paste').map(handleFromEventValue);
        const keyup$ = Observable.fromEvent($container, 'keyup').map(handleFromEventValue);

        let tree;

        Observable
            .merge(change$, paste$, keyup$)
            .subscribe(subject$.next.bind(subject$));

        const state$ = subject$
            .startWith(currentState)
            .scan(function processNextState (prev, next) {
                const currentState = extend(true, {}, prev, next);
                localStorage.setItem('state', JSON.stringify(currentState));
                return currentState;
            });

        state$.subscribe(function processStateChanges (state) {
            if (tree) {
                tree = patch(tree, render(subject$, state));
            } else {
                tree = patch($container, render(subject$, state));
            }
        });
    });