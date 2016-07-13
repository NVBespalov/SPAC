/**
 * Created by nickbespalov on 12.07.16.
 */
require('./styles/authnticate.scss');
const Observable = require('rxjs/rx').Observable;
const Subject = require('rxjs/rx').Subject;
const FormWidget = require('./../../widgets/form/FormWidget');
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
const renderMainLayout = function renderAuthenticateSceneLayout (subject$, state) {
    return h('div.authenticate-scene', [
        h('div.container', [
            h('div', {class: {header: true}}, [
                h('div.current-form-name', [getPath(state, 'currentForm') === 'auth' ? 'Sign In' : 'Sign Up']),
                h('div', {class: {'form-type-toggle': true}}, [
                    'or you can',
                    h('div', {
                        class: {'change-form-type': true}, on: {
                            click: function onClickChangeType() {
                                subject$.next({currentFormType: getPath(state, 'currentForm') === 'auth' ? 'signUp' : 'auth'});
                            }
                        }
                    }, [getPath(state, 'currentForm') === 'auth' ? 'Sign Up' : 'Sign In'])
                ])
            ]),
            h('form')
        ])
    ]);
};
const signInSignUp = function signInSignUp(subject$, state) {
    getJSON$({
        url: `/auth/${getPath(state, 'currentForm') === 'auth' ? 'signin' : 'signup'}`,
        method: 'POST',
        data: getPath(state, getPath(state, 'currentForm'))
    })
        .subscribe(function onAuthSuccess(r) {
            getPath(state, 'currentForm') === 'auth' ? subject$.next({session: r.data}) : subject$.next({currentFormType: 'auth'});
        }, function onAuthError(r) {
            subject$.next({error: r})
        });
};

const getCurrentForm = function getCurrentForm(currentState) {
    return getPath(currentState, 'currentForm') === 'auth' ? getPath(currentState, 'signInForm') : getPath(currentState, 'signInForm');
};
const getCurrentState = function getCurrentState(initialState) {
    const defaultState = {
        signInForm: {
            email: null,
            password: null
        },
        signUpForm: {
            firstName: null,
            LastName: null,
            displayName: null,
            email: null,
            password: null
        },
        currentForm: 'signInForm'
    };
    const localState = lSUtils.get(lSPath);
    return extend(true, {}, defaultState, localState, initialState);
};
const AuthenticatePerspective = module.exports = function AuthenticatePerspective ($container, initialState) {
    const subject$ = new Subject();
    var currentState = getCurrentState(initialState);
    let tree = patch($container, renderMainLayout(currentState));

    let form = new FormWidget(tree.elm.querySelector('form'), getCurrentForm(currentState),{onSubmit:signInSignUp});

    this.state = subject$
        .startWith(currentState)
        .scan(function processNextState (prev, next) {
            const currentState = getCurrentState(next);
            lSUtils.set(lSPath, currentState);
            return currentState;
        });

    this.state$ = this.state.subscribe(function processStateChanges (state) {
        if (tree) {
            debugger
            // ctx.tree = patch(ctx.tree, ctx.render(subject$, state));
        } else {
            debugger
        }
    }, function() {}, function(){$container.innerHTML = ''});
};
AuthenticatePerspective.prototype = {
    dispose: function disposeAuthenticatePerspective () {

    }

};