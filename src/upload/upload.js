/**
 * <p>API for crowd sourcing feature of gsc.js library</p>
 * <p>Functions to handle server side crowd sourcing app.</p>
 *
 * @namespace gsc.upload
 * @requires jQuery-2.1.4
 * @requires jszip-2.5.0
 */

var gsc = gsc || {};

gsc.upload = {
  /**
   * Version number of the uploading feature of gsc.js
   * @type {String}
   */
  version: '0.1.0',
  /**
   * Byte size of the uploading file
   * @type {Number}
   */
  fileSize: 8000000,
  /**
   * Allowed MIME types of files
   * @type {Array.<String>}
   */
  fileType: ['application/octet-stream', 'application/gml+xml',
    'application/kml+xml', 'application/zip', 'application/x-zip',
    'application/x-zip-compressed', 'application/x-compress',
    'application/x-compressed', 'multipart/x-zip']
};

/**
 * Create a Data with uploaded file and building height
 *
 * @param {File} file First element of FileList provided by input type file
 * @param {Number} [height] Height in meters of the building
 * (for solar potential calculation) if not specified will be -1
 * @constructor
 */
gsc.upload.Data = function(file, height) {
  'use strict';
  /**
   * Actual file to send
   * @type {File}
   */
  this.file = file;
  /**
   * Height of the building (for solar potential calculation) in meters
   * @type {Number}
   */
  if (height !== undefined) {
    this.height = height;
  } else {
    this.height = -1;
  }
};

/**
 * The name of the file referenced by the File object
 * @property {String} name of the file
 * @name gsc.upload.Data#name
 */
Object.defineProperty(gsc.upload.Data.prototype, 'name', {
  get: function() {
    return this.file && this.file.name;
  }
});

/**
 * Returns the last modified date of the file.
 * Files without a known last modified date use the current date instead
 * @property {Date} last modified date
 * @name gsc.upload.Data#lastModifiedDate
 */
Object.defineProperty(gsc.upload.Data.prototype, 'lastModifiedDate', {
  get: function() {
    return this.file && this.file.lastModifiedDate;
  }
});

/**
 * The size, in bytes, of the data contained in the file
 * @property {Number} size in bytes
 * @name gsc.upload.Data#size
 */
Object.defineProperty(gsc.upload.Data.prototype, 'size', {
  get: function() {
    return this.file && this.file.size;
  }
});

/**
 * A string indicating the MIME type of the data contained in the Blob.
 * If the type is unknown, this string is empty
 * @property {String} MIME type
 * @name gsc.upload.Data#type
 */
Object.defineProperty(gsc.upload.Data.prototype, 'type', {
  get: function() {
    return this.file && this.file.type;
  }
});

/**
 * Checks if size of file to be uploaded is smaller or equals to
 * config {@link gsc.upload#fileSize}
 *
 * @returns {Boolean} True if file size is smaller or equals to config
 */
gsc.upload.Data.prototype.isFileSizeCorrect = function() {
  'use strict';
  return (this.size <= gsc.upload.fileSize);
};

/**
 * Checks if type of file to be uploaded is acceptable by
 * config {@link gsc.upload#fileType}
 *
 * @returns {Boolean} True if file type is acceptable
 */
gsc.upload.Data.prototype.isFileTypeCorrect = function() {
  'use strict';
  var temp = this;
  return gsc.upload.fileType.some(function(fileType) {
    return (temp.type === fileType);
  });
};

/**
 * Check if .zip and if yes is it contain .shp .shx and .dbf files,
 * if no return true
 *
 * @returns {boolean}
 */
gsc.upload.Data.prototype.isShapefileCorrect  = function() {
  'use strict';
  if (this.name.substr(-3,3) === 'zip') {
    var arrayBufferZip = new ArrayBuffer(0);
    var fileReader = new FileReader();
    fileReader.onload = function() {
      arrayBufferZip = this.result;
    };
    fileReader.readAsArrayBuffer(this.file);
    var zip = new JSZip(arrayBufferZip);
    return zip.files.every(function(file) {
      return (file.name.substr(-3, 3) === 'shp' ||
      file.name.substr(-3, 3) === 'dbf' ||
      file.name.substr(-3, 3) === 'shx');
    });
  } else {
    return true;
  }
};

/**
 * Callback for handling upload progress percentage
 *
 * @callback progressCallback
 * @param {number} Percentage
 */

/**
 * Callback for handling upload success
 *
 * @callback successCallback
 * @param {event}
 */

/**
 * Callback for handling upload failure
 *
 * @callback failedCallback
 * @param {event}
 */

/**
 * Function
 *
 * @param pc {progressCallback} Callback that handles upload progress
 * @param sc {successCallback} Callback that handles upload success
 * @param fc {failedCallback} Callback that handles upload failure
 */
gsc.upload.Data.prototype.send = function(pc, sc, fc) {
  'use strict';
  if (this.isFileSizeCorrect() && this.isFileTypeCorrect() &&
      this.isShapefileCorrect()) {
    var formData = new FormData();
    formData.append('file', this.file, this.name);
    formData.append('height', this.height);
    var request = new XMLHttpRequest();
    if (pc || typeof pc === 'function') {
      request.upload.addEventListener('progress', function(e) {
        pc(parseInt(e.loaded / e.total * 100));
      }, false);
    }
    if (sc || typeof sc === 'function') {
      request.upload.addEventListener('load', function(e) {
        sc(e);
      }, false);
    }
    if (fc || typeof fc === 'function') {
      request.upload.addEventListener('error', function(e) {
        fc(e);
      }, false);
    }
    request.open('POST', 'some.php', true);
    request.send(formData);
  }
};
