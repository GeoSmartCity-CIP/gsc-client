/**
 *
 * @namespace gsc
 */

var gsc = gsc || {};

gsc.cs = {};

/**
 * Create an alert event object
 *
 * @constructor
 * @param {String} url The url of an aplication
 */

gsc.cs.AE = (function(url) {
  var _self = this;
  url = url || 'http://geo.mapshakers.com:8080/CrowsSourcing';

  /**
   * Recieve a config file
   *
   * @param {Function} callback The calback function f(error,data)
   */
  _self.getConfig = function(callback) {

    $.get(url + '/config')
            .done(function(data) {
              callback(data);
            })
            .fail(function(err) {
              callback(err);
            });

  };

  /**
   * Create a comment
   *
   * @param {Function} callback The calback function f(error,data)
   * @param {JSON} data The JSON data object
   * @param {String} uuid Identification string of event
   */
  _self.eventComment =  function(callback, data, uuid) {

    $.ajax({
            url: url + '/event/comment/' + uuid,
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json'}
    )
            .done(function(data) {
              callback(data);
            })
            .fail(function(err) {
              callback(err);
            });
  };

  /**
   * Create an event
   *
   * @param {Function} callback The calback function f(error,data)
   * @param {FormData} formdata The FormData object (JSON + attachment)
   */
  _self.eventCreate =  function(callback, formdata) {

    $.ajax({
      url: url + '/event/create',
      type: 'POST',
      data: formdata,
      processData: false,
      contentType: false
    }
)
            .done(function(data) {
              callback(data);
            })
            .fail(function(err) {
              callback(err);
            });
  };

  /**
   * Filter list on bounding box
   **
   * @param {Function} callback The calback function f(error,data)
   * @param {JSON} data The JSON data object
   */
  _self.eventListFilter =  function(callback, data) {

    $.ajax({
            url: url + '/event/list',
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json'}
    )
            .done(function(data) {
              callback(data);
            })
            .fail(function(err) {
              callback(err);
            });
  };

  return _self;
})();
