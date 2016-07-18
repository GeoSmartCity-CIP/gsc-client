'use strict';

var gsc = gsc || {};

/**
 * Response object
 *
 * @param {string} [status='error'] - Optionally one of 'success' or 'error'
 * @param {string} [description=''] - A message that will be added to the response
 *
 * @property {string} status - Whether the request was successful (done) or failed (error)
 * @property {string} description - Any error or status message
 * @property {Object} request - The request object
 * @property {number} [id] - Identifier of inserted object, only available on create statements
 * @class
 * @memberof gsc
 */
gsc.Response = function(status, description) {

  if (status === undefined) {
    status = 'error';
  }

  if (description === undefined) {
    description = '';
  }

  return {
    status: status,
    description: description
  };

};
