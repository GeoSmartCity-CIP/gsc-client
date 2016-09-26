'use strict';

var gsc = gsc || {};

gsc.geocode = (function() {

  /**
   * Module that implements forward and reverse geocoding features
   *
   * @exports gsc/geocode
   */
  var mod = {};

  function invokeGeocodingAPI(actionName,
      requestData) {
    return $.post(gsc.geonamesUrl(), {
      actionName: actionName,
      request: JSON.stringify(requestData)
    }, null, 'json');
  }

  /**
   * Matches for geocoding
   *
   * @property {geonameid} id - The geoname ID of the name
   * @property {name} name - The name itself
   * @property {string} region - The administrative area in which the name is located
   * @property {Object} country - The country in which the name is located
   * @property {Object} [distance=null] - The distance between the user supplied coordinates and the point (only for reverse geocoding)
   * @property {Object} [match=null] - The relevance of the name compared to the user specified string (only for forward geocoding)
   * @property {number} lon - The longitude of the name in the EPSG:4326 spatial reference system
   * @property {number} lat - The latitude of the name in the EPSG:4326 spatial reference system
   * @class
   */
  mod.Match = function() {

  };

  /**
   * Get a list of matching coordinate entries for a user supplied name. The matches will include
   * the matching name, a ranking and spatial coordinates according to the EPSG:4326 spatial reference
   * system.
   *
   * @param {String[]} geonames - An array of one or more geonames encoded in UTF-8
   * @returns {Promise.<gsc.Response>} - A response object confirming whether the operation was successful
   * and with an embedded data object that contains a list of geocoding matches.
   * @example <caption>Forward geocoding</caption>
   */
  mod.geocode = function(geonames) {

    return invokeGeocodingAPI('forward', {
      geonames: geonames
    });

  };

  /**
   * Get a list of matching names for a user supplied coordinate pair in the EPSG:4326 spatial reference
   * system. The returned list includes the formal name, the administrative area, the country and the
   * distance from the user supplied coordinate as well as the actual spatial coordinates (in the same SRS)
   * as the above method.
   *
   * @param {Number} lat - Latitude in EPSG:4326
   * @param {Number} lon - Longitude in EPSG:4326
   * @returns {Promise.<gsc.Response>} - A response object confirming whether the operation was successful
   * and with an embedded {@link module:gsc/geocode.Match} data object that contains a list of geocoding matches.
   */
  mod.reverseGeocode = function(lat, lon) {
    return invokeGeocodingAPI('reverse', {
      lat: lat,
      lon: lon
    });

  };

  return mod;
}());
