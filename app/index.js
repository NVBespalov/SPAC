'use strict';
require('./styles/index.scss');

const Observable = require('rxjs/rx').Observable;
const Subject = require('rxjs/rx').Subject;
const h = require('virtual-dom/h');
const diff = require('virtual-dom/diff');
const patch = require('virtual-dom/patch');
const createElement = require('virtual-dom/create-element');
const xhr = require('./../utils/XHR').xhr;


const initialState = {
    session: null,
    signIn: true
};

function login(e, subject$) {
    const elements = e.target.elements;
    Observable.fromPromise(xhr({
        url: '/auth/signin',
        method: 'POST',
        data: {email: elements.email.value, password: elements.password.value}
    }))
        .subscribe(r=> {
            subject$.next({session: r});
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
            h('input', {className: '', required: false, name: 'displayName', type: 'text'}),
            h('span', {className: 'highlight'}),
            h('span', {className: 'bar'}),
            h('label', ['Display Name'])
        ]),
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
function render(subject$, state) {
    if (state.session === null) {
        return h('div', {className: 'container modal'}, [
            h('form', {
                className: state.signIn ? 'sign-in' : 'sign-up',
                onsubmit: function onSignIn(e) {
                    login(e, subject$);
                    return false;
                }
            }, [
                h('div', {className: 'header'}, [
                    state.signIn ? 'Sign In' : 'Sign Up',
                    h('div', {className: 'form-type-toggle row'}, [
                        'or you can',
                        h('div', {
                            className: 'change-form-type', onclick: function onClickChangeType() {
                                subject$.next({signIn: state.signIn ? false : true});
                            }
                        }, [state.signIn ? 'Sign Up' : 'Sign In'])
                    ])
                ]),
                h('div', {className: 'body'}, state.signIn ? renderSignInBody() : renderSignUpBody()),
                h('div', {className: 'operations'}, [
                    h('input', {type: 'submit'})
                ])
            ])
        ]);
    } else {
        []
    }
}
Observable.fromEvent(document, 'DOMContentLoaded')
    .map(e=>e.target.body)
    .subscribe(function onDOMLoaded($body) {
        const subject$ = new Subject();
        const currentState = localStorage.getItem('state') && JSON.parse(localStorage.getItem('state')) || initialState;
        let tree, rootNode;
        const state$ = subject$
            .startWith(currentState)

            .scan((prev, next)=> {
                const currentState = Object.assign({}, prev, next);
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