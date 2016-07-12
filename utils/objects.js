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

    while ((obj = obj[keys[i++]]) != null && i < n) {}
    return i < n ? void 0 : obj;
};
function getFromLocalStorage(key) {
    return localStorage.getItem(key) && JSON.parse(localStorage.getItem(key));
}
function setToLocalStorage(key, value) {
    return localStorage.setItem(key, JSON.stringify(value));
}
function removeFromLocalStorage(key) {
    return localStorage.removeItem(key);
}
module.exports = {
    getPath:getPath,
    localStorage: {
        get: getFromLocalStorage,
        set:setToLocalStorage,
        remove: removeFromLocalStorage
    }
};