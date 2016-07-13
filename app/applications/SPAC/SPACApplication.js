/**
 * Created by nickbespalov on 12.07.16.
 */
const Subject = require('rxjs/rx').Subject;
const ConstructorPerspective = require('./../../scenes/constructor/ConstructorScene');
const AuthenticatePerspective = require('./../../scenes/authenticate/AuthenticateScene');
const extend = require('extend');
const getPath = require('./../../../utils/objects').getPath;
const lSUtils = require('./../../../utils/objects').localStorage;
const lSPath = 'index';
require('./styles/spac.application.scss');
const initialState = {
    session: null
};
const ApplicationConstructor = module.exports = function ApplicationConstructor ($container) {
    const subject$ = new Subject();
    const currentState = lSUtils.get(lSPath) || initialState;
    this.state = subject$
        .startWith(currentState)
        .scan(function processNextState (prev, next) {
            const currentState = extend(true, {}, prev, next);
            lSUtils.set(lSPath, currentState);
            return currentState;
        });
    this.state$ = this.state.subscribe(function onNextStateIndex(indexState){
            const session = indexState.session;
            if (session) {
                const constructorPerspective = new ConstructorPerspective($container);
                constructorPerspective.state.subscribe(function(constructorPerspectiveState){
                    debugger;
                });
            } else {
                debugger
                const authenticatePerspective = new AuthenticatePerspective($container);
                authenticatePerspective.state
                    .subscribe(
                        function onAuthChanged(authenticatePerspectiveState) {
                            if(getPath(authenticatePerspectiveState, 'session')) {
                                authenticatePerspectiveState.dispose();
                                subject$.next({session: authenticatePerspectiveState.session});
                            }
                        }
                    );
            }
        }, function(){}, function(){$container.innerHTML = ''});
};
ApplicationConstructor.prototype = {
    dispose: function disposeApplication () {
        this.state$.coplete();
    }
};