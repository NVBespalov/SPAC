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
const lSUtils = require('./../../../utils/objects').localStorage;
const lSPath = 'constructorWidget';
const initialState = {

};
const render = function render(subject$, state) {
    return h('div', []);
};
const ConstructorWidget = module.exports = function ($container) {
    const subject$ = new Subject();
    const currentState = lSUtils.get(lSPath) || initialState;
    let tree;
    this.state = subject$
        .startWith(currentState)
        .scan(function processNextState (prev, next) {
            const currentState = extend(true, {}, prev, next);
            lSUtils.set(lSPath, currentState);
            return currentState;
        });
    this.state$ = this.state.subscribe(function processStateChanges (state) {
        if (tree) {
            tree = patch(tree, render(subject$, state));
        } else {
            tree = patch($container, render(subject$, state));
        }
    });
};
ConstructorWidget.prototype = {
    dispose: function ConstructorWidgetDisposal () {
        lSUtils.remove(lSPath);
        this.state$.complete();
    }
};