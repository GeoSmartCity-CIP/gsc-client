'use strict';

gsc.function = (function() {

  /**
   *
   * @exports gsc/function
   */
  var mod = {};

  /**
   * Create a new function
   *
   * @param {type} functionname
   * @param {type} organization
   * @param {type} type
   * @param {type} description
   * @returns {jqXHR|!jQuery.jqXHR|Promise.<Object>}
   */
  mod.create = function(functionname,
      organization,
      type,
      description) {

    return gsc.doPost('createfunc', {
      functionname: functionname,
      organization: organization,
      type: type,
      description: description
    });

  };

  /**
   * Delete a function
   *
   * @param {Number} functionId - The numerical identifier of the function to delete
   * @returns {Promise.<Object>}
   */
  mod.delete = function(functionId) {
    return gsc.doPost('deletefunc', {
      idfunction: functionId
    });
  };

  /**
   * Update an existing function
   *
   * @param {type} idfunction
   * @param {type} functionname
   * @param {type} organization
   * @param {type} type
   * @param {type} description
   * @returns {jqXHR|!jQuery.jqXHR|Promise.<Object>}
   */
  mod.update = function(idfunction,
      functionname,
      organization,
      type,
      description) {

    return gsc.doPost('updatefunc', {
      idfunction: idfunction,
      functionname: functionname,
      organization: organization,
      type: type,
      description: description
    });
  };

  /**
   * List functions
   *
   * @param {Number} organizationId - The identifier of the organization for which functions should be loaded
   * @param {String} [functionName=null]
   * @param {Boolean} [includeAdminRecords=null]
   * @returns {Promise.<Object>}
   * @todo This function does not return organization or type...
   */
  mod.list = function(organizationId,
      functionName,
      includeAdminRecords) {

    var params = {
      organization: organizationId
    };

    if (!gsc.util.isNull(functionName)) {
      params.functionname = functionName;
    }

    if (!gsc.util.isNull(includeAdminRecords)) {
      params.includeadminrecords = includeAdminRecords;
    }

    return gsc.doPost('listfunc', params);
  };

  return mod;
}());
