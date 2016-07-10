'use strict';
const Observable = require('rxjs/rx').Observable;

const AuthenticateWidget = require('./authenticate/AuthenticateWidget');
const ConstructorWidget = require('./constructor/constructorWidget');

Observable.fromEvent(document, 'DOMContentLoaded')
    .map(e=> e.target.body.appendChild(document.createElement('div')))
    .subscribe(function onDOMLoaded($container) {
        const session = localStorage.getItem('session');
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
                        if (authWidgetState.session) {
                            localStorage.setItem('session', JSON.stringify(authWidgetState.session));
                            authenticateWidget.dispose();
                        }
                    }
                );
        }
    });