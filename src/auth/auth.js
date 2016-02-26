'use strict';

var gsc = gsc || {};

/**
 *
 * @namespace gsc.auth
 */
gsc.auth = gsc.auth || {};

/**
 * An <gsc.auth.LoginSession> object describing the current session - or null if
 * no session is available
 *
 * @type gsc.auth.LoginSession
 */
gsc.auth.session = null;

/**
 * Register a new user and return the complete user object
 *
 * @param {gsc.auth.User} user
 * @returns {gsc.auth.User|null} A valid user object or null on error
 */
gsc.auth.register = function(user) {
  return null;
};

/**
 * Log in and start a new user session
 *
 * @param {String} email The e-mail id of the user
 * @param {String} password The password of the user
 * @returns {gsc.auth.LoginSession|null} A valid <gsc.auth.LoginSession> object
 * or null on error
 */
gsc.auth.login = function(email, password) {
  return null;
};

/**
 * Log out of system
 */
gsc.auth.logout = function() {

    // Pseudo code
    // Log out

};

/**
 * Update a user profile
 *
 * @return {gsc.auth.User} The updated user object
 */
gsc.auth.update = function() {

};

/**
 * Delete a user profile
 *
 * @return {gsc.auth.User} The deleted user object
 */
gsc.auth.delete = function() {

};
