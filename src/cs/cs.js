'use strict';

/**
 * <p>API for crowd sourcing feature of gsc.js library</p>
 * <p>Functions to handle server side crowd sourcing app.</p>
 *
 * @namespace gsc.cs
 * @requires jQuery-2.1.4
 */
var gsc = gsc || {};

gsc.cs = {
  /**
   * Version number of the crowd sourcing feauture of gsc.js
   * @type {Number}
   */
  version: '0.1.0'
};

gsc.cs._csUrl = 'http://geo.mapshakers.com:8080/CrowdSourcing';

/**
 * Get or set GSC Datacatalog URL. If a parameter is supplied,
 * it is assumed to be a valid URL to the web service end-point of
 * a GSC Datacatalogue instance.
 *
 * If no parameter is provided, the function will return the currently
 * configured URL.
 *
 * @param {String} [csUrl] URL to working instance of GSC CrowdSourcing Servlet
 * @return {String} URL of GSC CrowdSourcing instance web service end-point
 */
gsc.cs.csUrl =  function(csUrl) {
  if (csUrl !== undefined) {
    gsc.cs._csUrl = csUrl;
  }
  return gsc.cs._csUrl;
};

/**
 * Receive a config file
 *
 * @return {Promise.<Object>} a jQuery promise object
 */
gsc.cs.getConfig = function() {
  return this.doPost('/config',null);
};

/**
 * Create a comment
 *
 * @param {JSON} data The JSON data object
 * @param {String} uuid Identification string of event
 * @return {Promise.<Object>} a jQuery promise object
 */
gsc.cs.eventComment =  function(data, uuid) {
  return this.doPost('/event/comment/' + uuid, data);
};

/**
 * Create an event
 *
 * @param {FormData} formdata The FormData object (JSON + attachment)
 * @return {Promise.<Object>} a jQuery promise object
 */
gsc.cs.eventCreate =  function(formdata) {
  return this.doPostFormData('/event/create',formdata);
};

/**
 * Filter list on bounding box
 **
 * @param {JSON} data The JSON data object
 * @return {Promise.<Object>} a jQuery promise object
 */
gsc.cs.eventListFilter =  function(data) {
  return this.doPost('/event/list',data);
};

/**
 * send POST requests
 **
 * @param {String} urlPart - Service url.
 * @param {Object} data The JSON data object
 * @return {Promise.<Object>} a jQuery promise object
 */
gsc.cs.doPost =  function(urlPart, data) {
  return $.ajax({
    url: gsc.cs._csUrl + '/' + urlPart ,
    type: 'POST',
    data: JSON.stringify(data),
    dataType: 'json'
  });
};

/**
 * send POST formdata requests
 **
 * @param {String} urlPart - Service url.
 * @param {FormData} formData The JSON data object
 * @return {Promise.<Object>} a jQuery promise object
 */
gsc.cs.doPostFormData =  function(urlPart, formData) {
  return $.ajax({
    url: gsc.cs._csUrl + '/' + urlPart ,
    type: 'POST',
    data: formData,
    processData: false,
    contentType: false
  });
};
