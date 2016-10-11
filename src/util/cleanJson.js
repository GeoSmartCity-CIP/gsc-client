'use strict';
/**
 * @namespace gsc.util
 */

gsc.util = gsc.util || {};

/**
 * Removes any angular specific elements from an array of objects
 *
 * @param {Object[]} objectArray
 * @returns {Object[]}
 */
gsc.util.cleanJsonObjects = function(objectArray) {

  jQuery.each(objectArray, function(index, currentObject) {
    gsc.util.cleanJsonObject(currentObject);
  });

  return objectArray;
};

/**
 * Removes any angular specific elements from an object
 *
 * @param {Object} singleObject
 * @returns {Object}
 */
gsc.util.cleanJsonObject = function(singleObject) {

  jQuery.each(singleObject, function(propertyName, value) {
    propertyName = '' + propertyName;
    if (propertyName.startsWith('$$')) {
      delete singleObject[propertyName];
    }
  });

  return singleObject;

};
