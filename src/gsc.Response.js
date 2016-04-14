'use strict';

var gsc = gsc || {};

/**
 * Response object
 *
 * @param {string} [status] [description]
 * @param {string} [description] [description]
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
