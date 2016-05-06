'use strict';

var gsc = gsc || {};

gsc.geocode = gsc.geocode || {};

/**
 * Get a list of coordinates for a name
 *
 * @param {String[]} geonames An array of one or more geonames
 */
gsc.geocode.geocode = function(geonames) {

  // pseudo code
  // lookup coordinate based on name

  return [{
    name: 'Brussels',
    lon: 1,
    lat: 2,
    match: 50 // percent
  }];

};

/**
 * Get a list of names for a coordinate
 *
 * @param {Number} lat Latitude
 * @param {Number} lon Longitude
 * @param {Number} srs Spatial reference system code (EPSG)
 */
gsc.geocode.reverseGeocode = function(lat, lon, srs) {

  // pseudo code
  // lookup name based on location

  return [{
    name: 'Brussels',
    lon: 1,
    lat: 2,
    distance: 100 // meters
  }];

};
