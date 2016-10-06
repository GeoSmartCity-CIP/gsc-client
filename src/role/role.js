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
   * @param {String} roleName - Name of role
   * @param {Number} organizationId - Numeric id of organization
   * @param {String} description - Description of role
   * @returns {Promise.<Object>}
   */
  mod.register = function(roleName,
      organizationId,
      description) {

    return gsc.doPost('createrole', {
      rolename: roleName,
      organization: organizationId,
      description: description
    });

  };

  /**
   * Delete a role
   *
   * @param {Number} roleId
   * @returns {Promise.<Object>}
   */
  mod.delete = function(roleId) {

    return gsc.doPost('deleterole', {
      idrole: roleId
    });

  };

  /**
   * Get all the rolees for an organization
   *
   * @param {Number} organizationId - Id of organization
   * @param {String} roleName - Name or partial name of role
   * @param {Boolean} includeAdminRecords - True to include admin records that have no organization attached to them
   * @returns {Promise.<Object>}
   */
  mod.listrole = function(organizationId,
      roleName,
      includeAdminRecords) {

    var params = {};

    if (!gsc.util.isNull(organizationId)) {
      params.organization = organizationId;
    }

    if (!gsc.util.isNull(roleName)) {
      params.rolename = roleName;
    }

    if (!gsc.util.isNull(includeAdminRecords)) {
      params.includeadminrecords = includeAdminRecords;
    }

    return gsc.doPost('listrole', params);

  };

  /**
   * Assgin a role to a user
   *
   * @param {Number} roleId - Numeric id of role
   * @param {Object[]} users - Array of user objects
   * @returns {jqXHR|!jQuery.jqXHR|Promise.<Object>}
   * @example <caption>Valid JSON message</caption>
   * {
   *  idrole:value,
   *  users:[
   *     {iduser:value},
   *     {iduser:value}
   *     ]
   *  }
   */
  mod.assignrole = function(roleId, users) {

    return gsc.doPost('assignrole', {
      idrole: roleId,
      users: users
    });

  };

  return mod;

}());
