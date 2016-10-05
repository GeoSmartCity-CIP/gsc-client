/* global gsc */

'use strict';

gsc.application = (function() {

    /**
     *
     * @exports gsc/application
     */
    var mod = {};

    /**
     * Create a new instance of a GeoServerParams object
     * 
     * @class GeoServerParams
     * @constructor
     * @param {String} uri
     * @param {String} username
     * @param {String} password
     * @property {String} url - The URL of the GeoServer instance, e.g. http://hub.geosmartcity.eu/geoserver/
     * @property {String} username - The username of the GeoServer user that will publish the data
     * @property {String} password - The corresponding password of the GeoServer user
     * @returns {gsc.application.GeoServerParams}
     */
    mod.GeoServerParams = function(uri,
        username,
        password) {
        var self = this;

        self.uri = uri;
        self.username = username;
        self.password = password;
    };

    /**
     * Create a new instance of a {@link gsc/application.Extent} object
     * 
     * @class Extent
     * @constructor
     * @param {Number} left
     * @param {Number} bottom
     * @param {Number} right
     * @param {Number} top
     * 
     * @property {Number} left - Left coordinate
     * @property {Number} bottom - Bottom coordinate
     * @property {Number} right - Right coordinate
     * @property {Number} top - Top coordinate
     * @returns {gsc.application.Extent}
     */
    mod.Extent = function(left, bottom, right, top) {
        var self = this;
        self.left = left;
        self.bottom = bottom;
        self.right = right;
        self.top = top;
    };

    /**
     * Create a new application
     * 
     * @param {String} applicationName
     * @param {String} organization
     * @param {String} description
     * @param {gsc.application.GeoServerParams} geoserver
     * @param {String} srs - Spatial reference system, specified on the form 'namespace:identifier', e.g. 'EPSG:4326' for WGS84 Lat/Lon
     * @param {gsc.application.Extent} maxExtent
     * @param {String} uri
     * @returns {Promise.<Object>}
     */
    mod.create = function(applicationName,
        organization,
        description,
        geoServerParams,
        srs,
        maxExtent,
        uri) {

        return gsc.doPost('createapp', {
            applicationname: applicationName,
            organization: organization,
            description: description,
            geoserver: geoServerParams,
            srs: srs,
            maxextent: maxExtent,
            uri: uri
        });

    };

    /**
     * Update an application and assign layers and group layers to it
     * 
     * @param {Number} applicationId
     * @param {String} applicationName
     * @param {Number} organization
     * @param {gsc.application.GeoServerParams} geoServerParams
     * @param {String} srs - Spatial reference system, specified on the form 'namespace:identifier', e.g. 'EPSG:4326' for WGS84 Lat/Lon
     * @param {gsc.application.Extent} maxExtent
     * @param {String} uri
     * @param {Object[]} layers
     * @param {Object[]} groups
     * @returns {Promise.<Object>}
     */
    mod.updateAssignContent = function(applicationId,
        applicationName,
        organization,
        geoServerParams,
        srs,
        maxExtent,
        uri,
        layers,
        groups) {

        return gsc.doPost('assigntoapp', {
            idapplication: applicationId,
            applicationname: applicationName,
            organization: organization,
            geoserver: geoServerParams,
            srs: srs,
            maxextent: maxExtent,
            uri: uri,
            layers: layers,
            groups: groups
        });

    };

    /**
     * Delete an application
     * 
     * @param {Number} applicationId - The numeric identifier of the application to delete
     * @returns {Promise.<Object>}
     */
    mod.delete = function(applicationId) {

        return gsc.doPost('deleteapp', {
            idapplication: applicationId
        });

    };

    /**
     * List applications
     * 
     * @param {Number} [organizationId=null]
     * @param {String} [applicationName='']
     * @param {Number} [applicationId=null]
     * @returns {jqXHR|!jQuery.jqXHR|Promise.<Object>}
     */
    mod.list = function(organizationId,
        applicationName,
        applicationId) {

        var params = {};

        if (!gsc.util.isNull(organizationId)) {
            params.organization = organizationId;
        }
        if (!gsc.util.isNull(applicationName)) {
            params.applicationname = applicationName;
        }
        if (!gsc.util.isNull(applicationId)) {
            params.idapplication = applicationId;
        }

        return gsc.doPost('listapp', params);

    };


    /**
     * Publish an application to GeoServer
     * 
     * @param {Number} applicationId - The numerical identifier of the application to publish
     * @returns {Promise.<Object>}
     */
    mod.publishToGeoServer = function(applicationId) {

        return gsc.doPost('pubongeoserver', {
            idapplication: applicationId
        });

    };
    
    /**
     * Retrieve a configuration JSON that can be used to populate a map client or similar
     * 
     * @todo Would it be interesting to retrieve configuration for an applicationId too?
     * @param {Number} userId - The numerical identifier of the user to retrieve application data for
     * @returns {Promise.<Object>}
     */
    mod.getConfiguration = function(userId) {

        return gsc.doPost('getconfiguration', {
            iduser: userId
        });

    };

    return mod;
}());
