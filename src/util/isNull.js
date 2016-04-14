'use strict';

gsc.util = gsc.util || {};

/**
 * Checks whether a variable is undefined or null
 *
 * @param {Mixed} mvar The variable to test
 * @return {Boolean} True if null, false if non-null
 * @memberof gsc.util
 */
gsc.util.isNull = function(mvar) {

  if (mvar !== undefined && mvar !== null) {
    return false;
  } else {
    return true;
  }

};
