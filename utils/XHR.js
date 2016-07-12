const getPath = require('./objects').getPath;
const extend = require('extend');
const Observable = require('rxjs/rx').Observable;
/**
 * @function onXHRLoaded
 * @throws SyntaxError - Throws SyntaxError if response is not a JSON string
 * @param res
 * @param rej
 * @param e
 */
const onXHRLoaded = function onXHRLoaded(res, rej, e) {
    const  parsedResponse = JSON.parse(getPath(e, 'target.responseText'));
    getPath(e, 'target.status') === 200 ? res(parsedResponse) : rej(parsedResponse);
};
/**
 *
 * @param {XMLHttpRequest} xhr - The xhr object
 * @param {String} k - The key value
 * @param {Object} collection - The headers object
 */
const setXHRHeader = function setXHRHeader (xhr, collection, k) {
    xhr.setRequestHeader(k, collection[k]);
};


module.exports = {
    /**
     * @param options
     * @param  {String} options.method - The method name (GET, POST, PUT)
     * @param  {String} options.url - The url to make request
     * @param  {Object} options.data - The request payload data
     * @param  {Object} options.headers - The request headers. By default is set to {'Content-Type':'application/json; charset=UTF-8'}
     * @param  {Boolean} options.async - Specify is this request is asynchronous or a synchronous
     * @returns {Observable<T>}
     */
    getJSON$:
        function getJSON$ (options) {
        return Observable.fromPromise(new Promise(function xhrPromiseExecutor(res, rej) {
            const xhr = new XMLHttpRequest();
            const headers = extend(true, {}, getPath(options, 'headers'), {'Content-Type': 'application/json; charset=UTF-8'});
            const data = getPath(options, 'data') ? JSON.stringify(getPath(options, 'data')) : null;
            const async = typeof getPath(options, 'async') === 'undefined' ? true : getPath(options, 'async');
            debugger
            xhr.onload = onXHRLoaded.bind(xhr, res, rej);
            xhr.open(getPath(options, 'method'), getPath(options, 'url'), async);
            headers && Object.keys(headers).forEach(setXHRHeader.bind(null, xhr, headers));
            xhr.send(data);
        }));


    }
};

