/**
 * Utils module
 * @module utils/XHR
 */

const getPath =  require('./objects').getPath;
/**
 * @description Get XHR data
 * @param {Object} options - The options
 * @param  {String} options.method - The method name (GET, POST, PUT)
 * @param  {String} options.url - The url to make request
 * @param  {Object} options.data - The request payload data
 * @param  {Object} options.headers - The request headers. By default is set to {'Content-Type':'application/json; charset=UTF-8'}
 * @param  {Boolean} options.async - Specify is this request is asynchronous or a synchronous
 * @returns {Promise}
 */
module.exports.xhr = options => {
    return new Promise(function (res) {
        const xhr = new XMLHttpRequest();
        const headers = getPath(options, 'headers') || {'Content-Type': 'application/json; charset=UTF-8'};
        const data = getPath(options, 'data') ? JSON.stringify(getPath(options, 'data')) : null;
        const async = typeof getPath(options, 'async') === 'undefined' ? true : getPath(options, 'async');

        xhr.onload = function() {
            if (xhr.status === 200) {
                res(JSON.parse(xhr.responseText));
            }
            else {
                //debugger
            }
        };

        xhr.open(getPath(options, 'method'), getPath(options, 'url'), async);
        headers && Object.keys(headers).forEach(k=>  xhr.setRequestHeader(k, getPath(headers, k)));
        xhr.send(data);
    });
};
