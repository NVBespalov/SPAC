/**
 * Created by nickbespalov on 08.05.16.
 */
const i18n = require('i18n'), path = require('path');
module.exports = function (app) {
    i18n.configure({
        locales:['en', 'de', 'ru'],
        directory: path.resolve(__dirname,  '../locales'),
        defaultLocale: 'en'
    });
    app && app.use(i18n.init);
    return i18n;
};