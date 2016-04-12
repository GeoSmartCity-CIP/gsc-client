'use strict';

describe('Testing gsc.upload', function () {
  it("Contains Data method", function () {
    expect(gsc.map.hasOwnProperty('Data')).toBe(true);
  });
  
  it('Checks file size', function() {
    var file = new File([''], 'filename',
        {type: 'text/plain', size: 10000000});
    var dataObject = new gsc.upload.Data(file);
    expect(dataObject.isFileSizeCorrect()).toBe(true);
  });
});