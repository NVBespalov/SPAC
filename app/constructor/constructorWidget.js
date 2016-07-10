/**
 * Created by nickbespalov on 10.07.16.
 */
const Observable = require('rxjs/rx').Observable;
const Subject = require('rxjs/rx').Subject;
const h = require('snabbdom/h');
const patch = require('snabbdom').init([
    require('snabbdom/modules/class'),
    require('snabbdom/modules/props'),
    require('snabbdom/modules/attributes'),
    require('snabbdom/modules/style'),
    require('snabbdom/modules/eventlisteners'),
    require('snabbdom/modules/dataset')
]);
const initialState = {

};
function render(subject$, state) {
    return h('div', [
        h('')
    ]);
}
const ConstructorWidget = module.exports = function ($container) {
    debugger
    const subject$ = new Subject();
    const currentState = localStorage.getItem('constructorWidgetState') && JSON.parse(localStorage.getItem('constructorWidgetState')) || initialState;
    let tree;
    this.state$ = subject$
        .startWith(currentState)
        .scan(function processNextState (prev, next) {
            const currentState = extend(true, {}, prev, next);
            localStorage.setItem('constructorWidgetState', JSON.stringify(currentState));
            return currentState;
        });

    this.state$.subscribe(function processStateChanges (state) {
        if (tree) {
            tree = patch(tree, render(subject$, state));
        } else {
            tree = patch($container, render(subject$, state));
        }
    });
};
ConstructorWidget.prototype = {
    dispose: function ConstructorWidgetDisposal () {
        localStorage.removeItem('constructorWidgetState');
    }
};