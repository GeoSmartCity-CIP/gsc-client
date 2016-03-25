var gsc = gsc || {};

gsc.auth = gsc.auth || {};

/**
 * Create a new user with specified email and password
 *
 * @param {String} email Usernames are specified and validated as e-mail
 * addresses
 * @param {String} password Passwords can be any string of 6 or more letters
 * @constructor
 */
gsc.auth.User = function(email, password) {

  /**
   * Unique identifier of user
   */
  this.Id = -1;

  /**
   * E-mail address (user name)
   */
  this.Email = '';

  /**
   * Password string
   */
  this.Password = '';

  if (email !== undefined) {
    this.Email = email;
  }

  if (email !== undefined) {
    this.Password = password;
  }

};
