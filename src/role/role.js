'use strict';

gsc.role = (function() {

  /**
   * Module to handles roles
   *
   * @exports gsc/role
   */
  var mod = {};

  /**
   * Register a new role
   *
   * @param {type} rolename
   * @param {type} organization
   * @param {type} description
   * @returns {jqXHR|!jQuery.jqXHR|Promise.<Object>}
   */
  mod.register = function(rolename,
      organization,
      description) {

    return gsc.doPost('createrole', {
      rolename: rolename,
      organization: organization,
      description: description
    });

  };

  /**
   * Delete a role
   *
   * @param {Number} idrole
   * @returns {Promise.<Object>}
   */
  mod.delete = function(idrole) {

    return gsc.doPost('deleterole', {
      idrole: idrole
    });

  };

  /**
   * Get all the rolees for an organization
   * 
   * @param {Number} organization - Id of organization to list roles for
   * @returns {Promise.<Object>}
   */
  mod.listrole = function(organization,
      rolename,
      includeadminrecords) {

    return gsc.doPost('listrole', {
      organization: organization,
      rolename: rolename,
      includeadminrecords: includeadminrecords
    });

  };

  /**
   * Assgin a role to a user
   *
   * @param {type} idrole
   * @param {type} users
   * @returns {jqXHR|!jQuery.jqXHR|Promise.<Object>}
   * @example <caption>Valid JSON message</caption>
   * {
   *  idrole:value
   *  users:[
   *      {iduser:value},
   *      {iduser:value}
   *  ]}
   */
  mod.assignrole = function(idrole, users) {

    return gsc.doPost('assignrole', {
      idrole: idrole,
      users: users
    });

  };

  return mod;

}());
