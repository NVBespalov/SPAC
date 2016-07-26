'use strict';
const Observable = require('rxjs/Rx').Observable;
const Application = require('./applications/SPAC/SPACApplication.js');

Observable.fromEvent(document, 'DOMContentLoaded')
    .map(e=> e.target.body.appendChild(document.createElement('div')))
    .subscribe(function onDOMLoaded($container) {
        new Application($container).state.subscribe(function applicationNextState (applicationState) {
            //debugger
        });
    });