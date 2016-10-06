'use strict';

gsc.util = gsc.util || {};

/**
 * Checks whether a variable is a number or not
 *
 * @param {Mixed} mvar The variable to test
 * @return {Boolean} True if it is numeric, false if it is not numeric
 * @memberof gsc.util
 */
gsc.util.isNumber = function(mvar) {

  if (jQuery.isNumeric(mvar)) {
    return true;
  } else {
    return false;
  }

};
