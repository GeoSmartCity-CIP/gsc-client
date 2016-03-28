'use strict';
describe("Testing gsc.user", function() {

    var res = '...';

    beforeEach(function(done) {
        gsc.user.register('rb@avinet.no',
                'runarbe',
                'pwd',
                'pwd', [{
                    'organization': 1
                }])
            .then(function(response) {
                res = response;
                done();
            }, function(response) {
                res = 'Failed: ' + JSON.stringify(response);
                done();
            } );
    });

    it("Create a new user", function() {
        console.log(res);
        expect(true).toBe(true);
    });
});