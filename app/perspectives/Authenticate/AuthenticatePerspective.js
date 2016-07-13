/**
 * Created by nickbespalov on 12.07.16.
 */
require('./styles/authnticate.scss');
const Observable = require('rxjs/rx').Observable;
const Subject = require('rxjs/rx').Subject;
const AuthenticateWidget = require('./../authenticate/AuthenticateWidget');
const h = require('snabbdom/h');
const getJSON$ = require('./../../../utils/XHR').getJSON$;
const extend = require('extend');
const getPath = require('./../../../utils/objects').getPath;
const lSUtils = require('./../../../utils/objects').localStorage;
const lSPath = 'authenticateWidgetState';
const patch = require('snabbdom').init([
    require('snabbdom/modules/class'),
    require('snabbdom/modules/props'),
    require('snabbdom/modules/attributes'),
    require('snabbdom/modules/style'),
    require('snabbdom/modules/eventlisteners'),
    require('snabbdom/modules/dataset')
]);
const AuthenticatePerspective = module.exports = function AuthenticatePerspective (container$) {
    this.state = subject$
        .startWith(currentState)
        .scan(function processNextState (prev, next) {
            const currentState = extend(true, {}, prev, next);
            lSUtils.set(lSPath, currentState);
            return currentState;
        });
    this.state$ = this.state.subscribe(function processStateChanges (state) {
        if (tree) {
            tree = patch(tree, render(subject$, state));
        } else {
            tree = patch($container, render(subject$, state));
        }
    }, function() {}, function(){$container.innerHTML = ''});
};
AuthenticatePerspective.prototype = {
    dispose: function disposeAuthenticatePerspective () {

    }
};