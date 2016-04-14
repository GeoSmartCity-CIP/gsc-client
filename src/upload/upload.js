'use strict';

var gsc = gsc || {};

/**
 * <p>API for crowd sourcing feature of gsc.js library</p>
 * <p>Functions to handle server side crowd sourcing app.</p>
 *
 * @namespace gsc.upload
 * @requires jQuery-2.1.4
 */
gsc.upload = {
  /**
   * Version number of the uploading feature of gsc.js
   * @type {String}
   */
  version: '1.0.0',
  /**
   * Byte size of the uploading file
   * @type {Number}
   */
  fileSize: 8000000
};

gsc.upload.uploadForm = function(selector) {
  var html =
      `<div class='upload'>
        <form role='form'>
          <h4>Upload file</h4>
          <div class='upload-file'>
            <div class='input-group'>
              <span class='input-group-btn'>
            <span class='btn btn-primary btn-file'>
            Browse… 
            <input type='file' id='geometryFile' accept='.gml, .kml, .zip'>
            </span>
              </span>
              <input type='text' class='form-control' style='width: 20%'
                readonly>
            </div>
            <span class='help-block'>
            Select .gml, .kml, .zip (containing .shp, .shx, and .dbf )
            </span>
          </div>
          <div class='building-height collapse'>
            <div class='input-group'>
              <span class='input-group-addon' id='basic-addon1'>&#127970;
            </span>
              <input type='text' id='height' class='form-control numbersOnly'
                style='width: 20%' placeholder='Height'
                aria-describedby='basic-addon1'>
            </div>
            <span class='help-block'>
            Provide height of the building in meters
            </span>
          </div>
          <button type='submit' class='btn btn-primary '>Submit</button>
        </form>
        <div class='progress'>
          <div class='progress-bar' aria-valuenow='0'
            aria-valuemin='0' aria-valuemax='100'
            id='progressbar' style='min-width: 2em; width: 0'>0%</div>
        </div>
        <div class='alert collapse' id='alert' role='alert'>...</div>
      </div>`      ;
  jQuery(selector).html(html);

  var script =
      `<script>
      jQuery(document).on('change', '.btn-file :file', function() {
        var input = jQuery(this);
        var label = input.val();
        if (label.substring(3, 11) == 'fakepath') {
          label = label.substring(12);
        }
        input.trigger('fileselect', [label]);
      });
      
      jQuery(document).ready(function() {
        jQuery('.btn-file :file').on('fileselect', function(event,
          label) {
          jQuery('#progressbar').width('0%').text('0%');
          jQuery('#alert').addClass('collapse').removeClass(
            'alert-danger alert-success').text('');
          var input = jQuery(this).parents('.input-group').find(
            ':text');
          var extension = label.substr(-3, 3);
          if (extension === 'zip' || extension === 'gml') {
            jQuery('.building-height').addClass('collapse');
          } else {
            jQuery('.building-height').removeClass('collapse');
          }
          if (input.length) {
            input.val(label);
          } else {
            if (label) {
              alert(label);
            }
          }
        });
      });
      
      jQuery('.numbersOnly').keyup(function() {
        if (jQuery.isNumeric(this.value) === false) {
          this.value = this.value.slice(0, -1);
        }
      });
      
      progressCallback = function(progress) {
        if (progress > 0) {
          jQuery('#progressbar').width(progress + '%').text(progress +
            ' %');
        }
      };
      
      successCallback = function(success) {
        jQuery('#alert').removeClass('collapse').addClass('alert-success')
          .text('Upload successful');
      };
      
      failedCallback = function(error) {
        jQuery('#alert').removeClass('collapse').addClass('alert-danger')
          .text('Upload failed with error: ' + error);
      };
      
      jQuery('form').on('submit', function(e) {
        e.preventDefault();
        jQuery('#progressbar').width('0%').text('0%');
        jQuery('#alert').addClass('collapse').removeClass(
          'alert-danger alert-success').text('');
        var fileToProcess = document.getElementById('geometryFile').files[
          0];
        var height = jQuery('#height').val();
        var dataToProcess = gsc.upload.Data(fileToProcess, height);
        dataToProcess.send(progressCallback, successCallback, failedCallback);
      });
      </script>`      ;
  jQuery(function() {
    jQuery('head').append(script);
  });

  jQuery('.btn-file').css({
    'position': 'relative',
    'overflow': 'hidden'
  });
  jQuery('.btn-file input[type=file]').css({
    'position': 'absolute',
    'top': '0',
    'right': '0',
    'min-width': '100%',
    'min-height': '100%',
    'font-size': '100px',
    'text-align': 'right',
    'filter': 'alpha(opacity=0)',
    'opacity': '0',
    'background': 'red',
    'cursor': 'inherit',
    'display': 'block'
  });
  jQuery('input[readonly]').css({
    'background-color': 'white !important',
    'cursor': 'text !important'
  });
  jQuery('.upload').css({
    'margin': '2em'
  });
  jQuery('.progress').css({
    'margin-top': '1em',
    'width': '25%'
  });
  jQuery('.alert').css({
    'margin-top': '1em',
    'width': '25%'
  });
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
  if (typeof file === undefined) {
    this.file = new File([''], 'filename');
  } else {
    this.file = file;
  }
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
 * @param {progressCallback} pc Callback that handles upload progress
 * @param {successCallback} sc Callback that handles upload success
 * @param {failedCallback} fc Callback that handles upload failure
 */
gsc.upload.Data.prototype.send = function(pc, sc, fc) {
  'use strict';
  if (this.isFileSizeCorrect()) {
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
