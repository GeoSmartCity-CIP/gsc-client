'use strict';

gsc.cs = (function() {
  /**
   *
   * @exports gsc/cs
   */
  var mod = {};

  mod._csUrl = 'http://geo.mapshakers.com:8080/CrowdSourcing';

  /**
   * Get or set GSC CrowdSourcing URL. If a parameter is supplied,.
   *
   * If no parameter is provided, the function will return the currently
   * configured URL.
   *
   * @param {String} [csUrl] URL to working instance of GSC CrowdSourcing Servlet
   * @return {String} URL of GSC CrowdSourcing instance web service end-point
   */
  mod.csUrl =  function(csUrl) {
    if (csUrl !== undefined) {
      mod._csUrl = csUrl;
    }
    return mod._csUrl;
  };

  /**
   * Receive a config file
   *
   * @return {Promise.<Object>} a jQuery promise object
   */
  mod.getConfig = function() {
    return this.doPost_('/config', null);
  };

  /**
   * Create a comment
   *
   * @param {JSON} data The JSON data object
   * @param {String} uuid Identification string of event
   * @return {Promise.<Object>} a jQuery promise object
   */
  mod.eventComment =  function(data, uuid) {
    return this.doPost_('/event/comment/' + uuid, data);
  };

  /**
   * Update an event
   *
   * @param {JSON} data The JSON data object
   * @return {Promise.<Object>} a jQuery promise object
   */
  mod.eventUpdate =  function(data) {
    return this.doPost_('/event/change', data);
  };

  /**
   * Create an event
   *
   * @param {FormData} formdata The FormData object (JSON + attachment)
   * @return {Promise.<Object>} a jQuery promise object
   */
  mod.eventCreate =  function(formdata) {
    return this.doPostFormData_('/event/create', formdata);
  };

  /**
   * Filter list
   **
   * @param {JSON} data The JSON data object
   * @return {Promise.<Object>} a jQuery promise object
   */
  mod.eventListFilter =  function(data) {
    return this.doPost_('/event/list', data);
  };

  /**
   * send POST requests
   *
   * @private
   * @param {String} urlPart - Service url.
   * @param {Object} data The JSON data object
   * @return {Promise.<Object>} a jQuery promise object
   *
   */
  mod.doPost_ =  function(urlPart, data) {
    return $.ajax({
      url: mod._csUrl + '/' + urlPart ,
      type: 'POST',
      data: JSON.stringify(data),
      dataType: 'json'
    });
  };

  /**
   * send POST formdata requests
   *
   * @private
   * @param {String} urlPart - Service url.
   * @param {FormData} formData The JSON data object
   * @return {Promise.<Object>} a jQuery promise object
   *
   */
  mod.doPostFormData_ =  function(urlPart, formData) {
    return $.ajax({
      url: mod._csUrl + '/' + urlPart ,
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false
    });
  };

  return mod;

}());
