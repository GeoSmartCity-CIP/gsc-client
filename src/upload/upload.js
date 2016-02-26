/**
 * <p>API for crowd sourcing feature of gsc.js library</p>
 * <p>Functions to handle server side crowd sourcing app.</p>
 *
 * @namespace gsc.upload
 * //@requires jQuery-2.1.4
 */

var gsc = gsc || {};

gsc.upload = {
  /**
   * Version number of the uploading feauture of gsc.js
   * @type {String}
   */
  version: '0.1.0',
  /**
   * Byte size of the uploading file
   * @type {Number} [fileSize=8000000]
   */
  fileSize: 8000000,
  /**
   * Allowed MIME types of files
   * @type {Array.<String>}
   */
  fileType: ['application/octet-stream', 'application/gml+xml',
    'application/kml+xml']
};
