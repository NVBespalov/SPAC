"use strict";
const mongoose = require('mongoose')
    , crypto = require('crypto');
/**
 * Check length of variable and exclude update handler
 * @param property
 * @returns {boolean}
 */
const validateProperty = (property) => !!(property.length);

const makeSalt = () => crypto.randomBytes(256).toString('hex');

/**
 * @class UserModel
 * @description The UserModel schema. The user model entity represents a system user.
 * @property {String} firstName - The user's first name.
 * @property {String} lastName - The user's last name.
 * @property {String} [displayName] - Mixed string of first and last names.
 * @property {String} email - The user's email.
 * @property {String} salt - The salt to hash password
 * @property {String} hashedPassword - The hashed password
 * @example
 * {
 *  "lastName" : "superadmin",
 *  "firstName" : "superadmin",
 *  "email" : "super@admin.ru",
 *  "hashedPassword" : "d2215a728e465c2f54b6287562f7b6f8aa230f06",
 *  "salt" : "47227553264",
 *  "displayName" : "Super super"
 * }
 * @version 1.0
 */

const unique = true
    , trim = true
    , required = true
    , stripHtmlTags = true
    , lowercase = true;

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim,
        required,
        stripHtmlTags,
        validate: [validateProperty, 'Please fill in your first name']
    },
    lastName: {
        type: String,
        trim,
        required,
        stripHtmlTags,
        validate: [validateProperty, 'Please fill in your last name']
    },
    displayName: {
        type: String,
        stripHtmlTags,
        trim
    },
    email: {
        type: String,
        stripHtmlTags,
        trim,
        unique,
        required,
        lowercase,
        validate: [validateProperty, 'Please fill in your email']
    },
    salt: {
        type: String,
        default: makeSalt
    },
    hashedPassword: {
        type: String
    }
});

userSchema.statics.fieldsForFilter = ['displayName', 'lastName', 'firstName'];

/**
 * @description Password validation
 */
userSchema.path('hashedPassword').validate(function validateHashedPassword () {
    if (this.purePassword === undefined) {
        return true;
    }
    const isValid = (( typeof(this.purePassword) === 'string') && (this.purePassword.length > 7));
    delete this.purePassword;
    return isValid;
}, 'The passwords should contain at least 8 characters');

/**
 * prepare password
 * do not store password in db
 */
userSchema.virtual('password').set(function setVirtualPassword(password) {
    this.purePassword = password;
    this.hashedPassword = this.encryptPassword(password);
});

userSchema.virtual('password').get((password) => 'we don\'t contain pure password');

userSchema.methods.authenticate = function authenticate (plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
};

userSchema.methods.encryptPassword = function encryptPassword (password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};
const validateEmail = (val) => /.+\@.+\..+/.test(val);

userSchema.path('email').validate(validateEmail, 'validation of `{PATH}` failed with value `{VALUE}`');


userSchema.methods.isValid = function() {
    return validateProperty(this.firstName) && validateProperty(this.lastName) && validateProperty(this.email) && validateProperty(this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;