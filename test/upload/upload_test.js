var gsc = require('../../src/upload/upload');
// Only for test purposes
var FileAPI = require('file-api');
var FileNode = FileAPI.File;

exports.isTooBigFileFalse = function(test) {
  var file = new FileNode({name: 'filename',
    type: 'text/plain', buffer: new Buffer(''), size: 10000000});
  var dataObject = new gsc.upload.Data(file);
  test.strictEqual(dataObject.isFileTypeCorrect(), false);
  test.ok(dataObject.isFileSizeCorrect());
  test.done();
};