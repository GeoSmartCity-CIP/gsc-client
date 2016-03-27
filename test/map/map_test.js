//load external library - gsc.js
var gsc = require('../../src/map/Map');

//test task
exports.isMapObject = function(test) {
    var map = gsc.map;
    test.ok(map.hasOwnProperty('Map'), "Created gsc.map object");
    test.done();
};