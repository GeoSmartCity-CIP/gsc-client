'use strict';
/**
 * @namespace gsc.util
 */

gsc.util = gsc.util || {};

/**
 * Checks whether a response is an error or not
 *
 * @param {Object} response The variable to test
 * @return {Boolean} True if response status is 'error',
 * false if response status is not 'error' or missing
 * @memberof gsc.util
 */
gsc.util.isError = function(response) {

  if (response.status !== undefined && response.status === 'error') {
    return true;
  }

  return false;

};
