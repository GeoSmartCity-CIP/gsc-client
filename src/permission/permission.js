'use strict';

gsc.permission = (function() {

    /**
     *
     * @exports gsc/permission
     */
    var mod = {};

    /**
     * Assign a permission to a role
     * 
     * @param {Number} roleId - The numeric identifier of the role that the permission should be assigned to
     * @param {Number} functionId - The numeric identifier of the function
     * @param {Number} [layerId=null] - The numeric identifier of a layer (or group layer?)
     * @param {Number} [applicationId=null] - The numeric identifier of an application
     * @returns {Promise.<Object>}
     */
    mod.assign = function(roleId,
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
