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
  version: '0.1.0',
  /**
   * URI of server-side crowd sourcing application
   * @type {String}
   */
  url: 'http://geo.mapshakers.com:8080/CrowdSourcing'
};

/**
 * Create an alert event object
 *
 * @constructor
 * @param {String} url The url of an application
 */

/**
 * Receive a config file
 *
 * @param {Function} callback The callback function f(error,data)
 */
gsc.cs.getConfig = function(callback) {

  $.post(gsc.cs.url + '/config')
        .done(function(data) {
          callback(null,data);
        })
        .fail(function(err) {
          callback(err);
        });

};

/**
 * Create a comment
 *
 * @param {requestCallback} cb - The callback that handles the response.
 * @param {JSON} data The JSON data object
 * @param {String} uuid Identification string of event
 */
gsc.cs.eventComment =  function(cb, data, uuid) {

  $.ajax({
          url: gsc.cs.url + '/event/comment/' + uuid,
          type: 'POST',
          data: JSON.stringify(data),
          //contentType: 'application/json; charset=utf-8',
          dataType: 'json'}
  )
        .done(function(data) {
          cb(null,data);
        })
        .fail(function(err) {
          cb(err);
        });
};

/**
 * Create an event
 *
 * @param {requestCallback} cb - The callback that handles the response.
 * @param {FormData} formdata The FormData object (JSON + attachment)
 */
gsc.cs.eventCreate =  function(cb, formdata) {

  $.ajax({
    url: gsc.cs.url + '/event/create',
    type: 'POST',
    data: formdata,
    processData: false,
    contentType: false
  }
)
        .done(function(data) {
          cb(null,data);
        })
        .fail(function(err) {
          cb(err);
        });
};

/**
 * Filter list on bounding box
 **
 * @param {requestCallback} cb - The callback that handles the response.
 * @param {JSON} data The JSON data object
 */
gsc.cs.eventListFilter =  function(cb, data) {

  $.ajax({
          url: gsc.cs.url + '/event/list',
          type: 'POST',
          data: JSON.stringify(data),
          //contentType: 'application/json; charset=utf-8',
          dataType: 'json'}
  )
        .done(function(data) {
          cb(null,data);

        })
        .fail(function(err) {
          cb(err);
        });
};
/**
 * This callback is displayed as a global member.
 * @callback requestCallback
 * @param {object} error An error object received from server
 * @param {object} responseData A data object (JSON)
 */