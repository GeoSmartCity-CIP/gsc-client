var gsc = require('../../src/upload/upload');
// Only for test purposes
var FileAPI = require('file-api');
var File = FileAPI.File;
var exports = exports || {};

exports.testuje = function(test) {
  var file = new File('test.geojson');
  var asd = new gsc.upload.Data(file);
  test.ok(asd.isFileTypeCorrect(), 'this assertion should pass');
  test.done();
};
