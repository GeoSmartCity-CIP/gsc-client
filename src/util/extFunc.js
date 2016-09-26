'use strict';

gsc.util = gsc.util || {};

/**
 * Checks if a variable is an array and contains at least one element
 *
 * @param {Array|Object|null|undefined} arrayCandidate
 * @returns {Boolean} True if array with >= 1 entry, false otherwise
 * @memberof gsc.util
 */
gsc.util.isArrayWithContent = function(arrayCandidate) {
  if (arrayCandidate !== undefined &&
          jQuery.isArray(arrayCandidate) &&
          arrayCandidate.length > 0) {
    return true;
  } else {
    return false;
  }
};

/**
 * Cecks if an object has an error property
 *
 * @param {type} responseObject
 * @returns {String|Boolean} The error message if error, false if no error
 * @memberof gsc.util
 * */
gsc.util.hasError = function(responseObject) {

  if (responseObject.error !== undefined) {
    return responseObject.error.toString();
  } else {
    return false;
  }
};

/**
 * Clears an existing array and adds all elements from another array into it.
 * Modifies the targetArray.
 *
 * @param {Object[]} targetArray
 * @param {Object[]} sourceArray
 * @memberof gsc.util
 */
gsc.util.clearExtendArray = function(targetArray, sourceArray) {
  targetArray.length = 0;
  jQuery.extend(targetArray, sourceArray);
};

/**
 * Clears all the properties of the target object and copies the properties
 * from the source object onto the target. Modifies the target object.
 *
 * @param {type} targetObject
 * @param {type} sourceObject
 * @memberof gsc.util
 */
gsc.util.clearExtendObject = function(targetObject, sourceObject) {
  jQuery.each(targetObject, function(key, value) {
    targetObject[key] = undefined;
  });
  jQuery.extend(targetObject, sourceObject);
};
