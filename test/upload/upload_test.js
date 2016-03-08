var gsc = require('../../src/upload/upload');
// Only for test purposes
var FileAPI = require('file-api');
var Node = require('bufferjs');
var File = FileAPI.File;
var exports = exports || {};

exports.testuje = function(test) {
  var file = new File();
  var asd = new gsc.upload.Data(file, 20);
  asd.isFileTypeCorrect().expect(1);
  test.ok(true, 'this assertion should pass');
  test.done();
};
