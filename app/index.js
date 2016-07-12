'use strict';
const Observable = require('rxjs/rx').Observable;

const AuthenticateWidget = require('./authenticate/AuthenticateWidget');
const ConstructorWidget = require('./constructor/constructorWidget');
var extend = require('extend');
const initialState = {
    session: null
};
Observable.fromEvent(document, 'DOMContentLoaded')
    .map(e=> e.target.body.appendChild(document.createElement('div')))
    .subscribe(function onDOMLoaded($container) {
        const subject$ = new Subject();
        const state$ = subject$
            .startWith(currentState)
            .scan(function processNextState (prev, next) {
                const currentState = extend(true, {}, prev, next);
                localStorage.setItem('authenticateWidgetState', JSON.stringify(currentState));
                return currentState;
            });
            state$.subscribe(function onNextStateIndex(indexState){
                const session = indexState.session || localStorage.getItem('session');
                if (session) {
                    const constructorWidget = new ConstructorWidget($container);
                    constructorWidget.state$.subscribe(function(constructorWidgetState){
                        debugger;
                    });
                } else {

                    const authenticateWidget = new AuthenticateWidget($container);
                    authenticateWidget.state$
                        .subscribe(
                            function onAuthChanged(authWidgetState) {
                                state$.next(Object.assign({}, indexState.session, authWidgetState.session));
                                authenticateWidget.dispose();
                            }
                        );
                }
            });

    });