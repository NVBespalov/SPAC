/**
 * Created by nickbespalov on 12.07.16.
 */
const Subject = require('rxjs/rx').Subject;
const AuthenticateWidget = require('./authenticate/AuthenticateWidget');
const ConstructorWidget = require('./constructor/constructorWidget');
const extend = require('extend');
const getPath = require('./../utils/objects').getPath;
const lSUtils = require('./../utils/objects').localStorage;
const lSPath = 'index';
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
                const constructorWidget = new ConstructorWidget($container);
                constructorWidget.state.subscribe(function(constructorWidgetState){
                    debugger;
                });
            } else {
                const authenticateWidget = new AuthenticateWidget($container);
                authenticateWidget.state
                    .subscribe(
                        function onAuthChanged(authWidgetState) {
                            if(getPath(authWidgetState, 'session')) {
                                authenticateWidget.dispose();
                                subject$.next({session: authWidgetState.session});
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