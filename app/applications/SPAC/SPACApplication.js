/**
 * Created by nickbespalov on 12.07.16.
 */
const Subject = require('rxjs/Rx').Subject;
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
    constructor: {
        table: {
            data: [
                {
                    desert: 'Frozen yogurt',
                    calories: 159,
                    fat: 6.0,
                    carbs: 24,
                    protein: 4.0,
                    sodium: 87,
                    calcium: '14%',
                    iron: '1%'
                },
                {
                    desert: 'Ice cream sandwich',
                    calories: 237,
                    fat: 9.0,
                    carbs: 16,
                    protein: 4.3,
                    sodium: 129,
                    calcium: '8%',
                    iron: '1%'
                },
                {
                    desert: 'Eclair',
                    calories: 262,
                    fat: 16.0,
                    carbs: 24,
                    protein: 6.0,
                    sodium: 337,
                    calcium: '6%',
                    iron: '7%'
                }
            ],
            header: {},
            selection: {}
        }
    }
};
const ApplicationConstructor = module.exports = function ApplicationConstructor($container) {
    const subject$ = new Subject();
    const currentState = lSUtils.get(lSPath) || initialState;
    let tree;

    function renderSPACApplication(subject$, state) {
        const session = getPath(state, 'authenticate.session');
        let result;
        if (session) {
            result = constructorScene(subject$, getPath(state, 'constructor'));
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
        .scan(function processNextState(prev, next) {
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
    dispose: function disposeApplication() {
        this.state$.coplete();
    }
};