'use strict';

gsc.util = gsc.util || {};

/**
 * Returns a resolved promise object
 *
 * @param {string} message [description]
 * @return {Promise.<gsc.Response>} [description]
 * @memberof gsc.util
 */
gsc.util.errorPromise = function(message) {
  var p = jQuery.Deferred();
  p.resolve(new gsc.Response('error', message));
  return p;
};
