'use strict';

/**
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

  /**
   * 'gsc' is the root object of the gsc.js library and the only variable to
   * be introduced into the global namespace.
   *
   * @exports gsc
   * @memberof gsc
   */
  var mod = {};

  /**
   * Version number of the s4a.js library
   * @type {Number}
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
   */
  mod.dcUrl = function(dcUrl) {
    if (dcUrl !== undefined) {
      _dcUrl = dcUrl;
    }
    return _dcUrl;
  };

  /**
   * Execute a HTTP post request and return the resulting promise
   *
   * @param {String} actionName Name of action to invoke
   * @param {Object} requestData  A JSON object with the parameters to send to the web service
   * @return {Promise.<Object>} a jQuery promise object
   */
  mod.doPost = function(actionName,
    requestData) {
    return jQuery.post(gsc.dcUrl(), {
      actionName: actionName,
      request: JSON.stringify(requestData)
    }, null, 'json');
  };

  return mod;

}());
