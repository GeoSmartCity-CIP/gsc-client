'use strict';

gsc.util = gsc.util || {};

/**
 * Checks if a variable is an array and contains at least one element
 *
 * @param {Array|Object|null|undefined} arrayCandidate
 * @returns {Boolean} True if array with >= 1 entry, false otherwise
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
 * Clears an existing array and adds all elements from another array into it.
 * Modifies the targetArray.
 *
 * @param {Object[]} targetArray
 * @param {Object[]} sourceArray
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
 */
gsc.util.clearExtendObject = function(targetObject, sourceObject) {
  jQuery.each(targetObject, function(key, value) {
    targetObject[key] = undefined;
  });
  jQuery.extend(targetObject, sourceObject);
};
