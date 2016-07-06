'use strict';
require('./styles/index.scss');

const Observable = require('rxjs/rx').Observable;
const Subject = require('rxjs/rx').Subject;
const h = require('virtual-dom/h');
const diff = require('virtual-dom/diff');
const patch = require('virtual-dom/patch');
const createElement = require('virtual-dom/create-element');
const xhr = require('./../utils/XHR').xhr;
const formFieldsHandlers = {text: textFieldHandler, email: textFieldHandler, password:textFieldHandler};
const extend = require('extend');
function textFieldHandler(e){
    let result = {};
    let fieldResult = {};
    fieldResult[e.target.name] = e.target.value;
    result[e.target.closest('form').name] = fieldResult;
    return result;
}

const initialState = {
    session: null,
    signIn: {},
    signUp: {},
    currentFormType: 'signIn'
};

function auth(subject$, state) {
    debugger
    Observable.fromPromise(xhr({
        url: `/auth/${state.currentFormType === 'signIn' ? 'signin' : 'signup'}`,
        method: 'POST',
        data: state[state.currentFormType]
    }))
        .subscribe(r=> {
            state.currentFormType === 'signIn' ? subject$.next({session: r}) : subject$.next({currentFormType:'signIn'});
        });
}

function renderSignInBody() {
    return [
        h('div', {className: 'form-group'}, [
            h('input', {className: '', required: true, name: 'email', type: 'text'}),
            h('span', {className: 'highlight'}),
            h('span', {className: 'bar'}),
            h('label', ['Email'])
        ]),
        h('div', {className: 'form-group'}, [
            h('input', {className: '', required: true, name: 'password', type: 'password'}),
            h('span', {className: 'highlight'}),
            h('span', {className: 'bar'}),
            h('label', ['Password'])
        ])];
}
function renderSignUpBody() {
    return [
        h('div', {className: 'form-group'}, [
            h('input', {className: '', required: true, name: 'firstName', type: 'text'}),
            h('span', {className: 'highlight'}),
            h('span', {className: 'bar'}),
            h('label', ['First Name'])
        ]),
        h('div', {className: 'form-group'}, [
            h('input', {className: '', required: true, name: 'lastName', type: 'text'}),
            h('span', {className: 'highlight'}),
            h('span', {className: 'bar'}),
            h('label', ['Last Name'])
        ]),
        h('div', {className: 'form-group'}, [
            h('input', {className: '', required: true, name: 'displayName', type: 'text'}),
            h('span', {className: 'highlight'}),
            h('span', {className: 'bar'}),
            h('label', ['Display Name'])
        ]),
        h('div', {className: 'form-group'}, [
            h('input', {className: '', required: true, name: 'email', type: 'email'}),
            h('span', {className: 'highlight'}),
            h('span', {className: 'bar'}),
            h('label', ['Email'])
        ]),
        h('div', {className: 'form-group'}, [
            h('input', {className: '', required: true, name: 'password', type: 'password'}),
            h('span', {className: 'highlight'}),
            h('span', {className: 'bar'}),
            h('label', ['Password'])
        ])];
}

function render(subject$, state) {
    if (state.session === null) {
        return h('div', {className: 'container modal'}, [
            h('form', {
                className: state.currentFormType === 'signIn' ? 'sign-in' : 'sign-up',
                name: state.currentFormType,
                onsubmit: function onSignIn(e) {
                    auth(subject$, state);
                    return false;
                }
            }, [
                h('div', {className: 'header'}, [
                    state.currentFormType === 'signIn' ? 'Sign In' : 'Sign Up',
                    h('div', {className: 'form-type-toggle row'}, [
                        'or you can',
                        h('div', {
                            className: 'change-form-type', onclick: function onClickChangeType() {
                                subject$.next(state.currentFormType === 'signIn' ? {currentFormType: 'signUp'} : {currentFormType:'signIn'});
                            }
                        }, [state.currentFormType === 'signIn' ? 'Sign Up' : 'Sign In'])
                    ])
                ]),
                h('div', {className: 'body'}, state.currentFormType === 'signIn' ? renderSignInBody() : renderSignUpBody()),
                h('div', {className: 'operations'}, [
                    h('input', {type: 'submit'})
                ])
            ])
        ]);
    } else {
        [];
    }
}

Observable.fromEvent(document, 'DOMContentLoaded')
    .map(e=>e.target.body)
    .subscribe(function onDOMLoaded($body) {

        const subject$ = new Subject();
        const currentState = localStorage.getItem('state') && JSON.parse(localStorage.getItem('state')) || initialState;

        let tree, rootNode;

        function handleFromEventValue(e) {
            return formFieldsHandlers[e.target.type](e);
        }

        const change$ = Observable.fromEvent($body, 'change').map(handleFromEventValue);
        const paste$ = Observable.fromEvent($body, 'paste').map(handleFromEventValue);
        const keyup$ = Observable.fromEvent($body, 'keyup').map(handleFromEventValue);

        Observable
            .merge(change$, paste$, keyup$)
            .subscribe(function(a){
                subject$.next(a);
            });

        const state$ = subject$
            .startWith(currentState)
            .scan((prev, next)=> {
                const currentState = extend(true, {}, prev, next);
                localStorage.setItem('state', JSON.stringify(currentState));
                return currentState;
            });

        state$.subscribe(state => {
            if (tree) {
                let newTree = render(subject$, state);
                rootNode = patch(rootNode, diff(tree, newTree));
                tree = newTree;
            } else {
                tree = render(subject$, state);
                rootNode = createElement(tree);
                $body.appendChild(rootNode);
            }
        });
    });