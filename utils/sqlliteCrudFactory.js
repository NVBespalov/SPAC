/**
 * Created by nickbespalov on 20.05.16.
 */

/**
 * Utils module
 * @module utils/sqliteCrudFactory
 */

const sqlite3 = require('sqlite3');
const size = require('./objects').collectionSize;
const getPath = require('./../utils/objects').getPath;

module.exports = {
    /**
     *
     * @param options
     * @param {sqlite3.Database} options.db - The db object
     * @param {String} options.tableName - The name of the table
     * @param {Object} options.values - The key value list with the values to insert.
     */
    create: function (options) {
        return new Promise(function (res, rej) {
            var queryString = 'INSERT INTO ' + options.tableName +
                '(' + Object.keys(options.values).join(',') + ')' +
                'VALUES(' + makeQueryStringValuesList(options.values) + ')';
            options.db.run(queryString, function (err, row) {
                err !== null ? rej(err) : res(row);
            });
        });
    },
    /**
     * @property {Function} get
     * @param {Object} options
     * @param  {sqlite3.Database} options.db - The db object
     * @param {string} options.tableName - The name of the table
     * @param {array} options.fields - The list of fields in result table.
     * @param {object} options.conditions - The key value list with the values condition.
     */
    get: function (options) {
        return new Promise(function (res, rej) {
            var conditions = '';
            if (options.conditions) {
                conditions = Object.keys(getPath(options, 'conditions')).reduce(function (memo, k) {
                    memo += k + '= \'' + getPath(options, `conditions.${k}`) + '\',';
                    return memo;
                }, '');
                conditions = conditions.substring(0, conditions.length -1);
            }

            var queryString = 'SELECT ' + options.fields +
                ' FROM ' + options.tableName;
            queryString += size(conditions) ? ' WHERE ' +  conditions : '';
            options.db.all(queryString, function (err, row) {
                err !== null ? rej(err) : res(row);
            });
        });
    },
    /**
     * @property {Function} getOne
     * @param {Object} options
     * @param  {sqlite3.Database} options.db - The db object
     * @param {string} options.tableName - The name of the table
     * @param {array} options.fields - The list of fields in result table.
     * @param {object} options.conditions - The key value list with the values condition.
     */
    getOne: function (options) {
        return new Promise(function (res, rej) {
            var conditions = '';
            if (options.conditions) {
                conditions = Object.keys(getPath(options, 'conditions')).reduce(function (memo, k) {
                    memo += k + '= \'' + getPath(options, `conditions.${k}`) + '\',';
                    return memo;
                }, '');
                conditions = conditions.substring(0, conditions.length -1);
            }

            var queryString = 'SELECT ' + options.fields +
                ' FROM ' + options.tableName;
            queryString += size(conditions) ? ' WHERE ' +  conditions : '';
            options.db.get(queryString, function (err, entrance) {
                err !== null ? rej(err) : res(entrance);
            });
        });
    },
    /**
     *
     * @param options
     * @param {sqlite3.Database} options.db - The db object
     * @param {String} options.tableName - The name of the table
     * @param {object} options.values - The key value list with the values to insert.
     * @param {object} options.conditions - The key value list with the values condition.
     */
    update: function (options) {
        return new Promise(function (res, rej) {
            var queryString = 'UPDATE ' + options.tableName +
                ' SET ' + makeKeyEqualValueStrings(options.values) +
                'WHERE ' +  makeKeyEqualValueStrings(options.conditions);
            options.db.run(queryString, function (err) {
                err !== null ? rej(err) : res({});
            });
        });
    },
    /**
     *
     * @param options
     * @param {sqlite3.Database} options.db - The db object
     * @param {String} options.tableName - The name of the table
     * @param {object} options.values - The key value list with the values to insert.
     * @param {object} options.conditions - The key value list with the values condition.
     */
    delete: function (options) {
        return new Promise(function (res, rej) {
            options.db.run('DELETE FROM ' + options.tableName + ' WHERE ' + makeKeyEqualValueStrings(options.conditions), function (err) {
                err !== null ? rej(err) : res({});
            });
        });
    },
    createDataBase: function (options) {
        return new sqlite3.Database(options.path + '\\' + options.name + '.db');
    },
    createTable: function () {
        if (err !== null) {
            console.error(err);
        }
        else if (rows === undefined) {
            db.run('CREATE TABLE agents (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), host VARCHAR(255), log INTEGER)', function (err) {
                if (err !== null) {
                    console.error(err);
                }
                else {
                    console.info("SQL Table 'agents' initialized.");
                }
            });
        }
        else {
            console.info("SQL Table 'agents' already initialized.");
        }
    }
};
var makeKeyEqualValueStrings = function (values) {
    var result = Object.keys(values).reduce(function (m, k) {
        return  m + k + ' = ' + '\'' + values[k] + '\'' + ', ';
    }, '');
    return result.substr(0, result.length - 2) + ' ';
};
function makeQueryStringValuesList(data) {
    var result = Object.keys(data).reduce(function (m, key) {
        return m + '\'' + data[key] + '\', '
    }, '');
    return result.substring(0, result.length -2);
}