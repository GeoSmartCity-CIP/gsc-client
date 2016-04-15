'use strict';
gsc.organization = (function() {

  /**
   * @exports gsc/organization
   */
  var mod = {};

  /**
   * Create a new organization
   *
   * @param {type} organizationname
   * @param {type} description
   * @returns {Promise.<Object>}
   */
  mod.create = function(organizationname, description) {
    return gsc.doPost('createorg', {
      organizationname: organizationname,
      description: description
    });
  };

  /**
   * List/search for organizations
   *
   * @param {type} [organizationname] - Optionally name of organization
   * @returns {Promise.<Object>}
   */
  mod.list = function(organizationname) {
    var param = {};
    if (organizationname !== null && organizationname !== undefined) {
      param.organizationname = organizationname;
    }
    return gsc.doPost('listorg', param);
  };

  /**
   * Delete organization
   *
   * @param {type} organizationId
   * @returns {Promise.<Object>}
   */
  mod.delete = function(organizationId) {
    return gsc.doPost('deleteorg', {
      idorganization: organizationId
    });
  };

  /**
   * Updatea an organization object
   *
   * @param {type} organizationId
   * @param {type} organizationname
   * @param {type} description
   * @returns {jqXHR|!jQuery.jqXHR|Promise.<Object>}
   */
  mod.update = function(organizationId, organizationname, description) {
    return gsc.doPost('updateorg', {
      idorganization: organizationId,
      organizationname: organizationname,
      description: description
    });
  };

  return mod;

}());
