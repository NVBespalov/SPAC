'use strict';
/**
 * Created by nickbespalov on 05.07.16.
 */
/**
 * @description get object value by the given path string
 * @param {object} obj - The object to get path on
 * @param {String} path - The path to get
 * @example Get nested value
 *  getPath({name:'name', nested:{name:'nestedName'}}, 'nested.name') => 'nestedName'
 * @returns {*}
 */
const getPath = (obj, path) => {
    if (!obj || Object.keys(obj).length === 0 || !path) return;
    var keys = path.replace(/\[(["']?)([^\1]+?)\1?]/g, '.$2').replace(/^\./, '').split('.'),
        i = 0,
        n = keys.length;

    while ((obj = obj[keys[i++]]) != null && i < n) {
    }
    return i < n ? void 0 : obj;
};
/**
 * @description set object property deep
 * @param obj {Object} - The object to process
 * @param key {String} - The key to get
 * @param value {*} - The value to set
 * @example Get nested value
 *  deepSet({name:'name', nested:{name:'nestedName'}}, 'nested.name')
 * @returns {*}
 */
function setPath(obj, key, value) {
    if (!key) return;
    var keys = key.replace(/\[(["']?)([^\1]+?)\1?]/g, '.$2').replace(/^\./, '').split('.'),
        i = 0,
        n = keys.length;
    if (arguments.length > 2) {
        n--;
        while (i < n) {
            key = keys[i++];
            obj = obj[key] = typeof obj[key] === 'object' ? obj[key] : {};
        }
        obj[keys[i]] = value;
    }
}

function getFromLocalStorage(key) {
    return localStorage.getItem(key) && JSON.parse(localStorage.getItem(key));
}
function setToLocalStorage(key, value) {
    return localStorage.setItem(key, JSON.stringify(value));
}
function removeFromLocalStorage(key) {
    return localStorage.removeItem(key);
}
function object(keys, values) {
    function toObject (m, k, i) {
        setPath(m, k, getPath(values, `[${i}]`));
        return m;
    }
    return keys.reduce(toObject, {});
}
function size (item) {
    return item && Object.keys(item).length
}

module.exports = {
    getPath: getPath,
    setPath: setPath,
    object: object,
    size: size,
    localStorage: {
        get: getFromLocalStorage,
        set: setToLocalStorage,
        remove: removeFromLocalStorage
    }
};