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
   * Version number of the uploading feauture of gsc.js
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
 * @param {Number} [height] Height of the building (for solar potential calculation) in meters
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
   * Height of the building (for solar potetnial calculation) in meters
   * @type {Number}
   */
  this.height = height;
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
 * Returns the last modified date of the file. Files without a known last modified date use the current date instead
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
 * A string indicating the MIME type of the data contained in the Blob. If the type is unknown, this string is empty
 * @property {String} MIME type
 * @name gsc.upload.Data#type
 */
Object.defineProperty(gsc.upload.Data.prototype, 'type', {
  get: function() {
    return this.file && this.file.type;
  }
});
/**
 * Checks if size of file to be uploaded is smaller or equals to config {@link gsc.upload#fileSize}
 *
 * @returns {Boolean} True if file size is smaller or equals to config
 */
gsc.upload.Data.prototype.isFileSizeCorrect = function() {
  'use strict';
  return (this.size <= gsc.upload.fileSize);
};
/**
 * Checks if type of file to be uploaded is acceptable by config {@link gsc.upload#fileType}
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
 * Check if .zip contain .shp .shx and .dbf files
 *
 * @returns {boolean}
 */
gsc.upload.Data.prototype.validateShapefile  = function() {
  'use strict';
  var arrayBufferZip;
  var fileReader = new FileReader();
  fileReader.onload = function() {
    arrayBufferZip = this.result;
  };
  fileReader.readAsArrayBuffer(this.file);
  var zip = new JSZip(arrayBufferZip);
  return zip.files.every(function(file) {
    return (file.name.substr(-3,3) === 'shp' ||
           file.name.substr(-3,3) === 'dbf' ||
           file.name.substr(-3,3) === 'shx');
  });
};

gsc.upload.Data.prototype.send = function() {
  'use strict';
  var formData = new FormData();
  formData.append('file', this.file, this.name);
  if (this.height !== undefined) {
    formData.append('height', this.height);
  }
  var request = new XMLHttpRequest();

  request.upload.addEventListener('progress', function(e) {
    var pc = parseInt(100 - (e.loaded / e.total * 100));
    progress.style.backgroundPosition = pc + '% 0';
  }, false);

  request.onreadystatechange = function(e) {
    if (xhr.readyState == 4) {
      progress.className = (xhr.status == 200 ? 'success' : 'failure');
    }
  };
  request.open('POST', some.php, true);
  request.send(formData);
};
