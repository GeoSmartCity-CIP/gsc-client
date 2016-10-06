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
     * Return a list of organizations, optionally filtered by organization name or id
     *
     * @param {String} [organizationName=null] - Name or partial name of organization
     * @param {Number} [organizationId=null] - Numeric identifier of organization
     * @returns {Promise.<Object>}
     */
    mod.list = function(organizationName,
        organizationId) {
        var params = {};
        if (!gsc.util.isNull(organizationName)) {
            params.organizationname = organizationName;
        }
        if (!gsc.util.isNull(organizationId)) {
            params.id = organizationId;
        }
        return gsc.doPost('listorg', params);
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
