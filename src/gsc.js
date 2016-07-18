'use strict';

/**
 * 'gsc' is the root object of the gsc.js library and the only variable to
 * be introduced into the global namespace.
 *
 * @namespace gsc
 */
var gsc = (function() {

  /**
   * Version number
   *
   * @type {String}
   * @private
   * @requires OpenLayers-3.13.1
   */
  var _version = '0.1.0';

  /**
   * URL of the GSC Datacatalog instance the API is working against
   * @type {String}
   * @private
   */
  var _dcUrl = 'http://hub.geosmartcity.eu/' +
          'gsc-datacatalogue/datacatalogservlet';

   * URL of the GSC Upload Features API
   * @type {String}
   * @private
   */
  var _uploadUrl = 'http://hub.geosmartcity.eu/building/';

  /**
  var mod = {};

  /**
   * Version number of the s4a.js library
   * @type {Number}
   * @memberof gsc
   */
  mod.version = _version;

  /**
   * Get or set GSC Datacatalog URL. If a parameter is supplied,
   * it is assumed to be a valid URL to the web service end-point of
   * a GSC Datacatalogue instance.
   *
   * If no parameter is provided, the function will return the currently
   * configured URL.
   *
   * @param {String} [dcUrl] URL to working instance of GSC Datacatalogue
   * @return {String} URL of GSC Datacatalogue instance web service end-point
   * @memberof gsc
   */
  mod.dcUrl = function(dcUrl) {
    if (dcUrl !== undefined) {
      _dcUrl = dcUrl;
    }
    return _dcUrl;
  };

  /**
   * Get or set GSC Upload feature URL. If a parameter is supplied,
   * it is assumed to be a valid URL to the upload feature API.
   *
   * If no parameter is provided, the function will return the currently
   * configured URL.
   *
   * @param {String} [uploadUrl] URL to upload feature API
   * @return {String} URL of upload feature API
   */
  mod.uploadUrl = function(uploadUrl) {
    if (uploadUrl !== undefined) {
      _uploadUrl = uploadUrl;
    }
    return _uploadUrl;
  };

  /**
   * Execute a HTTP post request and return the resulting promise
   *
   * @param {String} actionName Name of action to invoke
   * @param {Object} requestData  A JSON object with the parameters to send to the web service
   * @return {Promise.<Object>} a jQuery promise object
   * @memberof gsc
   */
  mod.doPost = function(actionName,
          requestData) {
    return $.post(gsc.dcUrl(), {
      actionName: actionName,
      request: JSON.stringify(requestData)
    }, null, 'json');
  };

  return mod;

}());
