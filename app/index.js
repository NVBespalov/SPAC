'use strict';
const Observable = require('rxjs/rx').Observable;
const Application = require('./Application');

Observable.fromEvent(document, 'DOMContentLoaded')
    .map(e=> e.target.body.appendChild(document.createElement('div')))
    .subscribe(function onDOMLoaded($container) {
        new Application($container).state.subscribe(function applicationNextState (applicationState) {
            //debugger
        });
    });