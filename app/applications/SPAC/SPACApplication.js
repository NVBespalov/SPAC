/**
 * Created by nickbespalov on 12.07.16.
 */
const Subject = require('rxjs/rx').Subject;
const constructorScene = require('./../../scenes/constructor/constructorSceneTemplate');
const AuthenticateScene = require('./../../scenes/authenticate/AuthenticateScene');
const extend = require('extend');
const getPath = require('./../../../utils/objects').getPath;
const lSUtils = require('./../../../utils/objects').localStorage;
const lSPath = 'index';
const patch = require('snabbdom').init([
    require('snabbdom/modules/class'),
    require('snabbdom/modules/props'),
    require('snabbdom/modules/attributes'),
    require('snabbdom/modules/style'),
    require('snabbdom/modules/eventlisteners'),
    require('snabbdom/modules/dataset')
]);
require('./styles/spac.application.scss');
const initialState = {
    authenticate: {
        session: {}
    }, 
    constructor: {}
};
const ApplicationConstructor = module.exports = function ApplicationConstructor ($container) {
    const subject$ = new Subject();
    const currentState = lSUtils.get(lSPath) || initialState;
    let tree;

    function renderSPACApplication (subject$, state) {
        const session = getPath(state, 'authenticate.session');
        let result;
        if (session) {
            result = constructorScene(subject$, state);
        } else {
            // authenticateScene = new AuthenticateScene($container);
            // authenticateScene.state
            //     .subscribe(
            //         function onAuthChanged(authenticateSceneState) {
            //             subject$.next({authenticate: authenticateSceneState});
            //         }
            //     );
        }
        return result;
    }


    this.state = subject$
        .startWith(currentState)
        .scan(function processNextState (prev, next) {
            const currentState = extend(true, {}, prev, next);
            lSUtils.set(lSPath, currentState);
            return currentState;
        });
    this.state$ = this.state$ = this.state.subscribe(function processStateChanges(state) {
        if (tree) {
            tree = patch(tree, renderSPACApplication(subject$, state));
        } else {
            tree = patch($container, renderSPACApplication(subject$, state));
        }
    });
};
ApplicationConstructor.prototype = {
    dispose: function disposeApplication () {
        this.state$.coplete();
    }
};