var gsc = gsc || {};

/**
 *
 * @namespace gsc.window
 */
gsc.window = gsc.window || {};

/**
 * window instance
 *
 * @type object
 */
gsc.window.object = null;

/**
 * Create a window
 *
 * @param {object} options
 */
gsc.window.init = function(options) {

  var options_ = options || {};

  this.wrapper =  $('<div>',{class: 'modal fade',role: 'dialog'});

  var modalDialog =  $('<div>',{class: 'modal-dialog gsc-window-fullscreen'})
      .appendTo(this.wrapper);
  var modalContent = $('<div>',{class: 'modal-content'})
      .appendTo(modalDialog);
  var modalHeader = $('<div>',{class: 'modal-header'})
      .appendTo(modalContent);
  var button = $('<button>',{class: 'close','data-dismiss': 'modal'})
      .html('&times;')
      .appendTo(modalHeader);
  this.modalTitle = $('<h4>',{class: 'modal-title'})
      .appendTo(modalHeader);
  this.modalBody = $('<div>',{class: 'modal-body'})
      .appendTo(modalContent);
  this.modalFooter = $('<div>',{class: 'modal-footer'})
      .appendTo(modalContent);

  if (options_.hasOwnProperty('title')) {
    this.setTitle(options_.title);
  }

  if (options_.hasOwnProperty('content')) {
    this.setContent(options_.content);
  }

  if (options_.hasOwnProperty('footer')) {
    this.setFooter(options_.footer);
  }

  if (options_.hasOwnProperty('show') && options_.show) {
    this.show();
  }

  return this;
};

/**
 * Create a window
 *
 * @param {string} string The callback function f(error,data)
 */
gsc.window.setContent = function(string) {

  var content = $('<div>').html(string);
  this.modalBody.append(content);

};

/**
 * Set title
 *
 * @param {string} string title value
 */
gsc.window.setTitle = function(string) {
  this.modalTitle.html(string);
};

/**
 * Set window footer
 *
 * @param {string} string The callback function
 */
gsc.window.setFooter = function(string) {
  this.modalFooter.html(string);
};

/**
 * Hide a window
 *
 */
gsc.window.hide = function() {
  this.wrapper.modal('hide');
};

/**
 * Show a window
 *
 */
gsc.window.show = function() {
  this.wrapper.modal('show');
};
