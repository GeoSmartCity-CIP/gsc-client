var gsc = require('../../src/upload/upload');
// Only for test purposes
var FileAPI = require('file-api');
var FileNode = FileAPI.File;

exports.isGeojsonCorrect = function(test) {
  var file = new FileNode('test.geojson');
  var dataObject = new gsc.upload.Data(file);
  test.ok(dataObject.isFileTypeCorrect());
  test.done();
};
exports.isShpCorrect = function(test) {
  var file = new FileNode('test.zip');
  var dataObject = new gsc.upload.Data(file);
  test.ok(dataObject.isFileTypeCorrect());
  test.done();
};
exports.isGmlCorrect = function(test) {
  var file = new FileNode('test.gml');
  var dataObject = new gsc.upload.Data(file);
  test.ok(dataObject.isFileTypeCorrect());
  test.done();
};
exports.iskmlCorrect = function(test) {
  var file = new FileNode('test.kml');
  var dataObject = new gsc.upload.Data(file);
  test.ok(dataObject.isFileTypeCorrect());
  test.done();
};
exports.iskmlCorrect = function(test) {
  var file = new FileNode('test.kml');
  var dataObject = new gsc.upload.Data(file);
  test.ok(dataObject.isFileTypeCorrect());
  test.done();
};
exports.iskmlCorrect = function(test) {
  var file = new FileNode('test.kml');
  var dataObject = new gsc.upload.Data(file);
  test.ok(dataObject.isFileTypeCorrect());
  test.done();
};
exports.isEmptyFileFalse = function(test) {
  var file = new FileNode({name: 'filename',
    type: 'text/plain', buffer: new Buffer('')});
  var dataObject = new gsc.upload.Data(file);
  test.strictEqual(dataObject.isFileTypeCorrect(), false);
  test.ok(dataObject.isFileSizeCorrect());
  test.done();
};
exports.isTooBigFileFalse = function(test) {
  var file = new FileNode({name: 'filename',
    type: 'text/plain', buffer: new Buffer(''), size: 10000000});
  var dataObject = new gsc.upload.Data(file);
  test.strictEqual(dataObject.isFileTypeCorrect(), false);
  test.ok(dataObject.isFileSizeCorrect());
  test.done();
};