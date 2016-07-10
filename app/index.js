'use strict';
require('./styles/index.scss');

const Observable = require('rxjs/rx').Observable;



Observable.fromEvent(document, 'DOMContentLoaded')
    .map(e=> e.target.body.appendChild(document.createElement('div')))
    .subscribe(function onDOMLoaded($container) {
        require('./authenticate/auth')($container);
    });