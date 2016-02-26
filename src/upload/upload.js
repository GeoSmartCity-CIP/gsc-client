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
/**
 * Create a Data with uploaded file and building height
 *
 * @param {File} file First element of FileList provided by input type file
 * @param {Number} [height] Height of the building (for solar potential calculation) in meters
 * @constructor
 */
gsc.upload.Data = function(file, height) {
  /**
   * The name of the file referenced by the File object
   * @type {string}
   */
  this.name = file.name;
  /**
   * Returns the last modified date of the file. Files without a known last modified date use the current date instead
   * @type {Date}
   */
  this.lastModifiedDate = file.lastModifiedDate;
  /**
   * The size, in bytes, of the data contained in the file
   * @type {number}
   */
  this.size = file.size;
  /**
   * A string indicating the MIME type of the data contained in the Blob. If the type is unknown, this string is empty
   * @type {string}
   */
  this.type = file.type;
  /**
   * Height of the building (for solar potetnial calculation) in meters
   * @type {Number}
   */
  this.height = height;
};
