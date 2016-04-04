'use strict';

gsc.user = (function() {

  /**
   *
   * @exports gsc/user
   */
  var mod = {};

  /**
   * Register a new user
   *
   * @param {String} email [description]
   * @param {String} username [description]
   * @param {String} password [description]
   * @param {String} confirmpassword [description]
   * @param {Object[]} organizations [description]
   * @return {Promise.<Object>} [description]
   */
  mod.register = function(email,
    username,
    password,
    confirmpassword,
    organizations) {

    return gsc.doPost('reguser', {
      email: email,
      username: username,
      password: password,
      confirmpassword: confirmpassword,
      organizations: organizations
    });

  };

  /**
   * Authenticate a user
   *
   * @param {string} username - Username
   * @param {string} password - Password
   * @return {Promise.<Response.<User>>} User object
   */
  mod.login = function(username, password) {
    return gsc.doPost('login', {
      username: username,
      password: password
    });
  };

  /**
   * Delete a user
   *
   * @param {String} username User name
   * @param {String} password Password
   * @return {Promise.<Object>}
   */
  mod.delete = function(username, password) {
    return gsc.doPost('unreguser', {
      username: username,
      password: password
    });
  };

  /**
   * Get a password reminder
   * If both arguments are supplied, email takes presedent
   *
   * @param {string} email - E-mail of user to get reminder for
   * @param {string} username - Username of user to get reminder for
   * @return {Promise} [description]
   */
  mod.remindPassword = function(email, username) {

    var params = {};

    if (email !== undefined && email !== null) {
      params.email = email;
    } else if (username !== undefined && username !== null) {
      params.username = username;
    }

    return gsc.doPost('remindpwd', params);

  };

  /**
   * Change password for user
   *
   * @param {string} username [description]
   * @param {string} oldpassword [description]
   * @param {string} newpassword [description]
   * @param {string} confirmnewpassword [description]
   * @return {Promise} [description]
   */
  mod.changePassword = function(username,
    oldpassword,
    newpassword,
    confirmnewpassword) {

    return gsc.doPost('changepwd', {
      username: username,
      oldpassword: oldpassword,
      newpassword: newpassword,
      confirmnewpassword: confirmnewpassword
    });

  };

  /**
   * Update user
   *
   * @param {number} userId Id of user to update
   * @return {Promise.<Object>} Updated user object
   */
  mod.update = function(userId, email, username, organizations) {

    return gsc.doPost('updateuser', {
      id: userId,
      email: email,
      username: username,
      organizations: organizations
    });

  };

  /**
   * Lock user
   *
   * @param {string} username Username
   * @param {boolean} [lock=true] Boolean flag to lock user
   * @return {Promise.<Object>}
   */
  mod.lock = function(username, lock) {

    if (lock === undefined) {
      lock = true;
    }

    return gsc.doPost('lockuser', {
      username: username,
      lock: lock
    });

  };

  /**
   * Verify registered email
   *
   * @param {number} verificationId Id to confirm - sent to registerred email
   * @return {Promise.<Object>}
   */
  mod.verifyEmail = function(verificationId) {

    return gsc.doPost('verifymail', {
      id: verificationId
    });

  };

  return mod;

}());