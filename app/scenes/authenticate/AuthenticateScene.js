/**
 * Created by nickbespalov on 12.07.16.
 */
require('./styles/authnticate.scss');
const Subject = require('rxjs/Rx').Subject;
const form = require('./../../widgets/form/materialForm/MaterialFormTemplate');
const h = require('snabbdom/h');
const getJSON$ = require('./../../../utils/XHR').getJSON$;
const extend = require('extend');
const getPath = require('./../../../utils/objects').getPath;
const lSUtils = require('./../../../utils/objects').localStorage;
const lSPath = 'authenticateScene';
const patch = require('snabbdom').init([
    require('snabbdom/modules/class'),
    require('snabbdom/modules/props'),
    require('snabbdom/modules/attributes'),
    require('snabbdom/modules/style'),
    require('snabbdom/modules/eventlisteners'),
    require('snabbdom/modules/dataset')
]);


const render = function renderAuthenticateScene(subject$, state) {
    function signOut(subject$, state) {
        getJSON$({url: '/auth/signout', method: 'POST'})
            .subscribe(
                function onAuthSignOutSuccess() {
                    subject$.next({session: null});
                },
                function onAuthError() {
                    debugger
                }
            );
    }

    function textFieldHandler(e) {
        let currentForm = getCurrentStateForm(state);
        let nextState = {};
        currentForm[e.target.name] = e.target.value;
        currentForm[e.target.name] = e.target.value;
        nextState[getPath(state, 'currentForm')] = currentForm;
        subject$.next(nextState);
    }

    function signInOrSignUp(e) {
        e.preventDefault();
        getJSON$({
            url: `/auth/${getPath(state, 'currentForm') === 'signInForm' ? 'signin' : 'signup'}`,
            method: 'POST',
            data: getPath(state, getPath(state, 'currentForm'))
        })
            .subscribe(function onAuthSuccess(r) {
                debugger
                getPath(state, 'currentForm') === 'signInForm' ? subject$.next({session: r.data}) : subject$.next({currentFormType: 'auth'});
            }, function onAuthError(r) {
                subject$.next({error: r});
            });
    }

    return h('div.authenticate-scene', [
        h('div.container', [
            h('div', {class: {header: true}}, [
                h('div.current-form-name', [getPath(state, 'currentForm') === 'signInForm' ? 'Sign In' : 'Sign Up']),
                h('div', {class: {'form-type-toggle': true}}, [
                    'or you can',
                    h('div', {
                        class: {'change-form-type': true}, on: {
                            click: function onClickChangeType() {
                                subject$.next({currentForm: getPath(state, 'currentForm') === 'signInForm' ? 'signUpForm' : 'signInForm'});
                            }
                        }
                    }, [getPath(state, 'currentForm') === 'signInForm' ? 'Sign Up' : 'Sign In'])
                ])
            ]),
            form(getCurrentStateForm(state), {
                form: {
                    on: {submit: signInOrSignUp},
                    props: {name: getPath(state, 'currentForm')}
                },
                formFieldsHandlers: {text: textFieldHandler}
            })
        ])
    ]);
};


const getCurrentStateForm = function getCurrentForm(currentState) {
    return getPath(currentState, getPath(currentState, 'currentForm'));
};
const getCurrentState = function getCurrentState(initialState) {
    const defaultState = {
        signInForm: {
            email: null,
            password: null
        },
        signUpForm: {
            firstName: null,
            lastName: null,
            displayName: null,
            email: null,
            password: null
        },
        currentForm: 'signInForm'
    };
    const localState = lSUtils.get(lSPath);
    return extend(true, {}, defaultState, localState, initialState);
};

const AuthenticateScene = module.exports = function AuthenticateScene($container, initialState) {
    const subject = new Subject();
    const currentState = getCurrentState(initialState);
    let tree;
    this.state = subject
        .startWith(currentState)
        .scan(function mergeStates(prev, next) {
            const currentState = getCurrentState(next);
            lSUtils.set(lSPath, currentState);
            return currentState;
        });

    this.state$ = this.state.subscribe(function processStateChanges(state) {
        if (tree) {
            tree = patch(tree, render(subject, state));
        } else {
            tree = patch($container, render(subject, state));
        }
    });
};
AuthenticateScene.prototype = {
    dispose: function AuthenticateSceneDisposal() {
        this.state$.complete();
    }

};