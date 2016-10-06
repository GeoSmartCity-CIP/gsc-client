'use strict';

gsc.permission = (function() {

  /**
   *
   * @exports gsc/permission
   */
  var mod = {};

  /**
   * Creates a new instance of a Permission object
   *
   * @class Defines a permission object that can be assigned to a role
   * @param {Number} functionId - Numeric identifier of a function
   * @param {Number} [layerId=null] - Numeric identifier of a layer
   * @param {Number} [applicationId=null] - Numeric identifier of an application
   * @property {Number} idfunction - Numeric identifier of a function
   * @property {Number} idlayer Numeric identifier of a layer
   * @property {Number} idapplication Numeric identifier of an application
   */
  mod.Permission = function(functionId,
      layerId,
      applicationId) {
    var self = this;
    self.idfunction = functionId;
    if (!gsc.util.isNull(layerId)) {
      self.idlayer = layerId;
    }
    if (!gsc.util.isNull(applicationId)) {
      self.idapplication = applicationId;
    }
  };

  /**
   * Assign a single permission to a role
   *
   * @param {Number} roleId - The numeric identifier of the role that the permission should be assigned to
   * @param {Number} functionId - The numeric identifier of the function
   * @param {Number} [layerId=null] - The numeric identifier of a layer (or group layer?)
   * @param {Number} [applicationId=null] - The numeric identifier of an application
   * @returns {Promise.<Object>}
   */
  mod.assignSingle = function(roleId,
      functionId,
      layerId,
      applicationId) {

    var functions = {
      idfunction: functionId
    };

    if (!gsc.util.isNull(layerId)) {
      functions.idlayer = layerId;
    }

    if (!gsc.util.isNull(applicationId)) {
      functions.idapplication = applicationId;
    }

    return gsc.doPost('assignperm', {
      idrole: roleId,
      functions: functions
    });

  };

  /**
   * Assign a list of permissions to a role
   *
   * @param {Number} roleId - The numeric identifier of the role that the permission should be assigned to
   * @param {gsc.permission.Permission[]} permissions - An array of Permission objects
   * @returns {Promise.<Object>}
   */
  mod.assign = function(roleId,
      permissions
      ) {

    return gsc.doPost('assignperm', {
      idrole: roleId,
      functions: permissions
    });
  };

  /**
   * Lists the functions associated with a role
   *
   * @param {Number} roleId - The numeric identifier of the role for which permissions should be listed
   * @returns {Promise.<Object>}
   */
  mod.list = function(roleId) {
    return gsc.doPost('listperm', {
      idrole: roleId
    });
  };

  return mod;

}());
