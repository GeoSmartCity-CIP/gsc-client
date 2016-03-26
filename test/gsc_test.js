//load external library - gsc.js
var gsc = require('../src/gsc');

//test task
exports.testGSC = function(test) {
    test.ok(gsc.hasOwnProperty('version'), "New Datagrid has 0 rows.");
    test.done();
};