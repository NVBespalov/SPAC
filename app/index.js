'use strict';
require('./styles/index.scss');

const Observable = require('rxjs/rx').Observable;
const Subject = require('rxjs/rx').Subject;
const h = require('virtual-dom/h');
const diff = require('virtual-dom/diff');
const patch = require('virtual-dom/patch');
const createElement = require('virtual-dom/create-element');

const initialState = {
    session: null
};

function render(subject$, state) {
    if (state.session === null) {
        return h('div', {className: 'container modal'}, [
            h('form', {
                className: 'login', onsubmit: e=> {
                    login(e, subject$);
                    return false;
                }
            }, [
                h('div', {className: 'header'}, [`Platform`, h('div', {className: 'version'}, [`${VERSION}`])]),
                h('div', {className: 'body'}, [
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
                    ])
                ]),
                h('div', {className: 'operations'}, [
                    h('input', {type: 'submit'})
                ])
            ])
        ]);
    }
}
Observable.fromEvent(document, 'DOMContentLoaded')
    .map(e=>e.target.body)
    .subscribe(function onDOMLoaded ($body) {
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