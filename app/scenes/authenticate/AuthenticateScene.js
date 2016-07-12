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
const render = function renderAuthenticateScene (subject$, state) {
    return h('div.authenticate-scene', {hook: {
        insert: function () {
            debugger
            subject$.next({currentForm: getPath(state, 'currentForm') || 'signIn'});
        }
    }}, []);
};
const AuthenticatePerspective = module.exports = function AuthenticatePerspective ($container, initialState) {
    debugger
    let tree;
    let form
    const subject$ = new Subject();
    const currentState = extend(true, {session: null, signInForm: null, signUpForm: null, currentForm: null}, lSUtils.get(lSPath), initialState);
    this.state = subject$
        .startWith(currentState)
        .scan(function processNextState (prev, next) {
            const currentState = extend(true, {}, prev, next);
            lSUtils.set(lSPath, currentState);
            return currentState;
        });

    this.state$ = this.state.subscribe(function processStateChanges (state) {

        if (tree) {
            debugger
            form = new FormWidget($container.querySelector('form'));
            // ctx.tree = patch(ctx.tree, ctx.render(subject$, state));
        } else {
            tree = patch($container, render(this, state));
            debugger
        }
    }, function() {}, function(){$container.innerHTML = ''});
};
AuthenticatePerspective.prototype = {
    dispose: function disposeAuthenticatePerspective () {

    }

};